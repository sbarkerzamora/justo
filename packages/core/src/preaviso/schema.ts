import { z } from "zod"
import type { CountryCode } from "../settlement"

export const countryCodes = [
  "ar",
  "cl",
  "co",
  "cr",
  "gt",
  "hn",
  "mx",
  "ni",
  "pa",
  "pe",
  "sv",
] as const

export const CountryCodesEnum = z.enum(countryCodes)

export const TerminationCauseEnum = z.enum([
  "renuncia",
  "despido_justificado",
  "despido_injustificado",
  "mutuo_acuerdo",
  "fin_plazo",
  "obra_terminada",
  "jubilacion",
  "fallecimiento",
])

export const ContractTypeEnum = z.enum([
  "indeterminado",
  "plazo_fijo",
  "obra_determinada",
  "temporada",
  "periodo_prueba",
])

export const PreavisoInputSchema = z.object({
  countryCode: CountryCodesEnum as z.ZodType<CountryCode>,
  monthlySalary: z.number().positive().finite(),
  tenureYears: z.number().min(0).max(100),
  terminationCause: TerminationCauseEnum,
  contractType: ContractTypeEnum,
  noticeGivenInWriting: z.boolean(),
  noticeDaysGiven: z.number().int().min(0).max(365).optional(),
  replaceNoticeWithPayment: z.boolean(),
})
