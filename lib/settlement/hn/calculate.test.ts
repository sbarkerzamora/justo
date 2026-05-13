import { describe, expect, test } from "bun:test"

import { calculateHondurasSettlement } from "@/lib/settlement/hn/calculate"

describe("calculateHondurasSettlement", () => {
  test("incluye todas las lineas de ingreso y version de corpus", () => {
    const result = calculateHondurasSettlement({
      countryCode: "hn",
      employeeName: "Luis",
      employerName: "Empresa HN",
      monthlySalary: 15000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2018-01-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("hn-v0.1.0")
    expect(result.incomes.length).toBe(4)
    expect(result.incomes[0]?.label).toBe("Indemnizacion")
    expect(result.incomes[1]?.label).toBe("Aguinaldo proporcional")
    expect(result.incomes[2]?.label).toBe("Vacaciones pendientes")
    expect(result.grossIncome).toBeGreaterThan(0)
  })

  test("incluye deduccion IHSS con referencia legal", () => {
    const result = calculateHondurasSettlement({
      countryCode: "hn",
      employeeName: "Marta",
      employerName: "Demo HN",
      monthlySalary: 12000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2022-06-01",
      endDate: "2026-05-11",
    })

    expect(result.deductions.length).toBe(1)
    expect(result.deductions[0]?.label).toBe("IHSS laboral")
    expect(result.deductions[0]?.amount).toBeGreaterThan(0)
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("devuelve 10 dias de indemnizacion para tenure 3-6 meses", () => {
    const result = calculateHondurasSettlement({
      countryCode: "hn",
      employeeName: "Jorge",
      employerName: "Servicios HN",
      monthlySalary: 10000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2026-01-01",
      endDate: "2026-04-30",
    })

    expect(result.incomes[0]?.amount).toBeGreaterThan(0)
    expect(result.incomes[0]?.legalReference).toContain("120")
  })
})
