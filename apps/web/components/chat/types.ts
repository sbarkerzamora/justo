import type { ComponentType } from "react"

export type Role = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: Role
  text: string
  reasoning?: string
  topics?: string[]
}

export const appModes = [
  "chat",
  "settlement",
  "vacations",
  "salary-net",
  "bonus",
  "termination",
  "contract",
  "preaviso",
] as const

export type AppMode = (typeof appModes)[number]

export function isAppMode(value: string | null | undefined): value is AppMode {
  return appModes.includes(value as AppMode)
}

export type ChatAction = {
  mode?: AppMode
  icon: ComponentType<{ className?: string }>
  labelEs: string
  labelEn: string
  onClick?: () => void
}
