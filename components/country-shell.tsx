"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LlmHome } from "@/components/chat/llm-home"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"

export function CountryShell({ countryCode }: { countryCode: string }) {
  const { push } = useRouter()

  useEffect(() => {
    try {
      localStorage.setItem("justo-country", countryCode)
    } catch {
      /* noop */
    }
  }, [countryCode])

  return (
    <div className="relative min-h-svh">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.08}
        duration={3}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
          "fixed inset-0 h-full w-full",
        )}
      />
      <div className="relative z-10">
        <LlmHome countryCode={countryCode} onChangeCountry={() => {
          try { localStorage.removeItem("justo-country") } catch { /* noop */ }
          push("/")
        }} />
      </div>
    </div>
  )
}
