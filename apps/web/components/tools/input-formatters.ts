"use client"

export function formatCurrencyInput(value: string): string {
  const digits = value.replace(/[^\d.]/g, "")
  const parts = digits.split(".")
  const whole = parts[0] ?? ""
  const decimal = parts[1] ?? ""
  const limitedDecimal = decimal.slice(0, 2)
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  if (parts.length > 1) {
    return `${formattedWhole}.${limitedDecimal}`
  }
  return formattedWhole
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/,/g, "")
  const n = Number(cleaned)
  return Number.isFinite(n) && n >= 0 ? n : NaN
}

export function formatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
}

export function isValidDateInput(value: string): boolean {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(value)
}

export function formatNumberInput(value: string): string {
  return value.replace(/\D/g, "")
}

export function getCurrencySymbol(countryCode: string): string {
  const symbols: Record<string, string> = {
    ni: "C$",
    sv: "$",
    gt: "Q",
    hn: "L",
    cr: "₡",
    pa: "$",
    mx: "$",
    co: "$",
    pe: "S/",
    ar: "$",
    cl: "$",
  }
  return symbols[countryCode] ?? "$"
}
