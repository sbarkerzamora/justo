import { buildContract } from "../shared"
import type { ContractInput, ContractResult } from "../types"
import { getCostaRicaContractParams } from "./legal-params"

export const assembleCostaRicaContract = (
  input: ContractInput,
): ContractResult => {
  return buildContract(input, getCostaRicaContractParams())
}
