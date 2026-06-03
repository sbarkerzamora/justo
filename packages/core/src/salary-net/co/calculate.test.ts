import { describe, expect, test } from "bun:test"

import { calculateColombiaSalaryNet } from "./calculate"

describe("calculateColombiaSalaryNet", () => {
  test("calculates EPS + Pension deductions for monthly frequency", () => {
    const result = calculateColombiaSalaryNet({
      countryCode: "co",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("COP")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const eps = result.deductions.find((d) => d.label === "EPS")
    expect(eps?.amount).toBe(1200)

    const pension = result.deductions.find((d) => d.label === "Pensión")
    expect(pension?.amount).toBe(1200)

    expect(result.totalDeductions).toBe(2400)
    expect(result.netSalary).toBe(27600)
    expect(result.netSalaryPerPeriod.mensual).toBe(27600)
    expect(result.netSalaryPerPeriod.quincenal).toBe(13800)
    expect(result.netSalaryPerPeriod.semanal).toBe(6369.23)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateColombiaSalaryNet({
        countryCode: "co",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
