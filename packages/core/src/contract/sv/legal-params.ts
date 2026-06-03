import type { ContractParams } from "../shared"

export const getElSalvadorContractParams = (): ContractParams => ({
  currency: "USD",
  corpusVersion: "sv-v0.2.0",
  legalReference: "Código de Trabajo, Art. 23",
  countryName: "El Salvador",
  lawName: "Código de Trabajo",
  lawArticles: "Art. 23",
  workerIdLabel: "Documento Único de Identidad (DUI)",
  employerIdLabel: "NIT",
})
