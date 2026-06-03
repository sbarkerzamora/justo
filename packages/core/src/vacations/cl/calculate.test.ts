import { describe, expect, test } from "bun:test"

import { calculateChileVacations } from "./calculate"

describe("calculateChileVacations", () => {
  test("seniority 15 years = 15 base + 1 extra", () => {
    const result = calculateChileVacations({
      countryCode: "cl",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
      seniorityYears: 15,
    })

    expect(result.currency).toBe("CLP")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(16.04)
    expect(result.pendingVacationDays).toBe(6.04)
    expect(result.amount).toBe(6040)
    expect(result.legalCorpusVersion).toBe("cl-v0.2.0")
  })

  test("seniority 5 years = 15 base, no extra", () => {
    const result = calculateChileVacations({
      countryCode: "cl",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
      seniorityYears: 5,
    })

    expect(result.accruedVacationDays).toBe(15.04)
  })
})
