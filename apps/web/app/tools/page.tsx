import { getTools } from "@justo/tools"
import type { JustoTool } from "@justo/tools"
import type { Metadata } from "next"
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
} from "@tabler/icons-react"

export const metadata: Metadata = {
  title: "Herramientas laborales abiertas | Justo",
  description:
    "Calculadoras y asistentes laborales open source para liquidaciones, vacaciones, salario neto y cumplimiento laboral en Latinoamerica.",
}

const categoryLabels: Record<JustoTool["category"], string> = {
  assistant: "Asistente",
  calculation: "Calculo",
  checklist: "Checklist",
  document: "Documento",
}

const statusLabels: Record<JustoTool["availability"], string> = {
  available: "Disponible",
  coming_soon: "Proximamente",
}

const countryLabels: Record<string, string> = {
  ar: "Argentina",
  cl: "Chile",
  co: "Colombia",
  cr: "Costa Rica",
  gt: "Guatemala",
  hn: "Honduras",
  mx: "Mexico",
  ni: "Nicaragua",
  pa: "Panama",
  pe: "Peru",
  sv: "El Salvador",
}

const toolIcons: Record<string, React.ReactNode> = {
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

function ToolCard({ tool }: { tool: JustoTool }) {
  const isAvailable = tool.availability === "available"
  const icon = toolIcons[tool.slug] ?? <IconTools className="size-5" />

  return (
    <Link
      href={isAvailable ? `/tools/${tool.slug}` : "#"}
      className={
        isAvailable
          ? "group flex flex-col gap-4 rounded-2xl border border-border/40 px-5 py-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-sm"
          : "flex flex-col gap-4 rounded-2xl border border-border/20 px-5 py-5 opacity-60"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {categoryLabels[tool.category]}
          </span>
          <span className="block h-1 w-1 rounded-full bg-border" />
          <span className="text-[10px] font-medium text-muted-foreground">
            {statusLabels[tool.availability]}
          </span>
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
            {tool.countrySupport.length} paises
          </span>
        ) : (
          tool.countrySupport.map((country) => (
            <span
              className="rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              key={country}
            >
              {countryLabels[country] ?? country.toUpperCase()}
            </span>
          ))
        )}
      </div>

      {isAvailable ? (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground transition-colors group-hover:text-primary">
          Abrir herramienta
          <IconArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground/60">
          Proximamente
        </span>
      )}
    </Link>
  )
}

export default function ToolsPage() {
  const tools = getTools()
  const availableTools = tools.filter((tool) => tool.availability === "available")
  const upcomingTools = tools.filter((tool) => tool.availability === "coming_soon")

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <IconTools className="size-4" />
            <span className="font-mono text-xs tracking-[0.16em] uppercase">
              Open source laboral
            </span>
          </div>

          <h1 className="text-4xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
            Herramientas
            <br />
            laborales abiertas
          </h1>

          <p className="max-w-[52ch] text-base leading-7 text-muted-foreground">
            Calculos verificables, corpus legal versionado y self-hosting. La
            monetizacion futura vive en operacion empresarial, no en ocultar la ley.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-6 border-b border-border pb-12">
          <div>
            <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {availableTools.length}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              herramientas disponibles
            </span>
          </div>
          <div>
            <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              {upcomingTools.length}
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              en roadmap OSS
            </span>
          </div>
          <div>
            <span className="font-mono text-3xl font-semibold tabular-nums text-foreground">
              11
            </span>
            <span className="ml-2 text-sm text-muted-foreground">
              paises en la base
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Disponible ahora
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {availableTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <h2 className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Proximamente
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <footer className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-border px-8 py-10 text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Regla de producto
          </p>
          <p className="mt-4 mx-auto max-w-lg text-sm leading-7 text-muted-foreground">
            Las herramientas laborales generales son abiertas. La plataforma
            empresarial con persistencia, equipos, auditoria y asistente de RRHH
            sera de pago.
          </p>
        </div>
      </footer>
    </main>
  )
}
