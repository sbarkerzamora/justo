import Image from "next/image"
import AgentAvatar from "@/components/smoothui/agent-avatar"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"

export function WelcomeEmptyState({
  cc,
  countryName,
  copy,
}: {
  cc: string
  countryName: string
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="flex flex-col items-center gap-y-3 py-2 text-center duration-300 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 sm:gap-y-8 sm:py-6">
      <div className="flex flex-col items-center gap-y-3 sm:gap-y-4">
        <div className="overflow-hidden rounded-full shadow-lg motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
          <AgentAvatar seed={cc} size={96} className="rounded-full" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1 sm:px-3.5 sm:py-1.5">
          <Image
            src={`https://flagcdn.com/w40/${cc}.png`}
            alt={countryName}
            width={14}
            height={10}
            sizes="14px"
            loading="lazy"
            className="h-2.5 w-3.5 rounded-[1px] border border-border object-cover"
          />
          <span>{copy.laborAssistant}</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{countryName}</span>
        </div>
      </div>
      <div className="motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {copy.welcome(countryName)}
        </p>
      </div>
    </div>
  )
}
