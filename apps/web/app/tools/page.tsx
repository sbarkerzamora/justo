import { getTools } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Herramientas laborales abiertas | Justo",
  description:
    "Calculadoras y asistentes laborales open source para liquidaciones, vacaciones, salario neto y cumplimiento laboral en Latinoamérica.",
}

const categoryLabels: Record<JustoTool["category"], string> = {
  assistant: "Asistente",
  calculation: "Cálculo",
  checklist: "Checklist",
  document: "Documento",
}

const statusLabels: Record<JustoTool["availability"], string> = {
  available: "Disponible",
  coming_soon: "Próximamente",
}

const countryLabels: Record<string, string> = {
  ar: "AR",
  cl: "CL",
  co: "CO",
  cr: "CR",
  gt: "GT",
  hn: "HN",
  mx: "MX",
  ni: "NI",
  pa: "PA",
  pe: "PE",
  sv: "SV",
}

function ToolCard({ tool }: { tool: JustoTool }) {
  const isAvailable = tool.availability === "available"

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {categoryLabels[tool.category]}
        </span>
        <span
          className={
            isAvailable
              ? "rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
              : "rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          }
        >
          {statusLabels[tool.availability]}
        </span>
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{tool.name}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
        {tool.shortDescription}
      </p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {tool.countrySupport.map((country) => (
          <span
            className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
            key={country}
          >
            {countryLabels[country] ?? country.toUpperCase()}
          </span>
        ))}
      </div>
      <div className="mt-6">
        {isAvailable ? (
          <Link
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition group-hover:scale-[1.02]"
            href={`/tools/${tool.slug}`}
          >
            Ver herramienta
          </Link>
        ) : (
          <span className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground">
            Roadmap OSS
          </span>
        )}
      </div>
    </article>
  )
}

export default function ToolsPage() {
  const tools = getTools()
  const availableTools = tools.filter((tool) => tool.availability === "available")
  const upcomingTools = tools.filter((tool) => tool.availability === "coming_soon")

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <Link
            className="mb-6 inline-flex text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            href="/"
          >
            ← Volver a Justo
          </Link>
          <div className="mb-6 inline-flex rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Open source laboral
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Herramientas laborales abiertas
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Justo publica sus herramientas laborales generales como software abierto:
            cálculos verificables, corpus legal versionado y self-hosting. La
            monetización futura vive en operación empresarial, no en ocultar la ley.
          </p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold">{availableTools.length}</p>
            <p className="text-sm text-muted-foreground">herramienta disponible</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">{upcomingTools.length}</p>
            <p className="text-sm text-muted-foreground">herramientas en roadmap OSS</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">11</p>
            <p className="text-sm text-muted-foreground">países en la base actual</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-10">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Disponible
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Lista para usar
            </h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {availableTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            Próximamente
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Roadmap abierto de herramientas
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {upcomingTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="rounded-[2rem] border border-border bg-primary p-8 text-primary-foreground sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] opacity-70">
            Regla de producto
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Las herramientas son abiertas. La plataforma empresarial será pagada.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-6 opacity-80">
            Los resultados son informativos y deben revisarse con asesoría legal o
            contable profesional en casos complejos o disputados. Los cálculos de
            Justo usan lógica determinística; no delegamos aritmética legal libre al LLM.
          </p>
        </div>
      </section>
    </main>
  )
}
