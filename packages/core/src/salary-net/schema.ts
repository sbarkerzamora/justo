import { z } from "zod"

const countryCodes = [
  "ni", "gt", "hn", "sv", "cr", "pa", "mx", "co", "pe", "ar", "cl",
] as const

export const salaryNetInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  grossSalary: z.number().positive(),
  frequency: z.enum(["mensual", "quincenal", "semanal"]),
  pensionSystem: z.enum(["afp", "onp"]).optional(),
})

export type SalaryNetInputPayload = z.infer<typeof salaryNetInputSchema>
