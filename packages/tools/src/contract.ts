import {
  contractInputSchema,
  type CountryCode,
} from "@justo/core"
import type { JustoTool } from "./types"

const allCountries = [
  "ni", "sv", "gt", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl",
] as const satisfies CountryCode[]

type CountryOverride = {
  longDescription: string
  legalReferences: readonly string[]
  corpusVersion: string
}

const contractCountryOverrides: Partial<Record<CountryCode, CountryOverride>> = {
  ni: {
    longDescription:
      "Genera un contrato individual de trabajo para Nicaragua según los requisitos del Artículo 20 de la Ley No. 185 (Código del Trabajo).",
    legalReferences: ["Ley 185 Arts. 19-29"],
    corpusVersion: "ni-v0.3.0",
  },
  sv: {
    longDescription:
      "Genera un contrato individual de trabajo para El Salvador según los requisitos del Artículo 23 del Código de Trabajo (14 campos obligatorios).",
    legalReferences: ["Código de Trabajo Art. 23"],
    corpusVersion: "sv-v0.2.0",
  },
  gt: {
    longDescription:
      "Genera un contrato individual de trabajo para Guatemala según los requisitos del Artículo 29 del Código de Trabajo, Decreto 1441.",
    legalReferences: ["Decreto 1441 Art. 29"],
    corpusVersion: "gt-v0.2.0",
  },
  hn: {
    longDescription:
      "Genera un contrato individual de trabajo para Honduras según los requisitos del Artículo 37 del Código de Trabajo, Decreto 189-59.",
    legalReferences: ["Decreto 189-59 Art. 37"],
    corpusVersion: "hn-v0.2.0",
  },
  cr: {
    longDescription:
      "Genera un contrato individual de trabajo para Costa Rica según los requisitos del Artículo 24 del Código de Trabajo.",
    legalReferences: ["Código de Trabajo Art. 24"],
    corpusVersion: "cr-v0.2.0",
  },
  pa: {
    longDescription:
      "Genera un contrato individual de trabajo para Panamá según los requisitos del Artículo 68 del Código de Trabajo.",
    legalReferences: ["Código de Trabajo Art. 68"],
    corpusVersion: "pa-v0.2.0",
  },
  mx: {
    longDescription:
      "Genera un contrato individual de trabajo para México según los requisitos del Artículo 25 de la Ley Federal del Trabajo. Incluye cláusula de capacitación.",
    legalReferences: ["LFT Art. 25"],
    corpusVersion: "mx-v0.2.0",
  },
  co: {
    longDescription:
      "Genera un contrato individual de trabajo para Colombia según los requisitos del Artículo 39 del Código Sustantivo del Trabajo.",
    legalReferences: ["CST Art. 39"],
    corpusVersion: "co-v0.2.0",
  },
  pe: {
    longDescription:
      "Genera un contrato individual de trabajo para Perú según la Ley General de Trabajo y mejores prácticas.",
    legalReferences: ["Ley General de Trabajo Art. 14"],
    corpusVersion: "pe-v0.2.0",
  },
  ar: {
    longDescription:
      "Genera un contrato individual de trabajo para Argentina según la Ley 20.744 de Contrato de Trabajo.",
    legalReferences: ["Ley 20.744 Arts. 48-55"],
    corpusVersion: "ar-v0.2.0",
  },
  cl: {
    longDescription:
      "Genera un contrato individual de trabajo para Chile según los requisitos del Artículo 10 del Código del Trabajo.",
    legalReferences: ["Código del Trabajo Art. 10"],
    corpusVersion: "cl-v0.2.0",
  },
}

export const contractTool: JustoTool & {
  inputSchema: typeof contractInputSchema
} = {
  id: "contract",
  slug: "generador-contratos",
  name: "Generador de contratos",
  shortDescription:
    "Genera un contrato individual de trabajo listo para imprimir y firmar.",
  longDescription:
    "Genera un contrato individual de trabajo según las leyes de cada país. Captura los datos de las partes, puesto, jornada, duración y salario, y produce un documento PDF listo para firmar.",
  category: "document",
  availability: "available",
  countrySupport: allCountries as unknown as CountryCode[],
  inputRequirements: [
    "País",
    "Datos del trabajador",
    "Datos del empleador",
    "Puesto y funciones",
    "Jornada",
    "Tipo de contrato",
    "Salario",
  ],
  outputSummary: ["Contrato PDF", "Cláusulas legales", "Firmas"],
  legalReferences: [
    "Ley 185 Arts. 19-29 (NI)",
    "Código de Trabajo Art. 23 (SV)",
    "Decreto 1441 Art. 29 (GT)",
    "Decreto 189-59 Art. 37 (HN)",
    "Código de Trabajo Art. 24 (CR)",
    "Código de Trabajo Art. 68 (PA)",
    "LFT Art. 25 (MX)",
    "CST Art. 39 (CO)",
    "Ley General de Trabajo Art. 14 (PE)",
    "Ley 20.744 Arts. 48-55 (AR)",
    "Código del Trabajo Art. 10 (CL)",
  ],
  corpusVersion: "multi-v0.1.0",
  disclaimer:
    "Documento informativo generado con base en el corpus legal versionado de Justo. No sustituye la revisión legal profesional. Recomendamos revisar el contrato con un abogado laboralista antes de firmar.",
  countryOverrides:
    contractCountryOverrides as Partial<Record<CountryCode, CountryOverride>>,
  inputSchema: contractInputSchema,
}
