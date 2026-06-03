import { describe, expect, test } from "bun:test"
import {
  calculateNicaraguaTermination,
  calculateElSalvadorTermination,
  calculateGuatemalaTermination,
  calculateHondurasTermination,
  calculateCostaRicaTermination,
  calculatePanamaTermination,
  calculateMexicoTermination,
  calculateColombiaTermination,
  calculatePeruTermination,
  calculateArgentinaTermination,
  calculateChileTermination,
} from "./index"

const baseInput = {
  monthlySalary: 30000,
  startDate: "2023-01-01",
  endDate: "2024-01-01",
}

describe("termination calculators", () => {
  test("Nicaragua: unjustified dismissal generates indemnity", () => {
    const result = calculateNicaraguaTermination({
      ...baseInput,
      countryCode: "ni",
    })
    expect(result.currency).toBe("NIO")
    expect(result.tenureYears).toBe(1)
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.total).toBe(30000)
    const renuncia = result.scenarios.find((s) => s.type === "renuncia")
    expect(renuncia?.applicable).toBe(true)
    expect(renuncia?.total).toBe(0)
  })

  test("El Salvador: 30 days/year for unjustified dismissal", () => {
    const result = calculateElSalvadorTermination({
      ...baseInput,
      countryCode: "sv",
    })
    expect(result.currency).toBe("USD")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.total).toBe(30000)
    expect(injust?.lines[0]?.formula).toContain("30 días")
  })

  test("Guatemala: indemnity applies to all scenarios including renuncia", () => {
    const result = calculateGuatemalaTermination({
      ...baseInput,
      countryCode: "gt",
    })
    expect(result.currency).toBe("GTQ")
    const renuncia = result.scenarios.find((s) => s.type === "renuncia")
    expect(renuncia?.applicable).toBe(true)
    expect(renuncia?.total).toBe(30000)
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.total).toBeGreaterThanOrEqual(30000)
  })

  test("Honduras: cesantia + preaviso for unjustified dismissal", () => {
    const result = calculateHondurasTermination({
      ...baseInput,
      countryCode: "hn",
    })
    expect(result.currency).toBe("HNL")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.lines.length).toBeGreaterThanOrEqual(1)
    expect(injust?.total).toBeGreaterThan(0)
  })

  test("Costa Rica: cesantia + preaviso for unjustified dismissal", () => {
    const result = calculateCostaRicaTermination({
      ...baseInput,
      countryCode: "cr",
    })
    expect(result.currency).toBe("CRC")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.lines.length).toBeGreaterThanOrEqual(1)
    expect(injust?.total).toBeGreaterThan(0)
  })

  test("Panama: prima + indemnization for unjustified dismissal", () => {
    const result = calculatePanamaTermination({
      ...baseInput,
      countryCode: "pa",
    })
    expect(result.currency).toBe("USD")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.lines.length).toBeGreaterThanOrEqual(2)
    const renuncia = result.scenarios.find((s) => s.type === "renuncia")
    expect(renuncia?.applicable).toBe(true)
    expect(renuncia?.total).toBe(7000)
  })

  test("Mexico: 90 days + 12d/year + 12d/year for unjustified dismissal", () => {
    const result = calculateMexicoTermination({
      ...baseInput,
      countryCode: "mx",
    })
    expect(result.currency).toBe("MXN")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.lines).toHaveLength(3)
    expect(injust?.total).toBe(114000)
  })

  test("Colombia: 30 base + 20d/year for unjustified dismissal", () => {
    const result = calculateColombiaTermination({
      ...baseInput,
      countryCode: "co",
    })
    expect(result.currency).toBe("COP")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.total).toBe(30000)
  })

  test("Peru: escala 45d/year, min 90 days", () => {
    const result = calculatePeruTermination({
      ...baseInput,
      countryCode: "pe",
    })
    expect(result.currency).toBe("PEN")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.total).toBe(90000)
  })

  test("Argentina: 1 month/year for unjustified dismissal", () => {
    const result = calculateArgentinaTermination({
      ...baseInput,
      countryCode: "ar",
    })
    expect(result.currency).toBe("ARS")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.total).toBe(30000)
  })

  test("Chile: 30d/year + aviso sustitutivo for unjustified dismissal", () => {
    const result = calculateChileTermination({
      ...baseInput,
      countryCode: "cl",
    })
    expect(result.currency).toBe("CLP")
    const injust = result.scenarios.find(
      (s) => s.type === "despido_injustificado",
    )
    expect(injust?.applicable).toBe(true)
    expect(injust?.lines).toHaveLength(2)
    expect(injust?.total).toBe(60000)
  })

  test("all 4 scenarios are present in result", () => {
    const result = calculateNicaraguaTermination({
      ...baseInput,
      countryCode: "ni",
    })
    const types = result.scenarios.map((s) => s.type)
    expect(types).toContain("renuncia")
    expect(types).toContain("despido_justificado")
    expect(types).toContain("despido_injustificado")
    expect(types).toContain("mutuo_acuerdo")
    expect(result.scenarios).toHaveLength(4)
  })

  test("result metadata is present", () => {
    const result = calculateNicaraguaTermination({
      ...baseInput,
      countryCode: "ni",
    })
    expect(result.generatedAt).toBeTruthy()
    expect(result.legalCorpusVersion).toBeTruthy()
    expect(result.tenureDays).toBeGreaterThan(0)
    expect(result.dailySalary).toBe(1000)
  })
})
