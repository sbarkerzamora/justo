export type PayrollFrequency = "mensual" | "quincenal" | "semanal"

export interface SettlementInput {
  countryCode: "ni"
  employeeName: string
  employerName: string
  monthlySalary: number
  frequency: PayrollFrequency
  unusedVacationDays: number
  startDate: string
  endDate: string
}

export interface SettlementLine {
  label: string
  amount: number
  formula: string
  legalReference: string
}

export interface SettlementResult {
  currency: "NIO"
  tenureDays: number
  tenureText: string
  incomes: SettlementLine[]
  deductions: SettlementLine[]
  grossIncome: number
  totalDeductions: number
  netTotal: number
  generatedAt: string
  legalCorpusVersion: string
}
