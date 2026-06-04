import { describe, expect, test } from "bun:test"
import { calculateNicaraguaSalaryNet } from "@justo/core"
import { buildSalaryNetPdf } from "./salary-net-pdf"

describe("buildSalaryNetPdf", () => {
  test("generates PDF bytes for a valid salary net calculation", async () => {
    const input = {
      countryCode: "ni" as const,
      grossSalary: 30000,
      frequency: "mensual" as const,
    }
    const result = calculateNicaraguaSalaryNet(input)
    const bytes = await buildSalaryNetPdf(input, result)

    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})