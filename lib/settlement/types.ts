export type PayrollFrequency = "mensual" | "quincenal" | "semanal"

export type CountryCode = "ni" | "gt" | "hn" | "sv" | "cr" | "pa"

export type CurrencyCode = "NIO" | "GTQ" | "HNL" | "USD" | "CRC"

export interface SettlementInput {
  countryCode: CountryCode
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
  currency: CurrencyCode
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
