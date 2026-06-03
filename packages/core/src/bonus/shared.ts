import { daysBetween, round2, startOfYear } from "../settlement"
import type { CurrencyCode } from "../settlement"
import type { BonusInput, BonusLine, BonusResult } from "./types"

export interface BonusLineParams {
  label: string
  amount: number
  formula: string
  legalReference: string
}

export interface BonusParams {
  currency: CurrencyCode
  corpusVersion: string
  getLines: (input: BonusInput, context: BonusContext) => BonusLineParams[]
  fallbackReason?: string
}

export interface BonusContext {
  start: Date
  end: Date
  periodStart: Date
  periodDays: number
  dailySalary: number
}

export function buildBonus(input: BonusInput, params: BonusParams): BonusResult {
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Fechas invalidas")
  }

  if (end < start) {
    throw new Error("La fecha de corte no puede ser menor que la fecha de inicio")
  }

  const periodStart = start > startOfYear(end) ? start : startOfYear(end)
  const periodDays = daysBetween(periodStart, end)
  const dailySalary = round2(input.monthlySalary / 30)
  const rawLines = params.getLines(input, {
    start,
    end,
    periodStart,
    periodDays,
    dailySalary,
  })
  const lines: BonusLine[] = rawLines.map((line) => ({
    ...line,
    amount: round2(line.amount),
  }))
  const total = round2(lines.reduce((sum, line) => sum + line.amount, 0))
  const supported = !params.fallbackReason

  return {
    currency: params.currency,
    supported,
    lines,
    total,
    periodDays,
    fallbackReason: params.fallbackReason,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: params.corpusVersion,
  }
}

export function annualMonthlySalaryLine({
  label,
  input,
  periodDays,
  legalReference,
}: {
  label: string
  input: BonusInput
  periodDays: number
  legalReference: string
}): BonusLineParams {
  return {
    label,
    amount: (input.monthlySalary * periodDays) / 365,
    formula: `(${input.monthlySalary} x ${periodDays} / 365)`,
    legalReference,
  }
}
