import { describe, expect, test } from "bun:test"
import {
  calculateArgentinaBonus,
  calculateChileBonus,
  calculateColombiaBonus,
  calculateCostaRicaBonus,
  calculateElSalvadorBonus,
  calculateGuatemalaBonus,
  calculateHondurasBonus,
  calculateMexicoBonus,
  calculateNicaraguaBonus,
  calculatePanamaBonus,
  calculatePeruBonus,
} from "./index"

const baseInput = {
  monthlySalary: 30000,
  startDate: "2024-01-01",
  endDate: "2024-12-31",
}

describe("bonus calculators", () => {
  test("calculates Nicaragua aguinaldo", () => {
    const result = calculateNicaraguaBonus({ ...baseInput, countryCode: "ni" })
    expect(result.supported).toBe(true)
    expect(result.currency).toBe("NIO")
    expect(result.lines).toHaveLength(1)
    expect(result.total).toBe(30000)
  })

  test("calculates Guatemala aguinaldo and bono 14", () => {
    const result = calculateGuatemalaBonus({ ...baseInput, countryCode: "gt" })
    expect(result.currency).toBe("GTQ")
    expect(result.lines).toHaveLength(2)
    expect(result.total).toBe(60000)
  })

  test("calculates Honduras aguinaldo", () => {
    const result = calculateHondurasBonus({ ...baseInput, countryCode: "hn" })
    expect(result.currency).toBe("HNL")
    expect(result.total).toBe(30000)
  })

  test("calculates Costa Rica aguinaldo", () => {
    const result = calculateCostaRicaBonus({ ...baseInput, countryCode: "cr" })
    expect(result.currency).toBe("CRC")
    expect(result.total).toBe(30000)
  })

  test("calculates Panama decimo", () => {
    const result = calculatePanamaBonus({ ...baseInput, countryCode: "pa" })
    expect(result.currency).toBe("USD")
    expect(result.lines[0]?.label).toBe("Decimotercer Mes")
    expect(result.total).toBe(30000)
  })

  test("calculates El Salvador aguinaldo scale", () => {
    const result = calculateElSalvadorBonus({ ...baseInput, countryCode: "sv" })
    expect(result.currency).toBe("USD")
    expect(result.lines[0]?.formula).toContain("15 dias")
    expect(result.total).toBe(15000)
  })

  test("calculates Mexico aguinaldo", () => {
    const result = calculateMexicoBonus({ ...baseInput, countryCode: "mx" })
    expect(result.currency).toBe("MXN")
    expect(result.total).toBe(15000)
  })

  test("calculates Colombia prima", () => {
    const result = calculateColombiaBonus({ ...baseInput, countryCode: "co" })
    expect(result.currency).toBe("COP")
    expect(result.lines[0]?.label).toBe("Prima de servicios")
    expect(result.total).toBe(30000)
  })

  test("calculates Peru gratificaciones", () => {
    const result = calculatePeruBonus({ ...baseInput, countryCode: "pe" })
    expect(result.currency).toBe("PEN")
    expect(result.total).toBe(60000)
  })

  test("calculates Argentina SAC by semester", () => {
    const result = calculateArgentinaBonus({ ...baseInput, countryCode: "ar" })
    expect(result.currency).toBe("ARS")
    expect(result.lines[0]?.label).toBe("SAC / Aguinaldo")
    expect(result.total).toBe(14918.48)
  })

  test("returns Chile fallback", () => {
    const result = calculateChileBonus({ ...baseInput, countryCode: "cl" })
    expect(result.supported).toBe(false)
    expect(result.currency).toBe("CLP")
    expect(result.total).toBe(0)
    expect(result.fallbackReason).toContain("Chile")
  })
})
