import { describe, expect, test } from "bun:test"

import { calculateColombiaVacations } from "./calculate"

describe("calculateColombiaVacations", () => {
  test("calculates 15 business days", () => {
    const result = calculateColombiaVacations({
      countryCode: "co",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("COP")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(15.04)
    expect(result.pendingVacationDays).toBe(5.04)
    expect(result.amount).toBe(5040)
    expect(result.legalCorpusVersion).toBe("co-v0.2.0")
  })
})
