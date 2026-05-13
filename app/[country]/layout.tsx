import type { Metadata } from "next"
import { countryList, isValidCountry } from "@/lib/countries"
import type { CountryCode } from "@/lib/settlement/types"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export async function generateStaticParams() {
  return countryList.map((c) => ({ country: c.code }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>
}): Promise<Metadata> {
  const { country } = await params

  if (!isValidCountry(country)) {
    return {
      title: "Justo · Asistente laboral para Centroamérica",
    }
  }

  const info = countryList.find((c) => c.code === country)!

  const languages: Record<string, string> = {}
  for (const c of countryList) {
    languages[c.hreflang] = `${SITE_URL}/${c.code}`
  }
  languages["x-default"] = `${SITE_URL}/`

  return {
    title: info.title,
    description: info.description,
    alternates: {
      canonical: `${SITE_URL}/${country}`,
      languages,
    },
    openGraph: {
      title: info.ogTitle,
      description: info.ogDescription,
      url: `${SITE_URL}/${country}`,
      siteName: "Justo",
      images: [
        {
          url: `${SITE_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: info.locale,
      type: "website",
    },
    other: {
      "geo.region": country.toUpperCase(),
      "geo.placename": info.name,
    },
  }
}

export default function CountryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
