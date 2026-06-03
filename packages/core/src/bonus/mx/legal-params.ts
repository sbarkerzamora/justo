import type { BonusParams } from "../shared"

export const getMexicoBonusParams = (): BonusParams => ({
  currency: "MXN",
  corpusVersion: "mx-v0.2.0",
  getLines: (_input, { dailySalary, periodDays }) => [
    {
      label: "Aguinaldo proporcional",
      amount: dailySalary * 15 * (periodDays / 365),
      formula: `(${dailySalary} x 15 dias x ${periodDays}/365)`,
      legalReference: "LFT Art. 87 (15 dias minimo)",
    },
  ],
})
