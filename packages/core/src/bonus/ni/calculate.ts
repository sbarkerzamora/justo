import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getNicaraguaBonusParams } from "./legal-params"

export const calculateNicaraguaBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getNicaraguaBonusParams())
}
