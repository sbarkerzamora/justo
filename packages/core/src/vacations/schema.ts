import { z } from "zod"

const countryCodes = [
  "ni", "gt", "hn", "sv", "cr", "pa", "mx", "co", "pe", "ar", "cl",
] as const

export const vacationInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  monthlySalary: z.number().positive().finite(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  usedVacationDays: z.number().int().min(0).max(365),
  seniorityYears: z.number().min(0).optional(),
})

export type VacationInputPayload = z.infer<typeof vacationInputSchema>
