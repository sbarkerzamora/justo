import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getMexicoPreavisoLegalParams } from "./legal-params"

export const calculateMexicoPreaviso = (
  input: PreavisoInput
): PreavisoResult => {
  const { currency, corpusVersion } = getMexicoPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const noticeDays = 0

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: false,
    legalReference: "LFT Art. 48, 50",
    calculationNote:
      "Mexico no contempla preaviso patronal. El despido injustificado genera indemnizacion constitucional de 90 dias (Art. 48 LFT).",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
