import { describe, expect, test } from "bun:test"
import type { CountryCode } from "@justo/core"

import { calculateSettlement, settlementTool } from "./settlement"

const baseInput = {
  employeeName: "Trabajador",
  employerName: "Empleador",
  monthlySalary: 30000,
  frequency: "mensual" as const,
  unusedVacationDays: 0,
  startDate: "2024-01-01",
  endDate: "2025-01-01",
  terminationCause: "despido_injustificado" as const,
  contractType: "indeterminado" as const,
}

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
      terminationCause: "renuncia",
      contractType: "indeterminado",
    })

    expect(result.currency).toBe("NIO")
    expect(result.netTotal).toBeGreaterThan(0)
    expect(result.legalCorpusVersion).toBeTruthy()
  })

  test("suppresses Nicaragua indemnity for voluntary resignation", () => {
    const result = calculateSettlement({
      countryCode: "ni",
      employeeName: "Trabajador",
      employerName: "Empleador",
      monthlySalary: 30000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      terminationCause: "renuncia",
      contractType: "indeterminado",
    })

    expect(result.incomes.some((line) => line.label === "Indemnizacion")).toBe(
      false
    )
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("keeps Guatemala indemnity for resignation under current country model", () => {
    const result = calculateSettlement({
      countryCode: "gt",
      employeeName: "Trabajador",
      employerName: "Empleador",
      monthlySalary: 9000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      terminationCause: "renuncia",
      contractType: "indeterminado",
    })

    expect(result.incomes.some((line) => line.label === "Indemnizacion")).toBe(
      true
    )
  })

  test("applies explicit final adjustments for every supported country", () => {
    for (const countryCode of settlementTool.countrySupport as CountryCode[]) {
      const baseline = calculateSettlement({
        ...baseInput,
        countryCode,
      })
      const result = calculateSettlement({
        ...baseInput,
        countryCode,
        pendingSalaryAmount: 100,
        pendingOvertimeAmount: 50,
        pendingBonusAmount: 25,
        benefitsAlreadyPaidAmount: 40,
        otherDeductionsAmount: 10,
      })

      expect(
        result.incomes.some(
          (line) => line.label === "Salario pendiente adicional"
        )
      ).toBe(true)
      expect(
        result.deductions.some(
          (line) => line.label === "Prestaciones ya pagadas"
        )
      ).toBe(true)
      expect(result.grossIncome).toBe(baseline.grossIncome + 175)
      expect(result.totalDeductions).toBe(baseline.totalDeductions + 50)
      expect(result.netTotal).toBe(baseline.netTotal + 125)
    }
  })
})
