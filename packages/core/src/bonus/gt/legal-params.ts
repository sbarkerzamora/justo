import type { BonusParams } from "../shared"
import { annualMonthlySalaryLine } from "../shared"

export const getGuatemalaBonusParams = (): BonusParams => ({
  currency: "GTQ",
  corpusVersion: "gt-v0.2.0",
  getLines: (input, { periodDays }) => [
    annualMonthlySalaryLine({
      label: "Aguinaldo proporcional",
      input,
      periodDays,
      legalReference: "Decreto 76-78 (proporcional segun tiempo laborado)",
    }),
    annualMonthlySalaryLine({
      label: "Bono 14 proporcional",
      input,
      periodDays,
      legalReference: "Decreto 42-92 (proporcional segun tiempo laborado)",
    }),
  ],
})
