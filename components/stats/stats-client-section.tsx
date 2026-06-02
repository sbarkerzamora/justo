"use client"

import { useState } from "react"
import {
  IconCoin,
  IconCalendarClock,
  IconCash,
  IconFileDescription,
  IconUsers,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { StatsChart, formatTenureDays } from "@/components/stats/StatsChart"
import type { ChartView } from "@/components/stats/StatsChart"
import type { CountryStats } from "@/lib/stats/types"

interface FilterDef {
  key: ChartView
  icon: React.ReactNode
  label: string
}

function safeNumber(n: number): string {
  if (!Number.isFinite(n)) return "—"
  return new Intl.NumberFormat("es-NI", { maximumFractionDigits: 0 }).format(n)
}

function safeCurrency(n: number, currency: string): string {
  if (!Number.isFinite(n)) return "—"
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

function HighlightCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col rounded-xl bg-card px-4 py-4 border-t-2 border-t-border/40">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80">
          {label}
        </span>
        <span className="text-muted-foreground/15">{icon}</span>
      </div>
      <span className="text-2xl font-semibold tabular-nums leading-none text-foreground">
        {value}
      </span>
    </div>
  )
}

export function StatsClientSection({
  stats,
  currency,
  filters,
  labels,
  isLoading = false,
}: {
  stats: CountryStats
  currency: string
  filters: { salary: string; tenure: string; net: string; termination: string }
  labels: { cases: string; medianSalary: string; medianTenure: string; medianNet: string }
  isLoading?: boolean
}) {
  const [view, setView] = useState<ChartView>("salary")

  const filterDefs: FilterDef[] = [
    { key: "salary", icon: <IconCoin className="size-4" />, label: filters.salary },
    { key: "tenure", icon: <IconCalendarClock className="size-4" />, label: filters.tenure },
    { key: "net", icon: <IconCash className="size-4" />, label: filters.net },
    { key: "termination", icon: <IconFileDescription className="size-4" />, label: filters.termination },
  ]

  const highlights = isLoading
    ? getLoadingHighlights(labels)
    : getHighlights(stats, currency, labels)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {highlights.map((h) => (
          <HighlightCard key={h.label} {...h} />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {filterDefs.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setView(f.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors",
              view === f.key
                ? "border-(--country-accent)/20 bg-(--country-accent)/10 font-medium text-(--country-accent)"
                : "border-border text-muted-foreground hover:bg-card"
            )}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <StatsChart stats={stats} view={view} isLoading={isLoading} />
    </div>
  )
}

function getLoadingHighlights(
  labels: { cases: string; medianSalary: string; medianTenure: string; medianNet: string }
) {
  return [
    { icon: <IconUsers className="size-4" />, value: "—", label: labels.cases },
    { icon: <IconCoin className="size-4" />, value: "—", label: labels.medianSalary },
    { icon: <IconCalendarClock className="size-4" />, value: "—", label: labels.medianTenure },
    { icon: <IconCash className="size-4" />, value: "—", label: labels.medianNet },
  ]
}

function getHighlights(
  stats: CountryStats,
  currency: string,
  labels: { cases: string; medianSalary: string; medianTenure: string; medianNet: string }
) {
  return [
    {
      icon: <IconUsers className="size-4" />,
      value: safeNumber(stats.totalSettlements),
      label: labels.cases,
    },
    {
      icon: <IconCoin className="size-4" />,
      value: safeCurrency(stats.salary.p50, currency),
      label: labels.medianSalary,
    },
    {
      icon: <IconCalendarClock className="size-4" />,
      value: formatTenureDays(stats.tenure.p50),
      label: labels.medianTenure,
    },
    {
      icon: <IconCash className="size-4" />,
      value: safeCurrency(stats.net.p50, currency),
      label: labels.medianNet,
    },
  ]
}
