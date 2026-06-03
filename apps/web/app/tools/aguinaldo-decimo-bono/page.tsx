import { getToolForCountry, getToolBySlug } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowRight, IconGift } from "@tabler/icons-react"
import { isValidCountry } from "@/lib/countries"
import { buildToolJsonLd, getToolPageMetadata } from "@/lib/tool-seo"
import { countryLabels } from "@/lib/tools-common"

interface Props {
  searchParams: Promise<{ country?: string }>
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : null
  const tool = cc
    ? getToolForCountry("aguinaldo-decimo-bono", cc)
    : getToolBySlug("aguinaldo-decimo-bono")
  if (!tool) return {}

  const countryName = cc ? (countryLabels[cc] ?? cc.toUpperCase()) : null
  const namePart = countryName ? ` en ${countryName}` : ""
  const title = `Calculadora de aguinaldo / décimo / bono${namePart} | Justo`

  return getToolPageMetadata({ slug: "aguinaldo-decimo-bono", tool, country: cc, title })
}

export default async function BonusToolPage({ searchParams }: Props) {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : null
  const tool: JustoTool | undefined = cc
    ? getToolForCountry("aguinaldo-decimo-bono", cc)
    : getToolBySlug("aguinaldo-decimo-bono")

  if (!tool) notFound()

  const countryName = cc ? (countryLabels[cc] ?? cc.toUpperCase()) : null
  const namePart = countryName ? ` en ${countryName}` : ""
  const title = `Calculadora de aguinaldo / décimo / bono${namePart} | Justo`
  const jsonLd = buildToolJsonLd({
    slug: "aguinaldo-decimo-bono",
    tool,
    country: cc,
    title,
  })

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
              <IconGift className="size-4 text-foreground" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Cálculo · Disponible
            </span>
          </div>

          <h1 className="text-3xl leading-none font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            Aguinaldo / décimo / bono{namePart}
          </h1>

          <p className="mt-4 max-w-[52ch] text-base leading-7 text-muted-foreground">
            {tool.longDescription}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              href={cc ? `/es/${cc}?tool=bonus` : "/?tool=bonus"}
            >
              Abrir calculadora
              <IconArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              href="/docs/legal"
            >
              Ver marco legal
            </Link>
          </div>
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
              {tool.disclaimer}
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
