import { describe, expect, test } from "bun:test"
import { bonusTool, calculateBonus } from "./bonus"

describe("bonusTool", () => {
  test("is available for all supported countries", () => {
    expect(bonusTool.availability).toBe("available")
    expect(bonusTool.countrySupport).toHaveLength(11)
  })

  test("calculates Guatemala bonus lines", () => {
    const result = calculateBonus({
      countryCode: "gt",
      monthlySalary: 9000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    })

    expect(result.supported).toBe(true)
    expect(result.lines).toHaveLength(2)
    expect(result.total).toBe(18000)
  })

  test("returns Chile fallback", () => {
    const result = calculateBonus({
      countryCode: "cl",
      monthlySalary: 900000,
      startDate: "2024-01-01",
      endDate: "2024-12-31",
    })

    expect(result.supported).toBe(false)
    expect(result.total).toBe(0)
  })
})
