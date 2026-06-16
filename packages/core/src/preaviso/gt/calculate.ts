import type { PreavisoInput, PreavisoResult } from "../types"
import { noticeDaysToAmount } from "../shared"
import { getGuatemalaPreavisoLegalParams } from "./legal-params"

export const calculateGuatemalaPreaviso = (input: PreavisoInput): PreavisoResult => {
  const { currency, corpusVersion } = getGuatemalaPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30

  let noticeDays: number
  if (input.tenureYears < 0.5) {
    noticeDays = 7
  } else if (input.tenureYears < 1) {
    noticeDays = 10
  } else if (input.tenureYears <= 5) {
    noticeDays = 14
  } else {
    noticeDays = 30
  }

  return {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Codigo de Trabajo Art. 83",
    calculationNote: "Preaviso escalonado segun antiguedad. <6 meses: 7 dias. 6-12 meses: 10 dias. 1-5 anos: 14 dias. >5 anos: 30 dias.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  }
}
