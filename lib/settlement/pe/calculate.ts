import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getPeruLegalRates } from "@/lib/settlement/pe/legal-params"

const CURRENCY = "PEN" as const
const LEGAL_CORPUS_VERSION = "pe-v0.1.0"

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

export const calculatePeruSettlement = (
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

  // Indemnizacion: Art. 167 - escala 45/30/15 dias
  const tramo1 = Math.min(tenureYears, 8) * 45
  const tramo2 = Math.max(Math.min(tenureYears - 8, 8), 0) * 30
  const tramo3 = Math.max(tenureYears - 16, 0) * 15
  const indemnizacionDias = round2(clamp(tramo1 + tramo2 + tramo3, 90, 720))
  const indemnizacion = round2(dailySalary * indemnizacionDias)

  // CTS: Art. 219 - 8.33% mensual (~1 salario/ano)
  const cts = round2(input.monthlySalary * 0.0833 * tenureYears)

  // Gratificaciones: Arts. 206-208 - 2 al ano
  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const gratifDays = daysBetween(accrualStart, end)
  const gratificacion = round2(input.monthlySalary * 2 * (gratifDays / 365))

  // Vacaciones: Art. 285 - 30 dias
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion por despido",
      amount: indemnizacion,
      formula: `(${round2(dailySalary)} x ${indemnizacionDias} dias)`,
      legalReference: "Art. 167 (45/30/15 dias segun antiguedad)",
    },
    {
      label: "CTS",
      amount: cts,
      formula: `(${input.monthlySalary} x 8.33% x ${round2(tenureYears)} anos)`,
      legalReference: "Art. 219 (8.33% mensual)",
    },
    {
      label: "Gratificaciones",
      amount: gratificacion,
      formula: `(${input.monthlySalary} x 2 x ${gratifDays}/365)`,
      legalReference: "Arts. 206-208 (2 al ano, jul/dic)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "Arts. 285 y 289 (30 dias naturales/ano)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Salario del mes en curso",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones ONP
  const { onpRate } = getPeruLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const onp = round2(deductionBase * onpRate)

  const deductions: SettlementLine[] = [
    {
      label: "ONP",
      amount: onp,
      formula: `(${deductionBase} x ${(onpRate * 100).toFixed(0)}%)`,
      legalReference: "D.L. 19990 (Sistema Nacional de Pensiones)",
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
