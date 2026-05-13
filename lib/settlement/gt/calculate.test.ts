import { describe, expect, test } from "bun:test"

import { calculateGuatemalaSettlement } from "@/lib/settlement/gt/calculate"

describe("calculateGuatemalaSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateGuatemalaSettlement({
      countryCode: "gt",
      employeeName: "Maria",
      employerName: "Empresa GT",
      monthlySalary: 8000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2020-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("gt-v0.1.0")
    expect(result.incomes.length).toBe(5)
    expect(result.incomes[0]?.label).toBe("Indemnizacion")
    expect(result.incomes[1]?.label).toBe("Aguinaldo proporcional")
    expect(result.incomes[2]?.label).toBe("Bono 14 proporcional")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deducciones con referencias legales", () => {
    const result = calculateGuatemalaSettlement({
      countryCode: "gt",
      employeeName: "Pedro",
      employerName: "Demo GT",
      monthlySalary: 6000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(2)
    expect(result.deductions[0]?.label).toBe("IGSS laboral")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.deductions[1]?.label).toBe("ISR estimado")
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("aplica tope maximo de 240 dias en indemnizacion", () => {
    const result = calculateGuatemalaSettlement({
      countryCode: "gt",
      employeeName: "Juan",
      employerName: "Servicios SA",
      monthlySalary: 10000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2000-01-01",
      endDate: "2026-05-11",
    })

    expect(result.incomes[0]?.amount).toBe(80000)
    expect(result.incomes[0]?.legalReference).toContain("Arts. 78")
  })
})
