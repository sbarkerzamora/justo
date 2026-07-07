import { stepCountIs, streamText, tool, zodSchema, type ModelMessage } from "ai"
import { calculateSalaryNet } from "@justo/tools"
import { calculateSettlement } from "@justo/tools"
import { calculatePreaviso } from "@justo/tools"
import { calculateVacations } from "@justo/tools"
import { calculateBonus, calculateTermination } from "@justo/tools"
import { z } from "zod"

import { getChatModelConfig } from "@/lib/ai/chat-provider"
import { retrieveLegalContext, buildRagSystemPrompt } from "@/lib/ai/legal-rag"
import { countryMeta, SUPPORTED_COUNTRIES } from "@/lib/ai/countries-meta"
import type { CountryCode, SettlementInput } from "@justo/core"

export { SUPPORTED_COUNTRIES, countryMeta }

export async function generateLaborResponse(input: {
  countryCode: string
  userMessageText: string
  modelMessages?: ModelMessage[]
}) {
  const { countryCode, userMessageText, modelMessages } = input

  if (
    !SUPPORTED_COUNTRIES.includes(
      countryCode as (typeof SUPPORTED_COUNTRIES)[number]
    )
  ) {
    throw new Error(`Pais no soportado: ${countryCode}`)
  }

  const retrieval = await retrieveLegalContext(countryCode, userMessageText)

  const systemPrompt = buildRagSystemPrompt({
    countryCode,
    context: retrieval.context,
    source: retrieval.source,
    retrievalHits: retrieval.hits,
  })

  const chatModelConfig = getChatModelConfig()

  const topics = [
    ...new Set(retrieval.hits.map((h) => h.topic).filter(Boolean)),
  ] as string[]

  return {
    stream: streamText({
      model: chatModelConfig.model,
      system: systemPrompt,
      messages: modelMessages ?? [{ role: "user", content: userMessageText }],
      maxOutputTokens: chatModelConfig.maxOutputTokens,
      temperature: chatModelConfig.temperature,
      topP: chatModelConfig.topP,
      providerOptions: chatModelConfig.providerOptions,
      stopWhen: stepCountIs(4),
      tools: {
        legalCorpusLookup: tool({
          description: `Busqueda vectorial en el corpus legal completo de ${countryMeta[countryCode]?.name ?? "este pais"}. Usala CUANDO el contexto inicial no tenga suficiente informacion para responder. Ideal para buscar tasas especificas, articulos legales, formulas detalladas o conceptos no cubiertos en el contexto recuperado. El parametro \`topic\` acepta texto libre (palabras clave del tema a buscar). Opcionalmente \`section\` restringe a una parte especifica del documento: base_legal (articulos de ley), texto_legal (texto completo del articulo), regla_operativa (como se aplica), formula (ecuacion matematica), variables (definicion de terminos), supuestos (condiciones), excepciones (casos especiales). NO la uses si el contexto inicial ya responde la pregunta del usuario.`,
          inputSchema: zodSchema(
            z.object({
              topic: z
                .string()
                .describe(
                  "Tema o palabras clave a buscar, ej: indemnizacion, aguinaldo, vacaciones, deducciones, inss, igss, ihss, ccss, css, imss, isss, afp, onp-afp, eps-pension, salud, afc, sac-aguinaldo, cts, gratificaciones, prima-servicios, cesantia, preaviso, salario-proporcional, ir-rentas-trabajo, ley 185"
                ),
              section: z
                .enum([
                  "base_legal",
                  "texto_legal",
                  "regla_operativa",
                  "formula",
                  "variables",
                  "supuestos",
                  "excepciones",
                  "vigencia_fuente",
                  "alcance_documental",
                ])
                .optional()
                .describe(
                  "Opcional: filtra la busqueda a una seccion especifica del documento"
                ),
            })
          ),
          execute: async ({ topic, section }) => {
            const result = await retrieveLegalContext(countryCode, topic, {
              section,
            })
            return JSON.stringify({
              query: topic,
              section: section ?? null,
              fuente: result.source,
              resultados: result.context,
              hits: result.hits.map((h) => ({
                archivo: h.filename,
                seccion: h.section,
                tema: h.topic,
                score: Number(h.score.toFixed(3)),
              })),
            })
          },
        }),
        quickEstimate: tool({
          description: `Calcula un estimado rapido de liquidacion en ${countryMeta[countryCode]?.name ?? "este pais"} usando el motor deterministico (${countryMeta[countryCode]?.law ?? "ley local"}). Usala cuando el usuario pregunte "cuanto me corresponde" con un salario y anos de antiguedad. No la uses para liquidaciones formales.`,
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
              terminationCause: z
                .enum([
                  "renuncia",
                  "despido_justificado",
                  "despido_injustificado",
                  "mutuo_acuerdo",
                  "fin_plazo",
                  "obra_terminada",
                  "jubilacion",
                  "fallecimiento",
                ])
                .optional()
                .describe("Causa de terminación, si el usuario la indicó"),
              contractType: z
                .enum([
                  "indeterminado",
                  "plazo_fijo",
                  "obra_determinada",
                  "temporada",
                  "periodo_prueba",
                ])
                .optional()
                .describe("Tipo de contrato, si el usuario lo indicó"),
            })
          ),
          execute: async ({
            monthlySalary,
            tenureYears,
            unusedVacationDays,
            terminationCause,
            contractType,
          }) => {
            const end = new Date()
            const start = new Date()
            start.setFullYear(start.getFullYear() - tenureYears)

            const input: SettlementInput = {
              countryCode: countryCode as CountryCode,
              employeeName: "Trabajador",
              employerName: "Empleador",
              monthlySalary,
              frequency: "mensual",
              unusedVacationDays,
              startDate: start.toISOString().slice(0, 10),
              endDate: end.toISOString().slice(0, 10),
              terminationCause: terminationCause ?? "despido_injustificado",
              contractType: contractType ?? "indeterminado",
            }

            try {
              const result = calculateSettlement(input)
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
                warnings: result.warnings,
              })
            } catch (e) {
              return `Error al calcular el estimado: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
            }
          },
        }),
        quickNetSalaryEstimate: tool({
          description: `Calcula el salario neto estimado en ${countryMeta[countryCode]?.name ?? "este pais"} despues de deducciones laborales (${countryCode === "ni" ? "INSS, IR" : countryCode === "sv" ? "ISSS, AFP, ISR" : countryCode === "gt" ? "IGSS, ISR" : countryCode === "hn" ? "IHSS, RAP" : countryCode === "cr" ? "CCSS" : countryCode === "pa" ? "CSS" : countryCode === "mx" ? "IMSS, ISR" : countryCode === "co" ? "EPS, pension" : countryCode === "pe" ? "ONP, AFP" : countryCode === "cl" ? "AFP, AFC, salud" : "INSS, IR"}) usando el motor deterministico. Usala cuando el usuario pregunte "cuanto recibo neto" con un salario bruto.`,
          inputSchema: zodSchema(
            z.object({
              grossSalary: z
                .number()
                .positive()
                .describe("Salario bruto mensual del trabajador"),
              frequency: z
                .enum(["mensual", "quincenal", "semanal"])
                .optional()
                .default("mensual")
                .describe("Frecuencia de pago"),
            })
          ),
          execute: async ({ grossSalary, frequency }) => {
            try {
              const result = calculateSalaryNet({
                countryCode: countryCode as
                  | "ni"
                  | "sv"
                  | "hn"
                  | "gt"
                  | "cr"
                  | "pa"
                  | "mx"
                  | "co"
                  | "pe"
                  | "cl"
                  | "ar",
                grossSalary,
                frequency,
              })
              return JSON.stringify({
                currency: result.currency,
                grossSalary: result.grossSalary,
                deductions: result.deductions.map((d) => ({
                  label: d.label,
                  amount: d.amount,
                  formula: d.formula,
                  legalReference: d.legalReference,
                })),
                totalDeductions: result.totalDeductions,
                netSalary: result.netSalary,
                netSalaryPerPeriod: result.netSalaryPerPeriod,
                legalCorpusVersion: result.legalCorpusVersion,
              })
            } catch (e) {
              return `Error al calcular salario neto: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
            }
          },
        }),
        quickBonusEstimate: tool({
          description: `Calcula un estimado de aguinaldo, décimo, bono 14, prima, SAC o gratificaciones proporcional en ${countryMeta[countryCode]?.name ?? "este pais"} usando el motor deterministico segun la ${countryMeta[countryCode]?.law ?? "ley local"}. Usala cuando el usuario pregunte sobre aguinaldo, decimo, bono, prima de servicios, gratificaciones o SAC.`,
          inputSchema: zodSchema(
            z.object({
              monthlySalary: z
                .number()
                .positive()
                .describe("Salario mensual del trabajador"),
              startDate: z
                .string()
                .describe("Fecha de inicio del periodo en formato YYYY-MM-DD"),
              endDate: z
                .string()
                .describe("Fecha de corte del periodo en formato YYYY-MM-DD"),
            })
          ),
          execute: async ({ monthlySalary, startDate, endDate }) => {
            try {
              const result = calculateBonus({
                countryCode: countryCode as
                  | "ni"
                  | "sv"
                  | "hn"
                  | "gt"
                  | "cr"
                  | "pa"
                  | "mx"
                  | "co"
                  | "pe"
                  | "cl"
                  | "ar",
                monthlySalary,
                startDate,
                endDate,
              })
              return JSON.stringify({
                currency: result.currency,
                supported: result.supported,
                lines: result.lines.map((l) => ({
                  label: l.label,
                  amount: l.amount,
                  formula: l.formula,
                  legalReference: l.legalReference,
                })),
                total: result.total,
                periodDays: result.periodDays,
                fallbackReason: result.fallbackReason,
                legalCorpusVersion: result.legalCorpusVersion,
              })
            } catch (e) {
              return `Error al calcular bono: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
            }
          },
        }),
        quickTerminationEstimate: tool({
          description: `Compara escenarios de terminación en ${countryMeta[countryCode]?.name ?? "este pais"} (renuncia, despido justificado, despido injustificado, mutuo acuerdo) usando el motor determinístico según la ${countryMeta[countryCode]?.law ?? "ley local"}. Usala cuando el usuario pregunte "cuanto me pagan si renuncio", "cuanto me indemnizan si me despiden", "comparar escenarios de salida" o similares.`,
          inputSchema: zodSchema(
            z.object({
              monthlySalary: z
                .number()
                .positive()
                .describe("Salario mensual del trabajador"),
              startDate: z
                .string()
                .describe("Fecha de inicio laboral en formato YYYY-MM-DD"),
              endDate: z
                .string()
                .describe("Fecha de salida en formato YYYY-MM-DD"),
              terminationCause: z
                .enum([
                  "renuncia",
                  "despido_justificado",
                  "despido_injustificado",
                  "mutuo_acuerdo",
                  "fin_plazo",
                  "obra_terminada",
                  "jubilacion",
                  "fallecimiento",
                ])
                .optional()
                .describe("Causa de terminación, si el usuario la indicó"),
              contractType: z
                .enum([
                  "indeterminado",
                  "plazo_fijo",
                  "obra_determinada",
                  "temporada",
                  "periodo_prueba",
                ])
                .optional()
                .describe("Tipo de contrato, si el usuario lo indicó"),
            })
          ),
          execute: async ({
            monthlySalary,
            startDate,
            endDate,
            terminationCause,
            contractType,
          }) => {
            try {
              const result = calculateTermination({
                countryCode: countryCode as
                  | "ni"
                  | "sv"
                  | "hn"
                  | "gt"
                  | "cr"
                  | "pa"
                  | "mx"
                  | "co"
                  | "pe"
                  | "cl"
                  | "ar",
                monthlySalary,
                startDate,
                endDate,
                terminationCause: terminationCause ?? "despido_injustificado",
                contractType: contractType ?? "indeterminado",
              })
              return JSON.stringify({
                currency: result.currency,
                tenureYears: result.tenureYears,
                scenarios: result.scenarios.map((s) => ({
                  type: s.type,
                  applicable: s.applicable,
                  total: s.total,
                  lines: s.lines.map((l) => ({
                    label: l.label,
                    amount: l.amount,
                    formula: l.formula,
                    legalReference: l.legalReference,
                  })),
                  note: s.note,
                })),
                legalCorpusVersion: result.legalCorpusVersion,
              })
            } catch (e) {
              return `Error al comparar escenarios: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
            }
          },
        }),
        contractGeneratorGuide: tool({
          description: `Informa al usuario sobre el generador de contratos de trabajo disponible para Nicaragua. Cuando el usuario pida generar un contrato de trabajo, menciona que puede usar la herramienta guiada "Generador de contratos" desde el menú de herramientas.`,
          inputSchema: zodSchema(
            z.object({
              request: z
                .string()
                .describe("La solicitud del usuario sobre el contrato"),
            })
          ),
          execute: async () => {
            return JSON.stringify({
              available: true,
              country: "Nicaragua",
              guide:
                'Puedo ayudarte a generar un contrato de trabajo paso a paso. Usa la herramienta "Generador de contratos" desde el menú de herramientas o haz clic en el botón "Contrato" para empezar.',
              legalBasis:
                "Ley 185, Código del Trabajo de Nicaragua, Arts. 19-29",
            })
          },
        }),
        preavisoEstimate: tool({
          description: `Calcula los dias de preaviso e indemnizacion sustitutiva en ${countryMeta[countryCode]?.name ?? "este pais"} segun la antiguedad del trabajador. Usala cuando el usuario pregunte sobre preaviso, aviso previo, o cuanto le corresponde por aviso de despido.`,
          inputSchema: zodSchema(
            z.object({
              monthlySalary: z
                .number()
                .positive()
                .describe("Salario mensual del trabajador"),
              tenureYears: z
                .number()
                .positive()
                .describe("Años de antigüedad del trabajador"),
              terminationCause: z
                .enum([
                  "renuncia",
                  "despido_justificado",
                  "despido_injustificado",
                  "mutuo_acuerdo",
                  "fin_plazo",
                  "obra_terminada",
                  "jubilacion",
                  "fallecimiento",
                ])
                .optional()
                .describe("Causa de terminación, si el usuario la indicó"),
              contractType: z
                .enum([
                  "indeterminado",
                  "plazo_fijo",
                  "obra_determinada",
                  "temporada",
                  "periodo_prueba",
                ])
                .optional()
                .describe("Tipo de contrato, si el usuario lo indicó"),
            })
          ),
          execute: async ({
            monthlySalary,
            tenureYears,
            terminationCause,
            contractType,
          }) => {
            try {
              const result = calculatePreaviso({
                countryCode: countryCode as CountryCode,
                monthlySalary,
                tenureYears,
                terminationCause: terminationCause ?? "despido_injustificado",
                contractType: contractType ?? "indeterminado",
                noticeGivenInWriting: false,
                replaceNoticeWithPayment: true,
              })
              return JSON.stringify({
                noticeDays: result.noticeDays,
                noticeAmount: result.noticeAmount,
                hasSubstitutePayment: result.hasSubstitutePayment,
                legalReference: result.legalReference,
                note: result.calculationNote,
                corpusVersion: result.legalCorpusVersion,
              })
            } catch (e) {
              return `Error al calcular: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
            }
          },
        }),
        quickVacationEstimate: tool({
          description: `Calcula un estimado de vacaciones acumuladas, gozadas y pendientes en ${countryMeta[countryCode]?.name ?? "este pais"} usando el motor deterministico segun la ${countryMeta[countryCode]?.law ?? "ley local"}. Usala cuando el usuario pregunte sobre dias de vacaciones, vacaciones pendientes o pago de vacaciones.`,
          inputSchema: zodSchema(
            z.object({
              monthlySalary: z
                .number()
                .positive()
                .describe("Salario mensual del trabajador"),
              startDate: z
                .string()
                .describe("Fecha de inicio laboral en formato YYYY-MM-DD"),
              endDate: z
                .string()
                .describe("Fecha de corte o salida en formato YYYY-MM-DD"),
              usedVacationDays: z
                .number()
                .min(0)
                .max(30)
                .optional()
                .default(0)
                .describe("Dias de vacaciones ya gozados (opcional)"),
            })
          ),
          execute: async ({
            monthlySalary,
            startDate,
            endDate,
            usedVacationDays,
          }) => {
            if (countryCode !== "ni") {
              return "El calculo de vacaciones solo esta disponible para Nicaragua actualmente."
            }

            try {
              const result = calculateVacations({
                countryCode: "ni",
                monthlySalary,
                startDate,
                endDate,
                usedVacationDays,
              })
              return JSON.stringify({
                currency: result.currency,
                accruedVacationDays: result.accruedVacationDays,
                usedVacationDays: result.usedVacationDays,
                pendingVacationDays: result.pendingVacationDays,
                dailySalary: result.dailySalary,
                amount: result.amount,
                formula: result.formula,
                legalReference: result.legalReference,
                legalCorpusVersion: result.legalCorpusVersion,
              })
            } catch (e) {
              return `Error al calcular vacaciones: ${e instanceof Error ? e.message : "error desconocido"}. Usa la calculadora guiada para un calculo mas preciso.`
            }
          },
        }),
      },
      maxRetries: 1,
    }),
    topics,
  }
}
