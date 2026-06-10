"use client"

import { useRef, useState } from "react"

type Role = "user" | "assistant"

type ChatMessage = { id: string; role: Role; text: string; reasoning?: string; topics?: string[] }

const uid = () => crypto.randomUUID()

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const queue = useRef<Promise<void>>(Promise.resolve())

  const append = (role: Role, text: string, reasoning?: string) =>
    setMessages((p) => [...p, { id: uid(), role, text, reasoning }])

  const setMessageText = (id: string, text: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, text } : message
      )
    )
  }

  const setMessageReasoning = (id: string, reasoning: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, reasoning } : message
      )
    )
  }

  const setMessageTopics = (id: string, topics: string[]) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, topics } : message
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
    setMessageReasoning,
    setMessageTopics,
    appendAssistant,
    resetMessages,
  }
}
