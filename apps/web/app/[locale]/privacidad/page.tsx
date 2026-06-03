import { notFound } from "next/navigation"
import { LegalPageContent } from "../legal-page"
import { getLegalPageMetadata, legalPages } from "@/lib/legal-pages"

export function generateMetadata() {
  return getLegalPageMetadata(legalPages.es.privacidad)
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== "es") notFound()
  return <LegalPageContent locale="es" slug="privacidad" />
}
