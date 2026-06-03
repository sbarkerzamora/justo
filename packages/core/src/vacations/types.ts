import type { CountryCode, CurrencyCode } from "../settlement"

export interface VacationInput {
  countryCode: CountryCode
  monthlySalary: number
  startDate: string
  endDate: string
  usedVacationDays: number
}

export interface VacationResult {
  currency: CurrencyCode
  accruedVacationDays: number
  usedVacationDays: number
  pendingVacationDays: number
  dailySalary: number
  amount: number
  formula: string
  legalReference: string
  generatedAt: string
  legalCorpusVersion: string
}
