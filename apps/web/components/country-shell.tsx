"use client"

import { useEffect, useRef, useState } from "react"
import { LlmHome } from "@/components/chat/llm-home"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { getCountryAccent } from "@/lib/country-accent"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function CountryShell({
  countryCode,
  locale,
  initialTool,
}: {
  countryCode: string
  locale: Locale
  initialTool?: "settlement" | "vacations" | "salary-net"
}) {
  const [isSpringing, setIsSpringing] = useState(false)
  const springTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem("justo-country", countryCode)
      localStorage.setItem("justo-locale", locale)
    } catch {
      /* noop */
    }
  }, [countryCode, locale])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) return

    const triggerSpring = () => {
      if (window.scrollY > 8) return

      setIsSpringing(false)
      window.requestAnimationFrame(() => setIsSpringing(true))

      if (springTimeoutRef.current) {
        clearTimeout(springTimeoutRef.current)
      }

      springTimeoutRef.current = setTimeout(() => {
        setIsSpringing(false)
      }, 620)
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 12) triggerSpring()
    }

    const handleTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      const startY = touchStartYRef.current
      const currentY = event.touches[0]?.clientY

      if (startY == null || currentY == null) return
      if (startY - currentY > 14) triggerSpring()
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      if (springTimeoutRef.current) clearTimeout(springTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <style>{`html{overflow-y:scroll;scrollbar-width:none !important}html::-webkit-scrollbar{display:none !important}`}</style>
      <div
        className={cn(
          "relative flex h-[calc(100vh-3rem)] min-h-[calc(100vh-3rem)] overflow-hidden",
          isSpringing && "justo-hero-spring"
        )}
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
        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <LlmHome
            countryCode={countryCode}
            locale={locale}
            initialTool={initialTool}
          />
        </div>
      </div>
    </>
  )
}
