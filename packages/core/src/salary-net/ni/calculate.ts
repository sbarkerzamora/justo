import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getNicaraguaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "NIO"
const LEGAL_CORPUS_VERSION = "ni-v0.3.0"

export const calculateNicaraguaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { inssLaborRate, irLaborRate } = getNicaraguaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "INSS laboral", rate: inssLaborRate, legalReference: "Ley 185 Art. 88 + normativa INSS vigente" },
    ],
    { label: "IR rentas del trabajo", rate: irLaborRate, legalReference: "Ley 185 Art. 97 + normativa IR rentas del trabajo vigente", source: "corpus" },
  )
}
