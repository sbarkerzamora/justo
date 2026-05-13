import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getColombiaLegalRates } from "@/lib/settlement/co/legal-params"

const CURRENCY = "COP" as const
const LEGAL_CORPUS_VERSION = "co-v0.1.0"

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

export const calculateColombiaSettlement = (
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

  // Cesantia: Art. 249 - 30 dias por ano
  const cesantia = round2(dailySalary * tenureYears * 30)

  // Intereses a las cesantias: Ley 52/1975 - 12% anual
  const interesesCesantia = round2(cesantia * 0.12 * Math.min(tenureYears, 1))

  // Indemnizacion: Art. 64 - <10 SMMLV: 30d 1er ano + 20d adicionales
  const indemnizacionDias = 30 + Math.max(0, tenureYears - 1) * 20
  const indemnizacion = round2(dailySalary * indemnizacionDias)

  // Prima de servicios: Art. 306 - 30 dias/ano
  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const primaDays = daysBetween(accrualStart, end)
  const primaServicios = round2(dailySalary * 30 * (primaDays / 365))

  // Vacaciones: Art. 186 - 15 dias habiles
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Cesantia",
      amount: cesantia,
      formula: `(${round2(dailySalary)} x ${round2(tenureYears)} anos x 30 dias)`,
      legalReference: "CST Art. 249 (1 mes/ano)",
    },
    {
      label: "Intereses a las cesantias",
      amount: interesesCesantia,
      formula: `(${cesantia} x 12%)`,
      legalReference: "Ley 52 de 1975 (12% anual)",
    },
    {
      label: "Indemnizacion por despido",
      amount: indemnizacion,
      formula: `(${round2(dailySalary)} x ${indemnizacionDias} dias)`,
      legalReference: "CST Art. 64 (30d 1er ano + 20d/adicional)",
    },
    {
      label: "Prima de servicios",
      amount: primaServicios,
      formula: `(${round2(dailySalary)} x 30d x ${primaDays}/365)`,
      legalReference: "CST Art. 306 (30 dias/ano)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "CST Arts. 186 y 189 (15 dias habiles/ano)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "CST (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones EPS + Pension
  const { epsRate, pensionRate } = getColombiaLegalRates()
  const deductionBase = round2(proportionalSalary + vacationPay)
  const eps = round2(deductionBase * epsRate)
  const pension = round2(deductionBase * pensionRate)

  const deductions: SettlementLine[] = [
    {
      label: "EPS (salud)",
      amount: eps,
      formula: `(${deductionBase} x ${(epsRate * 100).toFixed(0)}%)`,
      legalReference: "Ley 100 de 1993 (4% salud)",
    },
    {
      label: "Pension (AFP)",
      amount: pension,
      formula: `(${deductionBase} x ${(pensionRate * 100).toFixed(0)}%)`,
      legalReference: "Ley 100 de 1993 (4% pension)",
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
