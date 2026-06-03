import { describe, expect, test } from "bun:test"

import { calculateCostaRicaSalaryNet } from "./calculate"

describe("calculateCostaRicaSalaryNet", () => {
  test("calculates CCSS deduction for monthly frequency", () => {
    const result = calculateCostaRicaSalaryNet({
      countryCode: "cr",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("CRC")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(1)

    const ccss = result.deductions[0]
    expect(ccss.label).toBe("CCSS")
    expect(ccss.amount).toBe(2751)

    expect(result.totalDeductions).toBe(2751)
    expect(result.netSalary).toBe(27249)
    expect(result.netSalaryPerPeriod.mensual).toBe(27249)
    expect(result.netSalaryPerPeriod.quincenal).toBe(13624.5)
    expect(result.netSalaryPerPeriod.semanal).toBe(6288.23)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateCostaRicaSalaryNet({
        countryCode: "cr",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
