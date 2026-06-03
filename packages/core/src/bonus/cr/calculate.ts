import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getCostaRicaBonusParams } from "./legal-params"

export const calculateCostaRicaBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getCostaRicaBonusParams())
}
