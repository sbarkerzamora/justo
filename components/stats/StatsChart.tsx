import type { CountryStats } from "@/lib/stats/types"
import { BarChartMultiVertical } from "@/components/stats/BarChartMultiVertical"

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

export function formatTenureDays(days: number): string {
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  if (years > 0) return `${years}a ${months}m`
  return `${months}m`
}

function getChartData(stats: CountryStats, view: ChartView) {
  switch (view) {
    case "salary":
      return [
        { key: "Mín", values: [stats.salary.min] },
        { key: "P25", values: [stats.salary.p25] },
        { key: "Mediana", values: [stats.salary.p50] },
        { key: "P75", values: [stats.salary.p75] },
        { key: "Máx", values: [stats.salary.max] },
      ]
    case "tenure":
      return [
        { key: "P25", values: [stats.tenure.p25] },
        { key: "Mediana", values: [stats.tenure.p50] },
        { key: "P75", values: [stats.tenure.p75] },
        { key: "P90", values: [stats.tenure.p90] },
        { key: "Máx", values: [stats.tenure.max] },
      ]
    case "net":
      return [
        { key: "Mín", values: [stats.net.min] },
        { key: "P25", values: [stats.net.p25] },
        { key: "Mediana", values: [stats.net.p50] },
        { key: "P75", values: [stats.net.p75] },
        { key: "Máx", values: [stats.net.max] },
      ]
    case "termination": {
      const entries = Object.entries(stats.byTerminationType)
      return entries.map(([key, value]) => ({
        key: TERMINATION_LABELS[key] ?? key,
        values: [value],
      }))
    }
    default:
      return []
  }
}

export function StatsChart({
  stats,
  view,
}: {
  stats: CountryStats
  view: ChartView
}) {
  const data = getChartData(stats, view)
  const color = VIEW_COLORS[view]

  return <BarChartMultiVertical data={data} colors={[color]} />
}
