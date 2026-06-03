import type { VacationParams } from "../shared"

export const getGuatemalaVacationParams = (): VacationParams => ({
  currency: "GTQ",
  corpusVersion: "gt-v0.2.0",
  legalReference: "Art. 130 Decreto 1441",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: () => 15,
})
