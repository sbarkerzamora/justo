import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getHondurasTerminationParams } from "./legal-params"

export const calculateHondurasTermination = (
  input: TerminationInput
): TerminationResult => {
  return buildTermination(input, getHondurasTerminationParams(input))
}
