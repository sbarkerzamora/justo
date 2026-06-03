import { describe, expect, test } from "bun:test"

import { calculateElSalvadorVacations } from "./calculate"

describe("calculateElSalvadorVacations", () => {
  test("calculates with 30% premium", () => {
    const result = calculateElSalvadorVacations({
      countryCode: "sv",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("USD")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(15.04)
    expect(result.pendingVacationDays).toBe(5.04)
    expect(result.amount).toBe(6552)
    expect(result.legalCorpusVersion).toBe("sv-v0.2.0")
  })
})
