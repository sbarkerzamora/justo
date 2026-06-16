import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import type { Locale } from "@/lib/i18n"

export function LegalFooter({
  countryCode,
  countryName,
  locale,
}: {
  countryCode: string
  countryName: string
  locale: Locale
}) {
  const docsLink = getLegalDocsLink(countryCode)
  return (
    <div className="px-2 pb-3">
      <Link
        href={docsLink}
        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 transition-colors hover:text-muted-foreground"
      >
        {locale === "en"
          ? `Calculated under ${countryName} legislation`
          : `Calculando según legislación de ${countryName}`}
        <span className="inline-flex items-center gap-0.5 font-medium text-primary/70 hover:text-primary">
          {locale === "en" ? "View legal framework" : "Ver marco legal"}
          <IconArrowRight className="size-3" />
        </span>
      </Link>
    </div>
  )
}
