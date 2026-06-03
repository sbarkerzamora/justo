import type { CountryCode, CurrencyCode } from "../settlement"

export interface BonusInput {
  countryCode: CountryCode
  monthlySalary: number
  startDate: string
  endDate: string
}

export interface BonusLine {
  label: string
  amount: number
  formula: string
  legalReference: string
}

export interface BonusResult {
  currency: CurrencyCode
  supported: boolean
  lines: BonusLine[]
  total: number
  periodDays: number
  fallbackReason?: string
  generatedAt: string
  legalCorpusVersion: string
}
