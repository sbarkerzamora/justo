import type { ContractParams } from "../shared"

export const getGuatemalaContractParams = (): ContractParams => ({
  currency: "GTQ",
  corpusVersion: "gt-v0.2.0",
  legalReference: "Código de Trabajo, Decreto 1441, Art. 29",
  countryName: "Guatemala",
  lawName: "Código de Trabajo, Decreto 1441",
  lawArticles: "Art. 29",
  workerIdLabel: "cédula de vecindad",
  employerIdLabel: "NIT",
})
