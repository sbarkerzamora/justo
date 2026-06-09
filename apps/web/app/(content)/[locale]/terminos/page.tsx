import { notFound } from "next/navigation"
import { LegalPageContent } from "../legal-page"
import { getLegalPageMetadata, legalPages } from "@/lib/legal-pages"

export function generateMetadata() {
  return getLegalPageMetadata(legalPages.es.terminos)
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== "es") notFound()
  return <LegalPageContent locale="es" slug="terminos" />
}
