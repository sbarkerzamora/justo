import type { ContractParams } from "../shared"

export const getColombiaContractParams = (): ContractParams => ({
  currency: "COP",
  corpusVersion: "co-v0.2.0",
  legalReference: "Código Sustantivo del Trabajo, Art. 39",
  countryName: "Colombia",
  lawName: "Código Sustantivo del Trabajo",
  lawArticles: "Art. 39",
  workerIdLabel: "cédula de ciudadanía",
  employerIdLabel: "NIT",
})
