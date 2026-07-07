import { describe, expect, test } from "bun:test"

import { getMinimumWage, getMinimumWageForCalculation } from "./minimum-wages"

describe("getMinimumWage", () => {
  test("returns Mexico daily wage by year and region", () => {
    expect(getMinimumWage("mx", "2025-06-01")?.daily).toBe(278.8)
    expect(getMinimumWage("mx", "2025-06-01", { regionCode: "ZLFN" })?.daily).toBe(419.88)
    expect(getMinimumWage("mx", "2024-06-01")?.monthly).toBe(7467.9)
  })

  test("returns El Salvador commerce wage across 2025 change", () => {
    expect(getMinimumWage("sv", "2025-05-31")?.monthly).toBe(365)
    expect(getMinimumWage("sv", "2025-06-01")?.monthly).toBe(408.8)
  })

  test("returns Colombia SMMLV with transport allowance", () => {
    const wage = getMinimumWage("co", "2025-01-01")

    expect(wage?.monthly).toBe(1423500)
    expect(wage?.auxiliaryAmount).toBe(200000)
  })

  test("returns null when date has no configured legal value", () => {
    expect(getMinimumWage("co", "2026-01-01")).toBeNull()
  })

  test("returns latest documented value with a warning for calculations", () => {
    const lookup = getMinimumWageForCalculation("mx", "2026-01-01")

    expect(lookup.wage?.year).toBe(2025)
    expect(lookup.warnings[0]).toContain("base legal documentada")
  })
})
