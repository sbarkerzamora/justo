import type { Metadata } from "next"
import { ToolsPage, type ToolsPageCopy } from "./tools-page"
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
    ? `Herramientas laborales para ${info.name} | Justo`
    : "Herramientas laborales abiertas | Justo"
  const description = info
    ? `Calculadoras laborales open source para ${info.name}: liquidación, vacaciones, salario neto, aguinaldo y más. Gratis, sin registro.`
    : "Calculadoras y asistentes laborales open source para liquidaciones, vacaciones, salario neto y cumplimiento laboral en Latinoamerica."

  return {
    title,
    description,
    alternates: {
      canonical: info
        ? `${SITE_URL}/tools?country=${cc}`
        : `${SITE_URL}/tools`,
    },
    openGraph: {
      title,
      description,
      url: info
        ? `${SITE_URL}/tools?country=${cc}`
        : `${SITE_URL}/tools`,
      siteName: "Justo",
      images: [{ url: `${SITE_URL}/images/og-image.png`, width: 1200, height: 630 }],
      locale: "es_419",
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

const esCopy: ToolsPageCopy = {
  metaTitle: "Herramientas laborales abiertas | Justo",
  metaDescription: "Calculadoras y asistentes laborales open source para liquidaciones, vacaciones, salario neto y cumplimiento laboral en Latinoamerica.",
  badge: "Open source laboral",
  headingLine1: "Herramientas",
  headingLine2: "laborales abiertas",
  description: "Calculos verificables, corpus legal versionado y self-hosting.",
  availableLabel: "herramientas disponibles",
  roadmapLabel: "en roadmap OSS",
  countriesLabel: "paises en la base",
  availableLabelSingle: "herramienta disponible",
  roadmapLabelSingle: "en roadmap OSS",
  countriesLabelSingle: "pais",
  allCountries: "Todos los paises",
  availableNow: "Disponible ahora",
  comingSoon: "Proximamente",
  comingSoonBadge: "Proximamente",
  startButton: "Comenzar calculo",
  footerTitle: "Regla de producto",
  footerDescription: "Las herramientas laborales generales son abiertas. La plataforma empresarial con persistencia, equipos, auditoria y asistente de RRHH sera de pago.",
  forCountry: (name: string) => `Herramientas\nlaborales\npara ${name}`,
  emptyCountry: (name: string) => `No hay herramientas disponibles para ${name} aun.`,
  categoryLabels: {
    assistant: "Asistente",
    calculation: "Calculo",
    checklist: "Checklist",
    document: "Documento",
  },
  statusLabels: {
    available: "Disponible",
    coming_soon: "Proximamente",
  },
}

export default async function ToolsPageES({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>
}) {
  const { country } = await searchParams
  return <ToolsPage copy={esCopy} country={country} locale="es" />
}
