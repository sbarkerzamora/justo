import { describe, expect, test } from "bun:test"

import { calculatePeruSalaryNet } from "./calculate"

describe("calculatePeruSalaryNet", () => {
  test("calculates ONP deduction for monthly frequency", () => {
    const result = calculatePeruSalaryNet({
      countryCode: "pe",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("PEN")
    expect(result.grossSalary).toBe(30000)
    expect(result.deductions).toHaveLength(2)

    const onp = result.deductions[0]
    expect(onp.label).toBe("ONP")
    expect(onp.amount).toBe(3900)

    const ir = result.deductions[1]
    expect(ir.label).toBe("IR")
    expect(ir.amount).toBe(4517.46)

    expect(result.totalDeductions).toBe(8417.46)
    expect(result.netSalary).toBe(21582.54)
    expect(result.netSalaryPerPeriod.mensual).toBe(21582.54)
    expect(result.netSalaryPerPeriod.quincenal).toBe(10791.27)
    expect(result.netSalaryPerPeriod.semanal).toBe(4980.59)
  })

  test("calculates AFP deduction when pensionSystem is afp", () => {
    const result = calculatePeruSalaryNet({
      countryCode: "pe",
      grossSalary: 30000,
      frequency: "mensual",
      pensionSystem: "afp",
    })

    expect(result.deductions).toHaveLength(2)

    const afp = result.deductions[0]
    expect(afp.label).toBe("AFP")
    expect(afp.amount).toBe(3360)

    const ir = result.deductions[1]
    expect(ir.label).toBe("IR")
    expect(ir.amount).toBe(4679.46)

    expect(result.totalDeductions).toBe(8039.46)
    expect(result.netSalary).toBe(21960.54)
    expect(result.netSalaryPerPeriod.mensual).toBe(21960.54)
    expect(result.netSalaryPerPeriod.quincenal).toBe(10980.27)
    expect(result.netSalaryPerPeriod.semanal).toBe(5067.82)
  })

  test("throws on non-positive salary", () => {
    expect(() =>
      calculatePeruSalaryNet({
        countryCode: "pe",
        grossSalary: 0,
        frequency: "mensual",
      }),
    ).toThrow("El salario bruto debe ser positivo")
  })
})
