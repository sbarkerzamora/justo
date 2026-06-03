import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getMexicoContractParams } from "./legal-params"

export const assembleMexicoContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getMexicoContractParams())
}
