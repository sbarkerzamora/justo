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

export const terminationInputSchema = z.object({
  countryCode: z.enum(countryCodes),
  monthlySalary: z.number().positive().finite(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  terminationCause: z.enum(terminationCauses),
  contractType: z.enum(contractTypes),
})

export type TerminationInputPayload = z.infer<typeof terminationInputSchema>
