import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getColombiaPreavisoLegalParams } from "./legal-params"

export const calculateColombiaPreaviso = (
  input: PreavisoInput
): PreavisoResult => {
  const { currency, corpusVersion } = getColombiaPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const noticeDays = 0

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: false,
    legalReference: "CST Art. 64",
    calculationNote:
      "Colombia no exige preaviso patronal para contratos a termino indefinido. La indemnizacion por despido injustificado se calcula segun Art. 64 CST.",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
