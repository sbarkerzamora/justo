import { getToolForCountry, getToolBySlug, getAvailableTools } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { CountryCode } from "@justo/core"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import {
  IconArrowRight,
  IconCalculator,
  IconBeach,
  IconCoins,
  IconGift,
  IconDoorExit,
  IconFileDescription,
  IconBell,
} from "@tabler/icons-react"
import { isValidCountry } from "@/lib/countries"
import { buildToolJsonLd, getToolAppMode, getToolPageMetadata } from "@/lib/tool-seo"
import { countryLabels } from "@/lib/tools-common"
import type { ReactNode } from "react"

type ToolConfig = {
  icon: ReactNode
  h1Prefix: string
  ctaLabel: string
}

const toolConfigs: Record<string, ToolConfig> = {
  "liquidacion-laboral": { icon: <IconCalculator className="size-6" />, h1Prefix: "Calculadora de liquidación laboral", ctaLabel: "Abrir calculadora" },
  vacaciones: { icon: <IconBeach className="size-6" />, h1Prefix: "Vacaciones", ctaLabel: "Abrir calculadora" },
  "salario-neto": { icon: <IconCoins className="size-6" />, h1Prefix: "Salario neto", ctaLabel: "Abrir calculadora" },
  "aguinaldo-decimo-bono": { icon: <IconGift className="size-6" />, h1Prefix: "Aguinaldo / décimo / bono", ctaLabel: "Abrir calculadora" },
  "simulador-terminacion": { icon: <IconDoorExit className="size-6" />, h1Prefix: "Simulador de terminación", ctaLabel: "Abrir calculadora" },
  "generador-contratos": { icon: <IconFileDescription className="size-6" />, h1Prefix: "Generador de contratos de trabajo", ctaLabel: "Abrir generador" },
  preaviso: { icon: <IconBell className="size-6" />, h1Prefix: "Calculadora de preaviso laboral", ctaLabel: "Calcular preaviso" },
}

export async function generateStaticParams() {
  const tools = getAvailableTools()
  return tools.map((t) => ({ slug: t.slug }))
}

async function resolveCountry(searchParamsCountry: string | undefined): Promise<CountryCode | null> {
  if (searchParamsCountry && isValidCountry(searchParamsCountry)) {
    return searchParamsCountry
  }
  try {
    const maybe = (await cookies()).get("justo-country")?.value
    if (maybe && isValidCountry(maybe)) return maybe
  } catch {}
  return null
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ country?: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const sp = await searchParams
  const cc = await resolveCountry(sp.country)
  const tool = cc
    ? getToolForCountry(slug, cc)
    : getToolBySlug(slug)
  if (!tool) return {}
  const config = toolConfigs[slug]

  const countryName = cc ? (countryLabels[cc] ?? cc.toUpperCase()) : null
  const namePart = countryName ? ` en ${countryName}` : ""
  const title = config ? `${config.h1Prefix}${namePart}` : `${tool.name}${namePart}`

  return getToolPageMetadata({
    slug,
    tool,
    country: cc,
    title,
  })
}

export default async function ToolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ country?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const cc = await resolveCountry(sp.country)
  const tool: JustoTool | undefined = cc
    ? getToolForCountry(slug, cc)
    : getToolBySlug(slug)

  if (!tool) notFound()
  const config = toolConfigs[slug]

  const countryName = cc ? (countryLabels[cc] ?? cc.toUpperCase()) : null
  const namePart = countryName ? ` en ${countryName}` : ""
  const title = config ? `${config.h1Prefix}${namePart}` : `${tool.name}${namePart}`
  const toolParam = getToolAppMode(slug) ?? slug
  const jsonLd = buildToolJsonLd({
    slug,
    tool,
    country: cc,
    title,
  })

  const supportedCountries = tool.countrySupport
  const categoryLabelMap: Record<string, string> = {
    calculation: "Cálculo",
    document: "Documento",
    checklist: "Checklist",
    assistant: "Asistente",
  }

  return (
    <>
      <main className="min-h-screen bg-background">
        <section className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
          <Link
            className="mb-8 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            href="/tools"
          >
            ← Herramientas
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
              {config ? config.icon : null}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {categoryLabelMap[tool.category] ?? tool.category} ·{" "}
              {tool.availability === "available" ? "Disponible" : "Próximamente"}
            </span>
          </div>

          <h1 className="text-3xl leading-none font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            {config ? config.h1Prefix : tool.name}
            {namePart}
          </h1>

          <p className="mt-4 max-w-[52ch] text-base leading-7 text-muted-foreground">
            {tool.longDescription}
          </p>

          {!cc && supportedCountries.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Disponible en:
              </span>
              {supportedCountries.map((c: CountryCode) => (
                <Link
                  key={c}
                  href={`/tools/${slug}?country=${c}`}
                  className="rounded-full border border-border/40 px-2.5 py-0.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  {countryLabels[c] ?? c.toUpperCase()}
                </Link>
              ))}
            </div>
          )}

          {cc && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                href={`/${cc}?tool=${toolParam}`}
              >
                {config ? config.ctaLabel : "Abrir herramienta"}
                <IconArrowRight className="size-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                href={`/docs/legal/${cc}/`}
              >
                Ver marco legal
              </Link>
            </div>
          )}
        </section>

        <section className="mx-auto w-full max-w-2xl px-6 pb-16">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Qué datos necesita
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground">
                {tool.inputRequirements.map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <span className="block h-1 w-1 rounded-full bg-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Qué entrega
              </h2>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-foreground">
                {tool.outputSummary.map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <span className="block h-1 w-1 rounded-full bg-foreground/30" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl px-6 pb-12">
          <div className="border-t border-border pt-10">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="rounded-full border border-border px-2.5 py-0.5 font-medium">
                {cc
                  ? (countryLabels[cc] ?? cc.toUpperCase())
                  : `${tool.countrySupport.length} países`}
              </span>
              <span>Corpus {tool.corpusVersion}</span>
              <span>{tool.legalReferences.join(", ")}</span>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-2xl px-6 pb-24">
          <div className="rounded-xl border border-border/40 px-6 py-5">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {tool.disclaimer} Si existe disputa, datos incompletos o una
              situación compleja, valida el resultado con revisión legal o
              contable profesional.
            </p>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
