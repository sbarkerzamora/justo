import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getHondurasContractParams } from "./legal-params"

export const assembleHondurasContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getHondurasContractParams())
}
