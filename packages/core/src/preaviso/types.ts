import type { CountryCode, CurrencyCode } from "../settlement"

export interface PreavisoInput {
  countryCode: CountryCode
  monthlySalary: number
  tenureYears: number
}

export interface PreavisoResult {
  currency: CurrencyCode
  noticeDays: number
  noticeAmount: number
  hasSubstitutePayment: boolean
  legalReference: string
  calculationNote?: string
  generatedAt: string
  legalCorpusVersion: string
}
