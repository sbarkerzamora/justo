import { z } from "zod"

export const contractInputSchema = z.object({
  countryCode: z.enum(["ni", "sv", "gt", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl"]),
  celebrationPlace: z.string().min(2),
  workerName: z.string().min(3),
  workerId: z.string().min(5),
  workerAddress: z.string().min(5),
  employerName: z.string().min(3),
  employerId: z.string().min(5),
  employerRepresentative: z.string().min(3),
  employerAddress: z.string().min(5),
  jobTitle: z.string().min(3),
  jobDescription: z.string().min(10),
  workLocation: z.string().min(3),
  jornada: z.enum(["diurna", "mixta", "nocturna"]),
  contractType: z.enum(["indeterminado", "plazo_fijo", "obra_determinada"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  monthlySalary: z.number().positive(),
  paymentFrequency: z.enum(["mensual", "quincenal", "semanal"]),
  paymentMethod: z.enum(["unidad_tiempo", "destajo", "comision", "otro"]),
  trialPeriodDays: z.number().int().min(1).max(30).optional(),
})

export type ContractInputPayload = z.infer<typeof contractInputSchema>
