import { describe, expect, test } from "bun:test"
import { calculateNicaraguaTermination } from "@justo/core"
import { buildTerminationPdf } from "./termination-pdf"

describe("buildTerminationPdf", () => {
  test("generates PDF bytes for a valid termination calculation", async () => {
    const input = {
      countryCode: "ni" as const,
      monthlySalary: 30000,
      startDate: "2020-01-01",
      endDate: "2025-01-01",
    }
    const result = calculateNicaraguaTermination(input)
    const bytes = await buildTerminationPdf(input, result)

    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})