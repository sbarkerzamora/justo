import { SettlementInput, SettlementLine, SettlementResult } from "@/lib/settlement/types"
import { getCostaRicaLegalRates } from "@/lib/settlement/cr/legal-params"

const CURRENCY = "CRC" as const
const LEGAL_CORPUS_VERSION = "cr-v0.1.0"

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const round2 = (value: number) => Math.round(value * 100) / 100

const daysBetween = (start: Date, end: Date) =>
  Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

const startOfYear = (date: Date) => new Date(Date.UTC(date.getUTCFullYear(), 0, 1))

const tenureMonths = (totalDays: number) => Math.floor(totalDays / 30)

const formatTenure = (totalDays: number) => {
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays - years * 365 - months * 30
  return `${years} anos, ${months} meses, ${days} dias`
}

export const calculateCostaRicaSettlement = (
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
  const totalMonths = tenureMonths(tenureDays)

  // Cesantia: Art. 29 - ~20 dias/ano, max 8 anos
  const cesantiaDays = round2(Math.min(tenureYears * 20, 160))
  const cesantia = round2(dailySalary * cesantiaDays)

  // Preaviso: Art. 28
  let preavisoDays: number
  if (tenureDays < 90) {
    preavisoDays = 0
  } else if (tenureDays < 180) {
    preavisoDays = 7
  } else if (tenureDays < 365) {
    preavisoDays = 15
  } else {
    preavisoDays = 30
  }
  const preaviso = round2(dailySalary * preavisoDays)

  // Aguinaldo: Ley 2412 - 1/12 anual, proporcional
  const accrualStart = start > startOfYear(end) ? start : startOfYear(end)
  const aguinaldoDays = daysBetween(accrualStart, end)
  const aguinaldo = round2((input.monthlySalary * aguinaldoDays) / 365)

  // Vacaciones: Art. 153 - 14 dias/50 semanas
  const vacationPay = round2(dailySalary * input.unusedVacationDays)

  // Salario proporcional
  const proportionalSalaryDays = clamp(end.getUTCDate(), 1, 30)
  const proportionalSalary = round2(dailySalary * proportionalSalaryDays)

  const incomes: SettlementLine[] = [
    {
      label: "Cesantia",
      amount: cesantia,
      formula: `(${round2(dailySalary)} x ${cesantiaDays} dias)`,
      legalReference: "Codigo de Trabajo Art. 29 (~20 dias/ano, max 8 anos)",
    },
    {
      label: "Preaviso",
      amount: preaviso,
      formula: `(${round2(dailySalary)} x ${preavisoDays} dias)`,
      legalReference: "Codigo de Trabajo Art. 28",
    },
    {
      label: "Aguinaldo proporcional",
      amount: aguinaldo,
      formula: `(${input.monthlySalary} x ${aguinaldoDays} / 365)`,
      legalReference: "Ley No. 2412 (1/12 de salarios anuales)",
    },
    {
      label: "Vacaciones pendientes",
      amount: vacationPay,
      formula: `(${round2(dailySalary)} x ${input.unusedVacationDays})`,
      legalReference: "Codigo de Trabajo Arts. 153 y 156 (14 dias/50 semanas)",
    },
    {
      label: "Salario proporcional",
      amount: proportionalSalary,
      formula: `(${round2(dailySalary)} x ${proportionalSalaryDays} dias)`,
      legalReference: "Codigo de Trabajo (salario del mes en curso)",
    },
  ]

  const grossIncome = round2(incomes.reduce((sum, line) => sum + line.amount, 0))

  // Deducciones CCSS
  const { ccssRate } = getCostaRicaLegalRates()
  const ccssBase = round2(proportionalSalary + vacationPay)
  const ccss = round2(ccssBase * ccssRate)

  const deductions: SettlementLine[] = [
    {
      label: "CCSS laboral",
      amount: ccss,
      formula: `(${ccssBase} x ${(ccssRate * 100).toFixed(1)}%)`,
      legalReference: "Ley No. 17 (Ley Constitutiva de la CCSS)",
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
