import type { SettlementInput, SettlementLine, SettlementResult } from "./types"

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export const round2 = (value: number) => Math.round(value * 100) / 100

export const daysBetween = (start: Date, end: Date) =>
  Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  )

export const startOfYear = (date: Date) =>
  new Date(Date.UTC(date.getUTCFullYear(), 0, 1))

export const formatTenure = (totalDays: number) => {
  const years = Math.floor(totalDays / 365)
  const months = Math.floor((totalDays % 365) / 30)
  const days = totalDays - years * 365 - months * 30
  return `${years} anos, ${months} meses, ${days} dias`
}

const normalized = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const isSeveranceLine = (line: SettlementLine) => {
  const label = normalized(line.label)
  return (
    label.includes("indemnizacion") ||
    label.includes("cesantia") ||
    label.includes("auxilio de cesantia")
  )
}

const isIncomeTaxLine = (line: SettlementLine) => {
  const label = normalized(line.label)
  return (
    label === "ir" ||
    label.includes("ir estimado") ||
    label.includes("isr") ||
    label.includes("impuesto") ||
    label.includes("renta")
  )
}

const shouldKeepCountrySpecificLine = (
  input: SettlementInput,
  line: SettlementLine
) => {
  const label = normalized(line.label)

  if (input.countryCode === "pa" && label.includes("prima de antiguedad")) {
    return true
  }

  if (
    input.countryCode === "gt" &&
    (input.terminationCause === "renuncia" ||
      input.terminationCause === "mutuo_acuerdo")
  ) {
    return true
  }

  return false
}

const settlementAdjustmentReference = (input: SettlementInput) => {
  const references: Record<SettlementInput["countryCode"], string> = {
    ni: "Ley 185: liquidacion final; monto ingresado por usuario",
    gt: "Codigo de Trabajo: liquidacion final; monto ingresado por usuario",
    hn: "Codigo de Trabajo: liquidacion final; monto ingresado por usuario",
    sv: "Codigo de Trabajo: liquidacion final; monto ingresado por usuario",
    cr: "Codigo de Trabajo: liquidacion final; monto ingresado por usuario",
    pa: "Codigo de Trabajo: liquidacion final; monto ingresado por usuario",
    mx: "LFT: finiquito/liquidacion; monto ingresado por usuario",
    co: "CST: liquidacion final; monto ingresado por usuario",
    pe: "Legislacion laboral: liquidacion final; monto ingresado por usuario",
    ar: "Ley 20.744: liquidacion final; monto ingresado por usuario",
    cl: "Codigo del Trabajo: finiquito; monto ingresado por usuario",
  }

  return references[input.countryCode]
}

const makeUserAmountLine = (
  label: string,
  amount: number,
  reference: string
): SettlementLine => ({
  label,
  amount: round2(amount),
  formula: "Monto ingresado por usuario",
  legalReference: reference,
})

export function applySettlementInputAdjustments(
  input: SettlementInput,
  result: SettlementResult
): SettlementResult {
  const terminationCause = input.terminationCause ?? "despido_injustificado"
  const contractType = input.contractType ?? "indeterminado"
  const shouldSuppressSeverance =
    contractType === "periodo_prueba" ||
    terminationCause !== "despido_injustificado"

  if (!shouldSuppressSeverance) {
    return applyExplicitSettlementAdjustments(input, result)
  }

  const incomes = result.incomes.filter((line) => {
    if (!isSeveranceLine(line)) return true
    return shouldKeepCountrySpecificLine(
      { ...input, terminationCause, contractType },
      line
    )
  })
  const deductions = result.deductions.filter((line) => !isIncomeTaxLine(line))

  const grossIncome = round2(
    incomes.reduce((sum, line) => sum + line.amount, 0)
  )
  const totalDeductions = round2(
    deductions.reduce((sum, line) => sum + line.amount, 0)
  )
  const netTotal = round2(grossIncome - totalDeductions)

  return applyExplicitSettlementAdjustments(input, {
    ...result,
    incomes,
    deductions,
    grossIncome,
    totalDeductions,
    netTotal,
  })
}

export function applyExplicitSettlementAdjustments(
  input: SettlementInput,
  result: SettlementResult
): SettlementResult {
  const reference = settlementAdjustmentReference(input)
  const incomes = [...result.incomes]
  const deductions = [...result.deductions]

  if (input.pendingSalaryAmount && input.pendingSalaryAmount > 0) {
    incomes.push(
      makeUserAmountLine(
        "Salario pendiente adicional",
        input.pendingSalaryAmount,
        reference
      )
    )
  }

  if (input.pendingOvertimeAmount && input.pendingOvertimeAmount > 0) {
    incomes.push(
      makeUserAmountLine(
        "Horas extra/comisiones pendientes",
        input.pendingOvertimeAmount,
        reference
      )
    )
  }

  if (input.pendingBonusAmount && input.pendingBonusAmount > 0) {
    incomes.push(
      makeUserAmountLine(
        "Prestaciones pendientes adicionales",
        input.pendingBonusAmount,
        reference
      )
    )
  }

  if (input.benefitsAlreadyPaidAmount && input.benefitsAlreadyPaidAmount > 0) {
    deductions.push(
      makeUserAmountLine(
        "Prestaciones ya pagadas",
        input.benefitsAlreadyPaidAmount,
        reference
      )
    )
  }

  if (input.otherDeductionsAmount && input.otherDeductionsAmount > 0) {
    deductions.push(
      makeUserAmountLine(
        "Otras deducciones autorizadas",
        input.otherDeductionsAmount,
        reference
      )
    )
  }

  const grossIncome = round2(
    incomes.reduce((sum, line) => sum + line.amount, 0)
  )
  const totalDeductions = round2(
    deductions.reduce((sum, line) => sum + line.amount, 0)
  )
  const netTotal = round2(grossIncome - totalDeductions)

  return {
    ...result,
    incomes,
    deductions,
    grossIncome,
    totalDeductions,
    netTotal,
  }
}
