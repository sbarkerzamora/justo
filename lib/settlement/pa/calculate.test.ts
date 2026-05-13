import { describe, expect, test } from "bun:test"

import { calculatePanamaSettlement } from "@/lib/settlement/pa/calculate"

describe("calculatePanamaSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculatePanamaSettlement({
      countryCode: "pa",
      employeeName: "Elena",
      employerName: "Empresa PA",
      monthlySalary: 2000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2018-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("pa-v0.1.0")
    expect(result.incomes.length).toBe(5)
    expect(result.incomes[0]?.label).toBe("Prima de antiguedad")
    expect(result.incomes[1]?.label).toBe("Indemnizacion")
    expect(result.incomes[2]?.label).toBe("Decimotercer Mes")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deduccion CSS con referencia legal", () => {
    const result = calculatePanamaSettlement({
      countryCode: "pa",
      employeeName: "Ricardo",
      employerName: "Demo PA",
      monthlySalary: 1500,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(1)
    expect(result.deductions[0]?.label).toBe("CSS laboral")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica escala de indemnizacion segun antiguedad", () => {
    const result = calculatePanamaSettlement({
      countryCode: "pa",
      employeeName: "Ana",
      employerName: "Servicios PA",
      monthlySalary: 1000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2020-01-01",
      endDate: "2026-05-11",
    })

    expect(result.incomes[1]?.legalReference).toContain("Art. 225")
  })
})
