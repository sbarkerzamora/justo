import type { CountryCode } from "@justo/core"
import { bonusTool } from "./bonus"
import { contractTool } from "./contract"
import { preavisoTool } from "./preaviso"
import { salaryNetTool } from "./salary-net"
import { settlementTool } from "./settlement"
import { terminationTool } from "./termination"
import type { JustoTool, JustoToolCountryOverride, JustoToolAvailability, JustoToolCategory } from "./types"
import { vacationsTool } from "./vacations"

const allCountries = [
  "ni",
  "gt",
  "hn",
  "sv",
  "cr",
  "pa",
  "mx",
  "co",
  "pe",
  "ar",
  "cl",
] as const satisfies readonly CountryCode[]

const informationalDisclaimer =
  "Herramienta laboral open source en roadmap. Su resultado será informativo y no sustituirá asesoría legal o contable profesional."

const comingSoonTool = (
  tool: Omit<
    JustoTool,
    | "availability"
    | "countrySupport"
    | "legalReferences"
    | "corpusVersion"
    | "disclaimer"
  > & {
    countrySupport?: readonly CountryCode[]
    legalReferences?: readonly string[]
  }
): JustoTool => ({
  ...tool,
  availability: "coming_soon",
  countrySupport: tool.countrySupport ?? allCountries,
  legalReferences:
    tool.legalReferences ?? ["Corpus legal público de Justo por jurisdicción"],
  corpusVersion: "roadmap",
  disclaimer: informationalDisclaimer,
})

export const tools = [
  settlementTool,
  vacationsTool,
  salaryNetTool,
  bonusTool,
  preavisoTool,
  comingSoonTool({
    id: "overtime",
    slug: "horas-extra",
    name: "Horas extra",
    shortDescription: "Calcula recargos por horas extra y jornadas especiales.",
    longDescription:
      "Herramienta abierta para estimar pagos por tiempo extraordinario según reglas de jornada de cada país.",
    category: "calculation",
    inputRequirements: ["País", "Salario", "Horas trabajadas", "Tipo de jornada"],
    outputSummary: ["Horas reconocidas", "Recargo", "Monto total", "Referencias legales"],
  }),
  terminationTool,
  contractTool,
  comingSoonTool({
    id: "basic-settlement-document",
    slug: "finiquito-basico",
    name: "Generador básico de finiquito",
    shortDescription: "Genera un documento básico con resumen y firmas.",
    longDescription:
      "Documento abierto para imprimir un resumen básico de liquidación con datos del caso, montos, timestamp y firmas.",
    category: "document",
    inputRequirements: [
      "Datos del trabajador",
      "Datos del empleador",
      "Resultado de cálculo",
      "Fecha",
    ],
    outputSummary: ["Resumen", "Montos", "Firmas", "Disclaimer"],
  }),
  comingSoonTool({
    id: "labor-checklist",
    slug: "checklist-laboral",
    name: "Checklist laboral",
    shortDescription: "Revisa pasos básicos de cumplimiento laboral.",
    longDescription:
      "Checklist abierto para ordenar requisitos mínimos de contratación, terminación y documentación laboral.",
    category: "checklist",
    inputRequirements: ["País", "Tipo de proceso", "Datos básicos del caso"],
    outputSummary: ["Tareas pendientes", "Riesgos básicos", "Referencias"],
  }),
  comingSoonTool({
    id: "hiring-assistant",
    slug: "asistente-contratacion",
    name: "Asistente básico de contratación",
    shortDescription: "Guía abierta para preparar una contratación laboral.",
    longDescription:
      "Asistente abierto para orientar sobre datos y documentos básicos antes de iniciar una relación laboral.",
    category: "assistant",
    inputRequirements: [
      "País",
      "Tipo de contratación",
      "Salario",
      "Jornada",
      "Fecha de inicio",
    ],
    outputSummary: [
      "Datos requeridos",
      "Documentos sugeridos",
      "Puntos de revisión",
    ],
  }),
] as const satisfies readonly JustoTool[]

export function getTools(): readonly JustoTool[] {
  return tools
}

export function getAvailableTools(): readonly JustoTool[] {
  return tools.filter((tool) => tool.availability === "available")
}

export function getToolBySlug(slug: string): JustoTool | undefined {
  return tools.find((tool) => tool.slug === slug)
}

export function getToolForCountry(
  slug: string,
  countryCode: CountryCode
): JustoTool | undefined {
  const tool = getToolBySlug(slug)
  if (!tool) return undefined

  const override = tool.countryOverrides?.[countryCode]
  if (!override) return tool

  return {
    ...tool,
    longDescription: override.longDescription ?? tool.longDescription,
    legalReferences: override.legalReferences ?? tool.legalReferences,
    corpusVersion: override.corpusVersion ?? tool.corpusVersion,
  }
}

// Types are re-exported from index.ts via types.ts
