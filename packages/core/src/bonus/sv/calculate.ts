import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getElSalvadorBonusParams } from "./legal-params"

export const calculateElSalvadorBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getElSalvadorBonusParams())
}
