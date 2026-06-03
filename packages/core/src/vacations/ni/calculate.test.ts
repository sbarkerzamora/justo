import { describe, expect, test } from "bun:test"

import { calculateNicaraguaVacations } from "./calculate"

describe("calculateNicaraguaVacations", () => {
  test("calculates accrued and pending vacation pay", () => {
    const result = calculateNicaraguaVacations({
      countryCode: "ni",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("NIO")
    expect(result.dailySalary).toBe(1000)
    expect(result.accruedVacationDays).toBe(30.08)
    expect(result.pendingVacationDays).toBe(20.08)
    expect(result.amount).toBe(20080)
    expect(result.legalCorpusVersion).toBe("ni-v0.2.0")
  })

  test("does not return negative pending days", () => {
    const result = calculateNicaraguaVacations({
      countryCode: "ni",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2024-02-01",
      usedVacationDays: 20,
    })

    expect(result.pendingVacationDays).toBe(0)
    expect(result.amount).toBe(0)
  })
})
