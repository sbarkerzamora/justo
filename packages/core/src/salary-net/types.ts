import type { CountryCode, CurrencyCode, PayrollFrequency } from "../settlement"

export interface SalaryNetInput {
  countryCode: CountryCode
  grossSalary: number
  frequency: PayrollFrequency
  pensionSystem?: "afp" | "onp"
}

export interface SalaryNetLine {
  label: string
  amount: number
  formula: string
  legalReference: string
}

export interface NetPerPeriod {
  mensual: number
  quincenal: number
  semanal: number
}

export interface SalaryNetResult {
  currency: CurrencyCode
  grossSalary: number
  deductions: SalaryNetLine[]
  totalDeductions: number
  netSalary: number
  netSalaryPerPeriod: NetPerPeriod
  generatedAt: string
  legalCorpusVersion: string
}
