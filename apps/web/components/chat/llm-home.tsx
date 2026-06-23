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

import { useSearchParams } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { getCountryInfo } from "@/lib/countries"
import { homeCopy } from "@/lib/home-copy"
import type { Locale } from "@/lib/i18n"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import { useChatMessages } from "@/components/chat/use-chat-messages"
import { useChatUI } from "@/components/chat/use-chat-ui"
import { LlmHomeView } from "@/components/chat/llm-home-view"
import type { AppMode } from "@/components/chat/types"

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

export function LlmHome({
  countryCode,
  locale,
  initialTool,
}: {
  countryCode?: string
  locale: Locale
  initialTool?: AppMode
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
