import type { BonusParams } from "../shared"
import { annualMonthlySalaryLine } from "../shared"

export const getHondurasBonusParams = (): BonusParams => ({
  currency: "HNL",
  corpusVersion: "hn-v0.2.0",
  getLines: (input, { periodDays }) => [
    annualMonthlySalaryLine({
      label: "Aguinaldo proporcional",
      input,
      periodDays,
      legalReference: "Decreto 133-92 (Decimotercer Mes proporcional)",
    }),
  ],
})
