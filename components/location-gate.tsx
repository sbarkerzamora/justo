"use client"

import { useEffect, useState } from "react"
import { LlmHome } from "@/components/chat/llm-home"
import { LocationDialog } from "@/components/location-dialog"
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "justo-country"

const getStored = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const setStored = (code: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* noop */
  }
}

export function LocationGate() {
  const [ready, setReady] = useState(false)
  const [countryCode, setCountryCode] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    const stored = getStored()
    if (stored) {
      setCountryCode(stored)
    } else {
      setShowDialog(true)
    }
    setReady(true)
  }, [])

  const handleConfirm = (code: string) => {
    setStored(code)
    setCountryCode(code)
    setShowDialog(false)
  }

  const handleChangeCountry = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* noop */
    }
    setCountryCode(null)
    setShowDialog(true)
  }

  if (!ready) return null

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
        <LocationDialog open={showDialog} onConfirm={handleConfirm} />
        {countryCode ? <LlmHome countryCode={countryCode} onChangeCountry={handleChangeCountry} /> : null}
      </div>
    </div>
  )
}
