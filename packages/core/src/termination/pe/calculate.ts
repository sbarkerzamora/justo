import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getPeruTerminationParams } from "./legal-params"

export const calculatePeruTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getPeruTerminationParams(input))
}
