import { round2 } from "../settlement"
import type { CurrencyCode } from "../settlement"
import type { SalaryNetInput, SalaryNetLine, SalaryNetResult } from "./types"

interface SsDeductionSpec {
  label: string
  rate: number
  legalReference: string
  /** Optional maximum monthly base for the deduction (e.g., UF cap in Chile, ANSES tope in AR) */
  maxBase?: number
}

export interface IrBracket {
  from: number
  rate: number
}

export interface IrDeductionSpec {
  label: string
  legalReference: string
  source: "corpus" | "estimated"
  rate?: number
  brackets?: IrBracket[]
  /** Annual allowance subtracted from taxable base before brackets are applied (e.g., 5 UIT in PE) */
  annualAllowance?: number
}

function calculateAnnualProgressiveIr(annualBase: number, brackets: IrBracket[]): number {
  let annualIr = 0

  for (let i = 0; i < brackets.length; i++) {
    const lower = brackets[i].from
    const upper = i < brackets.length - 1 ? brackets[i + 1].from : Infinity
    const taxableInBracket = Math.max(0, Math.min(annualBase, upper) - lower)
    annualIr += taxableInBracket * brackets[i].rate
  }

  return round2(annualIr)
}

export function buildNetSalary(
  input: SalaryNetInput,
  currency: CurrencyCode,
  corpusVersion: string,
  ssDeductions: SsDeductionSpec[],
  ir?: IrDeductionSpec,
): SalaryNetResult {
  if (input.grossSalary <= 0) {
    throw new Error("El salario bruto debe ser positivo")
  }

  const frequency = input.frequency
  const gross = frequency === "semanal"
    ? round2(input.grossSalary * 4.33)
    : frequency === "quincenal"
      ? round2(input.grossSalary * 2)
      : input.grossSalary

  const lines: SalaryNetLine[] = []
  let totalSs = 0

  for (const d of ssDeductions) {
    const base = d.maxBase !== undefined ? Math.min(gross, d.maxBase) : gross
    const amount = round2(base * d.rate)
    totalSs += amount
    lines.push({
      label: d.label,
      amount,
      formula: d.maxBase !== undefined
        ? `(min(${gross}, ${d.maxBase}) x ${d.rate * 100}%)`
        : `(${gross} x ${d.rate * 100}%)`,
      legalReference: d.legalReference,
    })
  }

  totalSs = round2(totalSs)

  if (ir) {
    const irBase = round2(gross - totalSs)

    if (ir.brackets && ir.brackets.length > 0) {
      const annualBase = round2(Math.max(0, irBase * 12 - (ir.annualAllowance ?? 0)))
      const annualIr = calculateAnnualProgressiveIr(annualBase, ir.brackets)
      const irAmount = round2(annualIr / 12)

      if (irAmount > 0) {
        lines.push({
          label: ir.label,
          amount: irAmount,
          formula: "ISR progresivo sobre base anual",
          legalReference: ir.legalReference,
        })
      }
    } else if (ir.rate !== undefined) {
      const irAmount = round2(Math.max(0, irBase) * ir.rate)

      if (irAmount > 0) {
        lines.push({
          label: ir.label,
          amount: irAmount,
          formula: `max((${gross} - ${totalSs}), 0) x ${ir.rate * 100}%`,
          legalReference: ir.legalReference,
        })
      }
    }
  }

  const totalDeductions = round2(lines.reduce((s, l) => s + l.amount, 0))
  const netMensual = round2(gross - totalDeductions)
  const netQuincenal = round2(netMensual / 2)
  const netSemanal = round2((netMensual * 12) / 52)

  return {
    currency,
    grossSalary: gross,
    deductions: lines,
    totalDeductions,
    netSalary: netMensual,
    netSalaryPerPeriod: { mensual: netMensual, quincenal: netQuincenal, semanal: netSemanal },
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: corpusVersion,
  }
}
