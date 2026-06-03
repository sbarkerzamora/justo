import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getPanamaContractParams } from "./legal-params"

export const assemblePanamaContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getPanamaContractParams())
}
