import type { BonusParams } from "../shared"
import { annualMonthlySalaryLine } from "../shared"

export const getNicaraguaBonusParams = (): BonusParams => ({
  currency: "NIO",
  corpusVersion: "ni-v0.3.0",
  getLines: (input, { periodDays }) => [
    annualMonthlySalaryLine({
      label: "Aguinaldo proporcional",
      input,
      periodDays,
      legalReference: "Ley 185 Arts. 93 y 94 (decimo tercer mes proporcional)",
    }),
  ],
})
