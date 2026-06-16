import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getNicaraguaPreavisoLegalParams } from "./legal-params"

export const calculateNicaraguaPreaviso = (
  input: PreavisoInput
): PreavisoResult => {
  const { currency, corpusVersion } = getNicaraguaPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30

  let noticeDays: number
  if (input.tenureYears < 0.5) {
    noticeDays = 7
  } else if (input.tenureYears < 1) {
    noticeDays = 14
  } else if (input.tenureYears <= 5) {
    noticeDays = 30
  } else {
    noticeDays = 60
  }

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Ley 185 (Codigo del Trabajo) Art. 44",
    calculationNote:
      "Preaviso segun antiguedad. <6 meses: 7 dias. 6-12 meses: 14 dias. 1-5 anos: 30 dias. >5 anos: 60 dias.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
