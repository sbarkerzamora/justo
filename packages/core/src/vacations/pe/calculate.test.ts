import { describe, expect, test } from "bun:test"

import { calculatePeruVacations } from "./calculate"

describe("calculatePeruVacations", () => {
  test("calculates 30 natural days", () => {
    const result = calculatePeruVacations({
      countryCode: "pe",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("PEN")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(30.08)
    expect(result.pendingVacationDays).toBe(20.08)
    expect(result.amount).toBe(20080)
    expect(result.legalCorpusVersion).toBe("pe-v0.2.0")
  })
})
