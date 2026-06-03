import type { VacationParams } from "../shared"

export const getArgentinaVacationParams = (): VacationParams => ({
  currency: "ARS",
  corpusVersion: "ar-v0.2.0",
  legalReference: "Arts. 150, 151, 153, 155 Ley 20.744",
  dailyDivisor: 25,
  premium: 0,
  getDaysPerYear: (seniority) => {
    if (seniority >= 20) return 35
    if (seniority >= 10) return 28
    if (seniority >= 5) return 21
    return 14
  },
})
