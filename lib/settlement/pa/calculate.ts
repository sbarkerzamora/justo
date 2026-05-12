import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getPanamaLegalRates } from "@/lib/settlement/pa/legal-params"

const CURRENCY = "USD" as const
const LEGAL_CORPUS_VERSION = "pa-v0.1.0"

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

export const calculatePanamaSettlement = (
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

  // Prima de antiguedad: Art. 224 - 1 semana (7 dias) por ano
  const primaAntiguedad = round2(dailySalary * tenureYears * 7)

  // Indemnizacion: Art. 225-C - 3.4 semanas/ano primeros 10 anos, 1 semana/ano extra
  const firstTrancheDays = Math.min(tenureYears, 10) * 23.8
  const secondTrancheDays = Math.max(tenureYears - 10, 0) * 7
  const indemnizacionDays = round2(Math.max(firstTrancheDays + secondTrancheDays, 7))
  const indemnizacion = round2(dailySalary * indemnizacionDays)

  // Decimotercer Mes: Ley 13 de 1994
  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const decimoDays = daysBetween(accrualStart, end)
  const decimoTercerMes = round2((input.monthlySalary * decimoDays) / 365)

  // Vacaciones: Art. 54 - 30 dias por 11 meses
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Prima de antiguedad",
      amount: primaAntiguedad,
      formula: `(${round2(dailySalary)} x ${round2(tenureYears)} anos x 7 dias)`,
      legalReference: "Codigo de Trabajo Art. 224 (1 semana/ano)",
    },
    {
      label: "Indemnizacion",
      amount: indemnizacion,
      formula: `(${round2(dailySalary)} x ${indemnizacionDays} dias)`,
      legalReference: "Codigo de Trabajo Art. 225-C (3.4 sem/ano 1ros 10a, 1 sem/ano extra)",
    },
    {
      label: "Decimotercer Mes",
      amount: decimoTercerMes,
      formula: `(${input.monthlySalary} x ${decimoDays} / 365)`,
      legalReference: "Ley 13 de 1994",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "Codigo de Trabajo Art. 54 (30 dias / 11 meses)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Codigo de Trabajo (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones CSS
  const { cssRate } = getPanamaLegalRates()
  const cssBase = round2(proportionalSalary + vacationPay)
  const css = round2(cssBase * cssRate)

  const deductions: SettlementLine[] = [
    {
      label: "CSS laboral",
      amount: css,
      formula: `(${cssBase} x ${(cssRate * 100).toFixed(1)}%)`,
      legalReference: "Ley Organica de la CSS (tasa propuesta)",
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
