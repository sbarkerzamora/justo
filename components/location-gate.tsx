"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
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

export function LocationGate() {
  const { push } = useRouter()
  const storedCountry = useMemo(() => getStored(), [])

  const handleConfirm = (code: string) => {
    push(`/${code}`)
  }

  if (storedCountry) {
    if (typeof window !== "undefined") {
      window.location.replace(`/${storedCountry}`)
    }
    return null
  }

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
        <LocationDialog open onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
