import { getToolForCountry, getToolBySlug } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { IconArrowRight, IconCoins } from "@tabler/icons-react"
import { isValidCountry } from "@/lib/countries"
import { countryLabels } from "@/lib/tools-common"

interface Props {
  searchParams: Promise<{ country?: string }>
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : null
  const tool = cc ? getToolForCountry("salario-neto", cc) : getToolBySlug("salario-neto")
  if (!tool) return {}

  const countryName = cc ? (countryLabels[cc] ?? cc.toUpperCase()) : null
  const namePart = countryName ? ` en ${countryName}` : ""

  return {
    title: `Calculadora de salario neto${namePart} | Justo`,
    description: tool.longDescription,
    openGraph: {
      title: `Calculadora de salario neto${namePart} | Justo`,
      description: tool.longDescription,
    },
  }
}

export default async function SalaryNetToolPage({ searchParams }: Props) {
  const { country } = await searchParams
  const cc = country && isValidCountry(country) ? country : null
  const tool: JustoTool | undefined = cc
    ? getToolForCountry("salario-neto", cc)
    : getToolBySlug("salario-neto")

  if (!tool) notFound()

  const countryName = cc ? (countryLabels[cc] ?? cc.toUpperCase()) : null
  const namePart = countryName ? ` en ${countryName}` : ""

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-2xl px-6 py-20 sm:py-28">
        <Link
          className="mb-8 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          href="/tools"
        >
          ← Herramientas
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
            <IconCoins className="size-4 text-foreground" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">Cálculo · Disponible</span>
        </div>

        <h1 className="text-3xl font-semibold leading-none tracking-[-0.03em] text-foreground sm:text-4xl">
          Salario neto{namePart}
        </h1>

        <p className="mt-4 max-w-[52ch] text-base leading-7 text-muted-foreground">
          {tool.longDescription}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            href={cc ? `/es/${cc}?tool=salary-net` : "/?tool=salary-net"}
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
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
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
              {cc ? (countryLabels[cc] ?? cc.toUpperCase()) : `${tool.countrySupport.length} países`}
            </span>
            <span>Corpus {tool.corpusVersion}</span>
            <span>{tool.legalReferences.join(", ")}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl px-6 pb-24">
        <div className="rounded-xl border border-border/40 px-6 py-5">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {tool.disclaimer} Si el salario fue variable, hubo pagos parciales o ingresos
            no salariales, valida el resultado con revisión legal o contable profesional.
          </p>
        </div>
      </section>
    </main>
  )
}
