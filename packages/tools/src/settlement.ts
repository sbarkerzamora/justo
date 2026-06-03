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

type SOverride = { longDescription: string; legalReferences: readonly string[] }

const settlementCountryOverrides: Partial<Record<CountryCode, SOverride>> = {
  ni: {
    longDescription:
      "Calcula liquidación laboral en Nicaragua según la Ley 185 (Código del Trabajo). Incluye indemnización (Arts. 76, 77, 82), aguinaldo proporcional (Art. 56), vacaciones (Arts. 76, 77, 78), salario proporcional y deducciones (Arts. 88, 97).",
    legalReferences: ["Ley 185 Arts. 76, 77, 82, 56, 88, 97"],
  },
  sv: {
    longDescription:
      "Calcula liquidación laboral en El Salvador según el Código de Trabajo. Incluye indemnización (Arts. 53, 58), aguinaldo proporcional (Art. 197), vacaciones (Arts. 177, 187) y deducciones (ISSS, AFP, ISR).",
    legalReferences: ["Código de Trabajo Arts. 53, 58, 177, 187, 197"],
  },
  gt: {
    longDescription:
      "Calcula liquidación laboral en Guatemala según el Decreto 1441 (Código de Trabajo). Incluye indemnización por tiempo servido (Arts. 78, 82), vacaciones (Art. 130), aguinaldo (Decreto 76-78), bono 14 (Decreto 42-92) y deducciones (IGSS, ISR).",
    legalReferences: ["Decreto 1441 Arts. 78, 82, 130; Decreto 76-78; Decreto 42-92"],
  },
  hn: {
    longDescription:
      "Calcula liquidación laboral en Honduras según el Código de Trabajo (Decreto 189-59). Incluye indemnización (Arts. 116, 120, 123), vacaciones (Arts. 346, 349, 352) y deducciones (IHSS, RAP).",
    legalReferences: ["Decreto 189-59 Arts. 116, 120, 123, 346, 349, 352"],
  },
  cr: {
    longDescription:
      "Calcula liquidación laboral en Costa Rica según el Código de Trabajo. Incluye preaviso (Art. 28), cesantía (Art. 29), vacaciones (Arts. 153, 156), aguinaldo (Ley 5909) y deducciones (CCSS).",
    legalReferences: ["Código de Trabajo Arts. 28, 29, 153, 156; Ley 5909"],
  },
  pa: {
    longDescription:
      "Calcula liquidación laboral en Panamá según el Código de Trabajo. Incluye indemnización (Arts. 212, 224, 225), vacaciones (Art. 54), décimo tercer mes (Art. 161) y deducciones (CSS).",
    legalReferences: ["Código de Trabajo Arts. 54, 161, 212, 224, 225"],
  },
  mx: {
    longDescription:
      "Calcula liquidación laboral en México según la Ley Federal del Trabajo. Incluye indemnización (Arts. 48-50), vacaciones (Arts. 76, 77, 78, 80), aguinaldo (Art. 87) y deducciones (IMSS, ISR).",
    legalReferences: ["Ley Federal del Trabajo Arts. 48-50, 76, 77, 78, 80, 87"],
  },
  co: {
    longDescription:
      "Calcula liquidación laboral en Colombia según el Código Sustantivo del Trabajo. Incluye indemnización (Art. 64), cesantías (Arts. 249, 253), vacaciones (Arts. 186, 189), prima de servicios (Arts. 306, 307) y deducciones (EPS, pensión).",
    legalReferences: ["Código Sustantivo del Trabajo Arts. 64, 186, 189, 249, 253, 306, 307"],
  },
  pe: {
    longDescription:
      "Calcula liquidación laboral en Perú según la Ley General de Trabajo. Incluye indemnización (Art. 167), CTS (Art. 219), vacaciones (Arts. 285, 289), gratificaciones (Arts. 206-208) y deducciones (ONP, AFP).",
    legalReferences: ["Ley General de Trabajo Arts. 167, 206-208, 219, 285, 289"],
  },
  cl: {
    longDescription:
      "Calcula liquidación laboral en Chile según el Código del Trabajo. Incluye indemnización (Arts. 161-163), vacaciones (Arts. 67, 68, 73) y deducciones (AFP, AFC, salud).",
    legalReferences: ["Código del Trabajo Arts. 67, 68, 73, 161-163"],
  },
  ar: {
    longDescription:
      "Calcula liquidación laboral en Argentina según la Ley 20.744 (Ley de Contrato de Trabajo). Incluye indemnización (Arts. 245, 246), preaviso (Arts. 231-233), SAC proporcional (Art. 123), vacaciones (Arts. 150, 151, 153, 155) y deducciones (INSS, IR).",
    legalReferences: ["Ley 20.744 Arts. 123, 150, 151, 153, 155, 231-233, 245, 246"],
  },
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
  countryOverrides: settlementCountryOverrides as Record<CountryCode, { longDescription: string; legalReferences: readonly string[] }>,
}

export function calculateSettlement(input: SettlementInput): SettlementResult {
  const calculator = settlementCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`Pais no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
