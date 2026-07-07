"use client"

import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"
import { getLegalDocsLink } from "@/lib/legal-docs-link"
import { homeCopy } from "@/lib/home-copy"

import type { AppMode, ChatMessage } from "@/components/chat/types"
import { ChatInputPanel } from "@/components/chat/chat-input-panel"
import { WelcomeEmptyState } from "@/components/chat/welcome-empty-state"
import { ChatSurface } from "@/components/chat/chat-surface"

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
  isStreamingReply: boolean
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
    isStreamingReply,
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
    <section
      className={cn(
        "relative z-10 mx-auto flex h-full min-h-0 w-full min-w-0 flex-1 flex-col px-4 md:px-8",
        isChatMode ? "overflow-hidden" : "overflow-y-auto",
        isChatMode && messages.length > 0 ? "max-w-none" : "max-w-5xl",
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
              className="mx-auto flex min-h-0 max-w-5xl min-w-0 flex-1 flex-col items-center overflow-hidden px-1 sm:px-2"
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
          <ChatSurface
            cc={cc}
            countryName={countryName}
            locale={locale}
            copy={copy}
            docsLink={docsLink}
            messages={messages}
            isTyping={isTyping}
            typingMode={typingMode}
            isStreamingReply={isStreamingReply}
            chatActions={chatActions}
            setMode={setMode}
            resetConversation={resetConversation}
            input={input}
            setInput={setInput}
            onSend={onSend}
            isLoading={isLoading}
            onStop={onStop}
          />
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
  )
}
