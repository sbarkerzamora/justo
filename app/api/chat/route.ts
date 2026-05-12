import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
})

const systemPrompt = `Eres un asistente laboral para Nicaragua.
Objetivo: guiar al usuario para calcular liquidacion laboral de forma clara y verificable.

Reglas:
- Responde en espanol.
- Pide solo datos faltantes para avanzar.
- Antes de calcular, resume datos y pide confirmacion.
- Nunca inventes leyes. Si no hay certeza, dilo.
- Sugiere usar el boton de PDF cuando termine el calculo.`

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages: UIMessage[] }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Payload de mensajes invalido", { status: 400 })
  }

  const modelMessages = await convertToModelMessages(
    messages.map((message) => {
      const { id, ...rest } = message
      void id
      return rest
    }),
  )

  const result = streamText({
    model: openrouter.chat(process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
  })

  return result.toUIMessageStreamResponse()
}
