import type { BonusParams } from "../shared"

export const getColombiaBonusParams = (): BonusParams => ({
  currency: "COP",
  corpusVersion: "co-v0.2.0",
  getLines: (_input, { dailySalary, periodDays }) => [
    {
      label: "Prima de servicios",
      amount: dailySalary * 30 * (periodDays / 365),
      formula: `(${dailySalary} x 30d x ${periodDays}/365)`,
      legalReference: "CST Art. 306 (30 dias/ano)",
    },
  ],
})
