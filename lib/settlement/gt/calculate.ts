import { clamp, round2, daysBetween, startOfYear, formatTenure } from "@/lib/settlement/shared"
import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getGuatemalaLegalRates } from "@/lib/settlement/gt/legal-params"

const CURRENCY = "GTQ" as const
const LEGAL_CORPUS_VERSION = "gt-v0.1.0"

export const calculateGuatemalaSettlement = (
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

  // Indemnizacion: Art. 78 - 30 dias por ano, max 240 dias (8 meses)
  const baseIndemnizacionDays = tenureYears * 30
  const indemnizacionDays = round2(clamp(baseIndemnizacionDays, 0, 240))
  const indemnizacion = round2(dailySalary * indemnizacionDays)

  // Aguinaldo (Decreto 76-78): proporcional del ano en curso
  const aguinaldoAccrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const aguinaldoDays = daysBetween(aguinaldoAccrualStart, end)
  const aguinaldo = round2((input.monthlySalary * aguinaldoDays) / 365)

  // Bono 14 (Decreto 42-92): proporcional del ano en curso
  const bono14AccrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const bono14Days = daysBetween(bono14AccrualStart, end)
  const bono14 = round2((input.monthlySalary * bono14Days) / 365)

  // Vacaciones: Art. 130 - 15 dias por ano
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  // Salario proporcional del mes
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion",
      amount: indemnizacion,
      formula: `(${round2(dailySalary)} x ${indemnizacionDays} dias)`,
      legalReference: "Codigo de Trabajo Arts. 78-82 (30 dias por ano, max 8 meses)",
    },
    {
      label: "Aguinaldo proporcional",
      amount: aguinaldo,
      formula: `(${input.monthlySalary} x ${aguinaldoDays} / 365)`,
      legalReference: "Decreto 76-78 (proporcional segun tiempo laborado)",
    },
    {
      label: "Bono 14 proporcional",
      amount: bono14,
      formula: `(${input.monthlySalary} x ${bono14Days} / 365)`,
      legalReference: "Decreto 42-92 (proporcional segun tiempo laborado)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "Codigo de Trabajo Art. 130 (15 dias habiles por ano)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Codigo de Trabajo Arts. 68-76 (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  const { igssRate, isrRate } = getGuatemalaLegalRates()

  // Deducciones IGSS: se aplica sobre salario proporcional + vacaciones
  const igssBase = round2(proportionalSalary + vacationPay)
  const igss = round2(igssBase * igssRate)

  // ISR simplificado: base = ingresos totales - IGSS - aguinaldo (exento) - bono14 (exento)
  const isrBase = round2(grossIncome - igss - aguinaldo - bono14)
  const isr = round2(Math.max(0, isrBase) * isrRate)

  const deductions: SettlementLine[] = [
    {
      label: "IGSS laboral",
      amount: igss,
      formula: `(${igssBase} x ${(igssRate * 100).toFixed(2)}%)`,
      legalReference: "Ley del IGSS + Acuerdo 1124",
    },
    {
      label: "ISR estimado",
      amount: isr,
      formula: `(max(${isrBase}, 0) x ${(isrRate * 100).toFixed(0)}%)`,
      legalReference: "Ley del ISR (tasa simplificada propuesta)",
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
