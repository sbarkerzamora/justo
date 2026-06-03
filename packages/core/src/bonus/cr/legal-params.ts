import type { BonusParams } from "../shared"
import { annualMonthlySalaryLine } from "../shared"

export const getCostaRicaBonusParams = (): BonusParams => ({
  currency: "CRC",
  corpusVersion: "cr-v0.2.0",
  getLines: (input, { periodDays }) => [
    annualMonthlySalaryLine({
      label: "Aguinaldo proporcional",
      input,
      periodDays,
      legalReference: "Ley No. 2412 (1/12 de salarios anuales)",
    }),
  ],
})
