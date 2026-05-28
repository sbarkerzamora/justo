"use client"

import { useState, type CSSProperties } from "react"
import { scaleBand, scaleLinear, max } from "d3"
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

export function formatTenureDays(days: number): string {
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  if (years > 0) return `${years}a ${months}m`
  return `${months}m`
}

interface ChartDatum {
  key: string
  values: number[]
}

function getChartData(stats: CountryStats, view: ChartView): ChartDatum[] {
  switch (view) {
    case "salary": {
      const { p5, p25, p50, p75, p95 } = estimatePercentiles(stats.salary)
      return [
        { key: "Mín", values: [p5] },
        { key: "P25", values: [p25] },
        { key: "Mediana", values: [p50] },
        { key: "P75", values: [p75] },
        { key: "Máx", values: [p95] },
      ]
    }
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
      if (entries.length === 0) return []
      return entries.map(([key, value]) => ({
        key: TERMINATION_LABELS[key] ?? key,
        values: [value],
      }))
    }
    default:
      return []
  }
}

function estimatePercentiles(p: {
  min: number
  p25: number
  p50: number
  p75: number
  p90: number
  max: number
}) {
  return {
    p5: Math.round(p.min + (p.p25 - p.min) * 0.3),
    p25: p.p25,
    p50: p.p50,
    p75: p.p75,
    p95: Math.round(p.p90 + (p.max - p.p90) * 0.4),
  }
}

function formatTick(n: number, view: ChartView): string {
  if (view === "tenure") return formatTenureDays(n)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`
  return String(Math.round(n))
}

export function StatsChart({
  stats,
  view,
  currency,
}: {
  stats: CountryStats
  view: ChartView
  currency: string
}) {
  const [tooltip, setTooltip] = useState<{
    label: string
    value: number
    x: number
    y: number
  } | null>(null)

  if (stats.totalSettlements === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
        No hay suficientes datos aún.
      </div>
    )
  }

  const data = getChartData(stats, view)
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
        No hay datos de tipo de despido aún.
      </div>
    )
  }

  const maxVal = max(data.flatMap((d) => d.values)) ?? 0

  const xScale = scaleBand()
    .domain(data.map((d) => d.key))
    .range([0, 100])
    .padding(0.4)

  const yScale = scaleLinear()
    .domain([0, maxVal || 1])
    .range([100, 0])

  const color = VIEW_COLORS[view]

  return (
    <div
      className="relative h-72 w-full"
      style={
        {
          "--marginTop": "8px",
          "--marginRight": "16px",
          "--marginBottom": "48px",
          "--marginLeft": "44px",
        } as CSSProperties
      }
    >
      {/* Y axis */}
      <div
        className="relative h-[calc(100%-var(--marginTop)-var(--marginBottom))] w-[var(--marginLeft)] translate-y-[var(--marginTop)] overflow-visible"
      >
        {yScale
          .ticks(5)
          .map(yScale.tickFormat(5, "d"))
          .map((tick) => ({ raw: tick, value: Number(tick) }))
          .filter((t) => !isNaN(t.value))
          .map((tick, i) => (
            <div
              key={i}
              style={{ top: `${yScale(tick.value)}%` }}
              className="absolute w-full -translate-y-1/2 pr-2 text-right text-xs tabular-nums text-gray-400"
            >
              {formatTick(tick.value, view)}
            </div>
          ))}
      </div>

      {/* Chart area */}
      <div
        className="absolute inset-0
          h-[calc(100%-var(--marginTop)-var(--marginBottom))]
          w-[calc(100%-var(--marginLeft)-var(--marginRight))]
          translate-x-[var(--marginLeft)]
          translate-y-[var(--marginTop)]
          overflow-visible
        "
      >
        <div className="relative h-full w-full">
          {/* Grid lines */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {yScale
              .ticks(5)
              .map(yScale.tickFormat(5, "d"))
              .map((tick) => ({ raw: tick, value: Number(tick) }))
              .filter((t) => !isNaN(t.value))
              .map((tick, i) => (
                <g
                  transform={`translate(0,${yScale(tick.value)})`}
                  className="text-gray-300/80 dark:text-gray-800/80"
                  key={i}
                >
                  <line
                    x1={0}
                    x2={100}
                    stroke="currentColor"
                    strokeDasharray="6,5"
                    strokeWidth={0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
          </svg>

          {/* Bars */}
          {data.map((d, index) => {
            const barHeight = 100 - yScale(d.values[0])
            const barLeft = xScale(d.key)!
            const barWidth = xScale.bandwidth()

            return (
              <div
                key={index}
                className="absolute bottom-0 rounded-t transition-[filter] duration-150 hover:[filter:brightness(1.15)]"
                style={{
                  left: `${barLeft}%`,
                  width: `${barWidth}%`,
                  height: `${barHeight}%`,
                  backgroundColor: color,
                  border: `1px solid ${color}33`,
                }}
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const parent = e.currentTarget.parentElement?.getBoundingClientRect()
                  setTooltip({
                    label: d.key,
                    value: d.values[0],
                    x: rect.left - (parent?.left ?? 0) + rect.width / 2,
                    y: rect.top - (parent?.top ?? 0),
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            )
          })}

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-sm"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y - 8}px`,
              }}
            >
              <p className="text-xs text-muted-foreground">{tooltip.label}</p>
              <p className="font-mono text-foreground">
                {currency ? `${currency} ` : ""}
                {view === "tenure"
                  ? formatTenureDays(tooltip.value)
                  : tooltip.value.toLocaleString("es-NI")}
              </p>
            </div>
          )}

          {/* X axis labels */}
          {data.map((d, i) => {
            const xPos = xScale(d.key)! + xScale.bandwidth() / 2
            return (
              <div
                key={i}
                className="absolute overflow-visible text-gray-400"
                style={{
                  left: `${xPos}%`,
                  top: "100%",
                  transform: "rotate(45deg) translateX(4px) translateY(8px)",
                }}
              >
                <div className="absolute -translate-y-1/2 whitespace-nowrap text-xs">
                  {d.key.length > 10 ? `${d.key.slice(0, 10)}…` : d.key}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
