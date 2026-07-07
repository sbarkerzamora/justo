import { notFound } from "next/navigation"
import { getCountryInfo, isValidCountry } from "@/lib/countries"
import { CountryShell } from "@/components/country-shell"
import { type Locale, isValidLocale } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"
import { getSeoData, type SeoData } from "@/lib/country-seo-data"
import { isAppMode } from "@/components/chat/types"

const SITE_URL = getSiteUrl()

export default async function CountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; country: string }>
  searchParams: Promise<{ tool?: string }>
}) {
  const { locale, country } = await params
  const { tool } = await searchParams

  if (!isValidLocale(locale) || !isValidCountry(country)) {
    notFound()
  }

  const info = getCountryInfo(country)!
  const seo = getSeoData(country, locale, info.name)
  const pageUrl = `${SITE_URL}/${locale}/${country}`
  const jsonLd = buildJsonLd({
    locale,
    country,
    countryName: info.name,
    pageUrl,
    seo,
  })

  return (
    <>
      <CountryShell
        countryCode={country}
        locale={locale}
        initialTool={isAppMode(tool) && tool !== "chat" ? tool : undefined}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}

function buildJsonLd({
  locale,
  country,
  countryName,
  pageUrl,
  seo,
}: {
  locale: Locale
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
      inLanguage: locale === "en" ? "en" : `es-${country.toUpperCase()}`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: seo.intro,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Justo", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: countryName, item: pageUrl },
      ],
    },
  ]
}
