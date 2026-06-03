import { getToolBySlug } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Calculadora de vacaciones Nicaragua abierta | Justo",
  description:
    "Calcula vacaciones acumuladas, gozadas, pendientes y monto estimado en Nicaragua con fórmula determinística y corpus abierto.",
}

const countryNames: Record<string, string> = {
  ni: "Nicaragua",
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

export default function VacationsToolPage() {
  const tool = getToolBySlug("vacaciones")

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
              Nicaragua
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
              href="/es/ni"
            >
              Abrir app Nicaragua
            </Link>
            <Link
              className="inline-flex rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              href="/docs/legal/nicaragua/vacaciones"
            >
              Ver corpus de vacaciones
            </Link>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            País soportado ahora
          </p>
          <div className="mt-5">
            <CountryList tool={tool} />
          </div>
          <div className="mt-8 rounded-3xl bg-muted p-5">
            <p className="text-sm font-semibold">Fórmula inicial</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Días acumulados = días trabajados x 30 / 365. Monto = días pendientes x salario diario.
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
            <h2 className="text-lg font-semibold tracking-tight">Alcance actual</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Esta primera versión soporta Nicaragua. Otros países se agregarán cuando su corpus y fórmula estén revisados.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight">Motor determinístico</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              El cálculo vive en `@justo/core`; el LLM no hace aritmética legal libre.
            </p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold tracking-tight">Referencia legal</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Basado en Ley 185, artículos 76, 77 y 78, según corpus `ni-v0.2.0`.
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
            {tool.disclaimer} Si el salario fue variable, hubo pagos parciales, conflicto o datos incompletos, validá el resultado con revisión legal o contable profesional.
          </p>
        </div>
      </section>
    </main>
  )
}
