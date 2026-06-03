import type { VacationParams } from "../shared"

export const getHondurasVacationParams = (): VacationParams => ({
  currency: "HNL",
  corpusVersion: "hn-v0.2.0",
  legalReference: "Arts. 346, 349, 352 Decreto 189-59",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: (seniority) => {
    if (seniority >= 4) return 20
    if (seniority >= 3) return 15
    if (seniority >= 2) return 12
    return 10
  },
})
