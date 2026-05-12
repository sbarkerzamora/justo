import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getElSalvadorLegalRates } from "@/lib/settlement/sv/legal-params"

const CURRENCY = "USD" as const
const LEGAL_CORPUS_VERSION = "sv-v0.1.0"

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

export const calculateElSalvadorSettlement = (
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

  // Indemnizacion (Cesantia): Art. 58 - 30 dias por ano, min 15 dias
  const baseIndemnizacionDays = tenureYears * 30
  const indemnizacionDays = round2(Math.max(baseIndemnizacionDays, 15))
  const indemnizacion = round2(dailySalary * indemnizacionDays)

  // Aguinaldo: Arts. 196-202 - escala segun antiguedad
  const tenureYearsFloat = tenureYears
  let aguinaldoBaseDays: number
  if (tenureYearsFloat >= 10) {
    aguinaldoBaseDays = 21
  } else if (tenureYearsFloat >= 3) {
    aguinaldoBaseDays = 19
  } else {
    aguinaldoBaseDays = 15
  }

  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const aguinaldoDays = daysBetween(accrualStart, end)
  const aguinaldo = round2(dailySalary * aguinaldoBaseDays * (aguinaldoDays / 365))

  // Vacaciones: Art. 177 - 15 dias + 30% prima
  // Al terminar relacion, se pagan las no gozadas (Art. 187)
  // Si las vacaciones no se han tomado en el periodo, se paga proporcional
  const vacationDaysPerYear = 15
  const vacationPremium = 0.30
  const vacationPay = round2(dailySalary * input.unusedVacationDays * (1 + vacationPremium))

  // Salario proporcional del mes
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion",
      amount: indemnizacion,
      formula: `(${round2(dailySalary)} x ${indemnizacionDays} dias)`,
      legalReference: "Codigo de Trabajo Arts. 58 y 59 (30 dias/ano, min 15 dias)",
    },
    {
      label: "Aguinaldo proporcional",
      amount: aguinaldo,
      formula: `(${round2(dailySalary)} x ${aguinaldoBaseDays} dias escala x ${aguinaldoDays}/365)`,
      legalReference: "Codigo de Trabajo Arts. 196-202 (escala 15/19/21 dias)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays} x 1.30)`,
      legalReference: "Codigo de Trabajo Arts. 177 y 187 (15 dias + 30% prima)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Codigo de Trabajo (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones ISSS + AFP
  const { isssRate, afpRate } = getElSalvadorLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const isss = round2(deductionBase * isssRate)
  const afp = round2(deductionBase * afpRate)

  const deductions: SettlementLine[] = [
    {
      label: "ISSS laboral",
      amount: isss,
      formula: `(${deductionBase} x ${(isssRate * 100).toFixed(1)}%)`,
      legalReference: "Ley del Seguro Social (tasa propuesta)",
    },
    {
      label: "AFP laboral",
      amount: afp,
      formula: `(${deductionBase} x ${(afpRate * 100).toFixed(1)}%)`,
      legalReference: "Ley del SAP - Decreto 927 (tasa propuesta)",
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
