import { describe, expect, test } from "bun:test"

import { calculateMexicoSalaryNet } from "./calculate"

describe("calculateMexicoSalaryNet", () => {
  test("calculates IMSS deduction for monthly frequency", () => {
    const result = calculateMexicoSalaryNet({
      countryCode: "mx",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("MXN")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const imss = result.deductions[0]
    expect(imss.label).toBe("IMSS")
    expect(imss.amount).toBe(750)

    const isr = result.deductions[1]
    expect(isr.label).toBe("ISR")
    expect(isr.amount).toBe(411.73)

    expect(result.totalDeductions).toBe(1161.73)
    expect(result.netSalary).toBe(28838.27)
    expect(result.netSalaryPerPeriod.mensual).toBe(28838.27)
    expect(result.netSalaryPerPeriod.quincenal).toBe(14419.14)
    expect(result.netSalaryPerPeriod.semanal).toBe(6654.99)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateMexicoSalaryNet({
        countryCode: "mx",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
