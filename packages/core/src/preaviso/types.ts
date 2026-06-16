import type { CountryCode, CurrencyCode } from "../settlement"
import type { JurisdictionContractType, TerminationCause } from "../shared"

export interface PreavisoInput {
  countryCode: CountryCode
  monthlySalary: number
  tenureYears: number
  terminationCause: TerminationCause
  contractType: JurisdictionContractType
  noticeGivenInWriting: boolean
  noticeDaysGiven?: number
  replaceNoticeWithPayment: boolean
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
