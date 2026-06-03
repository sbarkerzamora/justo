import type { ContractParams } from "../shared"

export const getHondurasContractParams = (): ContractParams => ({
  currency: "HNL",
  corpusVersion: "hn-v0.2.0",
  legalReference: "Código de Trabajo, Decreto 189-59, Art. 37",
  countryName: "Honduras",
  lawName: "Código de Trabajo, Decreto 189-59",
  lawArticles: "Art. 37",
  workerIdLabel: "Tarjeta de Identidad (DNI)",
  employerIdLabel: "RTN",
})
