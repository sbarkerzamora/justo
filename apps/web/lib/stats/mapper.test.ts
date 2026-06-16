import { describe, it, expect } from "bun:test"
import { buildAnonymousRecord } from "@/lib/stats/mapper"
import type { SettlementInput, SettlementResult } from "@justo/core"

function makeInput(overrides?: Partial<SettlementInput>): SettlementInput {
  return {
    countryCode: "ni",
    employeeName: "Trabajador de Prueba",
    employerName: "Empresa de Prueba",
    monthlySalary: 10000,
    frequency: "mensual",
    unusedVacationDays: 5,
    startDate: "2020-01-01",
    endDate: "2025-06-01",
    terminationCause: "despido_injustificado",
    contractType: "indeterminado",
    ...overrides,
  }
}

function makeResult(overrides?: Partial<SettlementResult>): SettlementResult {
  return {
    currency: "NIO",
    tenureDays: 1978,
    tenureText: "5 anos, 4 meses, 30 dias",
    incomes: [
      {
        label: "Indemnizacion",
        amount: 30000,
        formula: "(10000 x 3)",
        legalReference: "Ley 185 Art. 45",
      },
    ],
    deductions: [
      {
        label: "INSS",
        amount: 1875,
        formula: "(30000 x 0.0625)",
        legalReference: "Ley INSS",
      },
    ],
    grossIncome: 30000,
    totalDeductions: 1875,
    netTotal: 28125,
    generatedAt: new Date().toISOString(),
    legalCorpusVersion: "ni-v0.3.0",
    ...overrides,
  }
}

describe("buildAnonymousRecord", () => {
  it("strips employeeName and employerName", () => {
    const input = makeInput()
    const result = makeResult()
    const record = buildAnonymousRecord(input, result)

    expect("employeeName" in record).toBe(false)
    expect("employerName" in record).toBe(false)
  })

  it("derives tenureDays from startDate and endDate", () => {
    const input = makeInput({
      startDate: "2024-01-01",
      endDate: "2024-02-01",
    })
    const result = makeResult()
    const record = buildAnonymousRecord(input, result)

    expect(record.tenureDays).toBe(31)
  })

  it("generates a unique id", () => {
    const input = makeInput()
    const result = makeResult()

    const a = buildAnonymousRecord(input, result)
    const b = buildAnonymousRecord(input, result)

    expect(a.id).toBeTruthy()
    expect(b.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  it("preserves terminationType when provided", () => {
    const input = makeInput({ terminationType: "despido_injustificado" })
    const result = makeResult()
    const record = buildAnonymousRecord(input, result)

    expect(record.terminationType).toBe("despido_injustificado")
  })

  it("uses terminationCause when terminationType is not provided", () => {
    const input = makeInput()
    const result = makeResult()
    const record = buildAnonymousRecord(input, result)

    expect(record.terminationType).toBe("despido_injustificado")
  })

  it("copies numeric fields correctly", () => {
    const input = makeInput({ monthlySalary: 15000, unusedVacationDays: 10 })
    const result = makeResult({
      grossIncome: 50000,
      totalDeductions: 5000,
      netTotal: 45000,
    })
    const record = buildAnonymousRecord(input, result)

    expect(record.monthlySalary).toBe(15000)
    expect(record.unusedVacationDays).toBe(10)
    expect(record.grossIncome).toBe(50000)
    expect(record.totalDeductions).toBe(5000)
    expect(record.netTotal).toBe(45000)
    expect(record.currency).toBe("NIO")
    expect(record.countryCode).toBe("ni")
    expect(record.frequency).toBe("mensual")
    expect(record.legalCorpusVersion).toBe("ni-v0.3.0")
  })

  it("sets timestamp to current time", () => {
    const before = Date.now()
    const record = buildAnonymousRecord(makeInput(), makeResult())
    const after = Date.now()

    expect(record.timestamp).toBeGreaterThanOrEqual(before)
    expect(record.timestamp).toBeLessThanOrEqual(after)
  })
})
