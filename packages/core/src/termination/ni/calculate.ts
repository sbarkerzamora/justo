import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getNicaraguaTerminationParams } from "./legal-params"

export const calculateNicaraguaTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getNicaraguaTerminationParams(input))
}
