import type { PreavisoInput, PreavisoResult } from "../types"
import { noticeDaysToAmount } from "../shared"
import { getCostaRicaPreavisoLegalParams } from "./legal-params"

export const calculateCostaRicaPreaviso = (input: PreavisoInput): PreavisoResult => {
  const { currency, corpusVersion } = getCostaRicaPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const months = input.tenureYears * 12

  let noticeDays: number
  if (months < 3) {
    noticeDays = 0
  } else if (months < 6) {
    noticeDays = 7
  } else if (input.tenureYears < 1) {
    noticeDays = 15
  } else {
    noticeDays = 30
  }

  return {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Codigo de Trabajo Art. 28",
    calculationNote: "Preaviso escalonado segun antiguedad. <3 meses: 0 dias. 3-6 meses: 7 dias. 6-12 meses: 15 dias. >=1 ano: 30 dias.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  }
}
