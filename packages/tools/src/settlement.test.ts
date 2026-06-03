import { describe, expect, test } from "bun:test"

import { calculateSettlement, settlementTool } from "./settlement"

describe("settlementTool", () => {
  test("exposes marketplace metadata and calculates deterministically", () => {
    expect(settlementTool.id).toBe("settlement")
    expect(settlementTool.slug).toBe("liquidacion-laboral")
    expect(settlementTool.availability).toBe("available")
    expect(settlementTool.countrySupport).toContain("ni")

    const result = calculateSettlement({
      countryCode: "ni",
      employeeName: "Trabajador",
      employerName: "Empleador",
      monthlySalary: 30000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      terminationType: "renuncia",
    })

    expect(result.currency).toBe("NIO")
    expect(result.netTotal).toBeGreaterThan(0)
    expect(result.legalCorpusVersion).toBeTruthy()
  })
})
