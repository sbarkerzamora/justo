import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getPanamaTerminationParams } from "./legal-params"

export const calculatePanamaTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getPanamaTerminationParams(input))
}
