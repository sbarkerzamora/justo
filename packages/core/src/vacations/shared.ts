import { daysBetween, round2 } from "../settlement"
import type { CurrencyCode } from "../settlement"
import type { VacationInput, VacationResult } from "./types"

export interface VacationParams {
  currency: CurrencyCode
  corpusVersion: string
  legalReference: string
  dailyDivisor: number
  premium: number
  getDaysPerYear: (seniorityYears: number) => number
}

export function buildVacation(
  input: VacationInput,
  params: VacationParams,
): VacationResult {
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Fechas invalidas")
  }

  if (end < start) {
    throw new Error("La fecha de corte no puede ser menor que la fecha de inicio")
  }

  const workedDays = daysBetween(start, end)
  const seniority = input.seniorityYears ?? workedDays / 365
  const daysPerYear = params.getDaysPerYear(seniority)
  const dailySalary = round2(input.monthlySalary / params.dailyDivisor)
  const accruedVacationDays = round2((workedDays * daysPerYear) / 365)
  const pendingVacationDays = round2(Math.max(0, accruedVacationDays - input.usedVacationDays))
  const amount = round2(dailySalary * pendingVacationDays * (1 + params.premium))

  return {
    currency: params.currency,
    accruedVacationDays,
    usedVacationDays: input.usedVacationDays,
    pendingVacationDays,
    dailySalary,
    amount,
    formula: `(${workedDays} dias x ${Math.round(daysPerYear * 100) / 100} / 365 - ${input.usedVacationDays}) x ${dailySalary}${params.premium > 0 ? ` x ${1 + params.premium}` : ""}`,
    legalReference: params.legalReference,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: params.corpusVersion,
  }
}
