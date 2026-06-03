import type { VacationParams } from "../shared"

export const getColombiaVacationParams = (): VacationParams => ({
  currency: "COP",
  corpusVersion: "co-v0.2.0",
  legalReference: "Arts. 186, 189 Código Sustantivo del Trabajo",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: () => 15,
})
