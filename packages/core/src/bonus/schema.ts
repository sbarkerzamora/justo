import { z } from "zod"

const countryCodes = [
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
] as const

export const bonusInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  monthlySalary: z.number().positive(),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
})

export type BonusInputPayload = z.infer<typeof bonusInputSchema>
