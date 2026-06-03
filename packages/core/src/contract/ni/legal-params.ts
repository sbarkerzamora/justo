import type { ContractParams } from "../shared"

export const getNicaraguaContractParams = (): ContractParams => ({
  currency: "NIO",
  corpusVersion: "ni-v0.3.0",
  legalReference: "Ley No. 185, Código del Trabajo, Arts. 19-29",
  countryName: "Nicaragua",
  lawName: "Ley No. 185, Código del Trabajo",
  lawArticles: "Arts. 19-29",
  workerIdLabel: "cédula de identidad",
  employerIdLabel: "RUC",
})
