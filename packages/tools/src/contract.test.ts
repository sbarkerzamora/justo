import { describe, expect, test } from "bun:test"
import { contractTool } from "./contract"

describe("contractTool", () => {
  test("exposes marketplace metadata for all countries", () => {
    expect(contractTool.id).toBe("contract")
    expect(contractTool.slug).toBe("generador-contratos")
    expect(contractTool.availability).toBe("available")
    expect(contractTool.category).toBe("document")
    expect(contractTool.countrySupport).toHaveLength(11)
    expect(contractTool.countrySupport).toContain("ni")
    expect(contractTool.countrySupport).toContain("cl")
  })

  test("includes Nicaragua country override", () => {
    const override = contractTool.countryOverrides?.ni
    expect(override).toBeDefined()
    expect(override?.legalReferences).toContain("Ley 185 Arts. 19-29")
    expect(override?.corpusVersion).toBe("ni-v0.3.0")
  })

  test("includes El Salvador country override", () => {
    const override = contractTool.countryOverrides?.sv
    expect(override).toBeDefined()
    expect(override?.legalReferences).toContain("Código de Trabajo Art. 23")
  })
})