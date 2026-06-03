import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getNicaraguaVacationParams } from "./legal-params"

export const calculateNicaraguaVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getNicaraguaVacationParams())
}
