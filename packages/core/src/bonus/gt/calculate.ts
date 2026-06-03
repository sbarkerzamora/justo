import { buildBonus } from "../shared"
import type { BonusInput, BonusResult } from "../types"
import { getGuatemalaBonusParams } from "./legal-params"

export const calculateGuatemalaBonus = (input: BonusInput): BonusResult => {
  return buildBonus(input, getGuatemalaBonusParams())
}
