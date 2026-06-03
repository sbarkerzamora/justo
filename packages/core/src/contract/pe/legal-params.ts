import type { ContractParams } from "../shared"

export const getPeruContractParams = (): ContractParams => ({
  currency: "PEN",
  corpusVersion: "pe-v0.2.0",
  legalReference: "Ley General de Trabajo, Art. 14",
  countryName: "Perú",
  lawName: "Ley General de Trabajo",
  lawArticles: "Art. 14",
  workerIdLabel: "Documento Nacional de Identidad (DNI)",
  employerIdLabel: "RUC",
})
