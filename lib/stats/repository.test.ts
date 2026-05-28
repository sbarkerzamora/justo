import { describe, it, expect } from "bun:test"
import type { AnonymousSettlementRecord } from "@/lib/stats/types"

const record: AnonymousSettlementRecord = {
  id: "test-001",
  countryCode: "ni",
  monthlySalary: 10000,
  frequency: "mensual",
  tenureDays: 365,
  unusedVacationDays: 5,
  terminationType: "despido_injustificado",
  grossIncome: 30000,
  totalDeductions: 1875,
  netTotal: 28125,
  currency: "NIO",
  legalCorpusVersion: "ni-v0.2.0",
  timestamp: Date.now(),
}

describe("AnonymousSettlementRecord type", () => {
  it("validates required fields", () => {
    expect(record.id).toBe("test-001")
    expect(record.countryCode).toBe("ni")
    expect(record.monthlySalary).toBe(10000)
    expect(record.frequency).toBe("mensual")
    expect(record.tenureDays).toBe(365)
    expect(record.grossIncome).toBe(30000)
    expect(record.totalDeductions).toBe(1875)
    expect(record.netTotal).toBe(28125)
  })

  it("does not contain PII fields", () => {
    const keys = Object.keys(record)
    const hasName = keys.includes("employeeName") || keys.includes("employerName")
    expect(hasName).toBe(false)
  })

  it("supports optional terminationType", () => {
    const withoutType: AnonymousSettlementRecord = {
      ...record,
      terminationType: undefined,
    }
    expect(withoutType.terminationType).toBeUndefined()
  })
})

describe("CountryStats type", () => {
  it("empty stats have zero values", () => {
    const empty = {
      countryCode: "ni" as const,
      totalSettlements: 0,
      byTerminationType: {},
      byFrequency: {},
      salary: { min: 0, p25: 0, p50: 0, p75: 0, p90: 0, max: 0 },
      tenure: { min: 0, p25: 0, p50: 0, p75: 0, p90: 0, max: 0 },
      net: { min: 0, p25: 0, p50: 0, p75: 0, p90: 0, max: 0 },
      legalCorpusVersion: "",
    }

    expect(empty.totalSettlements).toBe(0)
    expect(empty.salary.p50).toBe(0)
  })
})
