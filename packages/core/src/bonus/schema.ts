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
  monthlySalary: z.number().positive().finite(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type BonusInputPayload = z.infer<typeof bonusInputSchema>
