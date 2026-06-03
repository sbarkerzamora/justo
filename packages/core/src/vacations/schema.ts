import { z } from "zod"

const countryCodes = [
  "ni", "gt", "hn", "sv", "cr", "pa", "mx", "co", "pe", "ar", "cl",
] as const

export const vacationInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  monthlySalary: z.number().positive(),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
  usedVacationDays: z.number().min(0).max(365),
  seniorityYears: z.number().min(0).optional(),
})

export type VacationInputPayload = z.infer<typeof vacationInputSchema>
