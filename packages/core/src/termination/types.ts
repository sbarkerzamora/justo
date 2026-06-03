import type { CountryCode, CurrencyCode } from "../settlement"

export type TerminationScenarioType =
  | "renuncia"
  | "despido_justificado"
  | "despido_injustificado"
  | "mutuo_acuerdo"

export interface TerminationInput {
  countryCode: CountryCode
  monthlySalary: number
  startDate: string
  endDate: string
}

export interface TerminationLine {
  label: string
  amount: number
  formula: string
  legalReference: string
}

export interface TerminationScenario {
  type: TerminationScenarioType
  applicable: boolean
  total: number
  lines: TerminationLine[]
  note?: string
}

export interface TerminationResult {
  currency: CurrencyCode
  scenarios: TerminationScenario[]
  dailySalary: number
  tenureYears: number
  tenureDays: number
  generatedAt: string
  legalCorpusVersion: string
}
