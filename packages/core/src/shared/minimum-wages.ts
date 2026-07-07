// Historical minimum wage parameters used for legal caps.
// Sources are official government publications where available.

export interface MinimumWageData {
  /** Monthly minimum wage in local currency */
  monthly: number
  /** Daily minimum wage in local currency */
  daily: number
  /** Year these values correspond to */
  year: number
  /** Optional non-salary statutory allowance, e.g. Colombia transport allowance */
  auxiliaryAmount?: number
  /** Official source URL for auditability */
  officialSourceUrl: string
}

export interface MinimumWageRule extends MinimumWageData {
  countryCode: string
  regionCode: "GLOBAL" | "ZSMG" | "ZLFN"
  sectorCode: "GLOBAL" | "COMERCIO_SERVICIOS"
  validFrom: string
  validTo: string | null
}

export interface MinimumWageLookupOptions {
  regionCode?: MinimumWageRule["regionCode"]
  sectorCode?: MinimumWageRule["sectorCode"]
}

export interface MinimumWageCalculationLookup {
  wage: MinimumWageData | null
  warnings: string[]
}

const CONASAMI_SOURCE =
  "https://www.gob.mx/conasami/documentos/tabla-de-salarios-minimos-generales-y-profesionales-por-areas-geograficas"
const MTPS_SOURCE = "https://www.mtps.gob.sv/descargas/"
const CO_SOURCE = "https://www.funcionpublica.gov.co/eva/gestornormativo/"

const mxRule = (
  year: number,
  regionCode: "ZSMG" | "ZLFN",
  daily: number,
): MinimumWageRule => ({
  countryCode: "mx",
  regionCode,
  sectorCode: "GLOBAL",
  validFrom: `${year}-01-01`,
  validTo: `${year}-12-31`,
  monthly: Number((daily * 30).toFixed(2)),
  daily,
  year,
  officialSourceUrl: CONASAMI_SOURCE,
})

const svRule = (
  validFrom: string,
  validTo: string | null,
  monthly: number,
): MinimumWageRule => {
  const year = Number(validFrom.slice(0, 4))
  return {
    countryCode: "sv",
    regionCode: "GLOBAL",
    sectorCode: "COMERCIO_SERVICIOS",
    validFrom,
    validTo,
    monthly,
    daily: Number((monthly / 30).toFixed(2)),
    year,
    officialSourceUrl: MTPS_SOURCE,
  }
}

const coRule = (
  year: number,
  monthly: number,
  auxiliaryAmount: number,
): MinimumWageRule => ({
  countryCode: "co",
  regionCode: "GLOBAL",
  sectorCode: "GLOBAL",
  validFrom: `${year}-01-01`,
  validTo: `${year}-12-31`,
  monthly,
  daily: Number((monthly / 30).toFixed(2)),
  year,
  auxiliaryAmount,
  officialSourceUrl: CO_SOURCE,
})

export const minimumWageRules: MinimumWageRule[] = [
  mxRule(2021, "ZSMG", 141.7),
  mxRule(2021, "ZLFN", 213.39),
  mxRule(2022, "ZSMG", 172.87),
  mxRule(2022, "ZLFN", 260.34),
  mxRule(2023, "ZSMG", 207.44),
  mxRule(2023, "ZLFN", 312.41),
  mxRule(2024, "ZSMG", 248.93),
  mxRule(2024, "ZLFN", 374.89),
  mxRule(2025, "ZSMG", 278.8),
  mxRule(2025, "ZLFN", 419.88),
  svRule("2021-01-01", "2021-07-31", 304.17),
  svRule("2021-08-01", "2025-05-31", 365),
  svRule("2025-06-01", null, 408.8),
  coRule(2021, 908526, 106454),
  coRule(2022, 1000000, 117172),
  coRule(2023, 1160000, 140606),
  coRule(2024, 1300000, 162000),
  coRule(2025, 1423500, 200000),
]

const isRuleActive = (rule: MinimumWageRule, date: string) =>
  rule.validFrom <= date && (rule.validTo === null || date <= rule.validTo)

const getMinimumWageRules = (
  countryCode: string,
  options: MinimumWageLookupOptions,
) => {
  const normalizedCountry = countryCode.toLowerCase()
  const regionCode =
    options.regionCode ?? (normalizedCountry === "mx" ? "ZSMG" : "GLOBAL")
  const sectorCode =
    options.sectorCode ??
    (normalizedCountry === "sv" ? "COMERCIO_SERVICIOS" : "GLOBAL")

  return minimumWageRules.filter(
    (rule) =>
      rule.countryCode === normalizedCountry &&
      rule.regionCode === regionCode &&
      rule.sectorCode === sectorCode,
  )
}

export const capDailySalaryByMinimumWage = (
  dailySalary: number,
  minWageDaily: number,
  multiplier: number,
) => Math.min(dailySalary, minWageDaily * multiplier)

export const getMinimumWage = (
  countryCode: string,
  date?: string,
  options: MinimumWageLookupOptions = {},
): MinimumWageData | null => {
  const rules = getMinimumWageRules(countryCode, options)

  if (date) {
    return rules.find((rule) => isRuleActive(rule, date)) ?? null
  }

  return rules.toSorted((a, b) => b.validFrom.localeCompare(a.validFrom))[0] ?? null
}

export const getMinimumWageForCalculation = (
  countryCode: string,
  date: string,
  options: MinimumWageLookupOptions = {},
): MinimumWageCalculationLookup => {
  const exact = getMinimumWage(countryCode, date, options)
  if (exact) return { wage: exact, warnings: [] }

  const rules = getMinimumWageRules(countryCode, options)
    .toSorted((a, b) => b.validFrom.localeCompare(a.validFrom))

  const fallback = rules[0]
  if (!fallback || fallback.validTo === null || date <= fallback.validTo) {
    return { wage: null, warnings: [] }
  }

  return {
    wage: fallback,
    warnings: [
      `Este cálculo usa la base legal documentada disponible en Justo. No hay salario mínimo configurado para ${date}; se usó el valor documentado de ${fallback.year}. Verifica estos datos con un profesional. Estamos actualizando constantemente la base legal.`,
    ],
  }
}
