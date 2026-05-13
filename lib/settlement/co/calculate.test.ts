import { describe, expect, test } from "bun:test"

import { calculateColombiaSettlement } from "@/lib/settlement/co/calculate"

describe("calculateColombiaSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateColombiaSettlement({
      countryCode: "co",
      employeeName: "Carlos",
      employerName: "Empresa CO",
      monthlySalary: 3000000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("co-v0.1.0")
    expect(result.incomes.length).toBe(6)
    expect(result.incomes[0]?.label).toBe("Cesantia")
    expect(result.incomes[1]?.label).toBe("Intereses a las cesantias")
    expect(result.incomes[2]?.label).toBe("Indemnizacion por despido")
    expect(result.incomes[3]?.label).toBe("Prima de servicios")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deducciones EPS y Pension con referencias legales", () => {
    const result = calculateColombiaSettlement({
      countryCode: "co",
      employeeName: "Andrea",
      employerName: "Demo CO",
      monthlySalary: 2500000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(2)
    expect(result.deductions[0]?.label).toBe("EPS (salud)")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("Pension (AFP)")
    expect(result.deductions[1]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("incluye intereses a las cesantias al 12%", () => {
    const result = calculateColombiaSettlement({
      countryCode: "co",
      employeeName: "Pedro",
      employerName: "Servicios CO",
      monthlySalary: 2000000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2020-01-01",
      endDate: "2026-05-11",
    })

    const intereses = result.incomes.find((line) => line.label === "Intereses a las cesantias")
    expect(intereses).toBeDefined()
    expect(intereses?.legalReference).toContain("12%")
  })
})
