import type { ContractParams, ContractExtraSection } from "../shared"

const trainingSection: ContractExtraSection = {
  title: "CLAÚSULA DE CAPACITACIÓN",
  buildContent: () => [
    `El trabajador será capacitado o adiestrado en los términos de los planes y programas de la empresa, de conformidad con lo dispuesto en la Ley Federal del Trabajo.`,
    ``,
    `El empleador proporcionará al trabajador la capacitación necesaria para el desempeño eficiente de sus labores, así como para su desarrollo profesional dentro de la empresa.`,
  ].join("\n"),
}

export const getMexicoContractParams = (): ContractParams => ({
  currency: "MXN",
  corpusVersion: "mx-v0.2.0",
  legalReference: "Ley Federal del Trabajo, Art. 25",
  countryName: "México",
  lawName: "Ley Federal del Trabajo",
  lawArticles: "Art. 25",
  workerIdLabel: "CURP",
  employerIdLabel: "RFC",
  extraSections: [trainingSection],
})
