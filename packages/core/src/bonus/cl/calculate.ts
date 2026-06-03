import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getChileBonusParams } from "./legal-params"

export const calculateChileBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getChileBonusParams())
}
