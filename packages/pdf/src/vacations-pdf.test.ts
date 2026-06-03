import { describe, expect, test } from "bun:test"
import { calculateNicaraguaVacations } from "@justo/core"

import { buildVacationsPdf } from "./vacations-pdf"

describe("buildVacationsPdf", () => {
  test("generates PDF bytes for a valid vacation calculation", async () => {
    const input = {
      countryCode: "ni" as const,
      monthlySalary: 30000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      usedVacationDays: 5,
    }
    const result = calculateNicaraguaVacations(input)
    const bytes = await buildVacationsPdf(input, result)

    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})
