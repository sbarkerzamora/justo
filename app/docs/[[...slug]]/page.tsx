import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import { source } from "@/lib/source"
import { getSiteUrl } from "@/lib/site-url"

const SITE_URL = getSiteUrl()

function docsPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/docs"
  return `/docs/${slug.join("/")}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}
  const path = docsPath(slug)
  const canonical = `${SITE_URL}${path}`
  const title = page.data.title ?? "Justo Docs"
  const description = page.data.description
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      siteName: "Justo",
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) notFound()

  const pageData = page.data as {
    body: React.ReactNode
    title: string
    description?: string
    toc?: React.ComponentProps<typeof DocsPage>["toc"]
    full?: boolean
  }

  return (
    <DocsPage toc={pageData.toc} full={pageData.full ?? true}>
      <DocsTitle>{pageData.title}</DocsTitle>
      {pageData.description ? <DocsDescription>{pageData.description}</DocsDescription> : null}
      <DocsBody>{pageData.body}</DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}
