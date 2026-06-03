import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getElSalvadorVacationParams } from "./legal-params"

export const calculateElSalvadorVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getElSalvadorVacationParams())
}
