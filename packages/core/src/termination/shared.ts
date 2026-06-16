import { round2, daysBetween } from "../settlement"
import type { CurrencyCode } from "../settlement"
import type {
  TerminationInput,
  TerminationLine,
  TerminationResult,
  TerminationScenario,
  TerminationScenarioType,
} from "./types"

const baseScenarioTypes = new Set([
  "renuncia",
  "despido_justificado",
  "despido_injustificado",
  "mutuo_acuerdo",
])

export const scenarioLabels: Record<TerminationScenarioType, string> = {
  renuncia: "Renuncia voluntaria",
  despido_justificado: "Despido justificado",
  despido_injustificado: "Despido injustificado",
  mutuo_acuerdo: "Mutuo acuerdo",
  fin_plazo: "Fin de plazo",
  obra_terminada: "Obra terminada",
  jubilacion: "Jubilación",
  fallecimiento: "Fallecimiento",
}

export interface TerminationContext {
  dailySalary: number
  monthlySalary: number
  tenureYears: number
  fullYears: number
  seniorityDays: number
  seniorityMonths: number
}

export interface TerminationScenarioConfig {
  type: TerminationScenarioType
  applicable: boolean
  buildLines?: (ctx: TerminationContext) => TerminationLine[]
  note?: string
}

export interface TerminationParams {
  currency: CurrencyCode
  corpusVersion: string
  scenarios: TerminationScenarioConfig[]
}

export const isSpecialTerminationClosure = (input: TerminationInput) =>
  !baseScenarioTypes.has(input.terminationCause) ||
  input.contractType === "periodo_prueba"

export const getSpecialTerminationClosureNote = (input: TerminationInput) => {
  if (input.contractType === "periodo_prueba") {
    return "Periodo de prueba: no se calcula indemnización automática sin validar reglas específicas del caso en el corpus legal."
  }

  return "Causa especial de cierre: se requiere regla específica por causa y contrato; no se agrega indemnización sin respaldo del corpus."
}

export function buildTermination(
  input: TerminationInput,
  params: TerminationParams
): TerminationResult {
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Fechas inválidas")
  }

  if (end < start) {
    throw new Error(
      "La fecha de salida no puede ser menor que la fecha de inicio"
    )
  }

  const dailySalary = round2(input.monthlySalary / 30)
  const seniorityDays = daysBetween(start, end)
  const tenureYears = seniorityDays / 365
  const fullYears = Math.floor(tenureYears)
  const seniorityMonths = Math.floor(tenureYears * 12)

  const ctx: TerminationContext = {
    dailySalary,
    monthlySalary: input.monthlySalary,
    tenureYears,
    fullYears,
    seniorityDays,
    seniorityMonths,
  }

  const scenarios: TerminationScenario[] = params.scenarios.map((config) => {
    if (!config.applicable) {
      return {
        type: config.type,
        applicable: false,
        total: 0,
        lines: [],
        note: config.note,
      }
    }

    const lines = (config.buildLines?.(ctx) ?? []).map((line) => ({
      ...line,
      amount: round2(line.amount),
    }))

    const total = round2(lines.reduce((sum, line) => sum + line.amount, 0))

    return {
      type: config.type,
      applicable: true,
      total,
      lines,
      note: config.note,
    }
  })

  if (!scenarios.some((scenario) => scenario.type === input.terminationCause)) {
    scenarios.push({
      type: input.terminationCause,
      applicable: true,
      total: 0,
      lines: [],
      note: "Escenario informativo. Esta causa requiere reglas específicas por contrato y país; no se agrega indemnización sin respaldo del corpus.",
    })
  }

  return {
    currency: params.currency,
    scenarios,
    dailySalary,
    tenureYears: round2(tenureYears),
    tenureDays: seniorityDays,
    selectedTerminationCause: input.terminationCause,
    contractType: input.contractType,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: params.corpusVersion,
  }
}

export function makeIndemnityLine(
  label: string,
  dailySalary: number,
  days: number,
  legalReference: string
): TerminationLine {
  return {
    label,
    amount: dailySalary * days,
    formula: `${dailySalary} x ${days} días`,
    legalReference,
  }
}
