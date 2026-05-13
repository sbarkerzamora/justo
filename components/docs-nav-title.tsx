"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { getCountryInfo } from "@/lib/countries"

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

function NavTitleInner() {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const [storedCountry, setStoredCountry] = useState<string | null>(null)
  const fromUrl = searchParams.get("country")

  useEffect(() => {
    if (fromUrl) {
      try {
        localStorage.setItem("justo-country", fromUrl)
      } catch {
        /* noop */
      }
      setStoredCountry(fromUrl)
      return
    }

    try {
      setStoredCountry(localStorage.getItem("justo-country"))
    } catch {
      setStoredCountry(null)
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
          onClick={() => push(countryLinks[info.code] ?? "/docs/legal/nicaragua")}
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
    <Suspense fallback={<div className="flex items-center gap-2"><span>Justo</span></div>}>
      <NavTitleInner />
    </Suspense>
  )
}
