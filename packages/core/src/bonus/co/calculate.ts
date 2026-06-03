import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getColombiaBonusParams } from "./legal-params"

export const calculateColombiaBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getColombiaBonusParams())
}
