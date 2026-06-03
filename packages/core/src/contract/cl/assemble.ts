import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getChileContractParams } from "./legal-params"

export const assembleChileContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getChileContractParams())
}
