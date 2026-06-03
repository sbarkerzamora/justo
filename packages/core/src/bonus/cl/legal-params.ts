import type { BonusParams } from "../shared"

export const getChileBonusParams = (): BonusParams => ({
  currency: "CLP",
  corpusVersion: "cl-v0.2.0",
  fallbackReason:
    "El corpus MVP de Chile no contiene una prestacion legal equivalente a aguinaldo, decimo o bono para calculo automatico.",
  getLines: () => [],
})
