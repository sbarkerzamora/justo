import { notFound } from "next/navigation"
import { LegalPageContent } from "../legal-page"
import { getLegalPageMetadata, legalPages } from "@/lib/legal-pages"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== "es" && locale !== "en") return {}
  return getLegalPageMetadata(
    locale === "en" ? legalPages.en.cookies : legalPages.es.cookies
  )
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== "es" && locale !== "en") notFound()
  return <LegalPageContent locale={locale} slug="cookies" />
}
