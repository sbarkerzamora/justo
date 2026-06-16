import type { CountryCode, CurrencyCode } from "../settlement"
import type { JurisdictionContractType, TerminationCause } from "../shared"

export type TerminationScenarioType = TerminationCause

export interface TerminationInput {
  countryCode: CountryCode
  monthlySalary: number
  startDate: string
  endDate: string
  terminationCause: TerminationCause
  contractType: JurisdictionContractType
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
  selectedTerminationCause: TerminationCause
  contractType: JurisdictionContractType
  generatedAt: string
  legalCorpusVersion: string
}
