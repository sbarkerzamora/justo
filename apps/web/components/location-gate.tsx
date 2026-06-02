"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { Orb } from "@/components/ui/orb"
import { countryList, defaultCountry, isValidCountry } from "@/lib/countries"
import {
  defaultLocale,
  detectLocale,
  isValidLocale,
  localizedCountryPath,
} from "@/lib/i18n"
import { cn } from "@/lib/utils"

const COUNTRY_STORAGE_KEY = "justo-country"
const LOCALE_STORAGE_KEY = "justo-locale"

const getStored = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    const country = localStorage.getItem(COUNTRY_STORAGE_KEY)
    return country && isValidCountry(country) ? country : null
  } catch {
    return null
  }
}

const getStoredLocale = () => {
  if (typeof window === "undefined") return null
  try {
    const locale = localStorage.getItem(LOCALE_STORAGE_KEY)
    return locale && isValidLocale(locale) ? locale : null
  } catch {
    return null
  }
}

const detectCountry = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const country = countryList.find((c) =>
      c.timezones.some((t) => tz.startsWith(t))
    )
    return country?.code ?? defaultCountry
  } catch {
    return defaultCountry
  }
}

export function LocationGate() {
  const { replace } = useRouter()

  useEffect(() => {
    const locale =
      getStoredLocale() ?? detectLocale(navigator.language) ?? defaultLocale
    replace(localizedCountryPath(locale, getStored() ?? detectCountry()))
  }, [replace])

  return (
    <div className="relative min-h-svh">
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
      <div className="relative z-10 flex min-h-svh items-center justify-center px-4">
        <div className="rounded-2xl border border-border bg-card/85 px-5 py-4 shadow-sm backdrop-blur-md motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-2">
          <Orb className="size-14" agentState="thinking" colors={["#4F86C6", "#A8C8E8"]} />
        </div>
      </div>
    </div>
  )
}
