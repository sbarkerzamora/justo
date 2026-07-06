"use client"

import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import { homeCopy } from "@/lib/home-copy"

import type { AppMode, ChatMessage } from "@/components/chat/types"
import { JustoOrbAvatar } from "@/components/chat/justo-orb-avatar"
import { ChatTypingIndicator } from "@/components/chat/chat-typing-indicator"
import { ChatInputPanel } from "@/components/chat/chat-input-panel"
import { WelcomeEmptyState } from "@/components/chat/welcome-empty-state"
import { RichChatMarkdown } from "@/components/chat/rich-chat-markdown"
import { AssistantSource } from "@/components/chat/assistant-source"

import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning"
import { ScrollButton } from "@/components/ui/scroll-button"

import {
  IconCalculator,
  IconBeach,
  IconCoins,
  IconGift,
  IconDoorExit,
  IconFileDescription,
  IconBell,
  IconMessageCircle,
} from "@tabler/icons-react"

function ToolLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-16 text-sm text-muted-foreground">
      Cargando herramienta...
    </div>
  )
}

const SettlementTool = dynamic(
  () =>
    import("@/components/tools/settlement").then((mod) => mod.SettlementTool),
  { loading: ToolLoading }
)
const SalaryNetTool = dynamic(
  () => import("@/components/tools/salary-net").then((mod) => mod.SalaryNetTool),
  { loading: ToolLoading }
)
const VacationsTool = dynamic(
  () => import("@/components/tools/vacations").then((mod) => mod.VacationsTool),
  { loading: ToolLoading }
)
const BonusTool = dynamic(
  () => import("@/components/tools/bonus").then((mod) => mod.BonusTool),
  { loading: ToolLoading }
)
const TerminationTool = dynamic(
  () =>
    import("@/components/tools/termination").then(
      (mod) => mod.TerminationTool
    ),
  { loading: ToolLoading }
)
const ContractTool = dynamic(
  () => import("@/components/tools/contract").then((mod) => mod.ContractTool),
  { loading: ToolLoading }
)
const PreavisoTool = dynamic(
  () => import("@/components/tools/preaviso").then((mod) => mod.PreavisoTool),
  { loading: ToolLoading }
)

export function LlmHomeView(props: {
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

  const chatActions = [
    {
      mode: "settlement" as const,
      icon: IconCalculator,
      labelEs: "Liquidacion",
      labelEn: "Settlement",
    },
    {
      mode: "vacations" as const,
      icon: IconBeach,
      labelEs: "Vacaciones",
      labelEn: "Vacations",
    },
    {
      mode: "salary-net" as const,
      icon: IconCoins,
      labelEs: "Salario neto",
      labelEn: "Net salary",
    },
    {
      mode: "bonus" as const,
      icon: IconGift,
      labelEs: "Aguinaldo",
      labelEn: "Bonus",
    },
    {
      mode: "termination" as const,
      icon: IconDoorExit,
      labelEs: "Salida",
      labelEn: "Exit",
    },
    {
      mode: "contract" as const,
      icon: IconFileDescription,
      labelEs: "Contrato",
      labelEn: "Contract",
    },
    {
      mode: "preaviso" as const,
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
          "relative z-10 mx-auto flex min-h-0 w-full min-w-0 flex-1 flex-col px-4 md:px-8 h-full",
          isChatMode && messages.length > 0 ? "overflow-clip max-w-none" : "overflow-y-auto max-w-5xl",
          isChatMode && messages.length === 0 ? "pt-0" : "pt-4 md:pt-6"
        )}
      >
      {isChatMode ? (
        messages.length === 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="empty-chat"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-0 mx-auto max-w-5xl min-w-0 flex-1 flex-col items-center overflow-y-auto px-1 sm:px-2"
            >
              <div className="my-auto flex w-full max-w-5xl flex-col items-center gap-4 sm:gap-8">
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
              {messages.map((m) => {
                const isLastAssistant =
                  m.role === "assistant" &&
                  m.id ===
                    [...messages]
                      .reverse()
                      .find((msg) => msg.role === "assistant")?.id

                return (
                  <Message
                    key={m.id}
                    className={cn(
                      "min-w-0 duration-200 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {isLastAssistant ? <JustoOrbAvatar cc={cc} /> : null}
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
                )
              })}
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
              variant="compact"
              onNewChat={resetConversation}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  )
}
