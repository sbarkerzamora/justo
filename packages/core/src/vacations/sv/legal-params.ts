import type { VacationParams } from "../shared"

export const getElSalvadorVacationParams = (): VacationParams => ({
  currency: "USD",
  corpusVersion: "sv-v0.2.0",
  legalReference: "Arts. 177, 187 Código de Trabajo",
  dailyDivisor: 30,
  premium: 0.3,
  getDaysPerYear: () => 15,
})
