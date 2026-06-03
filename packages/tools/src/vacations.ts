import {
  calculateNicaraguaVacations,
  calculateElSalvadorVacations,
  calculateHondurasVacations,
  calculateGuatemalaVacations,
  calculateCostaRicaVacations,
  calculatePanamaVacations,
  calculateMexicoVacations,
  calculateColombiaVacations,
  calculatePeruVacations,
  calculateChileVacations,
  calculateArgentinaVacations,
  vacationInputSchema,
  type CountryCode,
  type VacationInput,
  type VacationResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

const vacationCalculators: Record<
  CountryCode,
  (input: VacationInput) => VacationResult
> = {
  ar: calculateArgentinaVacations,
  cl: calculateChileVacations,
  co: calculateColombiaVacations,
  cr: calculateCostaRicaVacations,
  gt: calculateGuatemalaVacations,
  hn: calculateHondurasVacations,
  mx: calculateMexicoVacations,
  ni: calculateNicaraguaVacations,
  pa: calculatePanamaVacations,
  pe: calculatePeruVacations,
  sv: calculateElSalvadorVacations,
}

type VOverride = {
  longDescription: string
  legalReferences: readonly string[]
  corpusVersion: string
}

const vacationsCountryOverrides: Partial<Record<CountryCode, VOverride>> = {
  ni: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Nicaragua según la Ley 185 Arts. 76, 77 y 78.",
    legalReferences: ["Ley 185 Arts. 76, 77 y 78"],
    corpusVersion: "ni-v0.3.0",
  },
  sv: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en El Salvador según el Código de Trabajo Arts. 177 y 187.",
    legalReferences: ["Código de Trabajo Arts. 177, 187"],
    corpusVersion: "sv-v0.2.0",
  },
  hn: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Honduras según el Decreto 189-59 Arts. 346, 349 y 352.",
    legalReferences: ["Decreto 189-59 Arts. 346, 349, 352"],
    corpusVersion: "hn-v0.2.0",
  },
  gt: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Guatemala según el Decreto 1441 Art. 130.",
    legalReferences: ["Decreto 1441 Art. 130"],
    corpusVersion: "gt-v0.2.0",
  },
  cr: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Costa Rica según el Código de Trabajo Arts. 153 y 156.",
    legalReferences: ["Código de Trabajo Arts. 153, 156"],
    corpusVersion: "cr-v0.2.0",
  },
  pa: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Panamá según el Código de Trabajo Art. 54.",
    legalReferences: ["Código de Trabajo Art. 54"],
    corpusVersion: "pa-v0.2.0",
  },
  mx: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en México según la Ley Federal del Trabajo Arts. 76, 77, 78 y 80.",
    legalReferences: ["Ley Federal del Trabajo Arts. 76, 77, 78, 80"],
    corpusVersion: "mx-v0.2.0",
  },
  co: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Colombia según el Código Sustantivo del Trabajo Arts. 186 y 189.",
    legalReferences: ["Código Sustantivo del Trabajo Arts. 186, 189"],
    corpusVersion: "co-v0.2.0",
  },
  pe: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Perú según la Ley General de Trabajo Arts. 285 y 289.",
    legalReferences: ["Ley General de Trabajo Arts. 285, 289"],
    corpusVersion: "pe-v0.2.0",
  },
  cl: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Chile según el Código del Trabajo Arts. 67, 68 y 73.",
    legalReferences: ["Código del Trabajo Arts. 67, 68, 73"],
    corpusVersion: "cl-v0.2.0",
  },
  ar: {
    longDescription:
      "Calcula vacaciones acumuladas, gozadas y pendientes en Argentina según la Ley 20.744 Arts. 150, 151, 153 y 155.",
    legalReferences: ["Ley 20.744 Arts. 150, 151, 153, 155"],
    corpusVersion: "ar-v0.2.0",
  },
}

export const vacationsTool: CalculationTool<VacationInput, VacationResult> = {
  id: "vacations",
  slug: "vacaciones",
  name: "Vacaciones",
  shortDescription: "Calcula vacaciones acumuladas, gozadas y pendientes.",
  longDescription:
    "Herramienta abierta para estimar días acumulados, días pendientes y monto de vacaciones con base en salario mensual y periodo trabajado.",
  category: "calculation",
  availability: "available",
  countrySupport: Object.keys(vacationCalculators) as CountryCode[],
  inputRequirements: [
    "País",
    "Salario mensual",
    "Fecha de inicio",
    "Fecha de corte",
    "Días de vacaciones gozados",
  ],
  outputSummary: [
    "Días acumulados",
    "Días gozados",
    "Días pendientes",
    "Salario diario",
    "Monto estimado",
    "Fórmula",
    "Referencia legal",
    "Versión del corpus",
  ],
  inputSchema: vacationInputSchema,
  calculate: calculateVacations,
  legalReferences: [
    "Ley 185 Arts. 76, 77 y 78 (NI)",
    "Arts. 177, 187 Código de Trabajo (SV)",
    "Arts. 346, 349, 352 Decreto 189-59 (HN)",
    "Art. 130 Decreto 1441 (GT)",
    "Arts. 153, 156 Código de Trabajo (CR)",
    "Art. 54 Código de Trabajo (PA)",
    "Arts. 76, 77, 78, 80 Ley Federal del Trabajo (MX)",
    "Arts. 186, 189 Código Sustantivo del Trabajo (CO)",
    "Arts. 285, 289 Ley General de Trabajo (PE)",
    "Arts. 67, 68, 73 Código del Trabajo (CL)",
    "Arts. 150, 151, 153, 155 Ley 20.744 (AR)",
  ],
  corpusVersion: "multi-v0.1.0",
  disclaimer:
    "Resultado informativo generado con reglas determinísticas y corpus legal versionado. No sustituye asesoría legal o contable profesional.",
  countryOverrides: vacationsCountryOverrides as Record<
    CountryCode,
    { longDescription: string; legalReferences: readonly string[]; corpusVersion: string }
  >,
}

export function calculateVacations(input: VacationInput): VacationResult {
  const calculator = vacationCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
