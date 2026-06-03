import { describe, expect, test } from "bun:test"

import { calculateSalaryNet, salaryNetTool } from "./salary-net"

describe("salaryNetTool", () => {
  test("exposes marketplace metadata and calculates Nicaragua salary net", () => {
    expect(salaryNetTool.id).toBe("salary-net")
    expect(salaryNetTool.slug).toBe("salario-neto")
    expect(salaryNetTool.availability).toBe("available")
    expect(salaryNetTool.countrySupport).toContain("ni")
    expect(salaryNetTool.countrySupport.length).toBe(11)

    const result = calculateSalaryNet({
      countryCode: "ni",
      grossSalary: 30000,
      frequency: "mensual",
    })

    expect(result.currency).toBe("NIO")
    expect(result.netSalary).toBe(27481.50)
    expect(result.totalDeductions).toBe(2518.50)
    expect(result.legalCorpusVersion).toBeTruthy()
  })
})
