import type { MetadataRoute } from "next"
import { countryList } from "@/lib/countries"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ]

  for (const country of countryList) {
    entries.push({
      url: `${SITE_URL}/${country.code}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    })
  }

  return entries
}
