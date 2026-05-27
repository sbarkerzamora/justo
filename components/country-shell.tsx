"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LlmHome } from "@/components/chat/llm-home"
import { AsciiShaderBackground } from "@/components/ui/ascii-shader-background"

export function CountryShell({ countryCode }: { countryCode: string }) {
  const { push } = useRouter()

  useEffect(() => {
    try {
      localStorage.setItem("justo-country", countryCode)
    } catch {
      /* noop */
    }
  }, [countryCode])

  return (
    <div className="relative isolate min-h-svh overflow-hidden bg-background">
      <AsciiShaderBackground />
      <div className="relative z-10">
        <LlmHome
          countryCode={countryCode}
          onChangeCountry={() => {
            try {
              localStorage.removeItem("justo-country")
            } catch {
              /* noop */
            }
            push("/")
          }}
        />
      </div>
    </div>
  )
}
