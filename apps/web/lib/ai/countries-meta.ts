export const SUPPORTED_COUNTRIES = [
  "ni",
  "gt",
  "sv",
  "hn",
  "cr",
  "pa",
  "mx",
  "co",
  "pe",
  "ar",
  "cl",
] as const

export type CountryCode = (typeof SUPPORTED_COUNTRIES)[number]

export const countryMeta: Record<string, { name: string; law: string }> = {
  ni: { name: "Nicaragua", law: "Ley No. 185 (Código del Trabajo)" },
  gt: { name: "Guatemala", law: "Decreto 1441 (Código de Trabajo)" },
  sv: { name: "El Salvador", law: "Código de Trabajo" },
  hn: { name: "Honduras", law: "Decreto 189-59 (Código de Trabajo)" },
  cr: { name: "Costa Rica", law: "Código de Trabajo" },
  pa: { name: "Panamá", law: "Código de Trabajo" },
  mx: { name: "México", law: "Ley Federal del Trabajo" },
  co: { name: "Colombia", law: "Código Sustantivo del Trabajo" },
  pe: { name: "Perú", law: "Ley General de Trabajo" },
  ar: { name: "Argentina", law: "Ley de Contrato de Trabajo 20.744" },
  cl: { name: "Chile", law: "Código del Trabajo (DFL 1)" },
}
