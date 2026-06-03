import { buildVacation } from "../shared"
import type { VacationInput, VacationResult } from "../types"
import { getCostaRicaVacationParams } from "./legal-params"

export const calculateCostaRicaVacations = (
  input: VacationInput,
): VacationResult => {
  return buildVacation(input, getCostaRicaVacationParams())
}
