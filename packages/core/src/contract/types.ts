import type { CountryCode, CurrencyCode } from "../settlement"

export type JornadaType = "diurna" | "mixta" | "nocturna"

export type ContractType = "indeterminado" | "plazo_fijo" | "obra_determinada"

export type PaymentMethod = "unidad_tiempo" | "destajo" | "comision" | "otro"

export type PaymentFrequency = "mensual" | "quincenal" | "semanal"

export interface ContractInput {
  countryCode: CountryCode
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
  jornada: JornadaType
  contractType: ContractType
  startDate: string
  endDate?: string
  monthlySalary: number
  paymentFrequency: PaymentFrequency
  paymentMethod: PaymentMethod
  trialPeriodDays?: number
}

export interface ContractSection {
  title: string
  content: string
}

export interface ContractResult {
  celebrationPlace: string
  celebrationDate: string
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
  jornada: JornadaType
  contractType: ContractType
  startDate: string
  endDate?: string
  monthlySalary: number
  paymentFrequency: PaymentFrequency
  paymentMethod: PaymentMethod
  trialPeriodDays: number | null
  countryCode: CountryCode
  currency: CurrencyCode
  workerIdLabel: string
  employerIdLabel: string
  sections: ContractSection[]
  generatedAt: string
  legalCorpusVersion: string
}
