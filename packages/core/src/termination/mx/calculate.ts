import { buildTermination } from "../shared"
import type { TerminationInput, TerminationResult } from "../types"
import { getMexicoTerminationParams } from "./legal-params"

export const calculateMexicoTermination = (
  input: TerminationInput,
): TerminationResult => {
  return buildTermination(input, getMexicoTerminationParams())
}
