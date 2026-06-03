import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getColombiaTerminationParams } from "./legal-params"

export const calculateColombiaTermination = (
  input: TerminationInput,
): TerminationResult => {
  return buildTermination(input, getColombiaTerminationParams())
}
