export const locales = ["es", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "es"

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function detectLocale(language?: string | null): Locale {
  if (!language) return defaultLocale
  return language.toLowerCase().startsWith("en") ? "en" : "es"
}

export function localizedCountryPath(locale: Locale, country: string): string {
  return `/${locale}/${country}`
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es"
}
