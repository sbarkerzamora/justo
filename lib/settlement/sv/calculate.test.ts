import { describe, expect, test } from "bun:test"

import { calculateElSalvadorSettlement } from "@/lib/settlement/sv/calculate"

describe("calculateElSalvadorSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateElSalvadorSettlement({
      countryCode: "sv",
      employeeName: "Carlos",
      employerName: "Empresa SV",
      monthlySalary: 1500,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("sv-v0.1.0")
    expect(result.incomes.length).toBe(4)
    expect(result.incomes[0]?.label).toBe("Indemnizacion")
    expect(result.incomes[1]?.label).toBe("Aguinaldo proporcional")
    expect(result.incomes[2]?.label).toBe("Vacaciones pendientes")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deducciones ISSS y AFP con referencias legales", () => {
    const result = calculateElSalvadorSettlement({
      countryCode: "sv",
      employeeName: "Ana",
      employerName: "Demo SV",
      monthlySalary: 1200,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(2)
    expect(result.deductions[0]?.label).toBe("ISSS laboral")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("AFP laboral")
    expect(result.deductions[1]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica escala de aguinaldo segun antiguedad (10+ anos = 21 dias)", () => {
    const result = calculateElSalvadorSettlement({
      countryCode: "sv",
      employeeName: "Rosa",
      employerName: "Servicios SV",
      monthlySalary: 1000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2010-01-01",
      endDate: "2026-05-11",
    })

    const aguinaldo = result.incomes.find((line) => line.label === "Aguinaldo proporcional")
    expect(aguinaldo).toBeDefined()
    expect(aguinaldo?.legalReference).toContain("Arts. 196")
  })
})
