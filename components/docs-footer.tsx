"use client"

import { useEffect, useState } from "react"

const countryLabels: Record<string, string> = {
  ni: "Nicaragua",
  sv: "El Salvador",
  gt: "Guatemala",
  hn: "Honduras",
  cr: "Costa Rica",
  pa: "Panamá",
  mx: "México",
  co: "Colombia",
  pe: "Perú",
  ar: "Argentina",
  cl: "Chile",
}

export function DocsFooter() {
  const [cc, setCc] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("justo-country")
    if (stored) setCc(stored)
  }, [])

  return (
    <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
      <p>
        Justo &middot; Asistente laboral open source &middot;{" "}
        {cc ? countryLabels[cc] ?? cc : "Nicaragua"} &middot; No constituye asesoría legal
        profesional &middot;{" "}
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
