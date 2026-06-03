import {
  calculateArgentinaBonus,
  calculateChileBonus,
  calculateColombiaBonus,
  calculateCostaRicaBonus,
  calculateElSalvadorBonus,
  calculateGuatemalaBonus,
  calculateHondurasBonus,
  calculateMexicoBonus,
  calculateNicaraguaBonus,
  calculatePanamaBonus,
  calculatePeruBonus,
  bonusInputSchema,
  type BonusInput,
  type BonusResult,
  type CountryCode,
} from "@justo/core"
import type { CalculationTool } from "./types"

const bonusCalculators: Record<CountryCode, (input: BonusInput) => BonusResult> = {
  ar: calculateArgentinaBonus,
  cl: calculateChileBonus,
  co: calculateColombiaBonus,
  cr: calculateCostaRicaBonus,
  gt: calculateGuatemalaBonus,
  hn: calculateHondurasBonus,
  mx: calculateMexicoBonus,
  ni: calculateNicaraguaBonus,
  pa: calculatePanamaBonus,
  pe: calculatePeruBonus,
  sv: calculateElSalvadorBonus,
}

type CountryOverride = {
  longDescription: string
  legalReferences: readonly string[]
  corpusVersion: string
}

const bonusCountryOverrides: Partial<Record<CountryCode, CountryOverride>> = {
  ni: {
    longDescription:
      "Calcula aguinaldo proporcional en Nicaragua según la Ley 185 (Código del Trabajo), Arts. 93 y 94.",
    legalReferences: ["Ley 185 Arts. 93 y 94"],
    corpusVersion: "ni-v0.3.0",
  },
  sv: {
    longDescription:
      "Calcula aguinaldo proporcional en El Salvador con escala de 15, 19 o 21 días según antigüedad (Código de Trabajo Arts. 196-202).",
    legalReferences: ["Código de Trabajo Arts. 196-202"],
    corpusVersion: "sv-v0.2.0",
  },
  gt: {
    longDescription:
      "Calcula aguinaldo y Bono 14 proporcionales en Guatemala según Decreto 76-78 y Decreto 42-92.",
    legalReferences: ["Decreto 76-78; Decreto 42-92"],
    corpusVersion: "gt-v0.2.0",
  },
  hn: {
    longDescription:
      "Calcula aguinaldo o decimotercer mes proporcional en Honduras según Decreto 133-92.",
    legalReferences: ["Decreto 133-92"],
    corpusVersion: "hn-v0.2.0",
  },
  cr: {
    longDescription:
      "Calcula aguinaldo proporcional en Costa Rica como 1/12 de salarios anuales según Ley No. 2412.",
    legalReferences: ["Ley No. 2412"],
    corpusVersion: "cr-v0.2.0",
  },
  pa: {
    longDescription:
      "Calcula décimo tercer mes proporcional en Panamá según Ley 13 de 1994.",
    legalReferences: ["Ley 13 de 1994"],
    corpusVersion: "pa-v0.2.0",
  },
  mx: {
    longDescription:
      "Calcula aguinaldo proporcional en México con mínimo de 15 días según Ley Federal del Trabajo Art. 87.",
    legalReferences: ["Ley Federal del Trabajo Art. 87"],
    corpusVersion: "mx-v0.2.0",
  },
  co: {
    longDescription:
      "Calcula prima de servicios proporcional en Colombia según CST Art. 306.",
    legalReferences: ["CST Art. 306"],
    corpusVersion: "co-v0.2.0",
  },
  pe: {
    longDescription:
      "Calcula gratificaciones proporcionales en Perú según reglas documentadas para pagos de julio y diciembre.",
    legalReferences: ["Arts. 206-208"],
    corpusVersion: "pe-v0.2.0",
  },
  ar: {
    longDescription:
      "Calcula SAC o aguinaldo proporcional en Argentina según Ley 23.041 (50% del mejor salario del semestre).",
    legalReferences: ["Ley 23.041"],
    corpusVersion: "ar-v0.2.0",
  },
  cl: {
    longDescription:
      "Muestra fallback para Chile: el corpus MVP no contiene prestación legal equivalente a aguinaldo, décimo o bono para cálculo automático.",
    legalReferences: ["Corpus MVP Chile: sin prestación equivalente soportada"],
    corpusVersion: "cl-v0.2.0",
  },
}

export const bonusTool: CalculationTool<BonusInput, BonusResult> = {
  id: "bonus",
  slug: "aguinaldo-decimo-bono",
  name: "Aguinaldo / décimo / bono",
  shortDescription: "Estima pagos proporcionales de bonos laborales por país.",
  longDescription:
    "Calculadora abierta para aguinaldo, décimo, bono 14, prima, SAC o gratificaciones según jurisdicción. Incluye fallback cuando el corpus MVP no soporta una prestación equivalente.",
  category: "calculation",
  availability: "available",
  countrySupport: Object.keys(bonusCalculators) as CountryCode[],
  inputRequirements: ["País", "Salario mensual", "Fecha de inicio", "Fecha de corte"],
  outputSummary: ["Monto proporcional", "Líneas aplicables", "Fórmula", "Referencias legales"],
  inputSchema: bonusInputSchema,
  calculate: calculateBonus,
  legalReferences: [
    "Ley 185 Arts. 93 y 94 (NI)",
    "Código de Trabajo Arts. 196-202 (SV)",
    "Decreto 76-78 + Decreto 42-92 (GT)",
    "Decreto 133-92 (HN)",
    "Ley No. 2412 (CR)",
    "Ley 13 de 1994 (PA)",
    "LFT Art. 87 (MX)",
    "CST Art. 306 (CO)",
    "Arts. 206-208 (PE)",
    "Ley 23.041 (AR)",
  ],
  corpusVersion: "multi-v0.1.0",
  disclaimer:
    "Resultado informativo generado con reglas determinísticas y corpus legal versionado. No sustituye asesoría legal o contable profesional.",
  countryOverrides: bonusCountryOverrides as Record<CountryCode, CountryOverride>,
}

export function calculateBonus(input: BonusInput): BonusResult {
  const calculator = bonusCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`País no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
