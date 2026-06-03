export type ToolKind = "settlement" | "vacations"

export const stepOrder: FlowStep[] = [
  "employeeName",
  "employerName",
  "monthlySalary",
  "startDate",
  "endDate",
  "unusedVacationDays",
  "frequency",
  "confirm",
]

export type FlowStep =
  | "idle"
  | "employeeName"
  | "employerName"
  | "monthlySalary"
  | "startDate"
  | "endDate"
  | "unusedVacationDays"
  | "frequency"
  | "confirm"
  | "done"

export type EditMode = null | "salary" | "dates" | "vacations"

export type SettlementForm = {
  countryCode: string
  employeeName: string
  employerName: string
  monthlySalary: number
  frequency: "mensual" | "quincenal" | "semanal"
  unusedVacationDays: number
  startDate: string
  endDate: string
}

export type VacationFormData = {
  countryCode: string
  monthlySalary: number
  startDate: string
  endDate: string
  usedVacationDays: number
}

export type VacationApiResponse = {
  input: VacationFormData
  result: {
    currency: string
    accruedVacationDays: number
    usedVacationDays: number
    pendingVacationDays: number
    dailySalary: number
    amount: number
    formula: string
    legalReference: string
    legalCorpusVersion: string
    generatedAt: string
  }
}

export type BonusFormData = {
  countryCode: string
  monthlySalary: number
  startDate: string
  endDate: string
}

export type SettlementApiResponse = {
  input: SettlementForm
  result: {
    netTotal: number
    legalCorpusVersion: string
    incomes: {
      label: string
      amount: number
      formula: string
      legalReference: string
    }[]
    deductions: {
      label: string
      amount: number
      formula: string
      legalReference: string
    }[]
    grossIncome: number
    totalDeductions: number
  }
}
