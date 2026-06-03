import type { BonusParams } from "../shared"

export const getPeruBonusParams = (): BonusParams => ({
  currency: "PEN",
  corpusVersion: "pe-v0.2.0",
  getLines: (input, { periodDays }) => [
    {
      label: "Gratificaciones",
      amount: input.monthlySalary * 2 * (periodDays / 365),
      formula: `(${input.monthlySalary} x 2 x ${periodDays}/365)`,
      legalReference: "Arts. 206-208 (2 al ano, jul/dic)",
    },
  ],
})
