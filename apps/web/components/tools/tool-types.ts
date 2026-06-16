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

export type TerminationFormData = {
  countryCode: string
  monthlySalary: number
  startDate: string
  endDate: string
}

export type ContractFormData = {
  countryCode: string
  celebrationPlace: string
  workerName: string
  workerId: string
  workerAddress: string
  employerName: string
  employerId: string
  employerRepresentative: string
  employerAddress: string
  jobTitle: string
  jobDescription: string
  workLocation: string
  jornada: "diurna" | "mixta" | "nocturna"
  contractType: "indeterminado" | "plazo_fijo" | "obra_determinada"
  startDate: string
  endDate?: string
  monthlySalary: number
  paymentFrequency: "mensual" | "quincenal" | "semanal"
  paymentMethod: "unidad_tiempo" | "destajo" | "comision" | "otro"
  trialPeriodDays?: number
}

export type PreavisoFormData = {
  countryCode: string
  monthlySalary: number
  tenureYears: number
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
