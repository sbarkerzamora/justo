"use client"

import { useEffect, useRef, useState } from "react"
import GridLoader from "@/components/smoothui/grid-loader"
import type { PresetPattern } from "@/components/smoothui/grid-loader"

const typingConfig: Record<
  "searching" | "thinking" | "generating",
  { pattern: PresetPattern; color: string; mode: "pulse" | "stagger" }
> = {
  searching: { pattern: "ripple-out", color: "blue", mode: "pulse" },
  thinking: { pattern: "waterfall", color: "amber", mode: "stagger" },
  generating: { pattern: "heartbeat", color: "green", mode: "pulse" },
}

export function ChatTypingIndicator({
  typingMode,
  typingMessages,
}: {
  typingMode: "idle" | "searching" | "thinking" | "generating"
  typingMessages: string[]
}) {
  const [labelIndex] = useState(() =>
    typingMessages.length > 0
      ? Math.floor(Math.random() * typingMessages.length)
      : 0
  )
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    el.classList.add("t-typing-enter")
    void el.offsetWidth
    el.classList.remove("t-typing-enter")
  }, [])

  const config =
    typingMode === "idle" ? typingConfig.searching : typingConfig[typingMode]

  return (
    <div className="flex max-w-[92%] justify-start px-2 sm:px-4">
      <div className="flex items-center gap-1.5 rounded-full bg-black px-2.5 py-1 ring-2 ring-primary/50">
        <GridLoader
          blur={0}
          color={config.color}
          gap={0.5}
          mode={config.mode}
          pattern={config.pattern}
          rounded={false}
          size={10}
        />
        <span
          className="t-typing-label font-medium text-[11px] text-white"
          ref={labelRef}
        >
          {typingMessages[labelIndex] ?? typingMessages[0] ?? ""}
        </span>
      </div>
    </div>
  )
}
