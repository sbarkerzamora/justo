import { describe, expect, test } from "bun:test"

import { calculateHondurasSalaryNet } from "./calculate"

describe("calculateHondurasSalaryNet", () => {
  test("calculates IHSS deduction for monthly frequency", () => {
    const result = calculateHondurasSalaryNet({
      countryCode: "hn",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("HNL")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const ihss = result.deductions[0]
    expect(ihss.label).toBe("IHSS")
    expect(ihss.amount).toBe(1050)

    const ir = result.deductions[1]
    expect(ir.label).toBe("IR")
    expect(ir.amount).toBe(1488.44)

    expect(result.totalDeductions).toBe(2538.44)
    expect(result.netSalary).toBe(27461.56)
    expect(result.netSalaryPerPeriod.mensual).toBe(27461.56)
    expect(result.netSalaryPerPeriod.quincenal).toBe(13730.78)
    expect(result.netSalaryPerPeriod.semanal).toBe(6337.28)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateHondurasSalaryNet({
        countryCode: "hn",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
