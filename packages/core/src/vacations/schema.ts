import { z } from "zod"

export const vacationInputSchema = z.object({
  countryCode: z.literal("ni"),
  monthlySalary: z.number().positive(),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
  usedVacationDays: z.number().min(0).max(365),
})

export type VacationInputPayload = z.infer<typeof vacationInputSchema>
