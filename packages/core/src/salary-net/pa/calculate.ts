import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getPanamaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "USD"
const LEGAL_CORPUS_VERSION = "pa-v0.2.0"

export const calculatePanamaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { cssRate, irBrackets } = getPanamaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "CSS", rate: cssRate, legalReference: "Ley Orgánica de la CSS" },
    ],
    {
      label: "IR",
      legalReference: "Ley del Impuesto sobre la Renta",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
