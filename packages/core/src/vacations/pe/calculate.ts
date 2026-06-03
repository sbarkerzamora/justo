import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getPeruVacationParams } from "./legal-params"

export const calculatePeruVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getPeruVacationParams())
}
