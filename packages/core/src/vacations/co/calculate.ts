import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getColombiaVacationParams } from "./legal-params"

export const calculateColombiaVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getColombiaVacationParams())
}
