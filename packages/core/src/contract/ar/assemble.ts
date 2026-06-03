import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getArgentinaContractParams } from "./legal-params"

export const assembleArgentinaContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getArgentinaContractParams())
}
