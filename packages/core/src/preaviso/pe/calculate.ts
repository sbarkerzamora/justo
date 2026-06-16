import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getPeruPreavisoLegalParams } from "./legal-params"

export const calculatePeruPreaviso = (input: PreavisoInput): PreavisoResult => {
  const { currency, corpusVersion } = getPeruPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const noticeDays = 0

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: false,
    legalReference: "LPCL Art. 34, 38",
    calculationNote:
      "Peru no contempla preaviso patronal. El despido arbitrario genera indemnizacion de 1.5 sueldos por ano (IDA), maximo 12 sueldos (Art. 38 LPCL).",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
