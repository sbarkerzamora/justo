import { describe, expect, test } from "bun:test"

import { calculateCostaRicaSettlement } from "./calculate"

describe("calculateCostaRicaSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateCostaRicaSettlement({
      countryCode: "cr",
      employeeName: "Sofia",
      employerName: "Empresa CR",
      monthlySalary: 1000000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("cr-v0.2.0")
    expect(result.incomes.length).toBe(5)
    expect(result.incomes[0]?.label).toBe("Cesantia")
    expect(result.incomes[1]?.label).toBe("Preaviso")
    expect(result.incomes[2]?.label).toBe("Aguinaldo proporcional")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deduccion CCSS con referencia legal", () => {
    const result = calculateCostaRicaSettlement({
      countryCode: "cr",
      employeeName: "Andres",
      employerName: "Demo CR",
      monthlySalary: 800000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(2)
    expect(result.deductions[0]?.label).toBe("CCSS laboral")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("IR")
    expect(result.deductions[1]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica preaviso de 30 dias para tenure mayor a 1 ano", () => {
    const result = calculateCostaRicaSettlement({
      countryCode: "cr",
      employeeName: "Laura",
      employerName: "Servicios CR",
      monthlySalary: 500000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2020-01-01",
      endDate: "2026-05-11",
    })

    expect(result.incomes[1]?.label).toBe("Preaviso")
    expect(result.incomes[1]?.legalReference).toContain("Art. 28")
  })

  test("calcula salario proporcional segun el dia de fin del mes", () => {
    const result = calculateCostaRicaSettlement({
      countryCode: "cr",
      employeeName: "Carlos",
      employerName: "Test CR",
      monthlySalary: 3000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2025-01-01",
      endDate: "2026-05-15",
    })

    const sp = result.incomes.find((line) => line.label === "Salario proporcional")
    expect(sp).toBeDefined()
    expect(sp?.amount).toBe(1500)
    expect(sp?.formula).toContain("15 dias")
  })
})
