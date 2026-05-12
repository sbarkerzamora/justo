import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getHondurasLegalRates } from "@/lib/settlement/hn/legal-params"

const CURRENCY = "HNL" as const
const LEGAL_CORPUS_VERSION = "hn-v0.1.0"

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

export const calculateHondurasSettlement = (
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

  // Indemnizacion (Auxilio de Cesantia): Art. 120
  // 3-6 meses = 10d, 6-12 = 20d, +1 ano = 1 mes/ano, max 750d (25 meses)
  let indemnizacionDays: number
  if (tenureDays < 90) {
    indemnizacionDays = 0
  } else if (tenureDays < 180) {
    indemnizacionDays = 10
  } else if (tenureDays < 365) {
    indemnizacionDays = 20
  } else {
    const base = tenureYears * 30
    indemnizacionDays = round2(clamp(base, 30, 750))
  }
  const indemnizacion = round2(dailySalary * indemnizacionDays)

  // Aguinaldo (Decimotercer Mes): proporcional del ano en curso
  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const aguinaldoDays = daysBetween(accrualStart, end)
  const aguinaldo = round2((input.monthlySalary * aguinaldoDays) / 365)

  // Vacaciones: pendientes no gozadas
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  // Salario proporcional del mes
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion",
      amount: indemnizacion,
      formula: indemnizacionDays === 10
        ? "10 dias (Art. 120a)"
        : indemnizacionDays === 20
          ? "20 dias (Art. 120b)"
          : `(${round2(dailySalary)} x ${indemnizacionDays} dias)`,
      legalReference: "Codigo de Trabajo Arts. 116 y 120 (auxilio de cesantia)",
    },
    {
      label: "Aguinaldo proporcional",
      amount: aguinaldo,
      formula: `(${input.monthlySalary} x ${aguinaldoDays} / 365)`,
      legalReference: "Decreto 133-92 (Decimotercer Mes proporcional)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "Codigo de Trabajo Arts. 346 y 349",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Codigo de Trabajo Arts. 322 y 378",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones IHSS 3.5%
  const { ihssRate } = getHondurasLegalRates()
  const ihssBase = round2(proportionalSalary + vacationPay)
  const ihss = round2(ihssBase * ihssRate)

  const deductions: SettlementLine[] = [
    {
      label: "IHSS laboral",
      amount: ihss,
      formula: `(${ihssBase} x ${(ihssRate * 100).toFixed(1)}%)`,
      legalReference: "Ley del IHSS (tasa propuesta)",
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
