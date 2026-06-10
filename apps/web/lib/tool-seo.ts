import type { CountryCode } from "@justo/core"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import { countryList } from "@/lib/countries"
import { getSiteUrl } from "@/lib/site-url"
import { countryLabels } from "@/lib/tools-common"

const SITE_URL = getSiteUrl()
const OG_IMAGE = `${SITE_URL}/images/og-image.png`

export function getToolCountryName(country: CountryCode | null): string | null {
  if (!country) return null
  return countryLabels[country] ?? country.toUpperCase()
}

export function getToolCanonical(
  slug: string,
  country: CountryCode | null
): string {
  const url = `${SITE_URL}/tools/${slug}`
  return country ? `${url}?country=${country}` : url
}

export function getToolPageMetadata({
  slug,
  tool,
  country,
  title,
  pageLocale = "es",
}: {
  slug: string
  tool: JustoTool
  country: CountryCode | null
  title: string
  pageLocale?: string
}): Metadata {
  const canonical = getToolCanonical(slug, country)
  const countryInfo = countryList.find((item) => item.code === country)
  const locale = countryInfo ? countryInfo.locale.replace("-", "_") : "es_419"

  const alternates: Metadata["alternates"] = {
    canonical,
  }

  if (country) {
    const prefix = pageLocale === "en" ? "/en" : ""
    const otherPrefix = pageLocale === "en" ? "" : "/en"
    alternates.languages = {
      es: `${SITE_URL}${pageLocale === "es" ? prefix : otherPrefix}/tools/${slug}?country=${country}`,
      en: `${SITE_URL}${pageLocale === "en" ? prefix : otherPrefix}/tools/${slug}?country=${country}`,
      "x-default": `${SITE_URL}/tools/${slug}`,
    }
  }

  return {
    title,
    description: tool.longDescription,
    alternates,
    openGraph: {
      title,
      description: tool.longDescription,
      url: canonical,
      siteName: "Justo",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: tool.longDescription,
      images: [OG_IMAGE],
    },
  }
}

export function buildToolJsonLd({
  slug,
  tool,
  country,
  title,
  pageLocale = "es",
}: {
  slug: string
  tool: JustoTool
  country: CountryCode | null
  title: string
  pageLocale?: string
}) {
  const canonical = getToolCanonical(slug, country)
  const countryName = getToolCountryName(country)
  const currentName = countryName ? `${tool.name} en ${countryName}` : tool.name
  const toolsLabel = pageLocale === "en" ? "Tools" : "Herramientas"
  const toolsUrl = pageLocale === "en" ? `${SITE_URL}/en/tools` : `${SITE_URL}/tools`
  const lang = pageLocale === "en" ? "en" : "es"

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      url: canonical,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: lang,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: tool.longDescription,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Justo", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: toolsLabel,
          item: toolsUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: currentName,
          item: canonical,
        },
      ],
    },
  ]
}

export function buildToolsItemListJsonLd(tools: JustoTool[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Herramientas laborales abiertas",
    url: `${SITE_URL}/tools`,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      description: tool.shortDescription,
      url: `${SITE_URL}/tools/${tool.slug}`,
    })),
  }
}
