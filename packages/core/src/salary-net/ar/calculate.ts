import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getArgentinaSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "ARS"
const LEGAL_CORPUS_VERSION = "ar-v0.2.0"

export const calculateArgentinaSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { jubilacionRate, pamiRate, obraSocialRate, irRate } = getArgentinaSalaryNetLegalRates()

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: "Jubilación", rate: jubilacionRate, legalReference: "Ley 24.241" },
      { label: "PAMI", rate: pamiRate, legalReference: "Ley 19.032" },
      { label: "Obra Social", rate: obraSocialRate, legalReference: "Ley 23.660" },
    ],
    undefined,
  )
}
