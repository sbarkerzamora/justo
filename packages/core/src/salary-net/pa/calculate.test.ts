import { describe, expect, test } from "bun:test"

import { calculatePanamaSalaryNet } from "./calculate"

describe("calculatePanamaSalaryNet", () => {
  test("calculates CSS deduction for monthly frequency", () => {
    const result = calculatePanamaSalaryNet({
      countryCode: "pa",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("USD")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const css = result.deductions[0]
    expect(css.label).toBe("CSS")
    expect(css.amount).toBe(2925)

    const ir = result.deductions[1]
    expect(ir.label).toBe("IR")
    expect(ir.amount).toBe(6214.58)

    expect(result.totalDeductions).toBe(9139.58)
    expect(result.netSalary).toBe(20860.42)
    expect(result.netSalaryPerPeriod.mensual).toBe(20860.42)
    expect(result.netSalaryPerPeriod.quincenal).toBe(10430.21)
    expect(result.netSalaryPerPeriod.semanal).toBe(4813.94)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculatePanamaSalaryNet({
        countryCode: "pa",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
