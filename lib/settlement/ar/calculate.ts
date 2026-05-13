import { clamp, round2, daysBetween, startOfYear, formatTenure } from "@/lib/settlement/shared"
import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getArgentinaLegalRates } from "@/lib/settlement/ar/legal-params"

const CURRENCY = "ARS" as const
const LEGAL_CORPUS_VERSION = "ar-v0.1.0"

const vacationDaysByYear = (years: number): number => {
  if (years < 5) return 14
  if (years < 10) return 21
  if (years < 20) return 28
  return 35
}

export const calculateArgentinaSettlement = (
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

  // Indemnizacion: Art. 245 - 1 mes por ano
  const indemnizacion = round2(input.monthlySalary * tenureYears)

  // Preaviso: Art. 231 - 1 mes (≤5a) o 2 meses (>5a)
  const preavisoDias = tenureYears > 5 ? 60 : 30
  const preaviso = round2(dailySalary * preavisoDias)

  // SAC/Aguinaldo: Ley 23.041 - 50% mejor salario del semestre
  const semesterMonths = end.getUTCMonth() < 6 ? "first" : "second"
  const semesterStart = semesterMonths === "first"
    ? new Date(Date.UTC(end.getUTCFullYear(), 0, 1))
    : new Date(Date.UTC(end.getUTCFullYear(), 6, 1))
  const sacDays = daysBetween(semesterStart, end)
  const sacSemesterDays = semesterMonths === "first" ? 181 : 184
  const sac = round2((input.monthlySalary * 0.5) * (sacDays / sacSemesterDays))

  // Vacaciones: Arts. 150-155 - escala 14-35d, pago ÷25
  const vDays = vacationDaysByYear(tenureYears)
  const vacationDailyRate = input.monthlySalary / 25
  const vacationPay = round2(vacationDailyRate * Math.min(input.unusedVacationDays, vDays))

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion (Art. 245)",
      amount: indemnizacion,
      formula: `(${input.monthlySalary} x ${round2(tenureYears)} anos)`,
      legalReference: "LCT Art. 245 (1 mes/ano)",
    },
    {
      label: "Preaviso",
      amount: preaviso,
      formula: `(${round2(dailySalary)} x ${preavisoDias} dias)`,
      legalReference: "LCT Arts. 231-232",
    },
    {
      label: "SAC / Aguinaldo",
      amount: sac,
      formula: `(${input.monthlySalary} x 50% x ${sacDays}/${sacSemesterDays})`,
      legalReference: "Ley 23.041 (50% mejor salario semestre)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(vacationDailyRate)} x ${input.unusedVacationDays} dias)`,
      legalReference: "LCT Arts. 150-155 (salario/25 por dia)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "LCT (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones: Jubilacion 11% + PAMI 3% + Obra Social 3%
  const { jubilacionRate, pamiRate, obraSocialRate } = getArgentinaLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const jubilacion = round2(deductionBase * jubilacionRate)
  const pami = round2(deductionBase * pamiRate)
  const obraSocial = round2(deductionBase * obraSocialRate)

  const deductions: SettlementLine[] = [
    {
      label: "Jubilacion (SIPA)",
      amount: jubilacion,
      formula: `(${deductionBase} x ${(jubilacionRate * 100).toFixed(0)}%)`,
      legalReference: "Ley 24.241 (11%)",
    },
    {
      label: "PAMI",
      amount: pami,
      formula: `(${deductionBase} x ${(pamiRate * 100).toFixed(0)}%)`,
      legalReference: "Ley 19.032 (3%)",
    },
    {
      label: "Obra Social",
      amount: obraSocial,
      formula: `(${deductionBase} x ${(obraSocialRate * 100).toFixed(0)}%)`,
      legalReference: "Ley 23.660 (3%)",
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
