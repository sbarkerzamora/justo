import { convertToModelMessages, type UIMessage } from "ai"

import {
  generateLaborResponse,
  SUPPORTED_COUNTRIES,
} from "@/lib/ai/respond"
import { checkRateLimit } from "@/lib/rate-limit"
import { getClientIp } from "@/lib/request-utils"

export const runtime = "edge"

const extractMessageText = (message: UIMessage): string => {
  const maybeMessage = message as UIMessage & {
    content?: unknown
    parts?: Array<{ type?: string; text?: unknown }>
  }

  if (Array.isArray(maybeMessage.parts)) {
    return maybeMessage.parts
      .map((part) =>
        part.type === "text" && typeof part.text === "string" ? part.text : ""
      )
      .join("\n")
      .trim()
  }

  if (typeof maybeMessage.content === "string") {
    return maybeMessage.content
  }

  if (Array.isArray(maybeMessage.content)) {
    return maybeMessage.content
      .map((part) => {
        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
        ) {
          return part.text
        }
        return ""
      })
      .join("\n")
      .trim()
  }

  return ""
}

const getLatestUserText = (messages: UIMessage[]): string => {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")
  return latestUserMessage ? extractMessageText(latestUserMessage) : ""
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  const rateLimitPromise = checkRateLimit("chat", clientIp)
  const bodyPromise = request.json().then(
    (data) => ({ ok: true as const, data }),
    () => ({ ok: false as const })
  )

  const [rateLimit, parsedBody] = await Promise.all([
    rateLimitPromise,
    bodyPromise,
  ])
  const { allowed, remaining, reset } = rateLimit
  if (!allowed) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    return Response.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en unos segundos." },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    )
  }

  if (!parsedBody.ok) {
    return Response.json(
      { error: "JSON invalido en la solicitud" },
      { status: 400 }
    )
  }

  const body: unknown = parsedBody.data

  const { messages, countryCode } = body as {
    messages: UIMessage[]
    countryCode?: string
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Payload de mensajes invalido", { status: 400 })
  }

  const cc = SUPPORTED_COUNTRIES.includes(
    countryCode as (typeof SUPPORTED_COUNTRIES)[number]
  )
    ? countryCode!
    : "ni"

  const latestUserText = getLatestUserText(messages)

  const modelMessages = await convertToModelMessages(
    messages.map((message) => {
      const { id, ...rest } = message
      void id
      return rest
    })
  )

  try {
    const { stream: result, topics } = await generateLaborResponse({
      countryCode: cc,
      userMessageText: latestUserText,
      modelMessages,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const emit = (type: string, content: string) => {
          if (!content) return
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type, content })}\n\n`
            )
          )
        }

        let textBuffer = ""
        let inThinkBlock = false

        const processBuffer = () => {
          while (textBuffer.length > 0) {
            if (inThinkBlock) {
              const thinkEnd = textBuffer.indexOf("</think>")
              if (thinkEnd === -1) return
              emit("reasoning", textBuffer.slice(0, thinkEnd))
              textBuffer = textBuffer.slice(thinkEnd + 8)
              inThinkBlock = false
            } else {
              const thinkStart = textBuffer.indexOf("<think>")
              if (thinkStart === -1) {
                emit("text", textBuffer)
                textBuffer = ""
                return
              }
              if (thinkStart > 0) {
                emit("text", textBuffer.slice(0, thinkStart))
              }
              textBuffer = textBuffer.slice(thinkStart + 7)
              inThinkBlock = true
            }
          }
        }

        const flushPendingText = () => {
          if (textBuffer.length > 0) {
            emit("text", textBuffer)
            textBuffer = ""
          }
        }

        try {
          for await (const event of result.fullStream) {
            if (event.type === "text-delta") {
              textBuffer += event.text
              processBuffer()
            } else if (event.type === "reasoning-delta") {
              const { text: reasoningContent } = event
              emit("reasoning", reasoningContent)
            }
          }
          flushPendingText()
          if (topics.length > 0) {
            emit("topics", JSON.stringify(topics))
          }
        } catch (error) {
          console.error("Stream error:", error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: { "Content-Type": "text/event-stream" },
    })
  } catch (error) {
    console.error("Chat provider error:", error)
    return Response.json(
      { error: "No se pudo obtener respuesta del proveedor de IA." },
      { status: 503 }
    )
  }
}
