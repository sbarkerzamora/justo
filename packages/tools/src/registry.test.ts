import { describe, expect, test } from "bun:test"

import { getAvailableTools, getToolBySlug, getTools } from "./registry"

describe("tools registry", () => {
  test("includes settlement", () => {
    expect(getTools().some((tool) => tool.id === "settlement")).toBe(true)
  })

  test("finds settlement by slug", () => {
    const tool = getToolBySlug("liquidacion-laboral")

    expect(tool?.id).toBe("settlement")
    expect(tool?.availability).toBe("available")
  })

  test("returns only available tools", () => {
    expect(getAvailableTools().every((tool) => tool.availability === "available")).toBe(true)
    expect(getAvailableTools().map((tool) => tool.id)).toEqual([
      "settlement",
      "vacations",
    ])
  })

  test("finds vacations by slug", () => {
    const tool = getToolBySlug("vacaciones")

    expect(tool?.id).toBe("vacations")
    expect(tool?.availability).toBe("available")
    expect(tool?.countrySupport).toContain("ni")
    expect(tool?.countrySupport.length).toBe(11)
  })
})
