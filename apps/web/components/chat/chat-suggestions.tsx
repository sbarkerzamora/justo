"use client"

import type { ChatAction, AppMode } from "@/components/chat/types"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import type { Locale } from "@/lib/i18n"

export function ChatSuggestions({
  actions,
  locale,
  setMode,
}: {
  actions: ChatAction[]
  locale: Locale
  setMode: (mode: AppMode) => void
}) {
  return (
    <div className="flex max-w-full min-w-0 flex-wrap justify-center gap-1.5 px-0.5 pb-1 sm:px-0">
      {actions.map((action) => {
        const Icon = action.icon
        const label = locale === "en" ? action.labelEn : action.labelEs
        return (
          <PromptSuggestion
            key={label}
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              if (action.onClick) {
                action.onClick()
                return
              }
              if (action.mode) setMode(action.mode)
            }}
            className="h-8 shrink-0 gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 text-xs font-medium text-muted-foreground shadow-none backdrop-blur transition-colors hover:border-foreground/20 hover:bg-muted hover:text-foreground sm:px-3"
          >
            <Icon className="size-3.5" />
            <span>{label}</span>
          </PromptSuggestion>
        )
      })}
    </div>
  )
}
