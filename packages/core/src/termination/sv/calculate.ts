import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getElSalvadorTerminationParams } from "./legal-params"

export const calculateElSalvadorTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getElSalvadorTerminationParams(input))
}
