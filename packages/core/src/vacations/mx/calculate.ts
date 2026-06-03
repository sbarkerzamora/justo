import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getMexicoVacationParams } from "./legal-params"

export const calculateMexicoVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getMexicoVacationParams())
}
