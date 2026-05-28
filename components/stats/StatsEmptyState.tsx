"use client"

import { useEffect, useRef, useState } from "react"
import { IconChartBar } from "@tabler/icons-react"

const STYLE_ID = "transitions-justo-stats"
const INTERVAL_MS = 3500

const PHRASES = [
  "Recopilando datos anónimos de liquidaciones…",
  "Cada cálculo nos ayuda a entender el panorama laboral.",
  "Los datos se actualizan en tiempo real.",
  "Transparencia basada en casos reales.",
  "Pronto verás tendencias de salarios y despidos.",
  "Tus cálculos construyen estas estadísticas.",
  "Estamos procesando las primeras liquidaciones.",
  "Sin datos personales, solo estadísticas anónimas.",
]

const STYLES = `
:root {
  --text-swap-dur: 150ms;
  --text-swap-translate-y: 4px;
  --text-swap-blur: 2px;
  --text-swap-ease: ease-in-out;
}

.justo-text-swap {
  display: inline-block;
  transform: translateY(0);
  filter: blur(0);
  opacity: 1;
  transition:
    transform var(--text-swap-dur) var(--text-swap-ease),
    filter    var(--text-swap-dur) var(--text-swap-ease),
    opacity   var(--text-swap-dur) var(--text-swap-ease);
  will-change: transform, filter, opacity;
}
.justo-text-swap.is-exit {
  transform: translateY(calc(var(--text-swap-translate-y) * -1));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
}
.justo-text-swap.is-enter-start {
  transform: translateY(var(--text-swap-translate-y));
  filter: blur(var(--text-swap-blur));
  opacity: 0;
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .justo-text-swap { animation: none !important; transition: none !important; }
}
`

if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = STYLES
  document.head.appendChild(style)
}

function readMs(name: string, fallback: number): number {
  if (typeof document === "undefined") return fallback
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

export function StatsEmptyState() {
  const [index, setIndex] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const busy = useRef(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timer.current = setInterval(() => {
      if (busy.current) return
      const el = ref.current
      if (!el) return
      busy.current = true
      const dur = readMs("--text-swap-dur", 200)

      el.classList.add("is-exit")
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length)
        el.classList.remove("is-exit")
        el.classList.add("is-enter-start")
        void el.offsetWidth
        el.classList.remove("is-enter-start")
        busy.current = false
      }, dur)
    }, INTERVAL_MS)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [])

  return (
    <div className="flex h-72 flex-col items-center justify-center gap-4">
      <IconChartBar className="size-8 text-muted-foreground/40 motion-safe:animate-pulse" />
      <span className="justo-text-swap text-sm text-muted-foreground" ref={ref}>
        {PHRASES[index]}
      </span>
    </div>
  )
}
