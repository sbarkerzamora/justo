import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getGuatemalaTerminationParams } from "./legal-params"

export const calculateGuatemalaTermination = (
  input: TerminationInput,
): TerminationResult => {
  return buildTermination(input, getGuatemalaTerminationParams())
}
