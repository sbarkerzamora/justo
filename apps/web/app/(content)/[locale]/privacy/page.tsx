import { notFound } from "next/navigation"
import { LegalPageContent } from "../legal-page"
import { getLegalPageMetadata, legalPages } from "@/lib/legal-pages"

export function generateMetadata() {
  return getLegalPageMetadata(legalPages.en.privacy)
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== "en") notFound()
  return <LegalPageContent locale="en" slug="privacy" />
}
