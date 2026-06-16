import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getHondurasPreavisoLegalParams } from "./legal-params"

const getPreavisoDaysHn = (months: number): number => {
  if (months < 3) return 1
  if (months < 6) return 7
  if (months < 12) return 14
  if (months < 24) return 30
  return 60
}

export const calculateHondurasPreaviso = (
  input: PreavisoInput
): PreavisoResult => {
  const { currency, corpusVersion } = getHondurasPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const months = input.tenureYears * 12

  const noticeDays = getPreavisoDaysHn(months)

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Codigo de Trabajo Art. 116",
    calculationNote:
      "Preaviso sustitutivo segun antiguedad. <3 meses: 1 dia (trivial). 3-6 meses: 7 dias. 6-12 meses: 14 dias. 1-2 anos: 30 dias. >2 anos: 60 dias.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
