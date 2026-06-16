import type { PreavisoInput, PreavisoResult } from "../types"
import { applyPreavisoInputAdjustments, noticeDaysToAmount } from "../shared"
import { getPanamaPreavisoLegalParams } from "./legal-params"

export const calculatePanamaPreaviso = (
  input: PreavisoInput
): PreavisoResult => {
  const { currency, corpusVersion } = getPanamaPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30

  let noticeDays: number
  let note: string

  if (input.tenureYears < 2) {
    noticeDays = 30
    note = "Preaviso de 30 dias por menos de 2 anos de servicio continuo."
  } else {
    noticeDays = 0
    note =
      "Con 2 anos o mas de servicio, aplica estabilidad laboral (Art. 212). No corresponde preaviso."
  }

  return applyPreavisoInputAdjustments(input, {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: true,
    legalReference: "Codigo de Trabajo Art. 212",
    calculationNote: note,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  })
}
