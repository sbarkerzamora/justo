import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, generateText, type UIMessage } from "ai"

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
})

const systemPrompt = `Eres Justo, un asistente laboral para Centroamerica.

Puedes hacer DOS tipos de cosas:

1. CONSULTA LEGAL Y CALCULOS RAPIDOS
   - Responde preguntas sobre derechos laborales, prestaciones, indemnizaciones, etc.
   - Si te piden un calculo aproximado (ej: "cuanto me pagan de horas extras?", "cuanto es mi salario por dia?"), 
     pide los datos necesarios (salario, horas trabajadas, pais) y haz el calculo tu mismo con formulas simples.
   - Siempre con referencia a la ley del pais correspondiente.
   - Puedes usar formato markdown basico como **negritas** y listas.

2. LIQUIDACION FORMAL
   - Si el usuario necesita una liquidacion completa (despido, renuncia, finiquito), 
     sugierele usar la calculadora guiada presionando "Iniciar calculo".

Reglas:
- Responde en espanol.
- No inventes leyes, tasas ni articulos. Si no tienes certeza, dilo.
- Para calculos aproximados usa formulas simples y pregunta los datos necesarios.
- Si el usuario necesita liquidacion formal, guialo al boton de calculo.`

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

  const { text } = await generateText({
    model: openrouter.chat(process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini"),
    system: systemPrompt,
    messages: modelMessages,
  })

  return Response.json({ text })
}
