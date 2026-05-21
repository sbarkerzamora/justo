import type { MetadataRoute } from "next"
import { countryList } from "@/lib/countries"
import { getSiteUrl } from "@/lib/site-url"
import { source } from "@/lib/source"

const SITE_URL = getSiteUrl()
const LAST_MODIFIED = new Date()

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

  for (const country of countryList) {
    entries.push({
      url: `${SITE_URL}/${country.code}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 0.9,
    })
  }

  return [...entries, ...getDocsEntries()]
}
