import type { VacationParams } from "../shared"

export const getChileVacationParams = (): VacationParams => ({
  currency: "CLP",
  corpusVersion: "cl-v0.2.0",
  legalReference: "Arts. 67, 68, 73 Código del Trabajo",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: (seniority) => {
    const base = 15
    const extra = Math.max(0, Math.floor((seniority - 10) / 3))
    return base + extra
  },
})
