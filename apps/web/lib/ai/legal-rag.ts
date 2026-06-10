import { getVectorIndex, hasVectorConfig } from "@/lib/ai/vector-client"
import {
  countryMeta,
  SUPPORTED_COUNTRIES,
  type CountryCode,
} from "@/lib/ai/countries-meta"

const TOP_K = 8
const MAX_CONTEXT_CHARS = 8_000

export type RetrievedHit = {
  text: string
  topic: string
  section: string
  filename: string
  score: number
}

type RetrievalResult = {
  context: string
  source: "vector" | "degraded"
  hits: RetrievedHit[]
}

const sanitizeCountry = (cc: string): CountryCode =>
  (SUPPORTED_COUNTRIES as readonly string[]).includes(cc) ? (cc as CountryCode) : "ni"

const escapeFilterValue = (value: string): string =>
  value.replace(/'/g, "\\'")

const isUpstashConfigured = (): boolean => hasVectorConfig()

const buildSectionFilter = (cc: CountryCode, section?: string): string => {
  const base = `country = '${cc}'`
  if (!section) return base
  return `${base} AND section = '${escapeFilterValue(section)}'`
}

const formatHits = (hits: RetrievedHit[]): string => {
  const ordered = [...hits].sort((a, b) => b.score - a.score)
  const blocks: string[] = []
  let used = 0

  for (const h of ordered) {
    const block = `[${h.topic} :: ${h.section}]\nFuente: ${h.filename}\n${h.text}`
    if (used + block.length > MAX_CONTEXT_CHARS && blocks.length > 0) break
    blocks.push(block)
    used += block.length
  }

  return blocks.join("\n\n---\n\n")
}

const QUERY_EXPANSION_MAP: Record<string, string[]> = {
  indemnizacion: ["indemnizacion", "cesantia", "despido", "liquidacion", "antiguedad", "finiquito", "severance"],
  aguinaldo: ["aguinaldo", "decimo", "decimotercer", "bono 14", "prima", "sac", "gratificaciones", "christmas bonus", "13th salary"],
  vacaciones: ["vacaciones", "dias de descanso", "periodo vacacional", "descanso anual", "vacation"],
  deducciones: ["deducciones", "descuentos", "retenciones", "aportes", "deductions"],
  inss: ["inss", "seguro social", "seguridad social"],
  igss: ["igss", "seguro social", "guatemala"],
  ihss: ["ihss", "seguro social", "honduras"],
  ccss: ["ccss", "seguro social", "costa rica"],
  css: ["css", "seguro social", "panama"],
  imss: ["imss", "seguro social", "mexico"],
  isss: ["isss", "seguro social", "el salvador"],
  afp: ["afp", "pension", "jubilacion", "retiro"],
  "onp-afp": ["onp", "afp", "pension", "peru"],
  "eps-pension": ["eps", "pension", "salud", "colombia"],
  isr: ["isr", "ir", "impuesto", "renta", "income tax", "impuesto a la renta"],
  salario: ["salario", "sueldo", "remuneracion", "ingreso", "salary", "wage"],
  cesantia: ["cesantia", "indemnizacion", "despido", "auxilio de cesantia"],
  preaviso: ["preaviso", "aviso", "notice", "aviso sustitutivo"],
  cts: ["cts", "compensacion", "peru"],
  "prima-servicios": ["prima", "servicios", "colombia"],
  contrato: ["contrato", "trabajo", "employment contract"],
  renuncia: ["renuncia", "resignation", "dimision", "retiro voluntario"],
  despido: ["despido", "terminacion", "rescision", "despido injustificado", "despido justificado"],
}

const expandQuery = (query: string): string => {
  const lower = query.toLowerCase()
  const expansions = new Set<string>()

  for (const [key, synonyms] of Object.entries(QUERY_EXPANSION_MAP)) {
    if (lower.includes(key) || synonyms.some((s) => lower.includes(s))) {
      synonyms.forEach((s) => expansions.add(s))
    }
  }

  if (expansions.size === 0) return query

  const expanded = [query, ...expansions].join(" ")
  if (expanded.length > 500) return query
  return expanded
}

const buildDegradedContext = (): string => {
  return [
    "AVISO: en este momento no se pudo consultar el corpus legal.",
    "Responde con prudencia: NO inventes articulos, tasas ni formulas.",
    "Si la consulta requiere datos legales especificos, indica al usuario que use la calculadora guiada y sugiere reformular la pregunta mas tarde.",
  ].join(" ")
}

const buildEmptyContext = (): string => {
  return [
    "No se encontro contexto relevante en el corpus para esta consulta.",
    "Si la consulta es legal especifica, pide una reformulacion o sugiere la calculadora guiada.",
  ].join(" ")
}

export async function retrieveLegalContext(
  countryCode: string,
  query: string,
  options: { section?: string } = {},
): Promise<RetrievalResult> {
  const cc = sanitizeCountry(countryCode)
  const trimmed = query.trim()

  if (!trimmed) {
    return { context: "", source: "vector", hits: [] }
  }

  if (!isUpstashConfigured()) {
    return { context: buildDegradedContext(), source: "degraded", hits: [] }
  }

  try {
    const index = getVectorIndex()
    const results = await index.query<{
      topic?: string
      section?: string
      filename?: string
    }>({
      data: expandQuery(trimmed),
      topK: TOP_K,
      filter: buildSectionFilter(cc, options.section),
      includeData: true,
      includeMetadata: true,
    })

    const hits: RetrievedHit[] = results
      .filter((r) => typeof r.data === "string" && r.data.length > 0)
      .map((r) => ({
        text: r.data as string,
        topic: r.metadata?.topic ?? "general",
        section: r.metadata?.section ?? "",
        filename: r.metadata?.filename ?? "",
        score: r.score,
      }))

    if (hits.length === 0) {
      return { context: buildEmptyContext(), source: "vector", hits: [] }
    }

    return { context: formatHits(hits), source: "vector", hits }
  } catch (error) {
    console.error("[legal-rag] Upstash Vector query failed:", error)
    return { context: buildDegradedContext(), source: "degraded", hits: [] }
  }
}

export function buildRagSystemPrompt(input: {
  countryCode: string
  context: string
  source: RetrievalResult["source"]
  retrievalHits: RetrievedHit[]
}): string {
  const cc = sanitizeCountry(input.countryCode)
  const meta = countryMeta[cc]

  const corpusBlock = input.context
    ? `CONTEXTO LEGAL RECUPERADO (chunks relevantes del corpus, filtrado por pais):\n${input.context}`
    : "No se encontro contexto legal. Indica al usuario que reformule o use la calculadora guiada."

  const citations =
    input.retrievalHits.length > 0
      ? `\n\nCITAS DISPONIBLES PARA REFERENCIAR:\n${input.retrievalHits
          .map(
            (h) =>
              `- \`${h.filename}\` seccion \`${h.section}\` (tema: ${h.topic}, score: ${h.score.toFixed(3)})`,
          )
          .join("\n")}`
      : ""

  const degradationNote =
    input.source === "degraded"
      ? "\n\nMODO DEGRADADO: el corpus no esta disponible. Responde con cautela, no inventes datos legales y sugiere la calculadora guiada."
      : ""

  return `Eres Justo, un asistente experto EXCLUSIVAMENTE en derecho laboral de ${meta.name}.

PAIS ACTIVO: ${meta.name}
MARCO LEGAL: ${meta.law}

${corpusBlock}${citations}${degradationNote}

INSTRUCCIONES:
- Si el CONTEXTO LEGAL RECUPERADO contiene suficiente informacion para responder, responde directamente SIN llamar herramientas adicionales.
- Basa tu respuesta EXCLUSIVAMENTE en el CONTEXTO LEGAL RECUPERADO y en las herramientas deterministicas.
- No inventes articulos, tasas, precedentes ni formulas. Si el contexto no alcanza, dilo claramente.
- Para CALCULOS NUMERICOS usa SIEMPRE las herramientas \`quickEstimate\`, \`quickNetSalaryEstimate\`, \`quickBonusEstimate\`, \`quickTerminationEstimate\` o \`quickVacationEstimate\`. NUNCA calcules montos manualmente, ni siquiera para estimaciones simples.
- Usa \`legalCorpusLookup\` SOLO en estos casos:
  1. El CONTEXTO LEGAL RECUPERADO no contiene la informacion necesaria y necesitas un tema especifico (ej: una tasa, un articulo, una formula).
  2. El usuario pregunta por un concepto no cubierto en el contexto inicial.
  Despues de \`legalCorpusLookup\`, redacta una respuesta final en texto para el usuario.
- NO uses \`legalCorpusLookup\` si el contexto ya tiene suficiente informacion.
- Cuando cites el corpus, incluye archivo y seccion: \`filename.md :: seccion\`.
- Responde SIEMPRE en espanol, claro y amable.
- Marca la interpretacion como informacion general, no asesoria legal profesional.
- Si preguntan algo fuera de derecho laboral de ${meta.name}, redirige cortesmente al tema laboral.
- Formato: maximo ~3000 caracteres, Markdown compacto (negritas, bullets cortos), 1-2 emojis por seccion maximo.
- Para datos faltantes, haz 1-3 preguntas concretas y breves.
- Cuando expliques un calculo, muestra LOS PASOS y LA FORMULA usada, no solo el resultado final.
- Si el usuario menciona "renuncia", "despido" o "terminacion", considera usar \`quickTerminationEstimate\` para comparar escenarios.`
}
