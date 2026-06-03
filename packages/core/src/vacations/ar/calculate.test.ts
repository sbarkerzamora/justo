import { describe, expect, test } from "bun:test"

import { calculateArgentinaVacations } from "./calculate"

describe("calculateArgentinaVacations", () => {
  test("seniority 7 years = 21 days, divisor 25", () => {
    const result = calculateArgentinaVacations({
      countryCode: "ar",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
      seniorityYears: 7,
    })

    expect(result.currency).toBe("ARS")
    expect(result.dailySalary).toBe(1200)
    expect(result.accruedVacationDays).toBe(21.06)
    expect(result.pendingVacationDays).toBe(11.06)
    expect(result.amount).toBe(13272)
    expect(result.legalCorpusVersion).toBe("ar-v0.2.0")
  })

  test("seniority 3 years = 14 days", () => {
    const result = calculateArgentinaVacations({
      countryCode: "ar",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 5,
      seniorityYears: 3,
    })

    expect(result.accruedVacationDays).toBe(14.04)
    expect(result.dailySalary).toBe(1200)
  })
})
