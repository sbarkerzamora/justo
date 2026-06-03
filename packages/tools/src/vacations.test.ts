import { describe, expect, test } from "bun:test"

import { calculateVacations, vacationsTool } from "./vacations"

describe("vacationsTool", () => {
  test("exposes marketplace metadata and calculates Nicaragua vacations", () => {
    expect(vacationsTool.id).toBe("vacations")
    expect(vacationsTool.slug).toBe("vacaciones")
    expect(vacationsTool.availability).toBe("available")
    expect(vacationsTool.countrySupport).toEqual(["ni"])

    const result = calculateVacations({
      countryCode: "ni",
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 10,
    })

    expect(result.currency).toBe("NIO")
    expect(result.pendingVacationDays).toBe(20.08)
    expect(result.amount).toBe(20080)
  })
})
