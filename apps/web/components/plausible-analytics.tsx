"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const enabled = process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED === "true"
const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
const endpoint = process.env.NEXT_PUBLIC_PLAUSIBLE_ENDPOINT

let isInitialized = false
let lastTrackedUrl: string | null = null

const getPageUrl = (pathname: string) => {
  if (typeof window === "undefined") return pathname
  return `${window.location.origin}${pathname}`
}

export function PlausibleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    if (!enabled || !domain || !endpoint || !pathname) return

    let cancelled = false

    const trackPageview = async () => {
      const { init, track } = await import("@plausible-analytics/tracker")

      if (cancelled) return

      if (!isInitialized) {
        init({
          domain,
          endpoint,
          autoCapturePageviews: false,
          captureOnLocalhost: false,
          logging: false,
        })
        isInitialized = true
      }

      const url = getPageUrl(pathname)
      if (lastTrackedUrl === url) return

      lastTrackedUrl = url
      track("pageview", { url, interactive: false })
    }

    void trackPageview()

    return () => {
      cancelled = true
    }
  }, [pathname])

  return null
}
