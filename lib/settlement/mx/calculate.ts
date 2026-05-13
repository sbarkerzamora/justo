import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getMexicoLegalRates } from "@/lib/settlement/mx/legal-params"

const CURRENCY = "MXN" as const
const LEGAL_CORPUS_VERSION = "mx-v0.1.0"

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round2 = (value: number) => Math.round(value * 100) / 100

const daysBetween = (start: Date, end: Date) =>
  Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

const startOfYear = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), 0, 1))

const vacationDaysByYear = (years: number): number => {
  if (years < 1) return Math.round(years * 6)
  if (years === 1) return 6
  if (years < 5) return 6 + (years - 1) * 2
  const extraQuinquennia = Math.floor((years - 4) / 5)
  return 12 + extraQuinquennia * 2
}

const formatTenure = (totalDays: number) => {
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays - years * 365 - months * 30
  return `${years} anos, ${months} meses, ${days} dias`
}

export const calculateMexicoSettlement = (
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

  // Indemnizacion constitucional: Art. 48 - 3 meses (90 dias)
  const indemnizacionConstitucional = round2(dailySalary * 90)

  // Indemnizacion por anos: Art. 50 - 12 dias/ano (reforma 2019)
  const indemnizacionAnual = round2(dailySalary * tenureYears * 12)

  // Prima de antiguedad: Art. 162 - 12 dias/ano (tope 2x salario minimo, no aplicado en MVP)
  const primaAntiguedad = round2(dailySalary * tenureYears * 12)

  // Indemnización total
  const totalIndemnizacion = round2(indemnizacionConstitucional + indemnizacionAnual + primaAntiguedad)

  // Aguinaldo: Art. 87 - 15 dias, proporcional
  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const aguinaldoDays = daysBetween(accrualStart, end)
  const aguinaldo = round2(dailySalary * 15 * (aguinaldoDays / 365))

  // Vacaciones: Arts. 76-80 - segun escala + prima vacacional 25%
  const vDays = vacationDaysByYear(tenureYears)
  const vacationPay = round2(dailySalary * Math.min(input.unusedVacationDays, vDays) * 1.25)

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion constitucional (3 meses)",
      amount: indemnizacionConstitucional,
      formula: `(${round2(dailySalary)} x 90 dias)`,
      legalReference: "LFT Art. 48 (indemnizacion constitucional)",
    },
    {
      label: "Indemnizacion por anos",
      amount: indemnizacionAnual,
      formula: `(${round2(dailySalary)} x ${round2(tenureYears)} anos x 12 dias)`,
      legalReference: "LFT Art. 50 (12 dias/ano, reforma 2019)",
    },
    {
      label: "Prima de antiguedad",
      amount: primaAntiguedad,
      formula: `(${round2(dailySalary)} x ${round2(tenureYears)} anos x 12 dias)`,
      legalReference: "LFT Art. 162 (12 dias/ano, tope 2x SM)",
    },
    {
      label: "Aguinaldo proporcional",
      amount: aguinaldo,
      formula: `(${round2(dailySalary)} x 15 dias x ${aguinaldoDays}/365)`,
      legalReference: "LFT Art. 87 (15 dias minimo)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${vDays} x 1.25)`,
      legalReference: "LFT Arts. 76-80 (escala + prima 25%)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "LFT (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones IMSS
  const { imssRate } = getMexicoLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const imss = round2(deductionBase * imssRate)

  const deductions: SettlementLine[] = [
    {
      label: "IMSS laboral",
      amount: imss,
      formula: `(${deductionBase} x ${(imssRate * 100).toFixed(1)}%)`,
      legalReference: "Ley del Seguro Social (tasa propuesta)",
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
