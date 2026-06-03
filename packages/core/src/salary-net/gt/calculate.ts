import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getGuatemalaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "GTQ"
const LEGAL_CORPUS_VERSION = "gt-v0.2.0"

export const calculateGuatemalaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { igssRate, isrRate } = getGuatemalaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "IGSS", rate: igssRate, legalReference: "Ley del IGSS" },
    ],
    { label: "ISR", rate: isrRate, legalReference: "Ley del ISR", source: "corpus" },
  )
}
