"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { LlmHome } from "@/components/chat/llm-home"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import type { Locale } from "@/lib/i18n"
import { localizedCountryPath } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function CountryShell({
  countryCode,
  locale,
  children,
}: {
  countryCode: string
  locale: Locale
  children?: ReactNode
}) {
  const { push } = useRouter()
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
    <div
      className={cn(
        "scrollbar-hidden relative h-svh transform-gpu overflow-y-auto",
        isSpringing && "justo-hero-spring"
      )}
    >
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.08}
        duration={3}
        repeatDelay={1}
        className={cn(
          "mask-[radial-gradient(800px_circle_at_center,white,transparent)]",
          "fixed inset-0 h-full w-full"
        )}
      />
      <div className="relative z-10">
        <LlmHome
          countryCode={countryCode}
          locale={locale}
          onChangeCountry={(nextCountryCode) => {
            try {
              localStorage.setItem("justo-country", nextCountryCode)
            } catch {
              /* noop */
            }
            push(localizedCountryPath(locale, nextCountryCode))
          }}
          onChangeLocale={(nextLocale) => {
            try {
              localStorage.setItem("justo-locale", nextLocale)
            } catch {
              /* noop */
            }
            push(localizedCountryPath(nextLocale, countryCode))
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-28 z-20 flex justify-center px-4 text-center text-[11px] font-medium tracking-widest text-muted-foreground uppercase motion-safe:animate-pulse max-sm:bottom-24">
        {locale === "en"
          ? "Swipe for legal explanation"
          : "Desliza para ver la explicación legal"}
      </div>
      {children}
    </div>
  )
}
