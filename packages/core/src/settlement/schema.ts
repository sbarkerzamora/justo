import { z } from "zod"

export const settlementInputSchema = z.object({
  countryCode: z.enum(["ni", "gt", "hn", "sv", "cr", "pa", "mx", "co", "pe", "ar", "cl"]),
  employeeName: z.string().min(2),
  employerName: z.string().min(2),
  monthlySalary: z.number().positive().finite(),
  frequency: z.enum(["mensual", "quincenal", "semanal"]),
  unusedVacationDays: z.number().int().min(0).max(30),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export type SettlementInputPayload = z.infer<typeof settlementInputSchema>
