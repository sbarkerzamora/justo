import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getArgentinaBonusParams } from "./legal-params"

export const calculateArgentinaBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getArgentinaBonusParams())
}
