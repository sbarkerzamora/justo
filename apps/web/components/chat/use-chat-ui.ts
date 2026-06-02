"use client"

import { useReducer } from "react"

type ChatUIState = {
  isLoading: boolean
  isTyping: boolean
  typingLabel: string
  isStreamingReply: boolean
  hasStreamChunk: boolean
}

type ChatUIAction =
  | { type: "setLoading"; value: boolean }
  | { type: "setTyping"; value: boolean }
  | { type: "setTypingLabel"; value: string }
  | { type: "setStreamingReply"; value: boolean }
  | { type: "setHasStreamChunk"; value: boolean }

const chatUIReducer = (state: ChatUIState, action: ChatUIAction): ChatUIState => {
  switch (action.type) {
    case "setLoading":
      return { ...state, isLoading: action.value }
    case "setTyping":
      return { ...state, isTyping: action.value }
    case "setTypingLabel":
      return { ...state, typingLabel: action.value }
    case "setStreamingReply":
      return { ...state, isStreamingReply: action.value }
    case "setHasStreamChunk":
      return { ...state, hasStreamChunk: action.value }
    default:
      return state
  }
}

const initialChatUIState: ChatUIState = {
  isLoading: false,
  isTyping: false,
  typingLabel: "Escribiendo",
  isStreamingReply: false,
  hasStreamChunk: false,
}

export function useChatUI() {
  const [state, dispatch] = useReducer(chatUIReducer, initialChatUIState)

  return {
    isLoading: state.isLoading,
    isTyping: state.isTyping,
    typingLabel: state.typingLabel,
    isStreamingReply: state.isStreamingReply,
    hasStreamChunk: state.hasStreamChunk,
    setLoading: (value: boolean) => dispatch({ type: "setLoading", value }),
    setTyping: (value: boolean) => dispatch({ type: "setTyping", value }),
    setTypingLabel: (value: string) => dispatch({ type: "setTypingLabel", value }),
    setStreamingReply: (value: boolean) => dispatch({ type: "setStreamingReply", value }),
    setHasStreamChunk: (value: boolean) => dispatch({ type: "setHasStreamChunk", value }),
  }
}
