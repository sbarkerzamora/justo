"use client"

import { useState } from "react"
import {
  IconCoin,
  IconCalendarClock,
  IconCash,
  IconFileDescription,
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

export function StatsClientSection({
  stats,
  currency,
  filters,
  labels,
}: {
  stats: CountryStats
  currency: string
  filters: { salary: string; tenure: string; net: string; termination: string }
  labels: { cases: string; medianSalary: string; medianTenure: string; medianNet: string }
}) {
  const [view, setView] = useState<ChartView>("salary")

  const filterDefs: FilterDef[] = [
    { key: "salary", icon: <IconCoin className="size-4" />, label: filters.salary },
    { key: "tenure", icon: <IconCalendarClock className="size-4" />, label: filters.tenure },
    { key: "net", icon: <IconCash className="size-4" />, label: filters.net },
    { key: "termination", icon: <IconFileDescription className="size-4" />, label: filters.termination },
  ]

  const highlights = getHighlights(stats, currency, labels)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {highlights.map((h) => (
          <div key={h.label} className="text-center">
            <p className="text-2xl font-semibold tracking-tight text-foreground">
              {h.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{h.label}</p>
          </div>
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

      <StatsChart stats={stats} view={view} currency={currency} />
    </div>
  )
}

function getHighlights(
  stats: CountryStats,
  currency: string,
  labels: { cases: string; medianSalary: string; medianTenure: string; medianNet: string }
) {
  return [
    {
      value: stats.totalSettlements.toLocaleString("es-NI"),
      label: labels.cases,
    },
    {
      value: `${currency} ${Math.round(stats.salary.p50).toLocaleString("es-NI")}`,
      label: labels.medianSalary,
    },
    {
      value:
        stats.tenure.p50 > 0
          ? formatTenureDays(stats.tenure.p50)
          : "—",
      label: labels.medianTenure,
    },
    {
      value: `${currency} ${Math.round(stats.net.p50).toLocaleString("es-NI")}`,
      label: labels.medianNet,
    },
  ]
}
