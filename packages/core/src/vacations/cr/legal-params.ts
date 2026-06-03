import type { VacationParams } from "../shared"

export const getCostaRicaVacationParams = (): VacationParams => ({
  currency: "CRC",
  corpusVersion: "cr-v0.2.0",
  legalReference: "Arts. 153, 156 Código de Trabajo",
  dailyDivisor: 30,
  premium: 0,
  getDaysPerYear: () => 14 / 350 * 365,
})
