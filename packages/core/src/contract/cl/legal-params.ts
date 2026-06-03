import type { ContractParams } from "../shared"

export const getChileContractParams = (): ContractParams => ({
  currency: "CLP",
  corpusVersion: "cl-v0.2.0",
  legalReference: "Código del Trabajo, Art. 10",
  countryName: "Chile",
  lawName: "Código del Trabajo",
  lawArticles: "Art. 10",
  workerIdLabel: "RUT",
  employerIdLabel: "RUT",
})
