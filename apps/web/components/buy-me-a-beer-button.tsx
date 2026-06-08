"use client"

import { useEffect, useRef } from "react"

const SCRIPT_SRC = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"

export function BuyMeABeerButton() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.textContent = ""

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = SCRIPT_SRC
    script.dataset.name = "bmc-button"
    script.dataset.slug = "stephanbarker"
    script.dataset.color = "#FF5F5F"
    script.dataset.emoji = "🍺"
    script.dataset.font = "Inter"
    script.dataset.text = "Buy me a beer"
    script.dataset.outlineColor = "#000000"
    script.dataset.fontColor = "#ffffff"
    script.dataset.coffeeColor = "#FFDD00"
    script.async = true

    container.appendChild(script)

    return () => {
      container.textContent = ""
    }
  }, [])

  return <div ref={containerRef} className="min-h-8 overflow-hidden" />
}
