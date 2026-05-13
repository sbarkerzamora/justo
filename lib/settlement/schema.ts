import { z } from "zod"

export const settlementInputSchema = z.object({
  countryCode: z.enum(["ni", "gt", "hn", "sv", "cr", "pa", "mx", "co", "pe", "ar", "cl"]),
  employeeName: z.string().min(2),
  employerName: z.string().min(2),
  monthlySalary: z.number().positive(),
  frequency: z.enum(["mensual", "quincenal", "semanal"]),
  unusedVacationDays: z.number().min(0).max(30),
  startDate: z.string().min(10),
  endDate: z.string().min(10),
})

export type SettlementInputPayload = z.infer<typeof settlementInputSchema>
