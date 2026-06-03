import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getNicaraguaContractParams } from "./legal-params"

export const assembleNicaraguaContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getNicaraguaContractParams())
}
