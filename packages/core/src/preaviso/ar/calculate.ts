import type { PreavisoInput, PreavisoResult } from "../types"
import { noticeDaysToAmount } from "../shared"
import { getArgentinaPreavisoLegalParams } from "./legal-params"

export const calculateArgentinaPreaviso = (input: PreavisoInput): PreavisoResult => {
  const { currency, corpusVersion } = getArgentinaPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30

  const noticeDays = input.tenureYears >= 5 ? 60 : 30

  return {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Ley 20.744 Art. 232",
    calculationNote: "El preaviso se calcula segun antiguedad. <5 anos: 30 dias. >=5 anos: 60 dias.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  }
}
