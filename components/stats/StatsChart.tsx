"use client"

import {
  EvilBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "@/components/evilcharts/charts/bar-chart"
import type { ChartConfig } from "@/components/evilcharts/ui/chart"
import type { CountryStats } from "@/lib/stats/types"

export type ChartView = "salary" | "tenure" | "net" | "termination"

export const TERMINATION_LABELS: Record<string, string> = {
  renuncia: "Renuncia",
  despido_justificado: "Despido just.",
  despido_injustificado: "Despido injust.",
  mutuo_acuerdo: "Mutuo acuerdo",
  otro: "Otro",
  no_especificado: "No espec.",
}

const VIEW_COLORS: Record<ChartView, string> = {
  salary: "#B89DFB",
  tenure: "#A5D6F1",
  net: "#B8F0C8",
  termination: "#F5C6D0",
}

const VIEW_LABELS: Record<ChartView, string> = {
  salary: "Salario",
  tenure: "Antigüedad",
  net: "Neto",
  termination: "Despidos",
}

export function formatTenureDays(days: number): string {
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  if (years > 0) return `${years}a ${months}m`
  return `${months}m`
}

interface ChartDatum extends Record<string, unknown> {
  key: string
  value: number
}

function getChartData(stats: CountryStats, view: ChartView): ChartDatum[] {
  switch (view) {
    case "salary":
      return [
        { key: "Mín", value: stats.salary.min },
        { key: "P25", value: stats.salary.p25 },
        { key: "Mediana", value: stats.salary.p50 },
        { key: "P75", value: stats.salary.p75 },
        { key: "Máx", value: stats.salary.max },
      ]
    case "tenure":
      return [
        { key: "P25", value: stats.tenure.p25 },
        { key: "Mediana", value: stats.tenure.p50 },
        { key: "P75", value: stats.tenure.p75 },
        { key: "P90", value: stats.tenure.p90 },
        { key: "Máx", value: stats.tenure.max },
      ]
    case "net":
      return [
        { key: "Mín", value: stats.net.min },
        { key: "P25", value: stats.net.p25 },
        { key: "Mediana", value: stats.net.p50 },
        { key: "P75", value: stats.net.p75 },
        { key: "Máx", value: stats.net.max },
      ]
    case "termination": {
      const entries = Object.entries(stats.byTerminationType)
      return entries.map(([key, value]) => ({
        key: TERMINATION_LABELS[key] ?? key,
        value,
      }))
    }
    default:
      return []
  }
}

function getChartConfig(view: ChartView): ChartConfig {
  const color = VIEW_COLORS[view]
  return {
    value: {
      label: VIEW_LABELS[view],
      colors: {
        light: [color],
        dark: [color],
      },
    },
  } satisfies ChartConfig
}

export function StatsChart({
  stats,
  view,
  isLoading = false,
}: {
  stats: CountryStats
  view: ChartView
  isLoading?: boolean
}) {
  if (isLoading) {
    return (
      <EvilBarChart
        data={[]}
        config={getChartConfig(view)}
        isLoading
        className="h-72 w-full"
      >
        <XAxis dataKey="key" />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="value" variant="default" />
      </EvilBarChart>
    )
  }

  const data = getChartData(stats, view)

  if (data.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center text-sm text-muted-foreground">
        No hay datos de tipo de despido aún.
      </div>
    )
  }

  const chartConfig = getChartConfig(view)

  return (
    <EvilBarChart
      data={data}
      config={chartConfig}
      className="h-72 w-full"
      animationType="left-to-right"
    >
      <XAxis dataKey="key" />
      <YAxis tickLine={false} axisLine={false} />
      <Tooltip />
      <Bar dataKey="value" variant="default" />
    </EvilBarChart>
  )
}
