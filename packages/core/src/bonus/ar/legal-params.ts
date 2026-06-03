import { daysBetween } from "../../settlement"
import type { BonusParams } from "../shared"

export const getArgentinaBonusParams = (): BonusParams => ({
  currency: "ARS",
  corpusVersion: "ar-v0.2.0",
  getLines: (input, { end }) => {
    const isFirstSemester = end.getUTCMonth() < 6
    const semesterStart = isFirstSemester
      ? new Date(Date.UTC(end.getUTCFullYear(), 0, 1))
      : new Date(Date.UTC(end.getUTCFullYear(), 6, 1))
    const semesterDays = isFirstSemester ? 181 : 184
    const sacDays = daysBetween(semesterStart, end)

    return [
      {
        label: "SAC / Aguinaldo",
        amount: input.monthlySalary * 0.5 * (sacDays / semesterDays),
        formula: `(${input.monthlySalary} x 50% x ${sacDays}/${semesterDays})`,
        legalReference: "Ley 23.041 (50% mejor salario semestre)",
      },
    ]
  },
})
