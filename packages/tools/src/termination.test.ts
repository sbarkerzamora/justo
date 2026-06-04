import { describe, expect, test } from "bun:test"
import { calculateTermination, terminationTool } from "./termination"

describe("terminationTool", () => {
  test("exposes marketplace metadata", () => {
    expect(terminationTool.id).toBe("termination-simulator")
    expect(terminationTool.slug).toBe("simulador-terminacion")
    expect(terminationTool.availability).toBe("available")
    expect(terminationTool.category).toBe("calculation")
    expect(terminationTool.countrySupport).toHaveLength(11)
  })

  test("calculates Nicaragua scenarios", () => {
    const result = calculateTermination({
      countryCode: "ni",
      monthlySalary: 30000,
      startDate: "2020-01-01",
      endDate: "2025-01-01",
    })

    expect(result.currency).toBe("NIO")
    expect(result.scenarios.length).toBeGreaterThanOrEqual(2)
    expect(result.legalCorpusVersion).toBeTruthy()
    result.scenarios.forEach((s) => {
      expect(s.total).toBeGreaterThanOrEqual(0)
      expect(s.lines.length).toBeGreaterThanOrEqual(0)
    })
  })

  test("calculates Guatemala scenarios", () => {
    const result = calculateTermination({
      countryCode: "gt",
      monthlySalary: 9000,
      startDate: "2022-06-01",
      endDate: "2025-01-01",
    })

    expect(result.currency).toBe("GTQ")
    result.scenarios.forEach((s) => {
      if (s.applicable) {
        expect(s.total).toBeGreaterThan(0)
      }
    })
  })
})