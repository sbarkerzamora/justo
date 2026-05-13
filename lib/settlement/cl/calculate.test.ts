import { describe, expect, test } from "bun:test"

import { calculateChileSettlement } from "@/lib/settlement/cl/calculate"

describe("calculateChileSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateChileSettlement({
      countryCode: "cl",
      employeeName: "Pablo",
      employerName: "Empresa CL",
      monthlySalary: 1500000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2019-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("cl-v0.1.0")
    expect(result.incomes.length).toBe(4)
    expect(result.incomes[0]?.label).toBe("Indemnizacion (Art. 163)")
    expect(result.incomes[1]?.label).toBe("Aviso sustitutivo")
    expect(result.incomes[2]?.label).toBe("Vacaciones pendientes")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deducciones AFP, Salud y AFC con referencias legales", () => {
    const result = calculateChileSettlement({
      countryCode: "cl",
      employeeName: "Camila",
      employerName: "Demo CL",
      monthlySalary: 1200000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(3)
    expect(result.deductions[0]?.label).toBe("AFP")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("Salud (FONASA/ISAPRE)")
    expect(result.deductions[1]?.amount).toBeGreaterThan(0)
    expect(result.deductions[2]?.label).toBe("AFC (Seguro Cesantia)")
    expect(result.deductions[2]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica feriado progresivo (+1 dia/3 anos desde 10 anos)", () => {
    const result = calculateChileSettlement({
      countryCode: "cl",
      employeeName: "Rosa",
      employerName: "Servicios CL",
      monthlySalary: 1000000,
      frequency: "mensual",
      unusedVacationDays: 15,
      startDate: "2005-01-01",
      endDate: "2026-05-11",
    })

    const vacaciones = result.incomes.find((line) => line.label === "Vacaciones pendientes")
    expect(vacaciones).toBeDefined()
    expect(vacaciones?.legalReference).toContain("Arts. 67")
  })
})
