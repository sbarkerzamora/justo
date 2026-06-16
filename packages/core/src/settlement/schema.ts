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

const terminationCauses = [
  "renuncia",
  "despido_justificado",
  "despido_injustificado",
  "mutuo_acuerdo",
  "fin_plazo",
  "obra_terminada",
  "jubilacion",
  "fallecimiento",
] as const

const contractTypes = [
  "indeterminado",
  "plazo_fijo",
  "obra_determinada",
  "temporada",
  "periodo_prueba",
] as const

export const settlementInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  employeeName: z.string().min(2),
  employerName: z.string().min(2),
  monthlySalary: z.number().positive().finite(),
  frequency: z.enum(["mensual", "quincenal", "semanal"]),
  unusedVacationDays: z.number().int().min(0).max(30),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  terminationCause: z.enum(terminationCauses),
  contractType: z.enum(contractTypes),
  pendingSalaryAmount: z.number().min(0).finite().optional().default(0),
  pendingOvertimeAmount: z.number().min(0).finite().optional().default(0),
  pendingBonusAmount: z.number().min(0).finite().optional().default(0),
  benefitsAlreadyPaidAmount: z.number().min(0).finite().optional().default(0),
  otherDeductionsAmount: z.number().min(0).finite().optional().default(0),
})

export type SettlementInputPayload = z.infer<typeof settlementInputSchema>
