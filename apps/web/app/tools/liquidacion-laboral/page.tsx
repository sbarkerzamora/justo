import { getToolBySlug } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Calculadora de liquidación laboral abierta | Justo",
  description:
    "Calcula liquidación laboral por país con fórmulas determinísticas, referencias legales y corpus abierto.",
}

const countryNames: Record<string, string> = {
  ar: "Argentina",
  cl: "Chile",
  co: "Colombia",
  cr: "Costa Rica",
  gt: "Guatemala",
  hn: "Honduras",
  mx: "México",
  ni: "Nicaragua",
  pa: "Panamá",
  pe: "Perú",
  sv: "El Salvador",
}

function DetailList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li className="flex gap-3" key={item}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CountryList({ tool }: { tool: JustoTool }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tool.countrySupport.map((country) => (
        <span
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground"
          key={country}
        >
          {countryNames[country] ?? country.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

export default function SettlementToolPage() {
  const tool = getToolBySlug("liquidacion-laboral")

  if (!tool) notFound()

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Link
            className="mb-6 inline-flex text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/tools"
          >
            ← Todas las herramientas
          </Link>
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              Disponible
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cálculo determinístico
            </span>
            <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Open source
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            {tool.name}
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {tool.longDescription}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              href="/"
            >
              Iniciar cálculo guiado
            </Link>
            <Link
              className="inline-flex rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              href="/docs/legal"
            >
              Ver marco legal
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Países soportados
          </p>
          <div className="mt-5">
            <CountryList tool={tool} />
          </div>
          <div className="mt-8 rounded-3xl bg-muted p-5">
            <p className="text-sm font-semibold">Corpus</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              La versión del corpus se incluye en cada resultado porque puede variar por
              jurisdicción y fecha de cálculo.
            </p>
          </div>
        </aside>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-5 px-6 pb-12 lg:grid-cols-2">
        <DetailList title="Qué datos necesita" items={tool.inputRequirements} />
        <DetailList title="Qué entrega" items={tool.outputSummary} />
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight">Motor determinístico</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              La IA puede orientar y explicar, pero la liquidación se ejecuta con
              funciones de servidor testeadas. No usamos aritmética libre del modelo.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight">Trazabilidad legal</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Cada línea del resultado incluye fórmula, referencia legal y versión del
              corpus para facilitar revisión y auditoría.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight">PDF básico</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              El resultado puede descargarse como PDF imprimible con resumen, montos,
              timestamp, versión del corpus, disclaimer y líneas de firma.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-muted p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Disclaimer
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            {tool.disclaimer} Si existe disputa, datos incompletos o una situación
            compleja, validá el resultado con revisión legal o contable profesional.
          </p>
        </div>
      </section>
    </main>
  )
}
