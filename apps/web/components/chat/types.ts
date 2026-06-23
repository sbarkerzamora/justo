import type { ComponentType } from "react"

export type Role = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: Role
  text: string
  reasoning?: string
  topics?: string[]
}

export type AppMode =
  | "chat"
  | "settlement"
  | "vacations"
  | "salary-net"
  | "bonus"
  | "termination"
  | "contract"
  | "preaviso"

export type ChatAction = {
  mode?: AppMode
  icon: ComponentType<{ className?: string }>
  labelEs: string
  labelEn: string
  onClick?: () => void
}
