import { describe, expect, test } from "bun:test"

import { calculateCostaRicaVacations } from "./calculate"

describe("calculateCostaRicaVacations", () => {
  test("calculates 14 days per 50 weeks", () => {
    const result = calculateCostaRicaVacations({
      countryCode: "cr",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("CRC")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(14.64)
    expect(result.pendingVacationDays).toBe(4.64)
    expect(result.amount).toBe(4640)
    expect(result.legalCorpusVersion).toBe("cr-v0.2.0")
  })
})
