import { describe, expect, test } from "bun:test"

import { calculateElSalvadorSalaryNet } from "./calculate"

describe("calculateElSalvadorSalaryNet", () => {
  test("calculates ISSS + AFP deductions for monthly frequency", () => {
    const result = calculateElSalvadorSalaryNet({
      countryCode: "sv",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("USD")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(3)

    const isss = result.deductions.find((d) => d.label === "ISSS")
    expect(isss?.amount).toBe(900)

    const afp = result.deductions.find((d) => d.label === "AFP")
    expect(afp?.amount).toBe(2175)

    const isr = result.deductions.find((d) => d.label === "ISR")
    expect(isr?.amount).toBe(7422.50)

    expect(result.totalDeductions).toBe(10497.50)
    expect(result.netSalary).toBe(19502.50)
    expect(result.netSalaryPerPeriod.mensual).toBe(19502.50)
    expect(result.netSalaryPerPeriod.quincenal).toBe(9751.25)
    expect(result.netSalaryPerPeriod.semanal).toBe(4500.58)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateElSalvadorSalaryNet({
        countryCode: "sv",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
