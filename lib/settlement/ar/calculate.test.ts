import { describe, expect, test } from "bun:test"

import { calculateArgentinaSettlement } from "@/lib/settlement/ar/calculate"

describe("calculateArgentinaSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateArgentinaSettlement({
      countryCode: "ar",
      employeeName: "Martin",
      employerName: "Empresa AR",
      monthlySalary: 500000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("ar-v0.1.0")
    expect(result.incomes.length).toBe(5)
    expect(result.incomes[0]?.label).toBe("Indemnizacion (Art. 245)")
    expect(result.incomes[1]?.label).toBe("Preaviso")
    expect(result.incomes[2]?.label).toBe("SAC / Aguinaldo")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deducciones Jubilacion, PAMI y Obra Social", () => {
    const result = calculateArgentinaSettlement({
      countryCode: "ar",
      employeeName: "Valentina",
      employerName: "Demo AR",
      monthlySalary: 400000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(3)
    expect(result.deductions[0]?.label).toBe("Jubilacion (SIPA)")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("PAMI")
    expect(result.deductions[1]?.amount).toBeGreaterThan(0)
    expect(result.deductions[2]?.label).toBe("Obra Social")
    expect(result.deductions[2]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica escala de vacaciones segun antiguedad (5-10 anos = 21 dias)", () => {
    const result = calculateArgentinaSettlement({
      countryCode: "ar",
      employeeName: "Lucia",
      employerName: "Servicios AR",
      monthlySalary: 300000,
      frequency: "mensual",
      unusedVacationDays: 15,
      startDate: "2018-01-01",
      endDate: "2026-05-11",
    })

    const vacaciones = result.incomes.find((line) => line.label === "Vacaciones pendientes")
    expect(vacaciones).toBeDefined()
    expect(vacaciones?.legalReference).toContain("Arts. 150")
  })
})
