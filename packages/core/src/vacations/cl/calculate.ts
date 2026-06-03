import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getChileVacationParams } from "./legal-params"

export const calculateChileVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getChileVacationParams())
}
