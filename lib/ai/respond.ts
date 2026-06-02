import { streamText, tool, zodSchema, type ModelMessage } from "ai"
import { join } from "node:path"
import { z } from "zod"

import { getChatModelConfig } from "@/lib/ai/chat-provider"
import {
  countryDirMap,
  readCountryCorpus,
  readLegalCorpusFile,
} from "@/lib/ai/legal-corpus-cache"
import type { SettlementInput, SettlementResult } from "@/lib/settlement/types"
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

export const SUPPORTED_COUNTRIES = [
  "ni",
  "gt",
  "sv",
  "hn",
  "cr",
  "pa",
  "mx",
  "co",
  "pe",
  "ar",
  "cl",
] as const

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

const countryTopicFiles: Record<string, string[]> = {
  ni: [
    "indemnizacion",
    "aguinaldo",
    "vacaciones",
    "salario-proporcional",
    "inss",
    "ir-rentas-trabajo",
    "deducciones",
    "Ley185Nic",
  ],
  gt: ["igss", "isr", "Leydeltrabajogua"],
  sv: [
    "indemnizacion",
    "aguinaldo",
    "vacaciones",
    "deducciones",
    "isss",
    "afp",
    "OpenL-2605112301",
  ],
  hn: [
    "indemnizacion",
    "vacaciones",
    "aguinaldo",
    "deducciones",
    "ihss",
    "OpenL-2605112256",
  ],
  cr: [
    "indemnizacion",
    "aguinaldo",
    "vacaciones",
    "deducciones",
    "ccss",
    "OpenL-2605112303",
  ],
  pa: [
    "indemnizacion",
    "aguinaldo",
    "vacaciones",
    "deducciones",
    "css",
    "codigo-de-trabajo-panama",
  ],
  mx: [
    "indemnizacion",
    "aguinaldo",
    "vacaciones",
    "deducciones",
    "imss",
    "1044_Ley_Federal_del_Trabajo",
  ],
  co: [
    "indemnizacion",
    "cesantia",
    "prima-servicios",
    "vacaciones",
    "deducciones",
    "eps-pension",
    "CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol",
  ],
  pe: [
    "indemnizacion",
    "cts",
    "gratificaciones",
    "vacaciones",
    "salario-proporcional",
    "deducciones",
    "onp-afp",
    "LEY_GENERAL_TRABAJO_Peru",
  ],
  ar: [
    "indemnizacion",
    "preaviso",
    "sac-aguinaldo",
    "vacaciones",
    "salario-proporcional",
    "deducciones",
    "leydeltrabajoargentina",
  ],
  cl: [
    "indemnizacion",
    "vacaciones",
    "salario-proporcional",
    "deducciones",
    "afp",
    "salud",
    "afc",
    "codigodeltrabajochile",
  ],
}

const countryGeneralLawTopic: Record<string, string> = {
  ni: "Ley185Nic",
  gt: "Leydeltrabajogua",
  sv: "OpenL-2605112301",
  hn: "OpenL-2605112256",
  cr: "OpenL-2605112303",
  pa: "codigo-de-trabajo-panama",
  mx: "1044_Ley_Federal_del_Trabajo",
  co: "CODIGO SUSTANTIVO DEL TRABAJO - Colombia _ SUIN Juriscol",
  pe: "LEY_GENERAL_TRABAJO_Peru",
  ar: "leydeltrabajoargentina",
  cl: "codigodeltrabajochile",
}

const calculators: Record<
  string,
  (input: SettlementInput) => SettlementResult
> = {
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

const normalizeCorpusTopic = (countryCode: string, topic: string): string => {
  const normalized = topic
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

  const isGeneralLaborQuery =
    normalized.includes("ley laboral") ||
    normalized.includes("codigo del trabajo") ||
    normalized.includes("derechos laborales") ||
    normalized.includes("derecho laboral") ||
    normalized.includes("ley de trabajo")

  if (isGeneralLaborQuery) {
    return countryGeneralLawTopic[countryCode] ?? topic
  }

  return topic
}

const toLookupKey = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase()

const resolveKnownTopicFilename = (
  countryCode: string,
  topic: string
): string => {
  const known = countryTopicFiles[countryCode] ?? []
  const wanted = toLookupKey(topic)
  const match = known.find((candidate) => toLookupKey(candidate) === wanted)
  return match ?? topic
}

type CorpusDocument = {
  filename: string
  topic: string
}

const corpusStopWords = new Set([
  "como",
  "cuando",
  "cuanto",
  "cuanta",
  "cuantos",
  "cuantas",
  "donde",
  "para",
  "pero",
  "porque",
  "sobre",
  "tengo",
  "tiene",
  "trabajo",
  "trabajador",
  "trabajadora",
  "laboral",
  "legal",
  "derecho",
  "derechos",
  "pagan",
  "pago",
  "pagar",
  "corresponde",
  "corresponderia",
  "anos",
  "meses",
  "dias",
])

const normalizeSearchText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const tokenize = (value: string): string[] => {
  const normalized = normalizeSearchText(value)
  const baseTerms = normalized
    .split(/[^a-z0-9]+/i)
    .filter((term) => term.length > 2 && !corpusStopWords.has(term))

  const expanded = new Set(baseTerms)
  if (
    baseTerms.some((term) =>
      ["renuncia", "renuncio", "renunciar", "renuncie"].includes(term)
    )
  ) {
    expanded.add("terminacion")
    expanded.add("antiguedad")
    expanded.add("indemnizacion")
  }
  if (
    baseTerms.some((term) =>
      ["despido", "despedido", "despedida"].includes(term)
    )
  ) {
    expanded.add("indemnizacion")
    expanded.add("preaviso")
  }
  if (
    baseTerms.some((term) =>
      ["liquidacion", "finiquito", "prestaciones"].includes(term)
    )
  ) {
    expanded.add("indemnizacion")
    expanded.add("vacaciones")
    expanded.add("aguinaldo")
    expanded.add("deducciones")
  }

  return [...expanded]
}

const stripFrontmatter = (content: string): string => {
  const frontmatterEnd = content.startsWith("---")
    ? content.indexOf("---", 3)
    : -1
  return frontmatterEnd !== -1
    ? content.slice(frontmatterEnd + 3).trim()
    : content.trim()
}

const scoreCorpusDocument = (
  doc: CorpusDocument,
  terms: string[],
  query: string
): number => {
  const normalizedQuery = normalizeSearchText(query)
  const key = normalizeSearchText(`${doc.filename} ${doc.topic}`)

  let score = 0
  for (const term of terms) {
    if (key.includes(term)) score += 8
  }
  if (normalizedQuery.includes(normalizeSearchText(doc.topic))) score += 12

  return score
}

const parseCorpusDocument = (filename: string, content: string) => {
  const body = stripFrontmatter(content)
  const title =
    body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? filename.replace(/\.md$/i, "")
  const topic =
    content.match(/\ntopic:\s*"?([^"\n]+)"?/i)?.[1]?.trim() ??
    filename.replace(/\.md$/i, "")
  const version =
    content.match(/\nversion:\s*"?([^"\n]+)"?/i)?.[1]?.trim() ??
    "sin version declarada"

  return { body, title, topic, version }
}

const makeCorpusExcerpt = (
  body: string,
  terms: string[],
  maxLength = 2_400
): string => {
  if (body.length <= maxLength) {
    return body
  }

  const normalizedBody = normalizeSearchText(body)
  const indexes: number[] = []
  for (const term of terms) {
    const index = normalizedBody.indexOf(term)
    if (index >= 0) indexes.push(index)
  }
  const firstIndex = indexes.length > 0 ? Math.min(...indexes) : 0
  const start = Math.max(0, firstIndex - 700)
  const end = Math.min(body.length, start + maxLength)
  const prefix = start > 0 ? "…\n" : ""
  const suffix = end < body.length ? "\n…" : ""

  return `${prefix}${body.slice(start, end).trim()}${suffix}`
}

const buildLegalCorpusContext = async (
  countryCode: string,
  query: string
): Promise<string> => {
  const docs = await readCountryCorpus(countryCode)
  const terms = tokenize(query)
  const generalLaw = countryGeneralLawTopic[countryCode]

  const ranked = docs
    .map((doc) => ({ doc, score: scoreCorpusDocument(doc, terms, query) }))
    .sort((a, b) => b.score - a.score)

  const selected = ranked
    .filter(({ score }) => score > 0)
    .slice(0, 4)
    .map(({ doc }) => doc)

  if (selected.length === 0) {
    const fallback =
      docs.find((doc) => doc.filename.replace(/\.md$/i, "") === generalLaw) ??
      docs[0]
    if (fallback) selected.push(fallback)
  }

  const context = selected.map(async (doc) => {
    const dir = countryDirMap[countryCode] ?? countryCode
    const content = await readLegalCorpusFile(
      join(process.cwd(), "content", "legal", dir, doc.filename)
    )
    const parsed = parseCorpusDocument(doc.filename, content)
    const excerpt = makeCorpusExcerpt(parsed.body, terms)
    return `### ${parsed.title}
Archivo: content/legal/${dir}/${doc.filename}
Tema: ${parsed.topic}
Version: ${parsed.version}

${excerpt}`
  })
  const contextChunks = await Promise.all(context)

  return (
    contextChunks.join("\n\n---\n\n") ||
    "No se encontro corpus legal para este pais."
  )
}

const buildSystemPrompt = (
  countryCode: string,
  corpusContext: string
): string => {
  const meta = countryMeta[countryCode]
  if (!meta) {
    return `Eres Justo, un asistente laboral. Responde en espanol.`
  }

  const topics = countryTopicFiles[countryCode] ?? []
  const topicList = topics
    .filter(
      (t) =>
        !t.includes("Ley") &&
        !t.includes("OpenL") &&
        !t.includes("CODIGO") &&
        !t.includes("1044") &&
        !t.includes("LEY")
    )
    .join(", ")

  return `Eres Justo, un asistente experto EXCLUSIVAMENTE en derecho laboral de ${meta.name}.

PAIS ACTIVO: ${meta.name}
MARCO LEGAL: ${meta.law}
TEMAS DISPONIBLES EN EL CORPUS LEGAL: ${topicList || "consulta laboral general"}

DOCUMENTOS DEL CORPUS YA CONSULTADOS PARA ESTA CONSULTA:
${corpusContext}

SOLO puedes hacer estas dos cosas:

1. CONSULTA LABORAL
   - Responde preguntas sobre derechos laborales, prestaciones, indemnizaciones, deducciones y liquidaciones.
   - Primero usa los DOCUMENTOS DEL CORPUS YA CONSULTADOS. Si no bastan, usa la herramienta \`legalCorpusLookup\` antes de responder.
   - Usa la herramienta \`quickEstimate\` para responder preguntas numericas como "cuanto me corresponde si gano X con Y anos de antiguedad?". NO hagas calculos matematicos por tu cuenta — usa siempre la herramienta.

2. REDIRECCION A CALCULADORA GUIADA
   - Si el usuario necesita una liquidacion formal y completa (despido, renuncia, finiquito con todos los datos), suguierele usar la calculadora guiada: "Puedo calcular tu liquidacion completa paso a paso. Presiona 'Iniciar calculo' para empezar."
   - La calculadora guiada es mejor cuando se conocen las fechas exactas de inicio y fin.

REGLAS ESTRICTAS:

- CLASIFICACION OBLIGATORIA: antes de responder clasifica la consulta como IN_SCOPE_LABORAL o OUT_OF_SCOPE.
- Responde corto pero enriquecido: maximo 3 secciones breves. Cada seccion debe tener 1-2 lineas o hasta 3 bullets.
- Usa Markdown compacto para mejorar legibilidad: titulos en **negrita**, listas cortas, tablas pequenas solo para montos/comparaciones, y citas ">" solo para advertencias legales o incertidumbre.
- Optimiza para movil: evita parrafos largos, tablas anchas y listas extensas. Si una tabla tendria mas de 4 filas o 3 columnas, resume en bullets.
- No repitas contexto legal ni explicaciones largas si no son necesarias.
- Si faltan datos, haz solo 1-3 preguntas concretas.
- Si calculas con herramienta, muestra resultado, formula minima y siguiente paso.
- IN_SCOPE_LABORAL incluye SIEMPRE: "ley laboral", "codigo del trabajo", "derechos laborales", "prestaciones", "liquidacion", "indemnizacion", "vacaciones", "aguinaldo", "deducciones", "despido", "renuncia".
- Si hay duda entre IN_SCOPE_LABORAL y OUT_OF_SCOPE, asume IN_SCOPE_LABORAL y pide una aclaracion breve.
- Para consultas legales o conceptuales, usa primero los DOCUMENTOS DEL CORPUS YA CONSULTADOS; si no contienen el dato solicitado, usa \`legalCorpusLookup\` antes de responder.
- Para consultas de montos o estimados, usa siempre \`quickEstimate\`. Nunca hagas calculos por tu cuenta.
- Antes de calcular o estimar liquidacion, indemnizacion, renuncia o despido, verifica que tengas el contexto minimo: salario mensual/promedio, tipo de salida, antiguedad o fechas de inicio y salida, y vacaciones pendientes. Si falta informacion, NO calcules todavia: consulta el corpus ya incluido y haz exactamente 2 o 3 preguntas breves para capturar esos datos.
- Si el usuario ya dio parte del contexto, no repitas lo capturado; pregunta solo lo que falta.
- Para consultas generales como "ley laboral", "codigo del trabajo" o "derechos laborales", responde con un marco general del pais usando corpus y ofrece temas para profundizar.
- Antes de rechazar una consulta, intenta responder con corpus o pide contexto adicional.
- SOLO respondes sobre derecho laboral, especificamente de ${meta.name}. Cualquier otra pregunta (politica, medicina, tecnologia, deportes, entretenimiento, etc.) debes rechazarla cortesmente: "Soy un asistente especializado en derecho laboral de ${meta.name}. No tengo informacion para responder sobre ese tema. ?Prefieres preguntarme sobre tus prestaciones, liquidacion o derechos laborales?"
- Si el usuario insiste en temas fuera de tu ambito, repite el redireccionamiento una vez mas de forma amable y luego sugiere terminar la conversacion.
- Responde SIEMPRE en espanol, de forma clara y amable.
- No inventes leyes, tasas, articulos ni precedentes. Si no tienes certeza, dila.
- Marca la interpretacion legal como informacion general, no asesoria legal profesional.
- Cuando cites corpus, incluye el archivo o version disponible.
- Cuando uses \`legalCorpusLookup\`, cita la informacion del corpus en tu respuesta.
- Cuando uses \`quickEstimate\`, presenta una tabla compacta con Concepto y Monto, incluye formula minima solo si cabe, y recomienda la calculadora guiada si necesita precision exacta.
- Formato recomendado para consulta legal:
  **Respuesta**
  Respuesta directa en 1-2 lineas.

  **Base legal**
  Fuente: \`archivo.md\`, version disponible.

  **Siguiente paso**
  Pregunta faltante o accion recomendada.
- Formato recomendado para datos faltantes:
  **Necesito estos datos**
  1. Salario mensual
  2. Fecha de inicio
  3. Fecha de salida
- Formato recomendado para estimaciones:
  **Estimado rapido**

  | Concepto | Monto |
  |---|---:|
  | Ingresos | C$ ... |
  | Deducciones | C$ ... |
  | Neto | C$ ... |

  **Base**
  Corpus version ...

  > Informacion general, no asesoria legal profesional.
- Puedes usar formato markdown enriquecido, pero siempre breve y escaneable.`
}

export async function generateLaborResponse(input: {
  countryCode: string
  userMessageText: string
  modelMessages?: ModelMessage[]
}) {
  const { countryCode, userMessageText, modelMessages } = input

  if (!SUPPORTED_COUNTRIES.includes(countryCode as (typeof SUPPORTED_COUNTRIES)[number])) {
    throw new Error(`Pais no soportado: ${countryCode}`)
  }

  const corpusContext = await buildLegalCorpusContext(
    countryCode,
    userMessageText
  ).catch(() => "No se encontro corpus legal para este pais.")

  const systemPrompt = buildSystemPrompt(countryCode, corpusContext)

  const chatModelConfig = getChatModelConfig()

  return streamText({
    model: chatModelConfig.model,
    system: systemPrompt,
    messages:
      modelMessages ?? [{ role: "user", content: userMessageText }],
    maxOutputTokens: chatModelConfig.maxOutputTokens,
    temperature: chatModelConfig.temperature,
    topP: chatModelConfig.topP,
    providerOptions: chatModelConfig.providerOptions,
    tools: {
      legalCorpusLookup: tool({
        description: `Busca informacion en el corpus legal del pais activo. Usala cuando te pregunten sobre derechos, articulos, formulas o tasas de un tema especifico (indemnizacion, aguinaldo, vacaciones, ISSS, INSS, IGSS, CSS, etc.).`,
        inputSchema: zodSchema(
          z.object({
            topic: z
              .string()
              .describe(
                "El tema a consultar en el corpus legal, ej: indemnizacion, aguinaldo, vacaciones, deducciones, inss, isss, igss, ihss, ccss, css, imss, eps-pension, onp-afp, afp, salud, afc, sac-aguinaldo, cts, gratificaciones, prima-servicios, cesantia, preaviso, salario-proporcional, ir-rentas-trabajo"
              ),
          })
        ),
        execute: async ({ topic }) => {
          const resolvedTopic = normalizeCorpusTopic(countryCode, topic)
          const knownTopic = resolveKnownTopicFilename(
            countryCode,
            resolvedTopic
          )
          const sanitized = knownTopic
            .replace(/[^a-z0-9-]/gi, "")
            .toLowerCase()
          if (!sanitized) {
            return `El tema "${topic}" no es valido.`
          }

          const dir = countryDirMap[countryCode] ?? countryCode
          const filePath = join(
            process.cwd(),
            "content",
            "legal",
            dir,
            `${knownTopic}.md`
          )

          try {
            const content = await readLegalCorpusFile(filePath)

            const body = stripFrontmatter(content)

            const sections: Record<string, string> = {}
            const sectionRegex = /##\s*(\S+)\s*\n([^#]*)/g
            let match: RegExpExecArray | null
            while ((match = sectionRegex.exec(body)) !== null) {
              sections[match[1]!] = match[2]!.trim()
            }

            return JSON.stringify({
              topic: sanitized,
              base_legal: sections["base_legal"] ?? "No disponible",
              regla_operativa:
                sections["regla_operativa"] ?? "No disponible",
              formula: sections["formula"] ?? "No disponible",
              variables: sections["variables"] ?? "No disponible",
              supuestos: sections["supuestos"] ?? "No disponible",
              excepciones: sections["excepciones"] ?? "No disponible",
              vigencia_fuente:
                sections["vigencia_fuente"] ?? "No disponible",
            })
          } catch {
            const context = await buildLegalCorpusContext(
              countryCode,
              topic
            )
            return JSON.stringify({
              query: topic,
              resultados_relacionados: context,
            })
          }
        },
      }),
      quickEstimate: tool({
        description: `Calcula un estimado rapido de liquidacion usando el motor deterministico. Usala cuando el usuario pregunte "cuanto me corresponde" con un salario y anos de antiguedad. No la uses para liquidaciones formales.`,
        inputSchema: zodSchema(
          z.object({
            monthlySalary: z
              .number()
              .positive()
              .describe("Salario mensual del trabajador"),
            tenureYears: z
              .number()
              .positive()
              .describe("Anos de antiguedad del trabajador"),
            unusedVacationDays: z
              .number()
              .min(0)
              .max(30)
              .optional()
              .default(0)
              .describe("Dias de vacaciones pendientes (opcional)"),
          })
        ),
        execute: async ({
          monthlySalary,
          tenureYears,
          unusedVacationDays,
        }) => {
          const calculator = calculators[countryCode]
          if (!calculator)
            return `No hay calculadora disponible para este pais. Usa la calculadora guiada.`

          const end = new Date()
          const start = new Date()
          start.setFullYear(start.getFullYear() - tenureYears)

          const input: SettlementInput = {
            countryCode: countryCode as SettlementInput["countryCode"],
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
            return `Error al calcular el estimado: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
          }
        },
      }),
    },
    maxRetries: 1,
  })
}
