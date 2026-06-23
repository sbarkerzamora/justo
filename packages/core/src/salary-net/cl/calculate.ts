import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getChileSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "CLP"
const LEGAL_CORPUS_VERSION = "cl-v0.2.0"

export const calculateChileSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { afpRate, saludRate, afcRate, afpSaludMaxBase, irBrackets } = getChileSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "AFP", rate: afpRate, maxBase: afpSaludMaxBase, legalReference: "D.L. 3.500 (tope 80.2 UF)" },
      { label: "Salud", rate: saludRate, maxBase: afpSaludMaxBase, legalReference: "Ley 18.933 (tope 80.2 UF)" },
      { label: "AFC", rate: afcRate, legalReference: "Ley 19.728" },
    ],
    {
      label: "IR",
      legalReference: "D.L. 824 (Impuesto Unico de Trabajo)",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
