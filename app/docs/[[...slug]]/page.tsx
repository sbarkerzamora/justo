import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import { source } from "@/lib/source"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}
  return {
    title: page.data.title ?? "Justo Docs",
    description: page.data.description,
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
    toc?: unknown
    full?: boolean
  }

  return (
    <DocsPage toc={pageData.toc as any} full={pageData.full ?? true}>
      <DocsTitle>{pageData.title}</DocsTitle>
      {pageData.description ? <DocsDescription>{pageData.description}</DocsDescription> : null}
      <DocsBody>{pageData.body}</DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}
