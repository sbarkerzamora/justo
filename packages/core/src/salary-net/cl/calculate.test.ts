import { describe, expect, test } from "bun:test"

import { calculateChileSalaryNet } from "./calculate"

describe("calculateChileSalaryNet", () => {
  test("calculates AFP + Salud + AFC deductions for monthly frequency", () => {
    const result = calculateChileSalaryNet({
      countryCode: "cl",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("CLP")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(3)

    const afp = result.deductions.find((d) => d.label === "AFP")
    expect(afp?.amount).toBe(3450)

    const salud = result.deductions.find((d) => d.label === "Salud")
    expect(salud?.amount).toBe(2100)

    const afc = result.deductions.find((d) => d.label === "AFC")
    expect(afc?.amount).toBe(180)

    expect(result.totalDeductions).toBe(5730)
    expect(result.netSalary).toBe(24270)
    expect(result.netSalaryPerPeriod.mensual).toBe(24270)
    expect(result.netSalaryPerPeriod.quincenal).toBe(12135)
    expect(result.netSalaryPerPeriod.semanal).toBe(5600.77)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateChileSalaryNet({
        countryCode: "cl",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
