import { describe, expect, test } from "bun:test"
import { preavisoCalculators } from "./index"
import type { CountryCode } from "../settlement"
import type { PreavisoInput } from "./types"

const input = (
  countryCode: CountryCode,
  monthlySalary: number,
  tenureYears: number,
  overrides: Partial<PreavisoInput> = {}
): PreavisoInput => ({
  countryCode,
  monthlySalary,
  tenureYears,
  terminationCause: "despido_injustificado",
  contractType: "indeterminado",
  noticeGivenInWriting: false,
  replaceNoticeWithPayment: true,
  ...overrides,
})

describe("preaviso — Argentina", () => {
  const calc = preavisoCalculators.ar

  test("menos de 5 años = 30 días", () => {
    const r = calc(input("ar", 3000, 4))
    expect(r.noticeDays).toBe(30)
    expect(r.noticeAmount).toBeGreaterThan(0)
    expect(r.hasSubstitutePayment).toBe(true)
  })

  test("5 años o más = 60 días", () => {
    const r = calc(input("ar", 3000, 8))
    expect(r.noticeDays).toBe(60)
    expect(r.noticeAmount).toBe(6000)
  })
})

describe("preaviso — Chile", () => {
  const calc = preavisoCalculators.cl

  test("siempre 30 días (aviso sustitutivo)", () => {
    const r = calc(input("cl", 1500000, 6))
    expect(r.noticeDays).toBe(30)
    expect(r.legalReference).toContain("Arts. 161")
  })
})

describe("preaviso — Costa Rica", () => {
  const calc = preavisoCalculators.cr

  test("menos de 3 meses = 0 días", () => {
    const r = calc(input("cr", 1000000, 0.2))
    expect(r.noticeDays).toBe(0)
  })

  test("entre 3 y 6 meses = 7 días", () => {
    const r = calc(input("cr", 1000000, 0.33))
    expect(r.noticeDays).toBe(7)
  })

  test("entre 6 y 12 meses = 15 días", () => {
    const r = calc(input("cr", 1000000, 0.5))
    expect(r.noticeDays).toBe(15)
  })

  test("1 año o más = 30 días", () => {
    const r = calc(input("cr", 1000000, 6))
    expect(r.noticeDays).toBe(30)
  })
})

describe("preaviso — Honduras", () => {
  const calc = preavisoCalculators.hn

  test("menos de 6 meses = 7 días", () => {
    const r = calc(input("hn", 15000, 0.3))
    expect(r.noticeDays).toBe(7)
  })

  test("menos de 3 meses = 1 día (trivial)", () => {
    const r = calc(input("hn", 15000, 0.1))
    expect(r.noticeDays).toBe(1)
  })

  test("más de 2 años = 60 días", () => {
    const r = calc(input("hn", 15000, 6))
    expect(r.noticeDays).toBe(60)
  })
})

describe("preaviso — Colombia", () => {
  const calc = preavisoCalculators.co

  test("contrato indefinido = 0 días (nota informativa)", () => {
    const r = calc(input("co", 3000000, 6))
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — Guatemala", () => {
  const calc = preavisoCalculators.gt

  test("menos de 6 meses = 7 días", () => {
    const r = calc(input("gt", 5000, 0.25))
    expect(r.noticeDays).toBe(7)
  })

  test("más de 5 años = 30 días", () => {
    const r = calc(input("gt", 5000, 8))
    expect(r.noticeDays).toBe(30)
    expect(r.noticeAmount).toBe(5000)
  })
})

describe("preaviso — México", () => {
  const calc = preavisoCalculators.mx

  test("0 días (no existe preaviso patronal)", () => {
    const r = calc(input("mx", 25000, 6))
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — Nicaragua", () => {
  const calc = preavisoCalculators.ni

  test("menos de 6 meses = 7 días", () => {
    const r = calc(input("ni", 15000, 0.25))
    expect(r.noticeDays).toBe(7)
  })

  test("más de 5 años = 60 días", () => {
    const r = calc(input("ni", 15000, 8))
    expect(r.noticeDays).toBe(60)
    expect(r.noticeAmount).toBe(30000)
  })
})

describe("preaviso — Panamá", () => {
  const calc = preavisoCalculators.pa

  test("menos de 2 años = 30 días", () => {
    const r = calc(input("pa", 2000, 1))
    expect(r.noticeDays).toBe(30)
    expect(r.noticeAmount).toBe(2000)
  })

  test("2 años o más = 0 días (estabilidad)", () => {
    const r = calc(input("pa", 2000, 6))
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — Perú", () => {
  const calc = preavisoCalculators.pe

  test("0 días (despido arbitrario)", () => {
    const r = calc(input("pe", 3000, 6))
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — El Salvador", () => {
  const calc = preavisoCalculators.sv

  test("0 días (no existe preaviso patronal)", () => {
    const r = calc(input("sv", 1000, 6))
    expect(r.noticeDays).toBe(0)
    expect(r.calculationNote).toBeTruthy()
  })
})

describe("preaviso — campos transversales", () => {
  const calc = preavisoCalculators.ni

  test("descuenta preaviso escrito ya otorgado", () => {
    const r = calc(
      input("ni", 15000, 8, { noticeGivenInWriting: true, noticeDaysGiven: 10 })
    )
    expect(r.noticeDays).toBe(50)
    expect(r.noticeAmount).toBe(25000)
  })

  test("no calcula pago sustitutivo cuando no se solicita", () => {
    const r = calc(input("ni", 15000, 8, { replaceNoticeWithPayment: false }))
    expect(r.noticeDays).toBe(60)
    expect(r.noticeAmount).toBe(0)
    expect(r.hasSubstitutePayment).toBe(false)
  })

  test("no aplica para periodo de prueba", () => {
    const r = calc(input("ni", 15000, 0.2, { contractType: "periodo_prueba" }))
    expect(r.noticeDays).toBe(0)
    expect(r.noticeAmount).toBe(0)
  })
})
