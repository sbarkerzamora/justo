import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getCostaRicaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "CRC"
const LEGAL_CORPUS_VERSION = "cr-v0.2.0"

export const calculateCostaRicaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { ccssRate, irBrackets } = getCostaRicaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "CCSS", rate: ccssRate, legalReference: "Ley Constitutiva de la CCSS" },
    ],
    {
      label: "IR",
      legalReference: "Ley del Impuesto sobre la Renta",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
