import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getChilePreavisoLegalParams } from "./legal-params"

export const calculateChilePreaviso = (
  input: PreavisoInput
): PreavisoResult => {
  const { currency, corpusVersion } = getChilePreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const noticeDays = 30

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Codigo del Trabajo Arts. 161-162",
    calculationNote:
      "Indemnizacion sustitutiva del aviso previo. 30 dias (1 mes) independiente de la antiguedad.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
