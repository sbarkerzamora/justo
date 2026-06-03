import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getPeruSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "PEN"
const LEGAL_CORPUS_VERSION = "pe-v0.2.0"

export const calculatePeruSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { onpRate, irBrackets } = getPeruSalaryNetLegalRates()

  const isAfp = input.pensionSystem === "afp"

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: isAfp ? "AFP" : "ONP", rate: isAfp ? 0.112 : onpRate, legalReference: isAfp ? "Ley del Sistema Privado de Pensiones" : "D.L. 19990" },
    ],
    {
      label: "IR",
      legalReference: "Ley del Impuesto a la Renta",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
