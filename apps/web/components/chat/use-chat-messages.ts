"use client"

import { useRef, useState } from "react"

type Role = "user" | "assistant"

type ChatMessage = { id: string; role: Role; text: string }

const uid = () => crypto.randomUUID()

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const queue = useRef<Promise<void>>(Promise.resolve())

  const append = (role: Role, text: string) =>
    setMessages((p) => [...p, { id: uid(), role, text }])

  const setMessageText = (id: string, text: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, text } : message
      )
    )
  }

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const appendAssistant = (
    text: string,
    opts?: { delay?: number; phase?: string },
    onTyping?: (label: string) => void,
    onTypingEnd?: () => void
  ) => {
    queue.current = queue.current.then(async () => {
      onTyping?.(opts?.phase ?? "Escribiendo")
      await wait(opts?.delay ?? 500)
      onTypingEnd?.()
      append("assistant", text)
    })
    return queue.current
  }

  const resetMessages = () => {
    setMessages([])
    setInput("")
  }

  return {
    messages,
    setMessages,
    input,
    setInput,
    append,
    setMessageText,
    appendAssistant,
    resetMessages,
  }
}
