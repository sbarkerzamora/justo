import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getPeruBonusParams } from "./legal-params"

export const calculatePeruBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getPeruBonusParams())
}
