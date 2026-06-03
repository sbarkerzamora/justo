import {
  calculateNicaraguaVacations,
  type CountryCode,
  vacationInputSchema,
  type VacationInput,
  type VacationResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

// Placeholder: all countries currently use Nicaragua's calculation as baseline
// until jurisdiction-specific vacation formulas are implemented.
const vacationCalculators: Record<
  CountryCode,
  (input: VacationInput) => VacationResult
> = {
  ar: calculateNicaraguaVacations,
  cl: calculateNicaraguaVacations,
  co: calculateNicaraguaVacations,
  cr: calculateNicaraguaVacations,
  gt: calculateNicaraguaVacations,
  hn: calculateNicaraguaVacations,
  mx: calculateNicaraguaVacations,
  ni: calculateNicaraguaVacations,
  pa: calculateNicaraguaVacations,
  pe: calculateNicaraguaVacations,
  sv: calculateNicaraguaVacations,
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
  legalReferences: ["Ley 185 Arts. 76, 77 y 78"],
  corpusVersion: "ni-v0.2.0",
  disclaimer:
    "Resultado informativo generado con reglas determinísticas y corpus legal versionado. No sustituye asesoría legal o contable profesional.",
}

export function calculateVacations(input: VacationInput): VacationResult {
  const calculator = vacationCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
