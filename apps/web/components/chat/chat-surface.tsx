"use client"

import { useEffect, useRef, useState } from "react"
import { IconArrowDown } from "@tabler/icons-react"
import type { Locale } from "@/lib/i18n"
import { homeCopy } from "@/lib/home-copy"
import type { AppMode, ChatAction, ChatMessage } from "@/components/chat/types"
import { cn } from "@/lib/utils"
import { JustoOrbAvatar } from "@/components/chat/justo-orb-avatar"
import { ChatTypingIndicator } from "@/components/chat/chat-typing-indicator"
import { ChatInputPanel } from "@/components/chat/chat-input-panel"
import { RichChatMarkdown } from "@/components/chat/rich-chat-markdown"
import { AssistantSource } from "@/components/chat/assistant-source"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning"

const isNearBottom = (element: HTMLElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight < 64

export function ChatSurface({
  cc,
  countryName,
  locale,
  copy,
  docsLink,
  messages,
  isTyping,
  typingMode,
  isStreamingReply,
  chatActions,
  setMode,
  resetConversation,
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
}: {
  cc: string
  countryName: string
  locale: Locale
  copy: (typeof homeCopy)[Locale]
  docsLink: string
  messages: ChatMessage[]
  isTyping: boolean
  typingMode: "idle" | "searching" | "thinking" | "generating"
  isStreamingReply: boolean
  chatActions: ChatAction[]
  setMode: (mode: AppMode) => void
  resetConversation: () => void
  input: string
  setInput: (value: string) => void
  onSend: () => Promise<void>
  isLoading: boolean
  onStop: () => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLDivElement>(null)
  const shouldStickRef = useRef(true)
  const [composerHeight, setComposerHeight] = useState(160)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const lastMessageText = messages.at(-1)?.text

  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return

    const observer = new ResizeObserver(([entry]) => {
      const borderBox = entry.borderBoxSize?.[0]
      const nextHeight =
        borderBox?.blockSize ?? composer.offsetHeight ?? entry.contentRect.height
      setComposerHeight(Math.ceil(nextHeight))
    })
    observer.observe(composer)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement || !shouldStickRef.current) return

    requestAnimationFrame(() => {
      scrollElement.scrollTop = scrollElement.scrollHeight
    })
  }, [messages.length, lastMessageText, isTyping, composerHeight])

  const updateScrollState = () => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return
    const nextIsAtBottom = isNearBottom(scrollElement)
    shouldStickRef.current = nextIsAtBottom
    setIsAtBottom(nextIsAtBottom)
  }

  const scrollToBottom = () => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return
    shouldStickRef.current = true
    setIsAtBottom(true)
    scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" })
  }

  const handleSend = async () => {
    shouldStickRef.current = true
    setIsAtBottom(true)
    await onSend()
  }

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="absolute inset-0 overflow-y-auto overscroll-contain px-1 pt-8 sm:px-2 md:pt-24"
        style={{ paddingBottom: composerHeight + 32 }}
        role="log"
      >
        <ChatMessageList
          cc={cc}
          countryName={countryName}
          locale={locale}
          docsLink={docsLink}
          messages={messages}
          isTyping={isTyping}
          typingMode={typingMode}
          isStreamingReply={isStreamingReply}
          copy={copy}
        />
      </div>
      <button
        type="button"
        onClick={scrollToBottom}
        className={cn(
          "absolute inset-x-0 bottom-[calc(var(--composer-height,160px)+0.75rem)] z-30 mx-auto flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-lg transition-all duration-150 ease-out hover:text-foreground",
          isAtBottom
            ? "pointer-events-none translate-y-4 scale-95 opacity-0"
            : "translate-y-0 scale-100 opacity-100"
        )}
        style={{ ["--composer-height" as string]: `${composerHeight}px` }}
        aria-label={locale === "en" ? "Scroll to bottom" : "Ir al final"}
        aria-hidden={isAtBottom}
        tabIndex={isAtBottom ? -1 : 0}
      >
        <IconArrowDown className="size-5" />
      </button>
      <div
        ref={composerRef}
        className="absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background/95 to-transparent px-1 pt-10 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-2"
      >
        <ChatInputPanel
          chatActions={chatActions}
          locale={locale}
          setMode={setMode}
          input={input}
          setInput={setInput}
          onSend={handleSend}
          isLoading={isLoading}
          onStop={onStop}
          variant="compact"
          onNewChat={resetConversation}
        />
      </div>
    </div>
  )
}

function ChatMessageList({
  cc,
  countryName,
  locale,
  docsLink,
  messages,
  isTyping,
  typingMode,
  isStreamingReply,
  copy,
}: {
  cc: string
  countryName: string
  locale: Locale
  docsLink: string
  messages: ChatMessage[]
  isTyping: boolean
  typingMode: "idle" | "searching" | "thinking" | "generating"
  isStreamingReply: boolean
  copy: (typeof homeCopy)[Locale]
}) {
  const lastAssistantId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.id

  return (
    <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-2.5 sm:gap-3">
      {messages.map((message) => {
        const isLastAssistant =
          message.role === "assistant" && message.id === lastAssistantId

        return (
          <Message
            key={message.id}
            className={cn(
              "min-w-0 duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {isLastAssistant ? <JustoOrbAvatar cc={cc} /> : null}
            <MessageContent
              className={cn(
                "min-w-0 rounded-2xl px-3 py-2.5 text-sm leading-relaxed sm:px-4",
                message.role === "user"
                  ? "max-w-[88%] bg-primary text-primary-foreground sm:max-w-[85%] prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-li:text-primary-foreground"
                  : "max-w-[85%] text-foreground"
              )}
            >
              {message.role === "assistant" && message.reasoning ? (
                <Reasoning isStreaming={isStreamingReply && isLastAssistant}>
                  <ReasoningTrigger className="mb-2 text-xs font-medium">
                    {locale === "en" ? "Show reasoning" : "Ver razonamiento"}
                  </ReasoningTrigger>
                  <ReasoningContent
                    markdown
                    contentClassName="text-xs leading-relaxed"
                  >
                    {message.reasoning}
                  </ReasoningContent>
                </Reasoning>
              ) : null}
              <RichChatMarkdown
                id={message.id}
                text={message.text}
                role={message.role}
              />
              {message.role === "assistant" ? (
                <AssistantSource
                  href={docsLink}
                  countryName={countryName}
                  cc={cc}
                  locale={locale}
                  topics={message.topics}
                />
              ) : null}
            </MessageContent>
          </Message>
        )
      })}
      {isTyping ? (
        <ChatTypingIndicator
          typingMode={typingMode}
          typingMessages={copy.typingMessages}
        />
      ) : null}
    </div>
  )
}
