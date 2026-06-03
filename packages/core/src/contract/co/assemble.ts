import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getColombiaContractParams } from "./legal-params"

export const assembleColombiaContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getColombiaContractParams())
}
