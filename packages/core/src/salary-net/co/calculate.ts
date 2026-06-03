import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getColombiaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "COP"
const LEGAL_CORPUS_VERSION = "co-v0.2.0"

export const calculateColombiaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { epsRate, pensionRate, irBrackets } = getColombiaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "EPS", rate: epsRate, legalReference: "Ley 100 de 1993" },
      { label: "Pensión", rate: pensionRate, legalReference: "Ley 100 de 1993" },
    ],
    {
      label: "IR",
      legalReference: "Estatuto Tributario",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
