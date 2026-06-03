import {
  calculateNicaraguaVacations,
  vacationInputSchema,
  type VacationInput,
  type VacationResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

export const vacationsTool: CalculationTool<VacationInput, VacationResult> = {
  id: "vacations",
  slug: "vacaciones",
  name: "Vacaciones",
  shortDescription: "Calcula vacaciones acumuladas, gozadas y pendientes en Nicaragua.",
  longDescription:
    "Herramienta abierta para estimar días acumulados, días pendientes y monto de vacaciones con base en salario mensual y periodo trabajado en Nicaragua.",
  category: "calculation",
  availability: "available",
  countrySupport: ["ni"],
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
  if (input.countryCode !== "ni") {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }

  return calculateNicaraguaVacations(input)
}
