import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getGuatemalaContractParams } from "./legal-params"

export const assembleGuatemalaContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getGuatemalaContractParams())
}
