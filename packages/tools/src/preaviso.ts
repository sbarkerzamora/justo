import {
  calculateArgentinaPreaviso,
  calculateChilePreaviso,
  calculateColombiaPreaviso,
  calculateCostaRicaPreaviso,
  calculateElSalvadorPreaviso,
  calculateGuatemalaPreaviso,
  calculateHondurasPreaviso,
  calculateMexicoPreaviso,
  calculateNicaraguaPreaviso,
  calculatePanamaPreaviso,
  calculatePeruPreaviso,
  PreavisoInputSchema,
  type CountryCode,
  type PreavisoInput,
  type PreavisoResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

const preavisoCalculators: Record<CountryCode, (input: PreavisoInput) => PreavisoResult> = {
  ar: calculateArgentinaPreaviso,
  cl: calculateChilePreaviso,
  co: calculateColombiaPreaviso,
  cr: calculateCostaRicaPreaviso,
  gt: calculateGuatemalaPreaviso,
  hn: calculateHondurasPreaviso,
  mx: calculateMexicoPreaviso,
  ni: calculateNicaraguaPreaviso,
  pa: calculatePanamaPreaviso,
  pe: calculatePeruPreaviso,
  sv: calculateElSalvadorPreaviso,
}

export function calculatePreaviso(input: PreavisoInput): PreavisoResult {
  const calc = preavisoCalculators[input.countryCode]
  if (!calc) throw new Error(`País no soportado: ${input.countryCode}`)
  return calc(input)
}

const countryOverrides: Partial<Record<CountryCode, { corpusVersion: string }>> = {
  ar: { corpusVersion: "ar-v0.1.0" },
  cl: { corpusVersion: "cl-v0.1.0" },
  co: { corpusVersion: "co-v0.1.0" },
  cr: { corpusVersion: "cr-v0.1.0" },
  gt: { corpusVersion: "gt-v0.1.0" },
  hn: { corpusVersion: "hn-v0.1.0" },
  mx: { corpusVersion: "mx-v0.1.0" },
  ni: { corpusVersion: "ni-v0.1.0" },
  pa: { corpusVersion: "pa-v0.1.0" },
  pe: { corpusVersion: "pe-v0.1.0" },
  sv: { corpusVersion: "sv-v0.1.0" },
}

export const preavisoTool: CalculationTool<PreavisoInput, PreavisoResult> = {
  id: "preaviso",
  slug: "preaviso",
  name: "Preaviso",
  shortDescription: "Cálculo de preaviso laboral e indemnización sustitutiva",
  longDescription:
    "Calcula los días de preaviso que corresponde según la antigüedad del trabajador y la legislación de cada país, así como el monto de indemnización sustitutiva cuando aplica.",
  category: "calculation",
  availability: "available",
  countrySupport: [
    "ar", "cl", "co", "cr", "gt", "hn", "mx", "ni", "pa", "pe", "sv",
  ] as const,
  inputRequirements: [
    "País",
    "Salario mensual",
    "Fecha de inicio",
    "Fecha de fin",
    "Años de antigüedad",
  ] as const,
  outputSummary: ["Días de preaviso", "Monto del preaviso", "Referencia legal"] as const,
  legalReferences: [
    "Leyes laborales de cada país",
  ] as const,
  corpusVersion: "v0.1.0",
  disclaimer:
    "Herramienta informativa. Los cálculos de preaviso pueden variar según el tipo de contrato y causales específicas. Consulte con un abogado laboral para casos concretos.",
  inputSchema: PreavisoInputSchema,
  calculate: calculatePreaviso,
  countryOverrides: Object.fromEntries(
    Object.entries(countryOverrides).map(([cc, o]) => [
      cc,
      { corpusVersion: o.corpusVersion },
    ]),
  ) as Partial<Record<CountryCode, { corpusVersion: string }>>,
}
