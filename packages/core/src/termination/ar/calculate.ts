import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getArgentinaTerminationParams } from "./legal-params"

export const calculateArgentinaTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getArgentinaTerminationParams(input))
}
