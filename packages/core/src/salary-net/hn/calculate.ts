import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getHondurasSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "HNL"
const LEGAL_CORPUS_VERSION = "hn-v0.2.0"

export const calculateHondurasSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { ihssRate, irBrackets } = getHondurasSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "IHSS", rate: ihssRate, legalReference: "Ley del IHSS" },
    ],
    {
      label: "IR",
      legalReference: "Ley de Impuesto Sobre la Renta",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
