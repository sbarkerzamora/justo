import { describe, expect, test } from "bun:test"

import { calculateGuatemalaVacations } from "./calculate"

describe("calculateGuatemalaVacations", () => {
  test("calculates 15 business days", () => {
    const result = calculateGuatemalaVacations({
      countryCode: "gt",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("GTQ")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(15.04)
    expect(result.pendingVacationDays).toBe(5.04)
    expect(result.amount).toBe(5040)
    expect(result.legalCorpusVersion).toBe("gt-v0.2.0")
  })
})
