import { isValidCountry, countryList } from "@/lib/countries"
import { CountrySeoContent } from "@/components/country-seo-content"
import { CountryStatsSection } from "@/components/country-stats-section"
import { getSeoData, type SeoData } from "@/lib/country-seo-data"
import { GuideCountrySelector } from "@/components/guide-country-selector"
import { getSiteUrl } from "@/lib/site-url"
import type { Metadata } from "next"
import Link from "next/link"

const SITE_URL = getSiteUrl()
const defaultCountry = "ni"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}): Promise<Metadata> {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : defaultCountry
  const info = countryList.find((c) => c.code === cc)!
  const seo = getSeoData(cc, "es", info.name)

  return {
    title: `Guía laboral de ${info.name} · Justo`,
    description: `${seo.intro} Datos anónimos y cómo funciona la calculadora de liquidación laboral para ${info.name}.`,
    alternates: {
      canonical: `${SITE_URL}/guia-laboral?country=${cc}`,
    },
    openGraph: {
      title: `Guía laboral de ${info.name} · Justo`,
      description: seo.intro,
      url: `${SITE_URL}/guia-laboral?country=${cc}`,
      siteName: "Justo",
      locale: "es_419",
      type: "website",
    },
  }
}

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : defaultCountry
  const info = countryList.find((c) => c.code === cc)!
  const seo = getSeoData(cc, "es", info.name)
  const pageUrl = `${SITE_URL}/guia-laboral?country=${cc}`
  const calculatorUrl = `/${cc}`

  return (
    <>
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
                Guía laboral
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Cómo funciona y estadísticas — {info.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {seo.intro}
              </p>
            </div>
            <GuideCountrySelector current={cc} />
          </div>
          <div className="mt-6">
            <Link
              href={calculatorUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              Ir a la calculadora de {info.name}
            </Link>
          </div>
        </section>

        <CountrySeoContent countryName={info.name} seo={seo} locale="es" />
        <CountryStatsSection countryCode={cc} locale="es" />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd({ country: cc, countryName: info.name, pageUrl, seo })),
        }}
      />
    </>
  )
}

function buildJsonLd({
  country,
  countryName,
  pageUrl,
  seo,
}: {
  country: string
  countryName: string
  pageUrl: string
  seo: SeoData
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: seo.h1,
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: `es-${country.toUpperCase()}`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: seo.intro,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faqs.map(
        (faq: { question: string; answer: string }) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })
      ),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Justo", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guía laboral",
          item: `${SITE_URL}/guia-laboral`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: countryName,
          item: pageUrl,
        },
      ],
    },
  ]
}
