"use client"

import { useEffect, useState } from "react"

const countryLabels: Record<string, string> = {
  ni: "Nicaragua",
  gt: "Guatemala",
}

const countryLinks: Record<string, string> = {
  ni: "/docs/legal/nicaragua",
  gt: "/docs/legal/guatemala",
}

export function DocsFooter() {
  const [cc, setCc] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("justo-country")
    if (stored) setCc(stored)
  }, [])

  const link = cc ? countryLinks[cc] : "/docs/legal/nicaragua"
  const label = cc ? countryLabels[cc] : "Nicaragua"

  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <div className="mb-3 flex items-center justify-center gap-1.5">
        <a
          href={link}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-foreground hover:bg-accent"
        >
          {cc ? (
            <img
              src={`https://flagcdn.com/w40/${cc}.png`}
              alt={label}
              className="h-2.5 w-3.5 rounded-[2px] border border-border object-cover"
            />
          ) : null}
          {label}
        </a>
      </div>
      <p>
        Justo &middot; Asistente laboral open source para Centroamerica &middot; La informacion
        aqui presentada no constituye asesoria legal profesional
      </p>
      <p className="mt-1">
        Desarrollado por{" "}
        <a
          href="https://stephanbarker.com"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-foreground"
        >
          stephanbarker.com
        </a>
      </p>
    </footer>
  )
}
