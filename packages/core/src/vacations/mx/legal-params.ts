import type { VacationParams } from "../shared"

export const getMexicoVacationParams = (): VacationParams => ({
  currency: "MXN",
  corpusVersion: "mx-v0.2.0",
  legalReference: "Arts. 76, 77, 78, 80 Ley Federal del Trabajo",
  dailyDivisor: 30,
  premium: 0.25,
  getDaysPerYear: (seniority) => {
    if (seniority < 1) return 6
    if (seniority < 2) return 6
    if (seniority < 3) return 8
    if (seniority < 4) return 10
    if (seniority < 5) return 12
    return 12 + Math.floor((Math.min(seniority, 24) - 4) / 5) * 2
  },
})
