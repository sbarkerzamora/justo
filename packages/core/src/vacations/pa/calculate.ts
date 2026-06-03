import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getPanamaVacationParams } from "./legal-params"

export const calculatePanamaVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getPanamaVacationParams())
}
