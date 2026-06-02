import {
  calculateArgentinaSettlement,
  calculateChileSettlement,
  calculateColombiaSettlement,
  calculateCostaRicaSettlement,
  calculateElSalvadorSettlement,
  calculateGuatemalaSettlement,
  calculateHondurasSettlement,
  calculateMexicoSettlement,
  calculateNicaraguaSettlement,
  calculatePanamaSettlement,
  calculatePeruSettlement,
  settlementInputSchema,
  type CountryCode,
  type SettlementInput,
  type SettlementResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

const settlementCalculators: Record<
  CountryCode,
  (input: SettlementInput) => SettlementResult
> = {
  ar: calculateArgentinaSettlement,
  cl: calculateChileSettlement,
  co: calculateColombiaSettlement,
  cr: calculateCostaRicaSettlement,
  gt: calculateGuatemalaSettlement,
  hn: calculateHondurasSettlement,
  mx: calculateMexicoSettlement,
  ni: calculateNicaraguaSettlement,
  pa: calculatePanamaSettlement,
  pe: calculatePeruSettlement,
  sv: calculateElSalvadorSettlement,
}

export const settlementTool: CalculationTool<SettlementInput, SettlementResult> = {
  id: "settlement",
  slug: "liquidacion-laboral",
  name: "Liquidación laboral",
  shortDescription:
    "Calcula liquidación, prestaciones, deducciones y total neto según país.",
  longDescription:
    "Herramienta abierta para estimar liquidaciones laborales con fórmulas determinísticas, desglose de ingresos y deducciones, referencias legales y versión del corpus usado.",
  category: "calculation",
  availability: "available",
  countrySupport: Object.keys(settlementCalculators) as CountryCode[],
  inputRequirements: [
    "País",
    "Nombre del trabajador",
    "Nombre del empleador",
    "Salario mensual",
    "Frecuencia de pago",
    "Fecha de inicio",
    "Fecha de salida",
    "Días de vacaciones pendientes",
    "Tipo de terminación, cuando aplique",
  ],
  outputSummary: [
    "Ingresos",
    "Deducciones",
    "Total bruto",
    "Total de deducciones",
    "Total neto",
    "Fórmulas",
    "Referencias legales",
    "Versión del corpus",
    "PDF básico",
  ],
  inputSchema: settlementInputSchema,
  calculate: calculateSettlement,
  legalReferences: ["Corpus legal público de Justo por jurisdicción"],
  corpusVersion: "per-result",
  disclaimer:
    "Resultado informativo generado con reglas determinísticas y corpus legal versionado. No sustituye asesoría legal o contable profesional.",
}

export function calculateSettlement(input: SettlementInput): SettlementResult {
  const calculator = settlementCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
