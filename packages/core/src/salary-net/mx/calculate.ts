import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getMexicoSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "MXN"
const LEGAL_CORPUS_VERSION = "mx-v0.2.0"

export const calculateMexicoSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { imssRate, irBrackets } = getMexicoSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "IMSS", rate: imssRate, legalReference: "Ley del Seguro Social" },
    ],
    {
      label: "ISR",
      legalReference: "Ley del ISR",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
