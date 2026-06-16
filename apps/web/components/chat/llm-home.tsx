"use client"

function _injectTypingStyles() {
  if (typeof document === "undefined") return
  if (document.getElementById("justo-typing-styles")) return
  const style = document.createElement("style")
  style.id = "justo-typing-styles"
  style.textContent = `
.t-typing-label{display:inline-block;transform:translateY(0);filter:blur(0);opacity:1;transition:transform .16s ease-in-out,filter .16s ease-in-out,opacity .16s ease-in-out;will-change:transform,filter,opacity}
.t-typing-label.t-typing-exit{transform:translateY(-4px);filter:blur(2px);opacity:0}
.t-typing-label.t-typing-enter{transform:translateY(3px);filter:blur(1px);opacity:0;transition:none}
@media (prefers-reduced-motion:reduce){.t-typing-label{transition:none!important}}
`
  document.head.appendChild(style)
}
_injectTypingStyles()

import {
  IconArrowUp,
  IconCalculator,
  IconBeach,
  IconBell,
  IconCoins,
  IconGift,
  IconDoorExit,
  IconFileDescription,
  IconMessageCircle,
  IconSquare,
} from "@tabler/icons-react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { type ComponentType, useCallback, useEffect, useRef, useState } from "react"
import type { Components } from "react-markdown"
import AgentAvatar from "@/components/smoothui/agent-avatar"
import { getCountryInfo } from "@/lib/countries"
import { homeCopy } from "@/lib/home-copy"
import type { Locale } from "@/lib/i18n"
import { getLegalDocsLink, getTopicDocsLink } from "@/lib/legal-docs-link"
import { useChatMessages } from "@/components/chat/use-chat-messages"
import { useChatUI } from "@/components/chat/use-chat-ui"
import { Button } from "@/components/ui/button"
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container"
import { Markdown } from "@/components/ui/markdown"
import { Message, MessageContent } from "@/components/ui/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning"
import { ScrollButton } from "@/components/ui/scroll-button"
import { cn } from "@/lib/utils"
import { SettlementTool } from "@/components/tools/settlement"
import { SalaryNetTool } from "@/components/tools/salary-net"
import { VacationsTool } from "@/components/tools/vacations"
import { BonusTool } from "@/components/tools/bonus"
import { TerminationTool } from "@/components/tools/termination"
import { ContractTool } from "@/components/tools/contract"
import { PreavisoTool } from "@/components/tools/preaviso"
import GridLoader from "@/components/smoothui/grid-loader"
import type { PresetPattern } from "@/components/smoothui/grid-loader"

type Role = "user" | "assistant"
type ChatMessage = { id: string; role: Role; text: string; reasoning?: string; topics?: string[] }

type AppMode =
  | "chat"
  | "settlement"
  | "vacations"
  | "salary-net"
  | "bonus"
  | "termination"
  | "contract"
  | "preaviso"

type ChatAction = {
  mode?: AppMode
  icon: ComponentType<{ className?: string }>
  labelEs: string
  labelEn: string
  onClick?: () => void
}

const safeHref = (href: string | undefined) => {
  if (!href) return "#"
  if (/^(https?:|mailto:|\/)/i.test(href)) return href
  return "#"
}

const validToolParams = new Set([
  "settlement",
  "vacations",
  "salary-net",
  "bonus",
  "termination",
  "contract",
  "preaviso",
])
function isValidToolParam(v: string): v is AppMode {
  return validToolParams.has(v)
}

const numberFormatters: Record<string, Intl.NumberFormat> = {
  NIO: new Intl.NumberFormat("es-NI", { style: "currency", currency: "NIO" }),
  USD: new Intl.NumberFormat("es-NI", { style: "currency", currency: "USD" }),
  GTQ: new Intl.NumberFormat("es-NI", { style: "currency", currency: "GTQ" }),
  HNL: new Intl.NumberFormat("es-NI", { style: "currency", currency: "HNL" }),
  CRC: new Intl.NumberFormat("es-NI", { style: "currency", currency: "CRC" }),
  MXN: new Intl.NumberFormat("es-NI", { style: "currency", currency: "MXN" }),
  COP: new Intl.NumberFormat("es-NI", { style: "currency", currency: "COP" }),
  PEN: new Intl.NumberFormat("es-NI", { style: "currency", currency: "PEN" }),
  ARS: new Intl.NumberFormat("es-NI", { style: "currency", currency: "ARS" }),
  CLP: new Intl.NumberFormat("es-NI", { style: "currency", currency: "CLP" }),
}
const money = (value: number, currencyCode?: string) =>
  (numberFormatters[currencyCode ?? "NIO"] ?? numberFormatters.NIO).format(
    value
  )

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()

const shouldStartGuidedFlow = (text: string, locale: Locale) => {
  const normalized = normalizeText(text)
  const es = locale === "es"
  return (
    (es && normalized.includes("iniciar calcul")) ||
    (es && normalized.includes("calculo guiado")) ||
    (es && normalized.includes("calcular mi liquidacion")) ||
    (es && normalized.includes("liquidacion completa")) ||
    (es && normalized.includes("paso a paso")) ||
    (es && normalized.includes("salario neto")) ||
    normalized.includes("start guided") ||
    normalized.includes("guided calculation") ||
    normalized.includes("calculate my settlement") ||
    normalized.includes("step by step") ||
    normalized.includes("full settlement") ||
    normalized.includes("net salary")
  )
}

export function LlmHome({
  countryCode,
  locale,
  initialTool,
}: {
  countryCode?: string
  locale: Locale
  initialTool?: "settlement" | "vacations" | "salary-net"
}) {
  const cc = countryCode ?? "ni"
  const copy = homeCopy[locale]
  const info = getCountryInfo(cc)
  const countryName = info?.name ?? cc
  const currencyCode = info?.currencyCode ?? "NIO"
  const currencyLabel = info?.currencyLabel ?? "córdobas (NIO)"
  const fmt = (v: number) => money(v, currencyCode)

  const {
    messages,
    setMessages,
    input,
    setInput,
    append,
    setMessageText,
    setMessageReasoning,
    setMessageTopics,
    resetMessages,
  } = useChatMessages()

  const {
    isLoading,
    isTyping,
    typingMode,
    setLoading,
    setTyping,
    setTypingMode,
    setStreamingReply,
    setHasStreamChunk,
  } = useChatUI()

  const searchParams = useSearchParams()
  const toolFromUrl = searchParams?.get("tool")

  const [mode, setMode] = useState<AppMode>(() => {
    const tool = initialTool ?? toolFromUrl
    if (tool === "settlement") return "settlement"
    if (tool === "vacations") return "vacations"
    if (tool === "salary-net") return "salary-net"
    if (tool === "bonus") return "bonus"
    if (tool === "termination") return "termination"
    if (tool === "contract") return "contract"
    if (tool === "preaviso") return "preaviso"
    return "chat"
  })

  const prevToolFromUrl = useRef<string | null>(undefined)
  if (prevToolFromUrl.current === undefined) {
    prevToolFromUrl.current = toolFromUrl
  } else if (toolFromUrl !== prevToolFromUrl.current) {
    prevToolFromUrl.current = toolFromUrl
    if (toolFromUrl && isValidToolParam(toolFromUrl)) {
      setMode(toolFromUrl)
    }
  }

  const resetConversation = () => {
    resetMessages()
    setMode("chat")
    setTyping(false)
  }

  const sendLegalQuery = async (text: string) => {
    setLoading(true)
    setTyping(true)
    setTypingMode("searching")
    const docsLink = getLegalDocsLink(cc)
    const fallbackMessage = copy.fallback(docsLink)
    const assistantMessageId = crypto.randomUUID()
    let assistantMessageCreated = false

    setStreamingReply(true)
    setHasStreamChunk(false)

    const ensureAssistantMessage = () => {
      if (assistantMessageCreated) return
      assistantMessageCreated = true
      setMessages((current) => [
        ...current,
        { id: assistantMessageId, role: "assistant", text: "", reasoning: "" },
      ])
    }

    const showAssistantMessage = (message: string) => {
      ensureAssistantMessage()
      setMessageText(assistantMessageId, message)
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", parts: [{ type: "text", text }] }],
          countryCode: cc,
        }),
      })
      if (!res.ok) {
        setStreamingReply(false)
        setTypingMode("idle")
        const errorMessage = await res
          .json()
          .then((data: { error?: unknown }) =>
            typeof data.error === "string" ? data.error : undefined
          )
          .catch(() => undefined)
        showAssistantMessage(copy.fallback(docsLink, errorMessage))
        return
      }

      if (!res.body) {
        setStreamingReply(false)
        setTypingMode("idle")
        showAssistantMessage(fallbackMessage)
        return
      }

      ensureAssistantMessage()
      setTypingMode("thinking")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamedText = ""
      let visibleText = ""
      let reasoningText = ""
      let receivedChunk = false
      let buffer = ""

      const revealText = async (targetText: string) => {
        ensureAssistantMessage()
        while (visibleText.length < targetText.length) {
          const remaining = targetText.length - visibleText.length
          const step = remaining > 80 ? 5 : remaining > 30 ? 3 : 2
          visibleText = targetText.slice(0, visibleText.length + step)
          setMessageText(assistantMessageId, visibleText)
          await wait(18)
        }
      }

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split("\n\n")
        buffer = parts.pop() || ""

        for (const part of parts) {
          const match = part.match(/^data: (.+)$/m)
          if (!match) continue

          try {
            const parsed = JSON.parse(match[1])
            if (parsed.type === "text") {
              streamedText += parsed.content
              if (!receivedChunk && streamedText.trim().length > 0) {
                receivedChunk = true
                setHasStreamChunk(true)
                setTyping(false)
                setTypingMode("generating")
              }
              await revealText(streamedText)
            } else if (parsed.type === "reasoning") {
              reasoningText += parsed.content
              ensureAssistantMessage()
              if (!receivedChunk) {
                receivedChunk = true
                setHasStreamChunk(true)
                setTyping(false)
                setTypingMode("generating")
              }
              setMessageReasoning(assistantMessageId, reasoningText)
            } else if (parsed.type === "topics") {
              ensureAssistantMessage()
              try {
                const topics = JSON.parse(parsed.content)
                if (Array.isArray(topics) && topics.length > 0) {
                  setMessageTopics(assistantMessageId, topics)
                }
              } catch {
                // skip invalid topics
              }
            }
          } catch {
            // skip invalid SSE events
          }
        }
      }

      const finalChunk = decoder.decode()
      if (finalChunk) {
        buffer += finalChunk
        const parts = buffer.split("\n\n")
        for (const part of parts) {
          const match = part.match(/^data: (.+)$/m)
          if (!match) continue
          try {
            const parsed = JSON.parse(match[1])
            if (parsed.type === "text") {
              streamedText += parsed.content
              if (!receivedChunk && streamedText.trim().length > 0) {
                receivedChunk = true
                setHasStreamChunk(true)
                setTyping(false)
                setTypingMode("generating")
              }
              await revealText(streamedText)
            } else if (parsed.type === "reasoning") {
              reasoningText += parsed.content
              ensureAssistantMessage()
              if (!receivedChunk) {
                receivedChunk = true
                setHasStreamChunk(true)
                setTyping(false)
                setTypingMode("generating")
              }
              setMessageReasoning(assistantMessageId, reasoningText)
            }
          } catch {
            // skip
          }
        }
      }

      if (!streamedText.trim()) {
        showAssistantMessage(fallbackMessage)
      }
    } catch (error) {
      showAssistantMessage(
        copy.fallback(
          docsLink,
          error instanceof Error ? error.message : undefined
        )
      )
    } finally {
      setTyping(false)
      setTypingMode("idle")
      setStreamingReply(false)
      setHasStreamChunk(false)
      setLoading(false)
    }
  }

  const onStop = useCallback(() => {
    setLoading(false)
    setTyping(false)
    setTypingMode("idle")
    setStreamingReply(false)
    setHasStreamChunk(false)
  }, [setLoading, setTyping, setStreamingReply, setHasStreamChunk, setTypingMode])

  const sendText = async (text: string) => {
    if (!text || isLoading) return
    append("user", text)

    if (shouldStartGuidedFlow(text, locale)) {
      setMode("settlement")
      return
    }

    await sendLegalQuery(text)
  }

  const onSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    await sendText(text)
  }

  const cleanUrlParams = () => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.delete("tool")
      window.history.replaceState({}, "", url.toString())
    }
  }

  const handleToolComplete = (
    toolMessages: { role: "user" | "assistant"; text: string }[]
  ) => {
    for (const m of toolMessages) {
      append(m.role, m.text)
    }
    setMode("chat")
    cleanUrlParams()
  }

  const handleToolCancel = () => {
    setMode("chat")
    cleanUrlParams()
  }

  return (
    <LlmHomeView
      cc={cc}
      countryName={countryName}
      locale={locale}
      copy={copy}
      resetConversation={resetConversation}
      mode={mode}
      setMode={setMode}
      messages={messages}
      currencyLabel={currencyLabel}
      fmt={fmt}
      onToolComplete={handleToolComplete}
      onToolCancel={handleToolCancel}
      isTyping={isTyping}
      typingMode={typingMode}
      input={input}
      setInput={setInput}
      onSend={onSend}
      isLoading={isLoading}
      onStop={onStop}
    />
  )
}

function LlmHomeView(props: {
  cc: string
  countryName: string
  locale: Locale
  copy: (typeof homeCopy)[Locale]
  resetConversation: () => void
  mode: AppMode
  setMode: (mode: AppMode) => void
  messages: ChatMessage[]
  currencyLabel: string
  fmt: (v: number) => string
  onToolComplete: (
    messages: { role: "user" | "assistant"; text: string }[]
  ) => void
  onToolCancel: () => void
  isTyping: boolean
  typingMode: "idle" | "searching" | "thinking" | "generating"
  input: string
  setInput: (value: string) => void
  onSend: () => Promise<void>
  isLoading: boolean
  onStop: () => void
}) {
  const {
    cc,
    countryName,
    locale,
    copy,
    mode,
    setMode,
    resetConversation,
    messages,
    currencyLabel,
    fmt,
    onToolComplete,
    onToolCancel,
    isTyping,
    typingMode,
    input,
    setInput,
    onSend,
    isLoading,
    onStop,
  } = props

  const isChatMode = mode === "chat"
  const docsLink = getLegalDocsLink(cc)
  const chatActions: ChatAction[] = [
    {
      mode: "settlement",
      icon: IconCalculator,
      labelEs: "Liquidacion",
      labelEn: "Settlement",
    },
    {
      mode: "vacations",
      icon: IconBeach,
      labelEs: "Vacaciones",
      labelEn: "Vacations",
    },
    {
      mode: "salary-net",
      icon: IconCoins,
      labelEs: "Salario neto",
      labelEn: "Net salary",
    },
    {
      mode: "bonus",
      icon: IconGift,
      labelEs: "Aguinaldo",
      labelEn: "Bonus",
    },
    {
      mode: "termination",
      icon: IconDoorExit,
      labelEs: "Salida",
      labelEn: "Exit",
    },
    {
      mode: "contract",
      icon: IconFileDescription,
      labelEs: "Contrato",
      labelEn: "Contract",
    },
    {
      mode: "preaviso",
      icon: IconBell,
      labelEs: "Preaviso",
      labelEn: "Notice",
    },
    {
      icon: IconMessageCircle,
      labelEs: "Nuevo chat",
      labelEn: "New chat",
      onClick: resetConversation,
    },
  ]

  return (
    <main
      className={cn(
        "relative z-10 mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-clip px-4 md:px-8",
        isChatMode ? "max-w-none" : "max-w-5xl"
      )}
    >
      <section className={cn("flex min-h-0 min-w-0 flex-1 flex-col pt-4 md:pt-6", !isChatMode && "overflow-y-auto")}>
        {isChatMode ? (
          messages.length === 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="empty-chat"
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="flex min-h-0 min-w-0 flex-1 items-center justify-center px-1 py-8 sm:px-2"
              >
                <div className="flex w-full max-w-5xl min-w-0 flex-col items-center gap-6 sm:gap-8">
                  <WelcomeEmptyState
                    cc={cc}
                    countryName={countryName}
                    copy={copy}
                  />
                  <ChatInputPanel
                    chatActions={chatActions}
                    locale={locale}
                    setMode={setMode}
                    input={input}
                    setInput={setInput}
                    onSend={onSend}
                    isLoading={isLoading}
                    onStop={onStop}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <ChatContainerRoot
              className={cn(
                "relative min-h-0 min-w-0 flex-1 [scrollbar-gutter:stable] px-1 sm:px-2",
                    messages.length <= 3
                      ? "pt-0 pb-46 md:pt-24 md:pb-44"
                      : "pt-8 pb-36 md:pb-44"
              )}
            >
              <ChatContainerContent className="mx-auto w-full max-w-5xl min-w-0 gap-2.5 sm:gap-3">
                {(() => {
                  const lastAssistantMessageId = [...messages]
                    .reverse()
                    .find((m) => m.role === "assistant")?.id
                  return messages.map((m) => (
                    <Message
                      key={m.id}
                      className={cn(
                        "min-w-0 duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1",
                        m.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {m.role === "assistant" &&
                      m.id === lastAssistantMessageId ? (
                        <JustoOrbAvatar cc={cc} />
                      ) : null}
                      <MessageContent
                        className={cn(
                          "min-w-0 rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:px-4",
                          m.role === "user"
                            ? "max-w-[88%] bg-primary text-primary-foreground sm:max-w-[85%] prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-li:text-primary-foreground"
                            : "max-w-[85%] text-foreground"
                        )}
                      >
                        {m.role === "assistant" && m.reasoning ? (
                          <Reasoning>
                            <ReasoningTrigger className="mb-2 text-xs font-medium">
                              {locale === "en"
                                ? "Show reasoning"
                                : "Ver razonamiento"}
                            </ReasoningTrigger>
                            <ReasoningContent
                              markdown
                              contentClassName="text-xs leading-relaxed"
                            >
                              {m.reasoning}
                            </ReasoningContent>
                          </Reasoning>
                        ) : null}
                        <RichChatMarkdown
                          id={m.id}
                          text={m.text}
                          role={m.role}
                        />
                        {m.role === "assistant" ? (
                          <AssistantSource
                            href={docsLink}
                            countryName={countryName}
                            cc={cc}
                            locale={locale}
                            topics={m.topics}
                          />
                        ) : null}
                      </MessageContent>
                    </Message>
                  ))
                })()}
                {isTyping ? (
          <ChatTypingIndicator
            typingMode={typingMode}
            typingMessages={copy.typingMessages}
          />
                ) : null}
                <ChatContainerScrollAnchor />
              </ChatContainerContent>
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
                <ScrollButton className="pointer-events-auto shadow-lg" />
              </div>
            </ChatContainerRoot>
          )
        ) : mode === "settlement" ? (
          <SettlementTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        ) : mode === "salary-net" ? (
          <SalaryNetTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        ) : mode === "bonus" ? (
          <BonusTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        ) : mode === "termination" ? (
          <TerminationTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        ) : mode === "contract" ? (
          <ContractTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        ) : mode === "preaviso" ? (
          <PreavisoTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        ) : (
          <VacationsTool
            countryCode={cc}
            countryName={countryName}
            locale={locale}
            currencyLabel={currencyLabel}
            fmt={fmt}
            onComplete={onToolComplete}
            onCancel={onToolCancel}
          />
        )}
      </section>
      <AnimatePresence>
        {isChatMode && messages.length > 0 ? (
          <motion.div
            key="bottom-chat-input"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-40 min-w-0 bg-gradient-to-t from-background via-background/95 to-transparent px-3 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8"
          >
            <ChatInputPanel
              chatActions={chatActions}
              locale={locale}
              setMode={setMode}
              input={input}
              setInput={setInput}
              onSend={onSend}
              isLoading={isLoading}
              onStop={onStop}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}

function JustoOrbAvatar({ cc }: { cc: string }) {
  return (
    <div className="mr-1.5 shrink-0 overflow-hidden rounded-full sm:mr-2">
      <AgentAvatar seed={cc} size={28} className="rounded-full" />
    </div>
  )
}

const typingConfig: Record<
  "searching" | "thinking" | "generating",
  { pattern: PresetPattern; color: string; mode: "pulse" | "stagger" }
> = {
  searching: { pattern: "ripple-out", color: "blue", mode: "pulse" },
  thinking: { pattern: "waterfall", color: "amber", mode: "stagger" },
  generating: { pattern: "heartbeat", color: "green", mode: "pulse" },
}

function ChatTypingIndicator({
  typingMode,
  typingMessages,
}: {
  typingMode: "idle" | "searching" | "thinking" | "generating"
  typingMessages: string[]
}) {
  const [labelIndex] = useState(() =>
    typingMessages.length > 0
      ? Math.floor(Math.random() * typingMessages.length)
      : 0
  )
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = labelRef.current
    if (!el) return
    el.classList.add("t-typing-enter")
    void el.offsetWidth
    el.classList.remove("t-typing-enter")
  }, [])

  const config =
    typingMode === "idle" ? typingConfig.searching : typingConfig[typingMode]
  return (
    <div className="flex max-w-[92%] justify-start px-2 sm:px-4">
      <div className="flex items-center gap-1.5 rounded-full bg-black px-2.5 py-1 ring-2 ring-primary/50">
        <GridLoader
          blur={0}
          color={config.color}
          gap={0.5}
          mode={config.mode}
          pattern={config.pattern}
          rounded={false}
          size={10}
        />
        <span className="t-typing-label font-medium text-[11px] text-white" ref={labelRef}>
          {typingMessages[labelIndex] ?? typingMessages[0] ?? ""}
        </span>
      </div>
    </div>
  )
}

const chatMarkdownComponents: Partial<Components> = {
  a: ({ children, href }) => {
    const resolvedHref = safeHref(href)
    const isExternal = /^https?:\/\//i.test(resolvedHref)

    return (
      <a
        href={resolvedHref}
        className="font-medium underline decoration-current/40 underline-offset-2 transition-opacity hover:opacity-80"
        {...(isExternal
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {children}
      </a>
    )
  },
  blockquote: ({ children }) => (
    <blockquote className="my-2 rounded-xl border border-current/15 bg-current/5 px-3 py-2 text-xs leading-relaxed text-current">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-2 max-w-full overflow-x-auto rounded-xl border border-current/15 bg-current/5">
      <table className="min-w-max border-collapse text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-current/10">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-current/15 px-3 py-2 text-left font-semibold text-current last:text-right">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-current/15 px-3 py-2 align-top text-current last:text-right">
      {children}
    </td>
  ),
}

function RichChatMarkdown({
  id,
  text,
  role,
}: {
  id: string
  text: string
  role: Role
}) {
  return (
    <Markdown
      id={id}
      components={chatMarkdownComponents}
      className={cn(
        "prose prose-sm max-w-none min-w-0 break-words dark:prose-invert",
        "prose-headings:my-2 prose-headings:font-semibold prose-p:my-1.5 prose-strong:text-current prose-ol:my-1.5 prose-ul:my-1.5 prose-li:my-0.5",
        "prose-code:rounded-md prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.82em] prose-code:before:content-none prose-code:after:content-none",
        role === "user" &&
          "prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-code:bg-primary-foreground/15 prose-code:text-primary-foreground prose-li:text-primary-foreground"
      )}
    >
      {text}
    </Markdown>
  )
}

function AssistantSource({
  href,
  countryName,
  cc,
  locale,
  topics,
}: {
  href: string
  countryName: string
  cc: string
  locale: Locale
  topics?: string[]
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border/40 pt-2 text-[11px] text-muted-foreground/70">
      {topics && topics.length > 0 ? (
        <>
          {topics.map((topic, i) => {
            const link = getTopicDocsLink(cc, topic)
            return (
              <span key={topic}>
                {i > 0 && <span className="mr-2 text-muted-foreground/40">·</span>}
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </a>
                ) : (
                  <span className="font-medium text-muted-foreground/60">{topic}</span>
                )}
              </span>
            )
          })}
        </>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
        >
          {locale === "en" ? "Legal corpus" : "Corpus legal"}
        </a>
      )}
      <span className="inline-flex items-center gap-1 text-muted-foreground/50">
        <span className="mx-0.5 text-muted-foreground/30">·</span>
        <span>{countryName}</span>
        <Image
          src={`https://flagcdn.com/w40/${cc}.png`}
          alt={countryName}
          width={14}
          height={10}
          className="h-2.5 w-3.5 shrink-0 rounded-[1px] border border-border/60 object-cover ml-0.5"
        />
      </span>
    </div>
  )
}

function ChatSuggestions({
  actions,
  locale,
  setMode,
}: {
  actions: ChatAction[]
  locale: Locale
  setMode: (mode: AppMode) => void
}) {
  return (
    <div className="flex max-w-full min-w-0 snap-x snap-mandatory [scrollbar-width:none] gap-1.5 overflow-x-auto px-0.5 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
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
            className="h-8 shrink-0 snap-start gap-1.5 rounded-full border border-border/70 bg-background/80 px-2.5 text-xs font-medium text-muted-foreground shadow-none backdrop-blur transition-colors hover:border-foreground/20 hover:bg-muted hover:text-foreground sm:px-3"
          >
            <Icon className="size-3.5" />
            <span>{label}</span>
          </PromptSuggestion>
        )
      })}
    </div>
  )
}

function ChatInputPanel({
  chatActions,
  locale,
  setMode,
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
}: {
  chatActions: ChatAction[]
  locale: Locale
  setMode: (mode: AppMode) => void
  input: string
  setInput: (value: string) => void
  onSend: () => Promise<void>
  isLoading: boolean
  onStop: () => void
}) {
  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-2">
      <ChatSuggestions
        actions={chatActions}
        locale={locale}
        setMode={setMode}
      />
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
        <PromptInputActions className="justify-end pt-1">
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

function WelcomeEmptyState({
  cc,
  countryName,
  copy,
}: {
  cc: string
  countryName: string
  copy: (typeof homeCopy)[Locale]
}) {
  return (
    <div className="flex flex-col items-center gap-y-6 py-4 text-center duration-300 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 sm:gap-y-8 sm:py-6">
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
