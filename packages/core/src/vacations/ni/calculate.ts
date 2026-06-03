import { daysBetween, round2 } from "../../settlement"
import type { VacationInput, VacationResult } from "../types"

const CURRENCY = "NIO" as const
const LEGAL_CORPUS_VERSION = "ni-v0.2.0"
const VACATION_DAYS_PER_YEAR = 30

export const calculateNicaraguaVacations = (
  input: VacationInput
): VacationResult => {
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Fechas invalidas")
  }

  if (end < start) {
    throw new Error("La fecha de corte no puede ser menor que la fecha de inicio")
  }

  const workedDays = daysBetween(start, end)
  const dailySalary = round2(input.monthlySalary / 30)
  const accruedVacationDays = round2(
    (workedDays * VACATION_DAYS_PER_YEAR) / 365
  )
  const pendingVacationDays = round2(
    Math.max(0, accruedVacationDays - input.usedVacationDays)
  )
  const amount = round2(dailySalary * pendingVacationDays)

  return {
    currency: CURRENCY,
    accruedVacationDays,
    usedVacationDays: input.usedVacationDays,
    pendingVacationDays,
    dailySalary,
    amount,
    formula: `(${workedDays} dias x ${VACATION_DAYS_PER_YEAR} / 365 - ${input.usedVacationDays}) x ${dailySalary}`,
    legalReference: "Ley 185 Arts. 76, 77 y 78",
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: LEGAL_CORPUS_VERSION,
  }
}
