import { describe, expect, test } from "bun:test"

import { calculateNicaraguaSettlement } from "@/lib/settlement/ni/calculate"

describe("calculateNicaraguaSettlement", () => {
  test("aplica tope maximo de 5 meses en indemnizacion (Art. 45)", () => {
    const result = calculateNicaraguaSettlement({
      countryCode: "ni",
      employeeName: "Ana",
      employerName: "Empresa SA",
      monthlySalary: 30000,
      frequency: "mensual",
      unusedVacationDays: 10,
      startDate: "2010-01-01",
      endDate: "2026-01-31",
    })

    const indemnizacion = result.incomes.find((line) => line.label === "Indemnizacion")
    expect(indemnizacion).toBeDefined()
    expect(indemnizacion?.amount).toBe(150000)
    expect(indemnizacion?.legalReference).toContain("Art. 45")
  })

  test("incluye deducciones con referencias legales y version de corpus", () => {
    const result = calculateNicaraguaSettlement({
      countryCode: "ni",
      employeeName: "Carlos",
      employerName: "Demo Ltda",
      monthlySalary: 18000,
      frequency: "mensual",
      unusedVacationDays: 5,
      startDate: "2024-02-01",
      endDate: "2026-05-11",
    })

    expect(result.legalCorpusVersion).toBe("ni-v0.2.0")
    expect(result.deductions.length).toBe(2)
    expect(result.deductions[0]?.legalReference).toContain("Art. 88")
    expect(result.deductions[1]?.legalReference).toContain("Art. 97")
    expect(result.netTotal).toBeGreaterThan(0)
  })

  test("calcula aguinaldo proporcional segun dias del periodo", () => {
    const result = calculateNicaraguaSettlement({
      countryCode: "ni",
      employeeName: "Laura",
      employerName: "Servicios NI",
      monthlySalary: 12000,
      frequency: "mensual",
      unusedVacationDays: 0,
      startDate: "2026-01-01",
      endDate: "2026-06-30",
    })

    const aguinaldo = result.incomes.find((line) => line.label === "Aguinaldo proporcional")
    expect(aguinaldo).toBeDefined()
    expect(aguinaldo?.amount).toBeGreaterThan(0)
    expect(aguinaldo?.formula).toContain("/ 365")
  })
})
