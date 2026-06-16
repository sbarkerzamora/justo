import { describe, expect, test } from "bun:test"
import { calculateNicaraguaSettlement } from "@justo/core"

import { buildSettlementPdf } from "./settlement-pdf"

describe("buildSettlementPdf", () => {
  test("generates PDF bytes for a valid settlement", async () => {
    const input = {
      countryCode: "ni" as const,
      employeeName: "Trabajador",
      employerName: "Empleador",
      monthlySalary: 30000,
      frequency: "mensual" as const,
      unusedVacationDays: 0,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      terminationCause: "renuncia" as const,
      contractType: "indeterminado" as const,
    }
    const result = calculateNicaraguaSettlement(input)
    const bytes = await buildSettlementPdf(input, result)

    expect(bytes.length).toBeGreaterThan(0)
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe("%PDF")
  })
})
