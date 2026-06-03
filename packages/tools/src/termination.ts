import {
  calculateArgentinaTermination,
  calculateChileTermination,
  calculateColombiaTermination,
  calculateCostaRicaTermination,
  calculateElSalvadorTermination,
  calculateGuatemalaTermination,
  calculateHondurasTermination,
  calculateMexicoTermination,
  calculateNicaraguaTermination,
  calculatePanamaTermination,
  calculatePeruTermination,
  terminationInputSchema,
  type TerminationInput,
  type TerminationResult,
  type CountryCode,
} from "@justo/core"
import type { CalculationTool } from "./types"

const terminationCalculators: Record<
  CountryCode,
  (input: TerminationInput) => TerminationResult
> = {
  ar: calculateArgentinaTermination,
  cl: calculateChileTermination,
  co: calculateColombiaTermination,
  cr: calculateCostaRicaTermination,
  gt: calculateGuatemalaTermination,
  hn: calculateHondurasTermination,
  mx: calculateMexicoTermination,
  ni: calculateNicaraguaTermination,
  pa: calculatePanamaTermination,
  pe: calculatePeruTermination,
  sv: calculateElSalvadorTermination,
}

type CountryOverride = {
  longDescription: string
  legalReferences: readonly string[]
  corpusVersion: string
}

const terminationCountryOverrides: Partial<
  Record<CountryCode, CountryOverride>
> = {
  ni: {
    longDescription:
      "Compara escenarios de terminación en Nicaragua: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización según Ley 185 Arts. 42, 43 y 45 (escala 30/20 días por año, min 1 mes, max 5 meses).",
    legalReferences: ["Ley 185 Arts. 42, 43 y 45"],
    corpusVersion: "ni-v0.3.0",
  },
  sv: {
    longDescription:
      "Compara escenarios de terminación en El Salvador: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización según Código de Trabajo Art. 58 (30 días por año, mínimo 15 días).",
    legalReferences: ["Código de Trabajo Art. 58"],
    corpusVersion: "sv-v0.2.0",
  },
  gt: {
    longDescription:
      "Compara escenarios de terminación en Guatemala: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización universal Art. 82 (30 días por año, máximo 240 días).",
    legalReferences: ["Decreto 1441 Arts. 78 y 82"],
    corpusVersion: "gt-v0.2.0",
  },
  hn: {
    longDescription:
      "Compara escenarios de terminación en Honduras: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Auxilio de cesantía Art. 120 y preaviso Art. 116.",
    legalReferences: ["Código de Trabajo Arts. 116, 120"],
    corpusVersion: "hn-v0.2.0",
  },
  cr: {
    longDescription:
      "Compara escenarios de terminación en Costa Rica: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Cesantía Art. 29 y preaviso Art. 28.",
    legalReferences: ["Código de Trabajo Arts. 28, 29"],
    corpusVersion: "cr-v0.2.0",
  },
  pa: {
    longDescription:
      "Compara escenarios de terminación en Panamá: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Prima de antigüedad Art. 224, indemnización Art. 225.",
    legalReferences: ["Código de Trabajo Arts. 224, 225"],
    corpusVersion: "pa-v0.2.0",
  },
  mx: {
    longDescription:
      "Compara escenarios de terminación en México: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización constitucional LFT Arts. 48, 50 y prima de antigüedad Art. 162.",
    legalReferences: ["LFT Arts. 48, 50, 162"],
    corpusVersion: "mx-v0.2.0",
  },
  co: {
    longDescription:
      "Compara escenarios de terminación en Colombia: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización CST Art. 64 (escala para salario <10 SMMLV).",
    legalReferences: ["CST Art. 64"],
    corpusVersion: "co-v0.2.0",
  },
  pe: {
    longDescription:
      "Compara escenarios de terminación en Perú: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización Art. 167 (escala 45/30/15 días por año, min 90, max 720 días).",
    legalReferences: ["Ley General de Trabajo Art. 167"],
    corpusVersion: "pe-v0.2.0",
  },
  ar: {
    longDescription:
      "Compara escenarios de terminación en Argentina: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización Ley 20.744 Art. 245 (1 mes por año, mínimo 1 mes).",
    legalReferences: ["Ley 20.744 Art. 245"],
    corpusVersion: "ar-v0.2.0",
  },
  cl: {
    longDescription:
      "Compara escenarios de terminación en Chile: renuncia, despido justificado, despido injustificado y mutuo acuerdo. Indemnización Art. 163 (30 días por año, max 330 días) y aviso sustitutivo.",
    legalReferences: ["Código del Trabajo Arts. 161-163"],
    corpusVersion: "cl-v0.2.0",
  },
}

export const terminationTool: CalculationTool<
  TerminationInput,
  TerminationResult
> = {
  id: "termination-simulator",
  slug: "simulador-terminacion",
  name: "Simulador de terminación",
  shortDescription: "Compara escenarios básicos de salida laboral.",
  longDescription:
    "Simulador abierto para comparar renuncia, despido justificado, despido injustificado u otros escenarios según país. Incluye indemnización, preaviso y prima de antigüedad según la legislación aplicable.",
  category: "calculation",
  availability: "available",
  countrySupport: Object.keys(
    terminationCalculators,
  ) as CountryCode[],
  inputRequirements: ["País", "Salario mensual", "Fecha de inicio", "Fecha de salida"],
  outputSummary: [
    "Comparación de escenarios",
    "Indemnización estimada",
    "Preaviso",
    "Referencias legales",
  ],
  inputSchema: terminationInputSchema,
  calculate: calculateTermination,
  legalReferences: [
    "Ley 185 Arts. 42, 43 y 45 (NI)",
    "Código de Trabajo Art. 58 (SV)",
    "Decreto 1441 Arts. 78 y 82 (GT)",
    "Código de Trabajo Arts. 116, 120 (HN)",
    "Código de Trabajo Arts. 28, 29 (CR)",
    "Código de Trabajo Arts. 224, 225 (PA)",
    "LFT Arts. 48, 50, 162 (MX)",
    "CST Art. 64 (CO)",
    "Ley General de Trabajo Art. 167 (PE)",
    "Ley 20.744 Art. 245 (AR)",
    "Código del Trabajo Arts. 161-163 (CL)",
  ],
  corpusVersion: "multi-v0.1.0",
  disclaimer:
    "Resultado informativo generado con reglas determinísticas y corpus legal versionado. No sustituye asesoría legal o contable profesional.",
  countryOverrides:
    terminationCountryOverrides as Record<CountryCode, CountryOverride>,
}

export function calculateTermination(
  input: TerminationInput,
): TerminationResult {
  const calculator = terminationCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`País no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
