import type { ContractParams } from "../shared"

export const getArgentinaContractParams = (): ContractParams => ({
  currency: "ARS",
  corpusVersion: "ar-v0.2.0",
  legalReference: "Ley 20.744 de Contrato de Trabajo, Arts. 48-55",
  countryName: "Argentina",
  lawName: "Ley de Contrato de Trabajo 20.744",
  lawArticles: "Arts. 48-55",
  workerIdLabel: "CUIL",
  employerIdLabel: "CUIT",
})
