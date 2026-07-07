"use client"

import { useState } from "react"
import {
  IconArrowUp,
  IconMessageCircle,
  IconSquare,
  IconTools,
} from "@tabler/icons-react"
import type { AppMode, ChatAction } from "@/components/chat/types"
import { ChatSuggestions } from "@/components/chat/chat-suggestions"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import type { Locale } from "@/lib/i18n"

const pickRandomToolModes = (modes: AppMode[]) =>
  [...modes]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)

const pickInitialToolModes = (modes: AppMode[]) => modes.slice(0, 4)

const pickSeededToolModes = (modes: AppMode[], seed: string) => {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return [...modes]
    .sort((a, b) => ((hash + a.charCodeAt(0)) % 17) - ((hash + b.charCodeAt(0)) % 17))
    .slice(0, 4)
}

export function ChatInputPanel({
  chatActions,
  locale,
  setMode,
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  variant = "welcome",
  onNewChat,
}: {
  chatActions: ChatAction[]
  locale: Locale
  setMode: (mode: AppMode) => void
  input: string
  setInput: (value: string) => void
  onSend: () => Promise<void>
  isLoading: boolean
  onStop: () => void
  variant?: "welcome" | "compact"
  onNewChat?: () => void
}) {
  const toolActions = chatActions.filter((a): a is ChatAction & { mode: AppMode } => !!a.mode)
  const toolModes = toolActions.map((action) => action.mode)
  const toolModeKey = toolModes.join("|")
  const [quickToolModes, setQuickToolModes] = useState<AppMode[]>(() =>
    toolModeKey
      ? pickSeededToolModes(toolModes, `${toolModeKey}:${new Date().toISOString().slice(0, 10)}`)
      : pickInitialToolModes(toolModes)
  )
  const quickToolActions = quickToolModes
    .map((mode) => toolActions.find((action) => action.mode === mode))
    .filter((action): action is ChatAction & { mode: AppMode } => !!action)
  const remainingToolActions = toolActions.filter(
    (action) => !quickToolModes.includes(action.mode)
  )

  const handleNewChat = () => {
    onNewChat?.()
    setQuickToolModes(pickRandomToolModes(toolModes))
  }
  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-2">
      {variant === "welcome" ? (
        <ChatSuggestions
          actions={chatActions}
          locale={locale}
          setMode={setMode}
        />
      ) : (
        <div className="flex max-w-full flex-wrap items-center gap-1.5 pb-1">
          <button
            type="button"
            onClick={handleNewChat}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:border-foreground/20 hover:bg-muted hover:text-foreground sm:px-3"
          >
            <IconMessageCircle className="size-3.5" />
            {locale === "en" ? "New chat" : "Nuevo chat"}
          </button>
          {quickToolActions.map((action) => {
            const Icon = action.icon
            const label = locale === "en" ? action.labelEn : action.labelEs
            return (
              <button
                key={action.mode}
                type="button"
                onClick={() => setMode(action.mode)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 text-xs font-medium text-muted-foreground shadow-none transition-colors hover:border-foreground/20 hover:bg-muted hover:text-foreground sm:px-3"
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      )}
      <PromptInput
        value={input}
        onValueChange={setInput}
        onSubmit={() => void onSend()}
        isLoading={isLoading}
        className="min-w-0 border-border bg-card/95 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-card/85"
      >
        <PromptInputTextarea
          placeholder={
            locale === "en"
              ? "Ask a labor question..."
              : "Escribe tu consulta laboral..."
          }
          disabled={isLoading}
          className="min-h-[48px] text-sm text-foreground placeholder:text-muted-foreground sm:min-h-[56px]"
        />
        <PromptInputActions className={cn("pt-1", variant === "compact" ? "justify-between" : "justify-end")}>
          {variant === "compact" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  aria-label={locale === "en" ? "Tools" : "Herramientas"}
                >
                  <IconTools className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start">
                {(remainingToolActions.length > 0 ? remainingToolActions : toolActions).map((action) => {
                  const Icon = action.icon
                  const label = locale === "en" ? action.labelEn : action.labelEs
                  return (
                    <DropdownMenuItem
                      key={label}
                      onSelect={() => setMode(action.mode)}
                    >
                      <Icon className="size-4" />
                      {label}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          {isLoading ? (
            <PromptInputAction tooltip={locale === "en" ? "Stop" : "Detener"}>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="rounded-full"
                onClick={onStop}
                aria-label={
                  locale === "en" ? "Stop response" : "Detener respuesta"
                }
              >
                <IconSquare data-icon="inline-start" />
              </Button>
            </PromptInputAction>
          ) : (
            <PromptInputAction tooltip={locale === "en" ? "Send" : "Enviar"}>
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                onClick={() => void onSend()}
                disabled={!input.trim()}
                aria-label={locale === "en" ? "Send message" : "Enviar mensaje"}
              >
                <IconArrowUp data-icon="inline-start" />
              </Button>
            </PromptInputAction>
          )}
        </PromptInputActions>
      </PromptInput>
    </div>
  )
}
