import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

type BackgroundRippleEffectProps = {
  rows?: number
  cols?: number
  cellSize?: number
  className?: string
}

export function BackgroundRippleEffect({
  rows = 8,
  cols = 27,
  cellSize = 56,
  className,
}: BackgroundRippleEffectProps) {
  const width = cols * cellSize
  const height = rows * cellSize
  const style = {
    width,
    height,
    backgroundImage: `linear-gradient(var(--cell-border-color) 1px, transparent 1px), linear-gradient(90deg, var(--cell-border-color) 1px, transparent 1px)`,
    backgroundSize: `${cellSize}px ${cellSize}px`,
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex justify-center overflow-hidden",
        "[--cell-border-color:var(--color-neutral-300)] dark:[--cell-border-color:var(--color-neutral-700)]",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="mask-radial-from-20% mask-radial-at-top max-w-full opacity-40"
        style={style}
      />
    </div>
  )
}
