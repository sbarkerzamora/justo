"use client"

import {
  IconCalculator,
  IconBeach,
  IconCoins,
  IconMessageCircle,
  IconSparkles,
  IconTools,
} from "@tabler/icons-react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  type KeyboardEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { ChatMarkdown } from "@/components/chat/chat-markdown"
import ShinyText from "@/components/ShinyText"
import AgentAvatar from "@/components/smoothui/agent-avatar"
import { getCountryInfo } from "@/lib/countries"
import { homeCopy } from "@/lib/home-copy"
import type { Locale } from "@/lib/i18n"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import { useChatMessages } from "@/components/chat/use-chat-messages"
import { useChatUI } from "@/components/chat/use-chat-ui"
import { PureMultimodalInput } from "@/components/ui/multimodal-ai-chat-input"
import { cn } from "@/lib/utils"
import { SettlementTool } from "@/components/tools/settlement"
import { SalaryNetTool } from "@/components/tools/salary-net"
import { VacationsTool } from "@/components/tools/vacations"

type Role = "user" | "assistant"
type ChatMessage = { id: string; role: Role; text: string }

type AppMode = "chat" | "settlement" | "vacations" | "salary-net"

const validToolParams = new Set(["settlement", "vacations", "salary-net"])
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
    resetMessages,
  } = useChatMessages()

  const {
    isLoading,
    isTyping,
    typingLabel,
    setLoading,
    setTyping,
    setTypingLabel,
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

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (messages.length === 0) return
    messagesContainerRef.current?.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [messages])

  const resetConversation = () => {
    resetMessages()
    setMode("chat")
    setTyping(false)
  }

  const sendLegalQuery = async (text: string) => {
    setLoading(true)
    setTypingLabel(copy.assistantThinking)
    setTyping(true)
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
        { id: assistantMessageId, role: "assistant", text: "" },
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
        showAssistantMessage(fallbackMessage)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamedText = ""
      let visibleText = ""
      let receivedChunk = false

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

        const chunk = decoder.decode(value, { stream: true })
        if (!chunk) continue

        streamedText += chunk
        if (!receivedChunk && streamedText.trim().length > 0) {
          receivedChunk = true
          setHasStreamChunk(true)
          setTyping(false)
        }
        await revealText(streamedText)
      }

      const finalChunk = decoder.decode()
      if (finalChunk) {
        streamedText += finalChunk
        if (!receivedChunk && streamedText.trim().length > 0) {
          receivedChunk = true
          setHasStreamChunk(true)
          setTyping(false)
        }
        await revealText(streamedText)
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
      setStreamingReply(false)
      setHasStreamChunk(false)
      setLoading(false)
    }
  }

  const onStop = useCallback(() => {
    setLoading(false)
    setTyping(false)
    setStreamingReply(false)
    setHasStreamChunk(false)
  }, [setLoading, setTyping, setStreamingReply, setHasStreamChunk])

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void onSend()
    }
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
      typingLabel={typingLabel}
      messagesEndRef={messagesEndRef}
      messagesContainerRef={messagesContainerRef}
      input={input}
      setInput={setInput}
      handleKeyDown={handleKeyDown}
      onSend={onSend}
      sendText={sendText}
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
  onToolComplete: (messages: { role: "user" | "assistant"; text: string }[]) => void
  onToolCancel: () => void
  isTyping: boolean
  typingLabel: string
  messagesEndRef: RefObject<HTMLDivElement | null>
  messagesContainerRef: RefObject<HTMLDivElement | null>
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: KeyboardEvent) => void
  onSend: () => Promise<void>
  sendText: (text: string) => Promise<void>
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
    typingLabel,
    messagesEndRef,
    messagesContainerRef,
    input,
    setInput,
    handleKeyDown,
    sendText,
    isLoading,
    onStop,
  } = props

  const isChatMode = mode === "chat"

  return (
    <main className={cn(
      "mx-auto flex min-h-0 flex-1 flex-col overflow-clip px-4 md:px-8",
      isChatMode ? "max-w-4xl" : "max-w-5xl"
    )}>
      <section className="flex min-h-0 flex-1 flex-col pt-4 md:pt-6">
        {isChatMode ? (
          messages.length === 0 ? (
            <div className="flex min-h-0 flex-1 items-center justify-center px-2 py-8 max-sm:px-1">
              <WelcomeEmptyState
                cc={cc}
                countryName={countryName}
                copy={copy}
                locale={locale}
                setMode={setMode}
                resetConversation={resetConversation}
              />
            </div>
          ) : (
            <div
              ref={messagesContainerRef}
              className={cn(
                "min-h-0 flex-1 space-y-2.5 overflow-y-auto px-2 max-sm:px-1 sm:space-y-3 [scrollbar-gutter:stable]",
                messages.length <= 3 ? "py-16 md:py-24" : "py-8"
              )}
            >
              {(() => {
                const lastAssistantMessageId = [...messages]
                  .reverse()
                  .find((m) => m.role === "assistant")?.id
                return messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      (m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start") +
                      " min-w-0 duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1"
                    }
                  >
                    {m.role === "assistant" &&
                    m.id === lastAssistantMessageId ? (
                      <JustoOrbAvatar cc={cc} />
                    ) : null}
                    <div
                      className={
                        m.role === "user"
                          ? "min-w-0 max-w-[88%] rounded-2xl bg-primary px-3 py-2.5 text-sm whitespace-pre-line text-primary-foreground sm:max-w-[85%] sm:px-4"
                          : "min-w-0 max-w-[92%] rounded-2xl border border-border bg-card px-3 py-2.5 text-sm leading-relaxed text-foreground sm:max-w-[88%] sm:px-4"
                      }
                    >
                      <ChatMarkdown text={m.text} />
                    </div>
                  </div>
                ))
              })()}
              {messages.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-2 pt-1 motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
                  <button
                    type="button"
                    onClick={() => setMode("settlement")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    <IconCalculator className="size-3.5" />
                    {locale === "en" ? "Calculate settlement" : "Calcular liquidacion"}
                  </button>
         <button
          type="button"
          onClick={() => setMode("vacations")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconBeach className="size-3.5" />
          {locale === "en" ? "Calculate vacations" : "Calcular vacaciones"}
        </button>
        <button
          type="button"
          onClick={() => setMode("salary-net")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconCoins className="size-3.5" />
          {locale === "en" ? "Net salary" : "Salario neto"}
        </button>
                  <button
                    type="button"
                    onClick={() => { window.location.href = "/tools" }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    <IconTools className="size-3.5" />
                    {locale === "en" ? "Tools" : "Herramientas"}
                  </button>
                  <button
                    type="button"
                    onClick={resetConversation}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
                  >
                    <IconMessageCircle className="size-3.5" />
                    {locale === "en" ? "New chat" : "Nuevo chat"}
                  </button>
                </div>
              ) : null}
              {isTyping ? (
                <TypingPanel
                  typingLabel={typingLabel}
                  cc={cc}
                />
              ) : null}
              <div ref={messagesEndRef} />
            </div>
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
      {isChatMode && (
        <PureMultimodalInput
          messages={messages.map((m) => ({ id: m.id, content: m.text, role: m.role }))}
          onSendMessage={(text: string) => {
            setInput("")
            void sendText(text)
          }}
          isGenerating={isLoading}
          input={input}
          setInput={setInput}
          onKeyDown={handleKeyDown}
          onStop={onStop}
          className="pb-4"
        />
      )}
    </main>
  )
}

function JustoOrbAvatar({
  cc,
}: {
  cc: string
}) {
  return (
    <div className="mr-1.5 shrink-0 overflow-hidden rounded-full sm:mr-2">
      <AgentAvatar seed={cc} size={32} className="rounded-full" />
    </div>
  )
}

function TypingPanel({
  typingLabel,
  cc,
}: {
  typingLabel: string
  cc: string
}) {
  return (
    <div className="flex justify-start max-w-[92%] motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <JustoOrbAvatar cc={cc} />
      <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-foreground">
        <IconSparkles className="size-4 shrink-0 text-primary" />
        <ShinyText
          text={typingLabel}
          speed={2}
          delay={0}
          color="var(--muted-foreground)"
          shineColor="var(--foreground)"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-xs font-medium"
        />
      </div>
    </div>
  )
}

function WelcomeEmptyState({
  cc,
  countryName,
  copy,
  locale,
  setMode,
  resetConversation,
}: {
  cc: string
  countryName: string
  copy: (typeof homeCopy)[Locale]
  locale: Locale
  setMode: (mode: AppMode) => void
  resetConversation: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-y-6 sm:gap-y-8 text-center py-4 sm:py-6 duration-300 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
      <div className="flex flex-col items-center gap-y-3 sm:gap-y-4">
        <div className="overflow-hidden rounded-full shadow-lg motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
          <AgentAvatar seed={cc} size={96} className="rounded-full" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 sm:px-3.5 sm:py-1.5 text-xs font-medium text-muted-foreground motion-safe:animate-in motion-safe:duration-200 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
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

      <div className="space-y-3 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
          Hola, soy <strong className="text-foreground">Justo</strong>
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          Tu asistente experto en derecho laboral de{" "}
          <strong className="text-foreground">{countryName}</strong>. Te ayudo con
          liquidaciones, vacaciones, aguinaldo y mas.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in motion-safe:slide-in-from-bottom-1">
        <button
          type="button"
          onClick={() => setMode("settlement")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconCalculator className="size-3.5" />
          {locale === "en" ? "Calculate settlement" : "Calcular liquidacion"}
        </button>
        <button
          type="button"
          onClick={() => setMode("vacations")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconBeach className="size-3.5" />
          {locale === "en" ? "Calculate vacations" : "Calcular vacaciones"}
        </button>
        <button
          type="button"
          onClick={() => setMode("salary-net")}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconCoins className="size-3.5" />
          {locale === "en" ? "Net salary" : "Salario neto"}
        </button>
        <button
          type="button"
          onClick={() => { window.location.href = "/tools" }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconTools className="size-3.5" />
          {locale === "en" ? "Tools" : "Herramientas"}
        </button>
        <button
          type="button"
          onClick={resetConversation}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
          <IconMessageCircle className="size-3.5" />
          {locale === "en" ? "New chat" : "Nuevo chat"}
        </button>
      </div>
    </div>
  )
}
