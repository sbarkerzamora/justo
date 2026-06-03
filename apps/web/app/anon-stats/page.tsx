import { isValidCountry, countryList } from "@/lib/countries"
import { CountrySeoContent } from "@/components/country-seo-content"
import { CountryStatsSection } from "@/components/country-stats-section"
import { getSeoData } from "@/lib/country-seo-data"
import { AnonCountrySelector } from "@/components/anon-country-selector"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Estadisticas anonimas | Justo",
  description:
    "Datos anonimos de liquidaciones y como funciona la calculadora laboral por pais. Sin informacion personal.",
}

const defaultCountry = "ni"

export default async function AnonStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : defaultCountry
  const info = countryList.find((c) => c.code === cc)!
  const seo = getSeoData(cc, "es", info.name)

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              className="mb-4 inline-flex text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              href="/"
            >
              Volver a Justo
            </Link>
            <div className="mb-4 inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Datos anonimos
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Como funciona y estadisticas
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Datos anonimos basados en calculos reales. No se almacena informacion personal
              solo rangos de salario, antiguedad y montos netos.
            </p>
          </div>
          <AnonCountrySelector current={cc} />
        </div>
      </section>

      <CountrySeoContent countryName={info.name} seo={seo} locale="es" />
      <CountryStatsSection countryCode={cc} locale="es" />
    </main>
  )
}
