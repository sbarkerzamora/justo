import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getCostaRicaTerminationParams } from "./legal-params"

export const calculateCostaRicaTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getCostaRicaTerminationParams(input))
}
