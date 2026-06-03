"use client"

import {
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
} from "react"
import {
  IconArrowUp,
  IconSquare,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface UIMessage {
  id: string
  content: string
  role: string
}

/*
interface SuggestedActionsProps {
  onSelectAction: (action: string) => void
}

function PureSuggestedActions({ onSelectAction: onAction }: SuggestedActionsProps) {
  const items: { title: string; label: string; action: string; icon: React.ReactNode }[] = [
    {
      title: "Calcular liquidacion",
      label: "paso a paso con datos exactos",
      action: "Quiero calcular mi liquidacion paso a paso",
      icon: <IconCalculator className="size-4" />,
    },
    {
      title: "Calcular vacaciones",
      label: "dias acumulados y monto estimado",
      action: "Quiero calcular mis vacaciones pendientes",
      icon: <IconBeach className="size-4" />,
    },
    {
      title: "Ver herramientas",
      label: "explora todas las calculadoras OSS",
      action: "Que herramientas tiene Justo?",
      icon: <IconTools className="size-4" />,
    },
    {
      title: "Consultar marco legal",
      label: "revisa el corpus laboral del pais",
      action: "Cual es el marco legal laboral de Nicaragua?",
      icon: <IconBook className="size-4" />,
    },
  ]

  return (
    <div className="grid w-full gap-2 pb-2 sm:grid-cols-2">
      <AnimatePresence>
        {items.map((item, i) => (
          <motion.button
            key={item.action}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05 * i }}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-accent",
              i > 1 && "hidden sm:flex"
            )}
            onClick={() => onAction(item.action)}
            type="button"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">
              {item.icon}
            </span>
            <div className="min-w-0">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}

const SuggestedActions = memo(PureSuggestedActions)
*/

function PureMultimodalInput({
  onSendMessage,
  isGenerating,
  className,
  input,
  setInput,
  onKeyDown,
  onStop,
}: {
  messages: UIMessage[]
  onSendMessage: (text: string) => void
  isGenerating: boolean
  className?: string
  input: string
  setInput: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onStop?: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = useCallback(() => {
    const ta = textareaRef.current
    if (ta) {
      ta.style.height = "auto"
      ta.style.height = `${ta.scrollHeight + 2}px`
    }
  }, [])

  useEffect(() => {
    if (textareaRef.current) adjustHeight()
  }, [input, adjustHeight])

  const submitForm = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed) return
    onSendMessage(trimmed)
    requestAnimationFrame(() => adjustHeight())
  }, [input, onSendMessage, adjustHeight])

  // const showActions = messages.length === 0

  return (
    <div className={cn("relative w-full flex flex-col gap-3", className)}>
      {/* {showActions && (
        <motion.div
          key="actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          <SuggestedActions
            onSelectAction={(action) => {
              setInput(action)
              textareaRef.current?.focus()
              adjustHeight()
            }}
          />
        </motion.div>
      )} */}

      <div className="relative">
        <textarea
          ref={textareaRef}
          placeholder="Escribe tu consulta laboral..."
          value={input}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="min-h-[80px] w-full resize-none rounded-2xl border border-border bg-card px-4 py-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-foreground/30"
          rows={1}
          disabled={isGenerating}
        />

        <div className="absolute bottom-1.5 right-1.5">
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              className="flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition-opacity hover:opacity-90"
              title="Detener"
            >
              <IconSquare className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submitForm}
              disabled={!input.trim()}
              className={cn(
                "flex size-8 items-center justify-center rounded-full transition-all",
                input.trim()
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <IconArrowUp className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { PureMultimodalInput }
