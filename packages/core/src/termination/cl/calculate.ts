import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getChileTerminationParams } from "./legal-params"

export const calculateChileTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getChileTerminationParams(input))
}
