import Image from "next/image"
import { getTopicDocsLink } from "@/lib/legal-docs-link"
import type { Locale } from "@/lib/i18n"

export function AssistantSource({
  href,
  countryName,
  cc,
  locale,
  topics,
}: {
  href: string
  countryName: string
  cc: string
  locale: Locale
  topics?: string[]
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground/70">
      {topics && topics.length > 0 ? (
        <>
          {topics.map((topic, i) => {
            const link = getTopicDocsLink(cc, topic)
            return (
              <span key={topic}>
                {i > 0 && <span className="mr-2 text-muted-foreground/40">·</span>}
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </a>
                ) : (
                  <span className="font-medium text-muted-foreground/60">{topic}</span>
                )}
              </span>
            )
          })}
        </>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {locale === "en" ? "Legal corpus" : "Corpus legal"}
        </a>
      )}
      <span className="inline-flex items-center gap-1 text-muted-foreground/50">
        <span className="mx-0.5 text-muted-foreground/30">·</span>
        <span>{countryName}</span>
        <Image
          src={`https://flagcdn.com/w40/${cc}.png`}
          alt={countryName}
          width={14}
          height={10}
          className="h-2.5 w-3.5 shrink-0 rounded-[1px] border border-border/60 object-cover ml-0.5"
        />
      </span>
    </div>
  )
}
