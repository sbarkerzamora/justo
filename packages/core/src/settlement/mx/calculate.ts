import { clamp, round2, daysBetween, startOfYear, formatTenure } from "../shared"
import { getMinimumWage } from "../../shared"
import { SettlementInput, SettlementLine, SettlementResult } from "../types"
import { getMexicoLegalRates } from "./legal-params"

const CURRENCY = "MXN" as const
const LEGAL_CORPUS_VERSION = "mx-v0.3.0"

const vacationDaysByYear = (years: number): number => {
  if (years < 1) return Math.round(years * 6)
  if (years === 1) return 6
  if (years < 5) return 6 + (years - 1) * 2
  const extraQuinquennia = Math.floor((years - 4) / 5)
  return 12 + extraQuinquennia * 2
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

  // Prima de antiguedad: Art. 162 - 12 dias/ano, tope 2x salario minimo
  const mxMinWage = getMinimumWage("mx", input.endDate)
  if (!mxMinWage) throw new Error("No hay salario mínimo MX para la fecha indicada")
  const cappedDailySalary = Math.min(dailySalary, mxMinWage.daily * 2)
  const primaAntiguedad = round2(cappedDailySalary * tenureYears * 12)

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
      formula: `(${round2(cappedDailySalary)} x ${round2(tenureYears)} anos x 12 dias, tope 2x SM)`,
      legalReference: `LFT Art. 162 (12 dias/ano, tope 2x SM CONASAMI ${mxMinWage.year})`,
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
  const { imssRate, irFlatRate } = getMexicoLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const imss = round2(deductionBase * imssRate)
  const ir = round2(Math.max(0, grossIncome - imss) * irFlatRate)

  const deductions: SettlementLine[] = [
    {
      label: "IMSS laboral",
      amount: imss,
      formula: `(${deductionBase} x ${(imssRate * 100).toFixed(1)}%)`,
      legalReference: "Ley del Seguro Social (tasa propuesta)",
    },
    {
      label: "IR",
      amount: ir,
      formula: `max(0, ${grossIncome} - ${imss}) x ${(irFlatRate * 100).toFixed(2)}%`,
      legalReference: "LISR (tasa minima)",
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
