import type { BonusParams } from "../shared"
import { annualMonthlySalaryLine } from "../shared"

export const getPanamaBonusParams = (): BonusParams => ({
  currency: "USD",
  corpusVersion: "pa-v0.2.0",
  getLines: (input, { periodDays }) => [
    annualMonthlySalaryLine({
      label: "Decimotercer Mes",
      input,
      periodDays,
      legalReference: "Ley 13 de 1994",
    }),
  ],
})
