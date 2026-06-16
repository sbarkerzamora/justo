import { z } from "zod"
import type { CountryCode } from "../settlement"

export const countryCodes = [
  "ar", "cl", "co", "cr", "gt", "hn", "mx", "ni", "pa", "pe", "sv",
] as const

export const CountryCodesEnum = z.enum(countryCodes)

export const PreavisoInputSchema = z.object({
  countryCode: CountryCodesEnum as z.ZodType<CountryCode>,
  monthlySalary: z.number().positive(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  tenureYears: z.number().min(0),
})
