import type { VacationParams } from "../shared"

export const getPeruVacationParams = (): VacationParams => ({
  currency: "PEN",
  corpusVersion: "pe-v0.2.0",
  legalReference: "Arts. 285, 289 Ley General de Trabajo",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: () => 30,
})
