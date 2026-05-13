"use client"

import { useRouter } from "next/navigation"
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

const countryLinks: Record<string, string> = {
  ni: "/docs/legal/nicaragua",
  sv: "/docs/legal/elsalvador",
  gt: "/docs/legal/guatemala",
  hn: "/docs/legal/honduras",
  cr: "/docs/legal/costarica",
  pa: "/docs/legal/panama",
  mx: "/docs/legal/mexico",
  co: "/docs/legal/colombia",
  pe: "/docs/legal/peru",
  ar: "/docs/legal/argentina",
  cl: "/docs/legal/chile",
}

export function DocsNavTitle() {
  const router = useRouter()
  const [cc, setCc] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("justo-country")
    if (stored) setCc(stored)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span>Justo</span>
      {cc ? (
        <button
          type="button"
          onClick={() => router.push(countryLinks[cc] ?? "/docs/legal/nicaragua")}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-accent"
        >
          <img
            src={`https://flagcdn.com/w40/${cc}.png`}
            alt={countryLabels[cc] ?? cc}
            className="h-2 w-3 rounded-[1px] border border-border object-cover"
          />
          {countryLabels[cc] ?? cc}
        </button>
      ) : null}
    </div>
  )
}
