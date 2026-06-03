import type { VacationParams } from "../shared"

export const getPanamaVacationParams = (): VacationParams => ({
  currency: "USD",
  corpusVersion: "pa-v0.2.0",
  legalReference: "Art. 54 Código de Trabajo",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: () => 30 / 11 * 12,
})
