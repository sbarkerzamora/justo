import { describe, expect, test } from "bun:test"

import { calculateMexicoVacations } from "./calculate"

describe("calculateMexicoVacations", () => {
  test("seniority 3 years = 10 days + 25% prima", () => {
    const result = calculateMexicoVacations({
      countryCode: "mx",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
      seniorityYears: 3,
    })

    expect(result.currency).toBe("MXN")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(10.03)
    expect(result.pendingVacationDays).toBe(0.03)
    expect(result.amount).toBe(37.5)
    expect(result.legalCorpusVersion).toBe("mx-v0.2.0")
  })

  test("seniority 1 year = 6 days, no pending days", () => {
    const result = calculateMexicoVacations({
      countryCode: "mx",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
      seniorityYears: 1,
    })

    expect(result.accruedVacationDays).toBe(6.02)
    expect(result.pendingVacationDays).toBe(0)
    expect(result.amount).toBe(0)
  })
})
