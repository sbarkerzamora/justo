import type { Metadata } from "next"
import { ToolsPage, type ToolsPageCopy } from "../../tools/tools-page"
import { isValidCountry, countryList } from "@/lib/countries"
import { getSiteUrl } from "@/lib/site-url"

const SITE_URL = getSiteUrl()

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}): Promise<Metadata> {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : null
  const info = cc ? countryList.find((c) => c.code === cc) : null
  const title = info
    ? `Labor tools for ${info.name} | Justo`
    : "Open source labor tools | Justo"
  const description = info
    ? `Open source labor calculators for ${info.name}: settlement, vacations, net salary, bonus and more. Free, no registration.`
    : "Open source labor calculators and assistants for settlements, vacations, net salary and labor compliance in Latin America."

  return {
    title,
    description,
    alternates: {
      canonical: info
        ? `${SITE_URL}/en/tools?country=${cc}`
        : `${SITE_URL}/en/tools`,
    },
    openGraph: {
      title,
      description,
      url: info
        ? `${SITE_URL}/en/tools?country=${cc}`
        : `${SITE_URL}/en/tools`,
      siteName: "Justo",
      images: [{ url: `${SITE_URL}/images/og-image.png`, width: 1200, height: 630 }],
      locale: "en",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/og-image.png`],
    },
  }
}

const enCopy: ToolsPageCopy = {
  metaTitle: "Open source labor tools | Justo",
  metaDescription: "Open source labor calculators and assistants for settlements, vacations, net salary and labor compliance in Latin America.",
  badge: "Open source labor",
  headingLine1: "Open source",
  headingLine2: "labor tools",
  description: "Verifiable calculations, versioned legal corpus and self-hosting.",
  availableLabel: "tools available",
  roadmapLabel: "on OSS roadmap",
  countriesLabel: "countries supported",
  availableLabelSingle: "tool available",
  roadmapLabelSingle: "on OSS roadmap",
  countriesLabelSingle: "country",
  allCountries: "All countries",
  availableNow: "Available now",
  comingSoon: "Coming soon",
  comingSoonBadge: "Coming soon",
  startButton: "Start calculation",
  footerTitle: "Product rule",
  footerDescription: "General labor tools are open source. The enterprise platform with persistence, teams, audit and HR assistant will be paid.",
  forCountry: (name: string) => `Labor tools\nfor ${name}`,
  emptyCountry: (name: string) => `No tools available for ${name} yet.`,
  categoryLabels: {
    assistant: "Assistant",
    calculation: "Calculation",
    checklist: "Checklist",
    document: "Document",
  },
  statusLabels: {
    available: "Available",
    coming_soon: "Coming soon",
  },
}

export default async function ToolsPageEN({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams
  return <ToolsPage copy={enCopy} country={country} locale="en" />
}
