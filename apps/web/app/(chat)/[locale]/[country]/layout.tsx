import type { Metadata } from "next"
import { countryList, isValidCountry } from "@/lib/countries"
import {
  getAlternateLocale,
  isValidLocale,
  locales,
  type Locale,
} from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"

const SITE_URL = getSiteUrl()

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    countryList.map((c) => ({ locale, country: c.code }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; country: string }>
}): Promise<Metadata> {
  const { locale, country } = await params

  if (!isValidLocale(locale) || !isValidCountry(country)) {
    return {
      title: "Justo · Asistente laboral para Centroamérica",
    }
  }

  const info = countryList.find((c) => c.code === country)!
  const typedLocale = locale as Locale
  const isEnglish = typedLocale === "en"
  const title = isEnglish
    ? `${info.name} Labor Settlement Calculator | Justo`
    : info.title
  const description = isEnglish
    ? `Calculate an estimated labor settlement for ${info.name} with transparent formulas, legal references and a printable PDF. Free and no registration required.`
    : info.description
  const ogTitle = isEnglish
    ? `Justo · Labor assistant for ${info.name}`
    : info.ogTitle
  const ogDescription = isEnglish
    ? `Estimate labor settlements for ${info.name} with transparent calculations and legal traceability.`
    : info.ogDescription

  const languages: Record<string, string> = {
    [info.hreflang]: `${SITE_URL}/es/${country}`,
    en: `${SITE_URL}/en/${country}`,
  }
  languages["x-default"] = `${SITE_URL}/`
  const alternateLocale = getAlternateLocale(typedLocale)

  return {
    title,
    description,
    keywords: [
      isEnglish
        ? `${info.name} labor calculator`
        : `calculadora laboral ${info.name}`,
      isEnglish
        ? `${info.name} settlement calculator`
        : `calculadora de liquidación ${info.name}`,
      isEnglish
        ? `labor settlement ${info.name}`
        : `calcular liquidación ${info.name}`,
      isEnglish
        ? `severance ${info.name}`
        : `indemnización laboral ${info.name}`,
      isEnglish
        ? `vacation pay ${info.name}`
        : `vacaciones laborales ${info.name}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/${locale}/${country}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${SITE_URL}/${locale}/${country}`,
      siteName: "Justo",
      images: [
        {
          url: `${SITE_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: isEnglish ? "en" : info.locale.replace("-", "_"),
      alternateLocale: [
        alternateLocale === "en" ? "en" : info.locale.replace("-", "_"),
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/images/og-image.png`],
    },
    other: {
      "geo.region": country.toUpperCase(),
      "geo.placename": info.name,
    },
  }
}

export const dynamicParams = false

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`html{overflow:hidden;scrollbar-width:none!important}html::-webkit-scrollbar{display:none!important}`}</style>
      {children}
    </>
  )
}
