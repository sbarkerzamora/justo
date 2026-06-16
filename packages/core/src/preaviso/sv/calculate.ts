import type { PreavisoInput, PreavisoResult } from "../types"
import { noticeDaysToAmount } from "../shared"
import { getElSalvadorPreavisoLegalParams } from "./legal-params"

export const calculateElSalvadorPreaviso = (input: PreavisoInput): PreavisoResult => {
  const { currency, corpusVersion } = getElSalvadorPreavisoLegalParams()
  const dailySalary = input.monthlySalary / 30
  const noticeDays = 0

  return {
    currency,
    noticeDays,
    noticeAmount: noticeDaysToAmount(dailySalary, noticeDays),
    hasSubstitutePayment: false,
    legalReference: "Codigo de Trabajo Art. 58",
    calculationNote: "El Salvador no exige preaviso patronal. La indemnizacion por despido injustificado es de 30 dias por ano (Art. 58 CT).",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  }
}
