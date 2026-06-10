import { describe, expect, test } from "bun:test"

import { calculateArgentinaSalaryNet } from "./calculate"

describe("calculateArgentinaSalaryNet", () => {
  test("calculates Jubilación + PAMI + Obra Social deductions for monthly frequency", () => {
    const result = calculateArgentinaSalaryNet({
      countryCode: "ar",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("ARS")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(3)

    const jub = result.deductions.find((d) => d.label === "Jubilación")
    expect(jub?.amount).toBe(3300)

    const pami = result.deductions.find((d) => d.label === "PAMI")
    expect(pami?.amount).toBe(900)

    const os = result.deductions.find((d) => d.label === "Obra Social")
    expect(os?.amount).toBe(900)

    expect(result.totalDeductions).toBe(5100)
    expect(result.netSalary).toBe(24900)
    expect(result.netSalaryPerPeriod.mensual).toBe(24900)
    expect(result.netSalaryPerPeriod.quincenal).toBe(12450)
    expect(result.netSalaryPerPeriod.semanal).toBe(5746.15)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateArgentinaSalaryNet({
        countryCode: "ar",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })

  test("applies IR progresivo when salary exceeds the minimum tax-free threshold", () => {
    const result = calculateArgentinaSalaryNet({
      countryCode: "ar",
      grossSalary: 2000000,
      frequency: "mensual",
    })

    expect(result.deductions).toHaveLength(4)
    const ir = result.deductions.find((d) => d.label === "IR")
    expect(ir?.amount).toBeGreaterThan(0)
  })
})
