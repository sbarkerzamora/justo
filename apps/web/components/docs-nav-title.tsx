"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { getCountryInfo } from "@/lib/countries"
import { getLegalDocsLink } from "@/lib/legal-docs-link"

function NavTitleInner() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const [storedCountry, setStoredCountry] = useState<string | null>(null)
  const fromUrl = searchParams.get("country")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("justo-country")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setStoredCountry(stored)
    } catch {
      /* noop */
    }
  }, [])

  useEffect(() => {
    if (!fromUrl) return
    try {
      localStorage.setItem("justo-country", fromUrl)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStoredCountry(fromUrl)
    } catch {
      /* noop */
    }
  }, [fromUrl])

  const cc = fromUrl ?? storedCountry

  const info = cc ? getCountryInfo(cc) : null

  return (
    <div className="flex items-center gap-2">
      <span>Justo</span>
      {info ? (
        <button
          type="button"
          onClick={() => push(getLegalDocsLink(info.code))}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-accent"
        >
          <Image
            src={`https://flagcdn.com/w40/${info.flag}.png`}
            alt={info.name}
            width={12}
            height={8}
            className="h-2 w-3 rounded-[1px] border border-border object-cover"
          />
          {info.name}
        </button>
      ) : null}
    </div>
  )
}

export function DocsNavTitle() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2">
          <span>Justo</span>
        </div>
      }
    >
      <NavTitleInner />
    </Suspense>
  )
}
