// Minimum wage values per country
// Update annually when new minimum wages are published by each country's authority.
// Sources: official government publications (CONASAMI MX, MTEPS SV, MINTRABAJO CO, etc.)

export interface MinimumWageData {
  /** Monthly minimum wage in local currency */
  monthly: number
  /** Daily minimum wage (monthly / 30) */
  daily: number
  /** Year these values correspond to */
  year: number
}

const wages: Record<string, MinimumWageData> = {
  mx: {
    monthly: 8364, // $278.80/dia × 30 = $8,364 MXN/mes (Salario Minimo General 2025, CONASAMI)
    daily: 278.80,
    year: 2025,
  },
  sv: {
    monthly: 365, // $365 USD/mes ≈ $12.17/dia (Comercio/Servicios 2025, MTEPS)
    daily: 12.17,
    year: 2025,
  },
  co: {
    monthly: 1423500, // $1,423,500 COP/mes (SMMLV 2025, MINTRABAJO)
    daily: 47450,
    year: 2025,
  },
}

export const getMinimumWage = (countryCode: string): MinimumWageData | null =>
  wages[countryCode] ?? null
