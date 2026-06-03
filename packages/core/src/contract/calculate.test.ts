import { describe, expect, test } from "bun:test"
import {
  assembleNicaraguaContract,
  assembleElSalvadorContract,
  assembleGuatemalaContract,
  assembleHondurasContract,
  assembleCostaRicaContract,
  assemblePanamaContract,
  assembleMexicoContract,
  assembleColombiaContract,
  assemblePeruContract,
  assembleArgentinaContract,
  assembleChileContract,
} from "./index"
import { contractInputSchema } from "./schema"
import type { ContractInput } from "./types"

const buildInput = (cc: ContractInput["countryCode"]): ContractInput => ({
  countryCode: cc,
  celebrationPlace: "Managua",
  workerName: "Juan Pérez",
  workerId: "001-123456-7890",
  workerAddress: "Managua, Distrito I",
  employerName: "Empresa S.A.",
  employerId: "J123456789",
  employerRepresentative: "María García",
  employerAddress: "Managua, Carretera Masaya",
  jobTitle: "Asistente administrativo",
  jobDescription: "Atención al cliente, archivo de documentos y elaboración de reportes",
  workLocation: "Managua",
  jornada: "diurna",
  contractType: "indeterminado",
  startDate: "2025-01-01",
  monthlySalary: 15000,
  paymentFrequency: "mensual",
  paymentMethod: "unidad_tiempo",
})

const niInput = buildInput("ni")

const assemblers: { name: string; fn: (i: ContractInput) => ReturnType<typeof assembleNicaraguaContract>; cc: string; currency: string }[] = [
  { name: "Nicaragua", fn: assembleNicaraguaContract, cc: "ni", currency: "NIO" },
  { name: "El Salvador", fn: assembleElSalvadorContract, cc: "sv", currency: "USD" },
  { name: "Guatemala", fn: assembleGuatemalaContract, cc: "gt", currency: "GTQ" },
  { name: "Honduras", fn: assembleHondurasContract, cc: "hn", currency: "HNL" },
  { name: "Costa Rica", fn: assembleCostaRicaContract, cc: "cr", currency: "CRC" },
  { name: "Panamá", fn: assemblePanamaContract, cc: "pa", currency: "USD" },
  { name: "México", fn: assembleMexicoContract, cc: "mx", currency: "MXN" },
  { name: "Colombia", fn: assembleColombiaContract, cc: "co", currency: "COP" },
  { name: "Perú", fn: assemblePeruContract, cc: "pe", currency: "PEN" },
  { name: "Argentina", fn: assembleArgentinaContract, cc: "ar", currency: "ARS" },
  { name: "Chile", fn: assembleChileContract, cc: "cl", currency: "CLP" },
]

describe("contract assembly - all countries", () => {
  for (const { name, fn, cc, currency } of assemblers) {
    test(`${name} builds contract with correct currency and 8+ sections`, () => {
      const result = fn(buildInput(cc as ContractInput["countryCode"]))
      expect(result.currency).toBe(currency as any)
      expect(result.countryCode).toBe(cc as any)
      expect(result.sections.length).toBeGreaterThanOrEqual(8)
      expect(result.workerName).toBe("Juan Pérez")
      expect(result.monthlySalary).toBe(15000)
    })

    test(`${name} includes legal corpus version`, () => {
      const result = fn(buildInput(cc as ContractInput["countryCode"]))
      expect(result.legalCorpusVersion).toBeTruthy()
      expect(result.generatedAt).toBeTruthy()
    })
  }
})

describe("contract assembly - specific features", () => {
  test("Nicaragua specific: 8 sections", () => {
    const result = assembleNicaraguaContract(niInput)
    expect(result.sections).toHaveLength(8)
  })

  test("Mexico includes training clause", () => {
    const result = assembleMexicoContract(buildInput("mx"))
    const hasTraining = result.sections.some(
      (s) => s.title.includes("CAPACITACIÓN"),
    )
    expect(hasTraining).toBe(true)
    expect(result.sections.length).toBeGreaterThan(8)
  })

  test("includes trial period when provided", () => {
    const input = { ...niInput, trialPeriodDays: 30 }
    const result = assembleNicaraguaContract(input)
    expect(result.trialPeriodDays).toBe(30)
  })

  test("sets endDate for fixed-term contracts", () => {
    const input = {
      ...niInput,
      contractType: "plazo_fijo" as const,
      endDate: "2025-12-31",
    }
    const result = assembleNicaraguaContract(input)
    expect(result.endDate).toBe("2025-12-31")
  })
})

describe("contract schema", () => {
  test("validates correct input", () => {
    const parsed = contractInputSchema.safeParse(niInput)
    expect(parsed.success).toBe(true)
  })

  test("rejects missing required fields", () => {
    const parsed = contractInputSchema.safeParse({ countryCode: "ni" })
    expect(parsed.success).toBe(false)
  })

  test("rejects invalid country code", () => {
    const parsed = contractInputSchema.safeParse({
      ...niInput,
      countryCode: "xx",
    })
    expect(parsed.success).toBe(false)
  })

  test("accepts all 11 country codes", () => {
    const codes = ["ni", "sv", "gt", "hn", "cr", "pa", "mx", "co", "pe", "ar", "cl"]
    for (const cc of codes) {
      const parsed = contractInputSchema.safeParse({
        ...niInput,
        countryCode: cc,
      })
      expect(parsed.success).toBe(true)
    }
  })
})
