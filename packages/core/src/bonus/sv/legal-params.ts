import type { BonusParams } from "../shared"

export const getElSalvadorBonusParams = (): BonusParams => ({
  currency: "USD",
  corpusVersion: "sv-v0.2.0",
  getLines: (input, { dailySalary, periodDays, start, end }) => {
    const tenureYears = Math.max(
      0,
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365),
    )
    const baseDays = tenureYears >= 10 ? 21 : tenureYears >= 3 ? 19 : 15
    return [
      {
        label: "Aguinaldo proporcional",
        amount: dailySalary * baseDays * (periodDays / 365),
        formula: `(${dailySalary} x ${baseDays} dias escala x ${periodDays}/365)`,
        legalReference: "Codigo de Trabajo Arts. 196-202 (escala 15/19/21 dias)",
      },
    ]
  },
})
