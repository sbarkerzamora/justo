"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"

export function LangUpdater() {
  const params = useParams<{ locale?: string }>()
  const locale = params?.locale

  useEffect(() => {
    if (locale === "en" || locale === "es") {
      document.documentElement.lang = locale
    }
  }, [locale])

  return null
}
