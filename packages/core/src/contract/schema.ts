import { z } from "zod"

const MAX_STR = 200

export const contractInputSchema = z.object({
  countryCode: z.enum(["ni", "sv", "gt", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl"]),
  celebrationPlace: z.string().min(2).max(MAX_STR),
  workerName: z.string().min(3).max(MAX_STR),
  workerId: z.string().min(5).max(MAX_STR),
  workerAddress: z.string().min(5).max(MAX_STR),
  employerName: z.string().min(3).max(MAX_STR),
  employerId: z.string().min(5).max(MAX_STR),
  employerRepresentative: z.string().min(3).max(MAX_STR),
  employerAddress: z.string().min(5).max(MAX_STR),
  jobTitle: z.string().min(3).max(MAX_STR),
  jobDescription: z.string().min(3).max(MAX_STR),
  workLocation: z.string().min(3).max(MAX_STR),
  jornada: z.enum(["diurna", "mixta", "nocturna"]),
  contractType: z.enum(["indeterminado", "plazo_fijo", "obra_determinada", "temporada", "periodo_prueba"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  monthlySalary: z.number().positive().finite(),
  paymentFrequency: z.enum(["mensual", "quincenal", "semanal"]),
  paymentMethod: z.enum(["unidad_tiempo", "destajo", "comision", "otro"]),
  trialPeriodDays: z.number().int().min(1).max(30).optional(),
})

export type ContractInputPayload = z.infer<typeof contractInputSchema>
