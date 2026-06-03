import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getPeruContractParams } from "./legal-params"

export const assemblePeruContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getPeruContractParams())
}
