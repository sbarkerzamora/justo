import { getTools } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import Link from "next/link"
import {
  IconCalculator,
  IconCoins,
  IconGift,
  IconClock,
  IconFileDescription,
  IconClipboardCheck,
  IconUserPlus,
  IconBeach,
  IconTools,
  IconArrowRight,
  IconMapPin,
} from "@tabler/icons-react"
import { buildToolsItemListJsonLd, getToolAppMode } from "@/lib/tool-seo"
import { countryLabels } from "@/lib/tools-common"
import { isValidCountry, countryList } from "@/lib/countries"
import type { ReactNode } from "react"

export type ToolsPageCopy = {
  metaTitle: string
  metaDescription: string
  badge: string
  headingLine1: string
  headingLine2: string
  description: string
  availableLabel: string
  roadmapLabel: string
  countriesLabel: string
  availableLabelSingle: string
  roadmapLabelSingle: string
  countriesLabelSingle: string
  allCountries: string
  availableNow: string
  comingSoon: string
  comingSoonBadge: string
  startButton: string
  footerTitle: string
  footerDescription: string
  categoryLabels: Record<JustoTool["category"], string>
  statusLabels: Record<JustoTool["availability"], string>
  forCountry: (name: string) => string
  emptyCountry: (name: string) => string
}

const toolIcons: Record<string, ReactNode> = {
  "liquidacion-laboral": <IconCalculator className="size-5" />,
  vacaciones: <IconBeach className="size-5" />,
  "salario-neto": <IconCoins className="size-5" />,
  "aguinaldo-decimo-bono": <IconGift className="size-5" />,
  "horas-extra": <IconClock className="size-5" />,
  "simulador-terminacion": <IconFileDescription className="size-5" />,
  "finiquito-basico": <IconFileDescription className="size-5" />,
  "checklist-laboral": <IconClipboardCheck className="size-5" />,
  "asistente-contratacion": <IconUserPlus className="size-5" />,
}

function ToolCard({ tool, copy, country, locale }: { tool: JustoTool; copy: ToolsPageCopy; country?: string; locale: string }) {
  const isAvailable = tool.availability === "available"
  const icon = toolIcons[tool.slug] ?? <IconTools className="size-5" />

  const isSupported = !country || tool.countrySupport.includes(country as CountryCode)
  const toolHref = isAvailable
    ? country
      ? `/tools/${tool.slug}?country=${country}`
      : `/tools/${tool.slug}`
    : "#"

  const calcHref = isAvailable && isSupported && country
    ? `/${locale}/${country}?tool=${getToolAppMode(tool.slug) ?? tool.slug}`
    : null

  const cardClassName =
    "flex flex-col gap-4 rounded-2xl border px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-sm" +
    (isAvailable
      ? isSupported
        ? " border-border/40"
        : " border-border/20 opacity-50"
      : " border-border/20 opacity-60")

  return (
    <div className={cardClassName}>
      <Link
        href={toolHref}
        className="flex flex-col gap-4"
        aria-disabled={!isAvailable || !isSupported}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
            {icon}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              {copy.categoryLabels[tool.category]}
            </span>
            <span className="block h-1 w-1 rounded-full bg-border" />
            {isSupported ? (
              <span className="text-[10px] font-medium text-muted-foreground">
                {copy.statusLabels[tool.availability]}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-muted-foreground/50">
                {copy.comingSoonBadge}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {tool.name}
          </h3>
          <p className="text-[13px] leading-relaxed text-muted-foreground">
            {tool.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {tool.countrySupport.length > 4 ? (
            <span className="rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {tool.countrySupport.length} {copy.countriesLabel}
            </span>
          ) : (
            tool.countrySupport.map((c) => (
              <span
                className={
                  "rounded-full border px-2 py-0.5 text-[10px] font-medium" +
                  (c === country
                    ? " border-primary/50 bg-primary/10 text-primary"
                    : " border-border/40 text-muted-foreground")
                }
                key={c}
              >
                {countryLabels[c] ?? c.toUpperCase()}
              </span>
            ))
          )}
        </div>
      </Link>

      {isAvailable && isSupported ? (
        calcHref ? (
          <Link
            href={calcHref}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
          >
            {copy.startButton}
            <IconArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link
            href={toolHref}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
          >
            {copy.startButton}
            <IconArrowRight className="size-3.5" />
          </Link>
        )
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground/60">
          {copy.comingSoonBadge}
        </span>
      )}
    </div>
  )
}

export function ToolsPage({ copy, country, locale = "es" }: { copy: ToolsPageCopy; country?: string; locale?: string }) {
  const tools = getTools()
  const cc = country && isValidCountry(country) ? country : null
  const countryInfo = cc ? countryList.find((c) => c.code === cc) : null

  const availableTools = tools.filter(
    (tool) => tool.availability === "available"
  )
  const upcomingTools = tools.filter(
    (tool) => tool.availability === "coming_soon"
  )
  const filteredAvailable = cc
    ? availableTools.filter((t) => t.countrySupport.includes(cc))
    : availableTools
  const filteredUpcoming = cc
    ? upcomingTools.filter((t) => t.countrySupport.includes(cc))
    : upcomingTools
  const jsonLd = buildToolsItemListJsonLd(filteredAvailable)
  const displayAvailable = cc ? filteredAvailable : availableTools
  const displayUpcoming = cc ? filteredUpcoming : upcomingTools

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <IconTools className="size-4" />
              <span className="font-mono text-xs tracking-[0.16em] uppercase">
                {copy.badge}
              </span>
            </div>

            <h1 className="text-4xl leading-none font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
              {countryInfo ? copy.forCountry(countryInfo.name) : (
                <>
                  {copy.headingLine1}
                  <br />
                  {copy.headingLine2}
                </>
              )}
            </h1>

            <p className="max-w-[52ch] text-base leading-7 text-muted-foreground">
              {cc
                ? `${copy.description} ${countryInfo?.name}.`
                : copy.description}
            </p>

            {cc && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <IconMapPin className="size-3.5" />
                {countryInfo?.name}
              </div>
            )}
          </div>

          <div className="mt-12 flex flex-wrap gap-6 border-b border-border pb-12">
            <div>
              <span className="font-mono text-3xl font-semibold text-foreground tabular-nums">
                {displayAvailable.length}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {displayAvailable.length === 1 ? copy.availableLabelSingle : copy.availableLabel}
              </span>
            </div>
            <div>
              <span className="font-mono text-3xl font-semibold text-foreground tabular-nums">
                {displayUpcoming.length}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {displayUpcoming.length === 1 ? copy.roadmapLabelSingle : copy.roadmapLabel}
              </span>
            </div>
            <div>
              <span className="font-mono text-3xl font-semibold text-foreground tabular-nums">
                {cc ? 1 : 11}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                {cc ? countryInfo?.name : copy.countriesLabel}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-16">
          <h2 className="mb-8 font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {copy.availableNow}
          </h2>
          {displayAvailable.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {cc ? copy.emptyCountry(countryInfo?.name ?? cc) : copy.availableLabel}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {displayAvailable.map((tool) => (
                <ToolCard key={tool.id} tool={tool} copy={copy} country={cc ?? undefined} locale={locale} />
              ))}
            </div>
          )}
        </section>

        <section className="mx-auto w-full max-w-5xl px-6 pb-20">
          <h2 className="mb-8 font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            {copy.comingSoon}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayUpcoming.map((tool) => (
              <ToolCard key={tool.id} tool={tool} copy={copy} country={cc ?? undefined} locale={locale} />
            ))}
          </div>
        </section>

        <footer className="mx-auto w-full max-w-5xl px-6 pb-24">
          <div className="rounded-2xl border border-border px-8 py-10 text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              {copy.footerTitle}
            </p>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
              {copy.footerDescription}
            </p>
          </div>
        </footer>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
