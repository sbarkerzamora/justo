const defaultAccent = "oklch(0.58 0.12 255)"

const countryAccents: Record<string, string> = {
  ni: "oklch(0.58 0.12 255)",
  sv: "oklch(0.56 0.13 252)",
  gt: "oklch(0.60 0.12 248)",
  hn: "oklch(0.57 0.13 253)",
  cr: "oklch(0.54 0.16 25)",
  pa: "oklch(0.53 0.17 22)",
  mx: "oklch(0.52 0.14 165)",
  co: "oklch(0.64 0.12 105)",
  pe: "oklch(0.53 0.17 20)",
  ar: "oklch(0.62 0.10 245)",
  cl: "oklch(0.53 0.17 23)",
}

export function getCountryAccent(countryCode: string): string {
  return countryAccents[countryCode] ?? defaultAccent
}
