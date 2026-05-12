import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getNicaraguaLegalRates } from "@/lib/settlement/ni/legal-params"

const CURRENCY = "NIO" as const
const LEGAL_CORPUS_VERSION = "ni-v0.2.0"

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round2 = (value: number) => Math.round(value * 100) / 100

const daysBetween = (start: Date, end: Date) =>
  Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

const startOfYear = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), 0, 1))

const formatTenure = (totalDays: number) => {
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays - years * 365 - months * 30
  return `${years} anos, ${months} meses, ${days} dias`
}

export const calculateNicaraguaSettlement = (
  input: SettlementInput,
): SettlementResult => {
  const start = new Date(input.startDate)
  const end = new Date(input.endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Fechas invalidas")
  }

  if (end < start) {
    throw new Error("La fecha de salida no puede ser menor que la fecha de inicio")
  }

  const tenureDays = daysBetween(start, end)

  const dailySalary = input.monthlySalary / 30
  const tenureYears = tenureDays / 365

  const firstTrancheYears = Math.min(tenureYears, 3)
  const secondTrancheYears = Math.max(tenureYears - 3, 0)
  const baseIndemnizationDays = firstTrancheYears * 30 + secondTrancheYears * 20
  const indemnizationDays = round2(clamp(baseIndemnizationDays, 30, 150))
  const indemnization = round2(dailySalary * indemnizationDays)

  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const aguinaldoDays = daysBetween(accrualStart, end)
  const proportionalAguinaldo = round2((input.monthlySalary * aguinaldoDays) / 365)

  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  const { inssLaborRate, irLaborRate } = getNicaraguaLegalRates()

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion",
      amount: indemnization,
      formula: `(${round2(dailySalary)} x ${indemnizationDays})`,
      legalReference: "Ley 185 Art. 45, Art. 43 (antiguedad, min 1 mes, max 5 meses)",
    },
    {
      label: "Aguinaldo proporcional",
      amount: proportionalAguinaldo,
      formula: `(${input.monthlySalary} x ${aguinaldoDays} / 365)`,
      legalReference: "Ley 185 Arts. 93 y 94 (proporcional y base de calculo)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "Ley 185 Arts. 76, 77 y 78",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Ley 185 Arts. 42, 81, 84 y 86",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  const inssBase = round2(vacationPay + proportionalSalary)
  const inss = round2(inssBase * inssLaborRate)
  const irBase = round2(grossIncome - inss - proportionalAguinaldo)
  const ir = round2(Math.max(0, irBase) * irLaborRate)

  const deductions: SettlementLine[] = [
    {
      label: "INSS laboral",
      amount: inss,
      formula: `(${inssBase} x ${inssLaborRate * 100}%)`,
      legalReference: "Ley 185 Art. 88 + normativa INSS vigente",
    },
    {
      label: "IR estimado",
      amount: ir,
      formula: `(max(${irBase}, 0) x ${irLaborRate * 100}%)`,
      legalReference: "Ley 185 Art. 97 + normativa IR rentas del trabajo vigente",
    },
  ]

  const totalDeductions = round2(deductions.reduce((sum, line) => sum + line.amount, 0))
  const netTotal = round2(grossIncome - totalDeductions)

  return {
    currency: CURRENCY,
    tenureDays,
    tenureText: formatTenure(tenureDays),
    incomes,
    deductions,
    grossIncome,
    totalDeductions,
    netTotal,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: LEGAL_CORPUS_VERSION,
  }
}
