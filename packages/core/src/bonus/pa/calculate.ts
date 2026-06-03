import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getPanamaBonusParams } from "./legal-params"

export const calculatePanamaBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getPanamaBonusParams())
}
