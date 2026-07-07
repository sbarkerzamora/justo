import type { CountryCode } from "@justo/core"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import type { AppMode } from "@/components/chat/types"
import { countryList } from "@/lib/countries"
import { getSiteUrl } from "@/lib/site-url"
import { countryLabels } from "@/lib/tools-common"

const SITE_URL = getSiteUrl()
const OG_IMAGE = `${SITE_URL}/images/og-image.png`

export const toolAppModes: Record<string, AppMode> = {
  "liquidacion-laboral": "settlement",
  vacaciones: "vacations",
  "salario-neto": "salary-net",
  "aguinaldo-decimo-bono": "bonus",
  "simulador-terminacion": "termination",
  "generador-contratos": "contract",
  preaviso: "preaviso",
}

export function getToolCountryName(country: CountryCode | null): string | null {
  if (!country) return null
  return countryLabels[country] ?? country.toUpperCase()
}

export function getToolCanonical(
  slug: string,
  country: CountryCode | null,
  pageLocale = "es"
): string {
  if (country) return `${SITE_URL}/${pageLocale}/${country}/${slug}`
  return `${SITE_URL}${pageLocale === "en" ? "/en" : ""}/tools/${slug}`
}

export function getCleanToolPath(
  slug: string,
  country: CountryCode,
  pageLocale = "es"
): string {
  return `/${pageLocale}/${country}/${slug}`
}

export function getToolAppMode(slug: string): AppMode | null {
  return toolAppModes[slug] ?? null
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
  const canonical = getToolCanonical(slug, country, pageLocale)
  const countryInfo = countryList.find((item) => item.code === country)
  const locale = countryInfo ? countryInfo.locale.replace("-", "_") : "es_419"

  const alternates: Metadata["alternates"] = {
    canonical,
  }

  if (country) {
    alternates.languages = {
      es: `${SITE_URL}/es/${country}/${slug}`,
      en: `${SITE_URL}/en/${country}/${slug}`,
      "x-default": `${SITE_URL}/es/${country}/${slug}`,
    }
  } else {
    alternates.languages = {
      es: `${SITE_URL}/tools/${slug}`,
      en: `${SITE_URL}/en/tools/${slug}`,
      "x-default": `${SITE_URL}/tools/${slug}`,
    }
  }

  const countryName = getToolCountryName(country)
  const countrySuffix = countryName ? ` en ${countryName}` : ""
  const yearSuffix = " 2026"

  return {
    title: `${title}${yearSuffix} | Justo`,
    description: `${tool.shortDescription}${countrySuffix}. ${tool.outputSummary.slice(0, 3).join(", ")}. Gratuito, open source, con referencias legales.`,
    alternates,
    openGraph: {
      title,
      description: `${tool.shortDescription}${countrySuffix}. ${tool.outputSummary.slice(0, 3).join(", ")}.`,
      url: canonical,
      siteName: "Justo",
      images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${tool.shortDescription}${countrySuffix}.`,
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
  const canonical = getToolCanonical(slug, country, pageLocale)
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
