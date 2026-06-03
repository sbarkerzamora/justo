import type { MetadataRoute } from "next"
import { countryList } from "@/lib/countries"
import { locales } from "@/lib/i18n"
import { getSiteUrl } from "@/lib/site-url"
import { source } from "@/lib/source"

const SITE_URL = getSiteUrl()
const LAST_MODIFIED = new Date().toISOString().replace(/\.\d+Z$/, "+00:00")

const toolSlugs = ["liquidacion-laboral", "vacaciones", "salario-neto"] as const

function toDocsPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/docs"
  return `/docs/${slug.join("/")}`
}

function getDocsEntries(): MetadataRoute.Sitemap {
  const params = source.generateParams() as Array<{ slug?: string[] }>
  const docsPaths = new Set<string>(["/docs"])

  for (const param of params) {
    docsPaths.add(toDocsPath(param.slug))
  }

  return Array.from(docsPaths).map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: path === "/docs" ? "weekly" : "monthly",
    priority: path === "/docs" ? 0.7 : 0.6,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ]

  for (const locale of locales) {
    for (const country of countryList) {
      entries.push({
        url: `${SITE_URL}/${locale}/${country.code}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: {
          languages: {
            [country.hreflang]: `${SITE_URL}/es/${country.code}`,
            en: `${SITE_URL}/en/${country.code}`,
            "x-default": `${SITE_URL}/`,
          },
        },
      })
    }
  }

  for (const country of countryList) {
    entries.push({
      url: `${SITE_URL}/guia-laboral?country=${country.code}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  }

  for (const slug of toolSlugs) {
    entries.push({
      url: `${SITE_URL}/tools/${slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.8,
    })
    for (const country of countryList) {
      entries.push({
        url: `${SITE_URL}/tools/${slug}?country=${country.code}`,
        lastModified: LAST_MODIFIED,
        changeFrequency: "weekly",
        priority: 0.7,
      })
    }
  }

  return [...entries, ...getDocsEntries()]
}
