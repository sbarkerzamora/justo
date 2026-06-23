export type ToolKind = "settlement" | "vacations"

export const stepOrder: FlowStep[] = [
  "employeeName",
  "employerName",
  "monthlySalary",
  "startDate",
  "endDate",
  "unusedVacationDays",
  "frequency",
  "terminationCause",
  "contractType",
  "pensionSystem",
  "adjustments",
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
  | "terminationCause"
  | "contractType"
  | "pensionSystem"
  | "adjustments"
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
  terminationCause:
    | "renuncia"
    | "despido_justificado"
    | "despido_injustificado"
    | "mutuo_acuerdo"
    | "fin_plazo"
    | "obra_terminada"
    | "jubilacion"
    | "fallecimiento"
  contractType:
    | "indeterminado"
    | "plazo_fijo"
    | "obra_determinada"
    | "temporada"
    | "periodo_prueba"
  pendingSalaryAmount?: number
  pendingOvertimeAmount?: number
  pendingBonusAmount?: number
  benefitsAlreadyPaidAmount?: number
  otherDeductionsAmount?: number
  pensionSystem?: "afp" | "onp"
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
  terminationCause:
    | "renuncia"
    | "despido_justificado"
    | "despido_injustificado"
    | "mutuo_acuerdo"
    | "fin_plazo"
    | "obra_terminada"
    | "jubilacion"
    | "fallecimiento"
  contractType:
    | "indeterminado"
    | "plazo_fijo"
    | "obra_determinada"
    | "temporada"
    | "periodo_prueba"
  noticeGivenInWriting?: boolean
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
  terminationCause:
    | "renuncia"
    | "despido_justificado"
    | "despido_injustificado"
    | "mutuo_acuerdo"
    | "fin_plazo"
    | "obra_terminada"
    | "jubilacion"
    | "fallecimiento"
  contractType:
    | "indeterminado"
    | "plazo_fijo"
    | "obra_determinada"
    | "temporada"
    | "periodo_prueba"
  noticeGivenInWriting: boolean
  noticeDaysGiven?: number
  replaceNoticeWithPayment: boolean
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
