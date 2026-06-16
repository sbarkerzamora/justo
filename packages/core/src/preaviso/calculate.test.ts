import { describe, expect, test } from "bun:test"
import { preavisoCalculators } from "./index"

describe("preaviso — Argentina", () => {
  const calc = preavisoCalculators.ar

  test("menos de 5 años = 30 días", () => {
    const r = calc({ countryCode: "ar", monthlySalary: 3000, startDate: "2020-01-01", endDate: "2024-12-31", tenureYears: 4 })
    expect(r.noticeDays).toBe(30)
    expect(r.noticeAmount).toBeGreaterThan(0)
    expect(r.hasSubstitutePayment).toBe(true)
  })

  test("5 años o más = 60 días", () => {
    const r = calc({ countryCode: "ar", monthlySalary: 3000, startDate: "2018-01-01", endDate: "2026-05-11", tenureYears: 8 })
    expect(r.noticeDays).toBe(60)
    expect(r.noticeAmount).toBe(6000)
  })
})

describe("preaviso — Chile", () => {
  const calc = preavisoCalculators.cl

  test("siempre 30 días (aviso sustitutivo)", () => {
    const r = calc({ countryCode: "cl", monthlySalary: 1500000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(30)
    expect(r.legalReference).toContain("Arts. 161")
  })
})

describe("preaviso — Costa Rica", () => {
  const calc = preavisoCalculators.cr

  test("menos de 3 meses = 0 días", () => {
    const r = calc({ countryCode: "cr", monthlySalary: 1000000, startDate: "2026-02-01", endDate: "2026-04-15", tenureYears: 0.2 })
    expect(r.noticeDays).toBe(0)
  })

  test("entre 3 y 6 meses = 7 días", () => {
    const r = calc({ countryCode: "cr", monthlySalary: 1000000, startDate: "2025-12-15", endDate: "2026-04-15", tenureYears: 0.33 })
    expect(r.noticeDays).toBe(7)
  })

  test("entre 6 y 12 meses = 15 días", () => {
    const r = calc({ countryCode: "cr", monthlySalary: 1000000, startDate: "2025-10-01", endDate: "2026-04-15", tenureYears: 0.5 })
    expect(r.noticeDays).toBe(15)
  })

  test("1 año o más = 30 días", () => {
    const r = calc({ countryCode: "cr", monthlySalary: 1000000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(30)
  })
})

describe("preaviso — Honduras", () => {
  const calc = preavisoCalculators.hn

  test("menos de 6 meses = 7 días", () => {
    const r = calc({ countryCode: "hn", monthlySalary: 15000, startDate: "2026-01-01", endDate: "2026-04-30", tenureYears: 0.3 })
    expect(r.noticeDays).toBe(7)
  })

  test("menos de 3 meses = 1 día (trivial)", () => {
    const r = calc({ countryCode: "hn", monthlySalary: 15000, startDate: "2026-02-01", endDate: "2026-03-15", tenureYears: 0.1 })
    expect(r.noticeDays).toBe(1)
  })

  test("más de 2 años = 60 días", () => {
    const r = calc({ countryCode: "hn", monthlySalary: 15000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(60)
  })
})

describe("preaviso — Colombia", () => {
  const calc = preavisoCalculators.co

  test("contrato indefinido = 0 días (nota informativa)", () => {
    const r = calc({ countryCode: "co", monthlySalary: 3000000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — Guatemala", () => {
  const calc = preavisoCalculators.gt

  test("menos de 6 meses = 7 días", () => {
    const r = calc({ countryCode: "gt", monthlySalary: 5000, startDate: "2026-02-01", endDate: "2026-04-30", tenureYears: 0.25 })
    expect(r.noticeDays).toBe(7)
  })

  test("más de 5 años = 30 días", () => {
    const r = calc({ countryCode: "gt", monthlySalary: 5000, startDate: "2018-01-01", endDate: "2026-05-11", tenureYears: 8 })
    expect(r.noticeDays).toBe(30)
    expect(r.noticeAmount).toBe(5000)
  })
})

describe("preaviso — México", () => {
  const calc = preavisoCalculators.mx

  test("0 días (no existe preaviso patronal)", () => {
    const r = calc({ countryCode: "mx", monthlySalary: 25000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — Nicaragua", () => {
  const calc = preavisoCalculators.ni

  test("menos de 6 meses = 7 días", () => {
    const r = calc({ countryCode: "ni", monthlySalary: 15000, startDate: "2026-02-01", endDate: "2026-04-30", tenureYears: 0.25 })
    expect(r.noticeDays).toBe(7)
  })

  test("más de 5 años = 60 días", () => {
    const r = calc({ countryCode: "ni", monthlySalary: 15000, startDate: "2018-01-01", endDate: "2026-05-11", tenureYears: 8 })
    expect(r.noticeDays).toBe(60)
    expect(r.noticeAmount).toBe(30000)
  })
})

describe("preaviso — Panamá", () => {
  const calc = preavisoCalculators.pa

  test("menos de 2 años = 30 días", () => {
    const r = calc({ countryCode: "pa", monthlySalary: 2000, startDate: "2025-01-01", endDate: "2026-05-11", tenureYears: 1 })
    expect(r.noticeDays).toBe(30)
    expect(r.noticeAmount).toBe(2000)
  })

  test("2 años o más = 0 días (estabilidad)", () => {
    const r = calc({ countryCode: "pa", monthlySalary: 2000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — Perú", () => {
  const calc = preavisoCalculators.pe

  test("0 días (despido arbitrario)", () => {
    const r = calc({ countryCode: "pe", monthlySalary: 3000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — El Salvador", () => {
  const calc = preavisoCalculators.sv

  test("0 días (no existe preaviso patronal)", () => {
    const r = calc({ countryCode: "sv", monthlySalary: 1000, startDate: "2020-01-01", endDate: "2026-05-11", tenureYears: 6 })
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})
