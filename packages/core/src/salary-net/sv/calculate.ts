import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getElSalvadorSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "USD"
const LEGAL_CORPUS_VERSION = "sv-v0.2.0"

export const calculateElSalvadorSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { isssRate, afpRate, irBrackets } = getElSalvadorSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "ISSS", rate: isssRate, legalReference: "Art. 132 Código de Trabajo + Ley ISSS" },
      { label: "AFP", rate: afpRate, legalReference: "Ley SAP + D.L. 927" },
    ],
    {
      label: "ISR",
      legalReference: "Ley ISR vigente",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
