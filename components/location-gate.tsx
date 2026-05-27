"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { LocationDialog } from "@/components/location-dialog"
import { AsciiShaderBackground } from "@/components/ui/ascii-shader-background"

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
    <div className="relative isolate min-h-svh overflow-hidden bg-background">
      <AsciiShaderBackground />
      <div className="relative z-10">
        <LocationDialog open onConfirm={handleConfirm} />
      </div>
    </div>
  )
}
