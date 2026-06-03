import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getGuatemalaVacationParams } from "./legal-params"

export const calculateGuatemalaVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getGuatemalaVacationParams())
}
