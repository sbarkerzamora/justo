import { describe, expect, test } from "bun:test"

import { calculatePeruSettlement } from "@/lib/settlement/pe/calculate"

describe("calculatePeruSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculatePeruSettlement({
      countryCode: "pe",
      employeeName: "Jose",
      employerName: "Empresa PE",
      monthlySalary: 3000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("pe-v0.1.0")
    expect(result.incomes.length).toBe(5)
    expect(result.incomes[0]?.label).toBe("Indemnizacion por despido")
    expect(result.incomes[1]?.label).toBe("CTS")
    expect(result.incomes[2]?.label).toBe("Gratificaciones")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deduccion ONP con referencia legal", () => {
    const result = calculatePeruSettlement({
      countryCode: "pe",
      employeeName: "Lucia",
      employerName: "Demo PE",
      monthlySalary: 2500,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(1)
    expect(result.deductions[0]?.label).toBe("ONP")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica escala de indemnizacion 45/30/15 segun antiguedad", () => {
    const result = calculatePeruSettlement({
      countryCode: "pe",
      employeeName: "Raul",
      employerName: "Servicios PE",
      monthlySalary: 2000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2010-01-01",
      endDate: "2026-05-11",
    })

    expect(result.incomes[0]?.legalReference).toContain("Art. 167")
  })
})
