import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getMexicoBonusParams } from "./legal-params"

export const calculateMexicoBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getMexicoBonusParams())
}
