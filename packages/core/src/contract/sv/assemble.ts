import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getElSalvadorContractParams } from "./legal-params"

export const assembleElSalvadorContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getElSalvadorContractParams())
}
