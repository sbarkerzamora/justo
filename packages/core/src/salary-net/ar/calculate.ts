import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getArgentinaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "ARS"
const LEGAL_CORPUS_VERSION = "ar-v0.2.0"

export const calculateArgentinaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { jubilacionRate, pamiRate, obraSocialRate, ansesMaxBase, irBrackets } = getArgentinaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "Jubilación", rate: jubilacionRate, maxBase: ansesMaxBase, legalReference: "Ley 24.241 (tope ANSES)" },
      { label: "PAMI", rate: pamiRate, maxBase: ansesMaxBase, legalReference: "Ley 19.032 (tope ANSES)" },
      { label: "Obra Social", rate: obraSocialRate, maxBase: ansesMaxBase, legalReference: "Ley 23.660 (tope ANSES)" },
    ],
    {
      label: "IR",
      legalReference: "Ley 20.628 (Impuesto a las Ganancias)",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
