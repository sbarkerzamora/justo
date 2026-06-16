import type {
  CountryCode,
  CurrencyCode,
  PayrollFrequency,
  TipoDespido,
  TerminationCause,
} from "@justo/core"

export type { TipoDespido }

export interface AnonymousSettlementRecord {
  id: string
  countryCode: CountryCode
  monthlySalary: number
  frequency: PayrollFrequency
  tenureDays: number
  unusedVacationDays: number
  terminationType?: TipoDespido | TerminationCause
  grossIncome: number
  totalDeductions: number
  netTotal: number
  currency: CurrencyCode
  legalCorpusVersion: string
  timestamp: number
}

export interface PercentileData {
  min: number
  p25: number
  p50: number
  p75: number
  p90: number
  max: number
}

export interface CountryStats {
  countryCode: CountryCode
  totalSettlements: number
  byTerminationType: Record<string, number>
  byFrequency: Record<string, number>
  salary: PercentileData
  tenure: PercentileData
  net: PercentileData
}
