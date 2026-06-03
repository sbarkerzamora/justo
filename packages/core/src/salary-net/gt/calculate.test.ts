import { describe, expect, test } from "bun:test"

import { calculateGuatemalaSalaryNet } from "./calculate"

describe("calculateGuatemalaSalaryNet", () => {
  test("calculates IGSS + ISR deductions for monthly frequency", () => {
    const result = calculateGuatemalaSalaryNet({
      countryCode: "gt",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("GTQ")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const igss = result.deductions.find((d) => d.label === "IGSS")
    expect(igss?.amount).toBe(1449)

    const isr = result.deductions.find((d) => d.label === "ISR")
    expect(isr?.amount).toBe(1427.55)

    expect(result.totalDeductions).toBe(2876.55)
    expect(result.netSalary).toBe(27123.45)
    expect(result.netSalaryPerPeriod.mensual).toBe(27123.45)
    expect(result.netSalaryPerPeriod.quincenal).toBe(13561.73)
    expect(result.netSalaryPerPeriod.semanal).toBe(6259.26)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateGuatemalaSalaryNet({
        countryCode: "gt",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
