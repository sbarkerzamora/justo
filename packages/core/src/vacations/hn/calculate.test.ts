import { describe, expect, test } from "bun:test"

import { calculateHondurasVacations } from "./calculate"

describe("calculateHondurasVacations", () => {
  test("uses seniority scale (5+ years = 20 days)", () => {
    const result = calculateHondurasVacations({
      countryCode: "hn",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
      seniorityYears: 5,
    })

    expect(result.currency).toBe("HNL")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(20.05)
    expect(result.pendingVacationDays).toBe(10.05)
    expect(result.amount).toBe(10050)
    expect(result.legalCorpusVersion).toBe("hn-v0.2.0")
  })

  test("seniority 1 year = 10 days", () => {
    const result = calculateHondurasVacations({
      countryCode: "hn",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 5,
      seniorityYears: 1,
    })

    expect(result.accruedVacationDays).toBe(10.03)
  })

  test("seniority 3 years = 15 days", () => {
    const result = calculateHondurasVacations({
      countryCode: "hn",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 5,
      seniorityYears: 3,
    })

    expect(result.accruedVacationDays).toBe(15.04)
  })
})
