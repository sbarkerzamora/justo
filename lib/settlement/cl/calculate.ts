import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getChileLegalRates } from "@/lib/settlement/cl/legal-params"

const CURRENCY = "CLP" as const
const LEGAL_CORPUS_VERSION = "cl-v0.1.0"

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

export const calculateChileSettlement = (
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

  // Indemnizacion: Art. 163 - 30d/ano, max 330d (11 anos)
  const indemnizacionAnos = round2(dailySalary * Math.min(tenureYears, 11) * 30)

  // Aviso sustitutivo: Art. 161-162 - 1 mes
  const avisoSustitutivo = input.monthlySalary

  // Vacaciones: Arts. 67-68 - 15d + feriado progresivo (+1d/3a desde 10a)
  const feriadoProgresivo = Math.max(0, Math.floor((tenureYears - 10) / 3))
  const vacacionesEscala = 15 + feriadoProgresivo
  const vacationPay = round2(dailySalary * Math.min(input.unusedVacationDays, vacacionesEscala))

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Indemnizacion (Art. 163)",
      amount: indemnizacionAnos,
      formula: `(${round2(dailySalary)} x ${round2(Math.min(tenureYears, 11))} anos x 30d)`,
      legalReference: "Codigo del Trabajo Art. 163 (max 330 dias)",
    },
    {
      label: "Aviso sustitutivo",
      amount: avisoSustitutivo,
      formula: `(${input.monthlySalary} x 1 mes)`,
      legalReference: "Codigo del Trabajo Arts. 161-162",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays} dias)`,
      legalReference: "Codigo del Trabajo Arts. 67-73 (15d + feriado progresivo)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Codigo del Trabajo (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones: AFP 11.5% + Salud 7% + AFC 0.6%
  const { afpRate, saludRate, afcRate } = getChileLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const afp = round2(deductionBase * afpRate)
  const salud = round2(deductionBase * saludRate)
  const afc = round2(deductionBase * afcRate)

  const deductions: SettlementLine[] = [
    {
      label: "AFP",
      amount: afp,
      formula: `(${deductionBase} x ${(afpRate * 100).toFixed(1)}%)`,
      legalReference: "D.L. 3.500 (10% + comision ~1.5%)",
    },
    {
      label: "Salud (FONASA/ISAPRE)",
      amount: salud,
      formula: `(${deductionBase} x ${(saludRate * 100).toFixed(0)}%)`,
      legalReference: "Ley 18.933 (7%)",
    },
    {
      label: "AFC (Seguro Cesantia)",
      amount: afc,
      formula: `(${deductionBase} x ${(afcRate * 100).toFixed(1)}%)`,
      legalReference: "Ley 19.728 (0.6% trabajador)",
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
