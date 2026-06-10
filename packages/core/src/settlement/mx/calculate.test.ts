import { describe, expect, test } from "bun:test"

import { calculateMexicoSettlement } from "./calculate"

describe("calculateMexicoSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateMexicoSettlement({
      countryCode: "mx",
      employeeName: "Juan",
      employerName: "Empresa MX",
      monthlySalary: 25000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("mx-v0.2.0")
    expect(result.incomes.length).toBe(6)
    expect(result.incomes[0]?.label).toBe("Indemnizacion constitucional (3 meses)")
    expect(result.incomes[1]?.label).toBe("Indemnizacion por anos")
    expect(result.incomes[2]?.label).toBe("Prima de antiguedad")
    expect(result.incomes[3]?.label).toBe("Aguinaldo proporcional")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deduccion IMSS con referencia legal", () => {
    const result = calculateMexicoSettlement({
      countryCode: "mx",
      employeeName: "Maria",
      employerName: "Demo MX",
      monthlySalary: 20000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(2)
    expect(result.deductions[0]?.label).toBe("IMSS laboral")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("IR")
    expect(result.deductions[1]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica prima vacacional del 25%", () => {
    const result = calculateMexicoSettlement({
      countryCode: "mx",
      employeeName: "Luis",
      employerName: "Servicios MX",
      monthlySalary: 15000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2020-01-01",
      endDate: "2026-05-11",
    })

    const vacaciones = result.incomes.find((line) => line.label === "Vacaciones pendientes")
    expect(vacaciones).toBeDefined()
    expect(vacaciones?.legalReference).toContain("Arts. 76")
  })

  test("calcula salario proporcional segun el dia de fin del mes", () => {
    const result = calculateMexicoSettlement({
      countryCode: "mx",
      employeeName: "Ana",
      employerName: "Test MX",
      monthlySalary: 3000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2025-01-01",
      endDate: "2026-05-25",
    })

    const sp = result.incomes.find((line) => line.label === "Salario proporcional")
    expect(sp).toBeDefined()
    expect(sp?.amount).toBe(2500)
    expect(sp?.formula).toContain("25 dias")
  })
})
