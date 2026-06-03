import type { CountryCode } from "@justo/core"
import type { z } from "zod"

export type JustoToolCategory =
  | "calculation"
  | "document"
  | "checklist"
  | "assistant"

export type JustoToolAvailability = "available" | "coming_soon"

export type JustoToolCountryOverride = {
  longDescription?: string
  legalReferences?: readonly string[]
  corpusVersion?: string
}

export type JustoTool = {
  id: string
  slug: string
  name: string
  shortDescription: string
  longDescription: string
  category: JustoToolCategory
  availability: JustoToolAvailability
  countrySupport: readonly CountryCode[]
  inputRequirements: readonly string[]
  outputSummary: readonly string[]
  legalReferences: readonly string[]
  corpusVersion: string
  disclaimer: string
  countryOverrides?: Partial<Record<CountryCode, JustoToolCountryOverride>>
}

export type CalculationTool<TInput, TResult> = JustoTool & {
  category: "calculation"
  availability: "available"
  inputSchema: z.ZodType<TInput>
  calculate: (input: TInput) => TResult
}
