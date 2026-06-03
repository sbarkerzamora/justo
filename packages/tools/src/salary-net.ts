import {
  calculateNicaraguaSalaryNet,
  calculateElSalvadorSalaryNet,
  calculateHondurasSalaryNet,
  calculateGuatemalaSalaryNet,
  calculateCostaRicaSalaryNet,
  calculatePanamaSalaryNet,
  calculateMexicoSalaryNet,
  calculateColombiaSalaryNet,
  calculatePeruSalaryNet,
  calculateChileSalaryNet,
  calculateArgentinaSalaryNet,
  salaryNetInputSchema,
  type CountryCode,
  type SalaryNetInput,
  type SalaryNetResult,
} from "@justo/core"
import type { CalculationTool } from "./types"

const salaryNetCalculators: Record<
  CountryCode,
  (input: SalaryNetInput) => SalaryNetResult
> = {
  ar: calculateArgentinaSalaryNet,
  cl: calculateChileSalaryNet,
  co: calculateColombiaSalaryNet,
  cr: calculateCostaRicaSalaryNet,
  gt: calculateGuatemalaSalaryNet,
  hn: calculateHondurasSalaryNet,
  mx: calculateMexicoSalaryNet,
  ni: calculateNicaraguaSalaryNet,
  pa: calculatePanamaSalaryNet,
  pe: calculatePeruSalaryNet,
  sv: calculateElSalvadorSalaryNet,
}

type CountryOverride = {
  longDescription: string
  legalReferences: readonly string[]
  corpusVersion: string
}

const salaryNetCountryOverrides: Partial<Record<CountryCode, CountryOverride>> = {
  ni: {
    longDescription:
      "Calcula el salario neto en Nicaragua después de deducciones de INSS (4.11%) e IR (Ley 185 Arts. 88 y 97).",
    legalReferences: ["Ley 185 Arts. 88 y 97; Ley del INSS"],
    corpusVersion: "ni-v0.3.0",
  },
  sv: {
    longDescription:
      "Calcula el salario neto en El Salvador después de deducciones de ISSS (3%), AFP (7.25%) e ISR (Art. 132 Código de Trabajo + Ley ISSS + Ley SAP).",
    legalReferences: ["Art. 132 Código de Trabajo; Ley ISSS; Ley SAP"],
    corpusVersion: "sv-v0.2.0",
  },
  gt: {
    longDescription:
      "Calcula el salario neto en Guatemala después de deducciones de IGSS (4.83%) e ISR (Art. 88 Decreto 1441 + Ley del IGSS + Ley del ISR).",
    legalReferences: ["Decreto 1441 Art. 88; Ley del IGSS; Ley del ISR"],
    corpusVersion: "gt-v0.2.0",
  },
  hn: {
    longDescription:
      "Calcula el salario neto en Honduras después de deducciones de IHSS (2.5%) y RAP (Ley del IHSS + RAP).",
    legalReferences: ["Ley del IHSS; RAP"],
    corpusVersion: "hn-v0.2.0",
  },
  cr: {
    longDescription:
      "Calcula el salario neto en Costa Rica después de deducciones de CCSS (Ley Constitutiva de la CCSS).",
    legalReferences: ["Ley Constitutiva de la CCSS"],
    corpusVersion: "cr-v0.2.0",
  },
  pa: {
    longDescription:
      "Calcula el salario neto en Panamá después de deducciones de CSS (Ley Orgánica de la CSS).",
    legalReferences: ["Ley Orgánica de la CSS"],
    corpusVersion: "pa-v0.2.0",
  },
  mx: {
    longDescription:
      "Calcula el salario neto en México después de deducciones de IMSS e ISR (Ley del Seguro Social + Ley del ISR).",
    legalReferences: ["Ley del Seguro Social; Ley del ISR"],
    corpusVersion: "mx-v0.2.0",
  },
  co: {
    longDescription:
      "Calcula el salario neto en Colombia después de deducciones de salud (EPS) y pensión (Ley 100 de 1993).",
    legalReferences: ["Ley 100 de 1993"],
    corpusVersion: "co-v0.2.0",
  },
  pe: {
    longDescription:
      "Calcula el salario neto en Perú después de deducciones de ONP o AFP (D.L. 19990).",
    legalReferences: ["D.L. 19990"],
    corpusVersion: "pe-v0.2.0",
  },
  cl: {
    longDescription:
      "Calcula el salario neto en Chile después de deducciones de AFP, AFC y salud (D.L. 3.500 + Ley 18.933 + Ley 19.728).",
    legalReferences: ["D.L. 3.500; Ley 18.933; Ley 19.728"],
    corpusVersion: "cl-v0.2.0",
  },
  ar: {
    longDescription:
      "Calcula el salario neto en Argentina después de deducciones de INSS, IR y obra social (Ley 24.241 + Ley 19.032 + Ley 23.660).",
    legalReferences: ["Ley 24.241; Ley 19.032; Ley 23.660"],
    corpusVersion: "ar-v0.2.0",
  },
}

export const salaryNetTool: CalculationTool<SalaryNetInput, SalaryNetResult> = {
  id: "salary-net",
  slug: "salario-neto",
  name: "Salario neto",
  shortDescription: "Estima salario neto después de deducciones laborales.",
  longDescription:
    "Calculadora abierta para entender deducciones aplicables (INSS, IR, ISSS, AFP, etc.) y estimar el pago neto según país y frecuencia de pago.",
  category: "calculation",
  availability: "available",
  countrySupport: Object.keys(salaryNetCalculators) as CountryCode[],
  inputRequirements: [
    "País",
    "Salario bruto",
    "Frecuencia de pago",
  ],
  outputSummary: [
    "Salario bruto",
    "Deducciones",
    "Salario neto mensual",
    "Salario neto quincenal",
    "Salario neto semanal",
    "Referencias legales",
  ],
  inputSchema: salaryNetInputSchema,
  calculate: calculateSalaryNet,
  legalReferences: [
    "Ley 185 Arts. 88 y 97 (NI)",
    "Ley del IGSS + Ley del ISR (GT)",
    "Ley del IHSS (HN)",
    "Ley Constitutiva de la CCSS (CR)",
    "Ley Orgánica de la CSS (PA)",
    "Ley del Seguro Social (MX)",
    "Ley 100 de 1993 (CO)",
    "D.L. 19990 (PE)",
    "D.L. 3.500 + Ley 18.933 + Ley 19.728 (CL)",
    "Ley 24.241 + Ley 19.032 + Ley 23.660 (AR)",
    "Art. 132 Código de Trabajo + Ley ISSS + Ley SAP (SV)",
  ],
  corpusVersion: "multi-v0.1.0",
  disclaimer:
    "Resultado informativo generado con reglas determinísticas y corpus legal versionado. No sustituye asesoría legal o contable profesional.",
  countryOverrides: salaryNetCountryOverrides as Record<
    CountryCode,
    { longDescription: string; legalReferences: readonly string[]; corpusVersion: string }
  >,
}

export function calculateSalaryNet(input: SalaryNetInput): SalaryNetResult {
  const calculator = salaryNetCalculators[input.countryCode]

  if (!calculator) {
    throw new Error(`País no soportado: ${input.countryCode}`)
  }

  return calculator(input)
}
