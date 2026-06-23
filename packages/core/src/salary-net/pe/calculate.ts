import { buildNetSalary } from "../shared"
import type { SalaryNetInput, SalaryNetResult } from "../types"
import { getPeruSalaryNetLegalRates } from "./legal-params"

const CURRENCY = "PEN"
const LEGAL_CORPUS_VERSION = "pe-v0.3.0"

export const calculatePeruSalaryNet = (
  input: SalaryNetInput,
): SalaryNetResult => {
  const { onpRate, afpRate, irBrackets } = getPeruSalaryNetLegalRates()

  const isAfp = input.pensionSystem === "afp"

  return buildNetSalary(
    input,
    CURRENCY,
    LEGAL_CORPUS_VERSION,
    [
      { label: isAfp ? "AFP" : "ONP", rate: isAfp ? afpRate : onpRate, legalReference: isAfp ? "SBS SPP: aporte 10% + prima seguro 1.37% (comisión mixta)" : "D.L. 19990" },
    ],
    {
      label: "IR",
      legalReference: "Ley del Impuesto a la Renta",
      source: "estimated",
      brackets: irBrackets,
    },
  )
}
