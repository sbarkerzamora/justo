import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, generateText, tool, zodSchema, type UIMessage } from "ai"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { z } from "zod"

import { SettlementInput, SettlementResult } from "@/lib/settlement/types"
import { calculateNicaraguaSettlement } from "@/lib/settlement/ni/calculate"
import { calculateGuatemalaSettlement } from "@/lib/settlement/gt/calculate"
import { calculateHondurasSettlement } from "@/lib/settlement/hn/calculate"
import { calculateElSalvadorSettlement } from "@/lib/settlement/sv/calculate"
import { calculateCostaRicaSettlement } from "@/lib/settlement/cr/calculate"
import { calculatePanamaSettlement } from "@/lib/settlement/pa/calculate"
import { calculateMexicoSettlement } from "@/lib/settlement/mx/calculate"
import { calculateColombiaSettlement } from "@/lib/settlement/co/calculate"
import { calculatePeruSettlement } from "@/lib/settlement/pe/calculate"
import { calculateArgentinaSettlement } from "@/lib/settlement/ar/calculate"
import { calculateChileSettlement } from "@/lib/settlement/cl/calculate"

const SUPPORTED_COUNTRIES = ["ni", "gt", "sv", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl"] as const

const countryMeta: Record<string, { name: string; law: string }> = {
  ni: { name: "Nicaragua", law: "Ley No. 185 (Código del Trabajo)" },
  gt: { name: "Guatemala", law: "Decreto 1441 (Código de Trabajo)" },
  sv: { name: "El Salvador", law: "Código de Trabajo" },
  hn: { name: "Honduras", law: "Decreto 189-59 (Código de Trabajo)" },
  cr: { name: "Costa Rica", law: "Código de Trabajo" },
  pa: { name: "Panamá", law: "Código de Trabajo" },
  mx: { name: "México", law: "Ley Federal del Trabajo" },
  co: { name: "Colombia", law: "Código Sustantivo del Trabajo" },
  pe: { name: "Perú", law: "Ley General de Trabajo" },
  ar: { name: "Argentina", law: "Ley de Contrato de Trabajo 20.744" },
  cl: { name: "Chile", law: "Código del Trabajo (DFL 1)" },
}

const countryDirMap: Record<string, string> = {
  gt: "gua",
}

const countryTopicFiles: Record<string, string[]> = {
  ni: ["indemnizacion", "aguinaldo", "vacaciones", "salario-proporcional", "inss", "ir-rentas-trabajo", "deducciones", "Ley185Nic"],
  gt: ["igss", "isr", "Leydeltrabajogua"],
  sv: ["indemnizacion", "aguinaldo", "vacaciones", "deducciones", "isss", "afp", "OpenL-2605112301"],
  hn: ["indemnizacion", "vacaciones", "aguinaldo", "deducciones", "ihss", "OpenL-2605112256"],
  cr: ["indemnizacion", "aguinaldo", "vacaciones", "deducciones", "ccss", "OpenL-2605112303"],
  pa: ["indemnizacion", "aguinaldo", "vacaciones", "deducciones", "css", "codigo-de-trabajo-panama"],
  mx: ["indemnizacion", "aguinaldo", "vacaciones", "deducciones", "imss", "1044_Ley_Federal_del_Trabajo"],
  co: ["indemnizacion", "cesantia", "prima-servicios", "vacaciones", "deducciones", "eps-pension", "CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol"],
  pe: ["indemnizacion", "cts", "gratificaciones", "vacaciones", "salario-proporcional", "deducciones", "onp-afp", "LEY_GENERAL_TRABAJO_Peru"],
  ar: ["indemnizacion", "preaviso", "sac-aguinaldo", "vacaciones", "salario-proporcional", "deducciones", "leydeltrabajoargentina"],
  cl: ["indemnizacion", "vacaciones", "salario-proporcional", "deducciones", "afp", "salud", "afc", "codigodeltrabajochile"],
}

const calculators: Record<string, (input: SettlementInput) => SettlementResult> = {
  ni: calculateNicaraguaSettlement,
  gt: calculateGuatemalaSettlement,
  sv: calculateElSalvadorSettlement,
  hn: calculateHondurasSettlement,
  cr: calculateCostaRicaSettlement,
  pa: calculatePanamaSettlement,
  mx: calculateMexicoSettlement,
  co: calculateColombiaSettlement,
  pe: calculatePeruSettlement,
  ar: calculateArgentinaSettlement,
  cl: calculateChileSettlement,
}

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
})

const legalCorpusCache = new Map<string, string>()

const readLegalCorpusFile = async (filePath: string) => {
  const cached = legalCorpusCache.get(filePath)
  if (cached) {
    return cached
  }

  const content = await readFile(filePath, "utf8")
  legalCorpusCache.set(filePath, content)
  return content
}

const buildSystemPrompt = (countryCode: string): string => {
  const meta = countryMeta[countryCode]
  if (!meta) {
    return `Eres Justo, un asistente laboral. Responde en español.`
  }

  const topics = countryTopicFiles[countryCode] ?? []
  const topicList = topics
    .filter((t) => !t.includes("Ley") && !t.includes("OpenL") && !t.includes("CODIGO") && !t.includes("1044") && !t.includes("LEY"))
    .join(", ")

  return `Eres Justo, un asistente experto EXCLUSIVAMENTE en derecho laboral de ${meta.name}.

PAÍS ACTIVO: ${meta.name}
MARCO LEGAL: ${meta.law}
TEMAS DISPONIBLES EN EL CORPUS LEGAL: ${topicList || "consulta laboral general"}

SOLO puedes hacer estas dos cosas:

1. CONSULTA LABORAL
   - Responde preguntas sobre derechos laborales, prestaciones, indemnizaciones, deducciones y liquidaciones.
   - Usa la herramienta \`legalCorpusLookup\` para consultar el corpus legal cuando te pregunten sobre un tema específico (ej: "cómo se calcula la indemnización?", "qué dice la ley sobre vacaciones?").
   - Usa la herramienta \`quickEstimate\` para responder preguntas numéricas como "cuánto me corresponde si gano X con Y años de antigüedad?". NO hagas cálculos matemáticos por tu cuenta — usa siempre la herramienta.

2. REDIRECCIÓN A CALCULADORA GUIADA
   - Si el usuario necesita una liquidación formal y completa (despido, renuncia, finiquito con todos los datos), sugiérele usar la calculadora guiada: "Puedo calcular tu liquidación completa paso a paso. Presiona 'Iniciar cálculo' para empezar."
   - La calculadora guiada es mejor cuando se conocen las fechas exactas de inicio y fin.

REGLAS ESTRICTAS:

- SOLO respondes sobre derecho laboral, específicamente de ${meta.name}. Cualquier otra pregunta (política, medicina, tecnología, deportes, entretenimiento, etc.) debes rechazarla cortésmente: "Soy un asistente especializado en derecho laboral de ${meta.name}. No tengo información para responder sobre ese tema. ¿Prefieres preguntarme sobre tus prestaciones, liquidación o derechos laborales?"
- Si el usuario insiste en temas fuera de tu ámbito, repite el redireccionamiento una vez más de forma amable y luego sugiere terminar la conversación.
- Responde SIEMPRE en español, de forma clara y amable.
- No inventes leyes, tasas, artículos ni precedentes. Si no tienes certeza, dila.
- Cuando uses \`legalCorpusLookup\`, cita la información del corpus en tu respuesta.
- Cuando uses \`quickEstimate\`, presenta los resultados y recomienda la calculadora guiada si necesita precisión exacta.
- Puedes usar formato markdown básico como **negritas** y listas para mejorar la legibilidad.`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { messages, countryCode } = body as { messages: UIMessage[]; countryCode?: string }

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response("Payload de mensajes invalido", { status: 400 })
  }

  const cc = SUPPORTED_COUNTRIES.includes(countryCode as typeof SUPPORTED_COUNTRIES[number])
    ? countryCode!
    : "ni"

  const systemPrompt = buildSystemPrompt(cc)

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
    tools: {
      legalCorpusLookup: tool({
        description: `Busca información en el corpus legal del país activo. Úsala cuando te pregunten sobre derechos, artículos, fórmulas o tasas de un tema específico (indemnización, aguinaldo, vacaciones, ISSS, INSS, IGSS, CSS, etc.).`,
        inputSchema: zodSchema(
          z.object({
            topic: z
              .string()
              .describe(
                "El tema a consultar en el corpus legal, ej: indemnizacion, aguinaldo, vacaciones, deducciones, inss, isss, igss, ihss, ccss, css, imss, eps-pension, onp-afp, afp, salud, afc, sac-aguinaldo, cts, gratificaciones, prima-servicios, cesantia, preaviso, salario-proporcional, ir-rentas-trabajo",
              ),
          }),
        ),
        execute: async ({ topic }) => {
          const countryName = countryMeta[cc]?.name ?? "el país"
          const sanitized = topic.replace(/[^a-z0-9-]/gi, "").toLowerCase()
          if (!sanitized) {
            return `El tema "${topic}" no es válido.`
          }

          const dir = countryDirMap[cc] ?? cc
          const filePath = join(process.cwd(), "content", "legal", dir, `${sanitized}.md`)

          try {
            const content = await readLegalCorpusFile(filePath)

            const frontmatterEnd = content.indexOf("---", 3)
            const body = frontmatterEnd !== -1 ? content.slice(frontmatterEnd + 3) : content

            const sections: Record<string, string> = {}
            const sectionRegex = /##\s*(\S+)\s*\n([^#]*)/g
            let match: RegExpExecArray | null
            while ((match = sectionRegex.exec(body)) !== null) {
              sections[match[1]!] = match[2]!.trim()
            }

            return JSON.stringify({
              topic: sanitized,
              base_legal: sections["base_legal"] ?? "No disponible",
              regla_operativa: sections["regla_operativa"] ?? "No disponible",
              formula: sections["formula"] ?? "No disponible",
              variables: sections["variables"] ?? "No disponible",
              supuestos: sections["supuestos"] ?? "No disponible",
              excepciones: sections["excepciones"] ?? "No disponible",
              vigencia_fuente: sections["vigencia_fuente"] ?? "No disponible",
            })
          } catch {
            const known = countryTopicFiles[cc] ?? []
            if (!known.includes(sanitized)) {
              return `No encontré información sobre "${topic}" en el corpus legal de ${countryName}. Temas disponibles: ${known.join(", ")}.`
            }
            return `Error al leer el corpus legal de ${countryName} para el tema "${topic}".`
          }
        },
      }),
      quickEstimate: tool({
        description: `Calcula un estimado rápido de liquidación usando el motor determinístico. Úsala cuando el usuario pregunte "cuánto me corresponde" con un salario y años de antigüedad. No la uses para liquidaciones formales.`,
        inputSchema: zodSchema(
          z.object({
            monthlySalary: z.number().positive().describe("Salario mensual del trabajador"),
            tenureYears: z.number().positive().describe("Años de antigüedad del trabajador"),
            unusedVacationDays: z
              .number()
              .min(0)
              .max(30)
              .optional()
              .default(0)
              .describe("Días de vacaciones pendientes (opcional)"),
          }),
        ),
        execute: async ({ monthlySalary, tenureYears, unusedVacationDays }) => {
          const calculator = calculators[cc]
          if (!calculator) return `No hay calculadora disponible para este país. Usa la calculadora guiada.`

          const end = new Date()
          const start = new Date()
          start.setFullYear(start.getFullYear() - tenureYears)

          const input: SettlementInput = {
            countryCode: cc as SettlementInput["countryCode"],
            employeeName: "Trabajador",
            employerName: "Empleador",
            monthlySalary,
            frequency: "mensual",
            unusedVacationDays,
            startDate: start.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
          }

          try {
            const result = calculator(input)
            return JSON.stringify({
              currency: result.currency,
              grossIncome: result.grossIncome,
              totalDeductions: result.totalDeductions,
              netTotal: result.netTotal,
              tenureDays: result.tenureDays,
              tenureText: result.tenureText,
              legalCorpusVersion: result.legalCorpusVersion,
              incomes: result.incomes.map((i) => ({
                label: i.label,
                amount: i.amount,
                formula: i.formula,
                legalReference: i.legalReference,
              })),
              deductions: result.deductions.map((d) => ({
                label: d.label,
                amount: d.amount,
                formula: d.formula,
                legalReference: d.legalReference,
              })),
            })
          } catch (e) {
            return `Error al calcular el estimado: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un cálculo más preciso.`
          }
        },
      }),
    },
    maxRetries: 1,
  })

  return Response.json({ text })
}
