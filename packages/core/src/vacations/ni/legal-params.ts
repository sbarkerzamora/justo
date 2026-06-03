import type { VacationParams } from "../shared"

export const getNicaraguaVacationParams = (): VacationParams => ({
  currency: "NIO",
  corpusVersion: "ni-v0.3.0",
  legalReference: "Ley 185 Arts. 76, 77 y 78",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: () => 30,
})
