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

  const { allowed, remaining, reset } = await checkRateLimit("chat", clientIp)
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

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json(
      { error: "JSON invalido en la solicitud" },
      { status: 400 }
    )
  }

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
    const result = await generateLaborResponse({
      countryCode: cc,
      userMessageText: latestUserText,
      modelMessages,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Chat provider error:", error)
    return Response.json(
      { error: "No se pudo obtener respuesta del proveedor de IA." },
      { status: 503 }
    )
  }
}
