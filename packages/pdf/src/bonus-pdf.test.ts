import { describe, expect, test } from "bun:test"
import { calculateNicaraguaBonus } from "@justo/core"
import { buildBonusPdf } from "./bonus-pdf"

describe("buildBonusPdf", () => {
  test("generates PDF bytes for a valid bonus calculation", async () => {
    const input = {
      countryCode: "ni" as const,
      monthlySalary: 15000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    }
    const result = calculateNicaraguaBonus(input)
    const bytes = await buildBonusPdf(input, result)

    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})