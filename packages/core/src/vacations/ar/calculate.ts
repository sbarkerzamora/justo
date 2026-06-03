import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getArgentinaVacationParams } from "./legal-params"

export const calculateArgentinaVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getArgentinaVacationParams())
}
