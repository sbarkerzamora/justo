import { describe, expect, test } from "bun:test"

import { calculateNicaraguaSalaryNet } from "./calculate"

describe("calculateNicaraguaSalaryNet", () => {
  test("calculates deductions and net salary for monthly frequency", () => {
    const result = calculateNicaraguaSalaryNet({
      countryCode: "ni",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("NIO")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const inss = result.deductions.find((d) => d.label === "INSS laboral")
    expect(inss?.amount).toBe(2100)

    const ir = result.deductions.find((d) => d.label === "IR rentas del trabajo")
    expect(ir?.amount).toBe(418.50)

    expect(result.totalDeductions).toBe(2518.50)
    expect(result.netSalary).toBe(27481.50)
    expect(result.netSalaryPerPeriod.mensual).toBe(27481.50)
    expect(result.netSalaryPerPeriod.quincenal).toBe(13740.75)
    expect(result.netSalaryPerPeriod.semanal).toBe(6341.88)
    expect(result.legalCorpusVersion).toBe("ni-v0.3.0")
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculateNicaraguaSalaryNet({
        countryCode: "ni",
        grossSalary: 0,
        frequency: "mensual",
      })
    ).toThrow("El salario bruto debe ser positivo")
  })
})
