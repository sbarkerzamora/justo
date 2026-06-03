import { describe, expect, test } from "bun:test"

import { calculatePanamaVacations } from "./calculate"

describe("calculatePanamaVacations", () => {
  test("calculates 30 days per 11 months", () => {
    const result = calculatePanamaVacations({
      countryCode: "pa",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("USD")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(32.82)
    expect(result.pendingVacationDays).toBe(22.82)
    expect(result.amount).toBe(22820)
    expect(result.legalCorpusVersion).toBe("pa-v0.2.0")
  })
})
