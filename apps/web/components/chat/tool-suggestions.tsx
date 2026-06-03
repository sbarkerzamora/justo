"use client"

import {
  IconCalculator,
  IconBeach,
  IconTools,
  IconBook,
} from "@tabler/icons-react"

interface ToolSuggestion {
  label: string
  icon: React.ReactNode
  onClick: () => void
}

export function ToolSuggestions({
  suggestions,
}: {
  suggestions: ToolSuggestion[]
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {suggestions.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={s.onClick}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:border-primary/30"
        >
          {s.icon}
          {s.label}
        </button>
      ))}
    </div>
  )
}

export function defaultToolSuggestions(
  onSettlement: () => void,
  onVacations: () => void,
  onTools: () => void,
  onLegal: () => void
): ToolSuggestion[] {
  return [
    {
      label: "Calcular liquidacion",
      icon: <IconCalculator className="size-3.5" />,
      onClick: onSettlement,
    },
    {
      label: "Calcular vacaciones",
      icon: <IconBeach className="size-3.5" />,
      onClick: onVacations,
    },
    {
      label: "Ver herramientas",
      icon: <IconTools className="size-3.5" />,
      onClick: onTools,
    },
    {
      label: "Ver base legal",
      icon: <IconBook className="size-3.5" />,
      onClick: onLegal,
    },
  ]
}
