import type { ContractParams } from "../shared"

export const getPanamaContractParams = (): ContractParams => ({
  currency: "USD",
  corpusVersion: "pa-v0.2.0",
  legalReference: "Código de Trabajo, Art. 68",
  countryName: "Panamá",
  lawName: "Código de Trabajo",
  lawArticles: "Art. 68",
  workerIdLabel: "cédula de identidad personal",
  employerIdLabel: "RUC",
})
