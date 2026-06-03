import type { ContractParams } from "../shared"

export const getCostaRicaContractParams = (): ContractParams => ({
  currency: "CRC",
  corpusVersion: "cr-v0.2.0",
  legalReference: "Código de Trabajo, Art. 24",
  countryName: "Costa Rica",
  lawName: "Código de Trabajo",
  lawArticles: "Art. 24",
  workerIdLabel: "cédula de identidad",
  employerIdLabel: "cédula jurídica",
})
