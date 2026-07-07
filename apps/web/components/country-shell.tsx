"use client"

import { useEffect } from "react"
import { LlmHome } from "@/components/chat/llm-home"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { getCountryAccent } from "@/lib/country-accent"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { AppMode } from "@/components/chat/types"

export function CountryShell({
  countryCode,
  locale,
  initialTool,
}: {
  countryCode: string
  locale: Locale
  initialTool?: AppMode
}) {
  useEffect(() => {
    try {
      localStorage.setItem("justo-country", countryCode)
      localStorage.setItem("justo-locale", locale)
    } catch {
      /* noop */
    }
  }, [countryCode, locale])

  return (
    <>
      <div
        className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden"
        style={
          {
            "--country-accent": getCountryAccent(countryCode),
          } as React.CSSProperties
        }
      >
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.08}
          duration={3}
          repeatDelay={1}
          className={cn(
            "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
            "absolute inset-0 z-0"
          )}
        />
        <LlmHome
        countryCode={countryCode}
        locale={locale}
        initialTool={initialTool}
      />
      </div>
    </>
  )
}
