import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getHondurasBonusParams } from "./legal-params"

export const calculateHondurasBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getHondurasBonusParams())
}
