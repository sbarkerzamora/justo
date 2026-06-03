import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getHondurasVacationParams } from "./legal-params"

export const calculateHondurasVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getHondurasVacationParams())
}
