import { Chat, toAiMessages } from "chat"
import { createTelegramAdapter } from "@chat-adapter/telegram"
import { UpstashRedisState } from "@/lib/chat-state"
import { generateLaborResponse, countryMeta } from "@/lib/ai/respond"
import {
  WELCOME,
  HELP,
  PLACEHOLDER,
  ERROR_MESSAGE,
  COUNTRY_CHANGED,
  STATUS,
  ESTIMATE_HELP,
  COUNTRY_NAMES,
} from "@/lib/bot-copy"

const countryFlag = (cc: string): string => {
  const entry = COUNTRY_NAMES[cc]
  return entry ? entry.slice(0, 4) : ""
}

const COUNTRY_LIST =
  Object.entries(COUNTRY_NAMES)
    .map(([code, label]) => `${code} — ${label}`)
    .join("\n") +
  "\n\nEnvía el código del país que quieres usar (ej: *gt* para Guatemala)."

const DEFAULT_COUNTRY = "ni"

interface BotThreadState {
  country?: string
}

let botInstance: Chat | null = null

async function getCountry(thread: {
  state: Promise<unknown>
}): Promise<string> {
  const state = (await thread.state) as BotThreadState | null
  return state?.country && countryMeta[state.country]
    ? state.country
    : DEFAULT_COUNTRY
}

async function handleLaborQuery(
  thread: {
    subscribe: () => Promise<void>
    startTyping: () => Promise<void>
    post: (message: unknown) => Promise<unknown>
    adapter: { fetchMessages: (id: string, opts?: { limit: number }) => Promise<{ messages: unknown[] }> }
    id: string
    state: Promise<unknown>
  },
  message: { text: string },
  isFirstMessage: boolean
) {
  await thread.startTyping()

  const cc = await getCountry(thread)

  let modelMessages
  if (!isFirstMessage) {
    const { messages } = await thread.adapter.fetchMessages(thread.id, {
      limit: 20,
    })
    modelMessages = await toAiMessages(messages as Parameters<typeof toAiMessages>[0])
  }

  const streamResult = await generateLaborResponse({
    countryCode: cc,
    userMessageText: message.text,
    modelMessages: modelMessages as Parameters<
      typeof generateLaborResponse
    >[0]["modelMessages"],
  })

  await thread.post(streamResult.stream.fullStream)
}

function getBot(): Chat {
  if (botInstance) return botInstance

  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is required to start the Telegram bot."
    )
  }

  botInstance = new Chat({
    userName:
      process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "JustoAsistenteBot",
    adapters: {
      telegram: createTelegramAdapter(),
    },
    state: new UpstashRedisState(),
    dedupeTtlMs: 600_000,
    streamingUpdateIntervalMs: 500,
    fallbackStreamingPlaceholderText: PLACEHOLDER,
    onLockConflict: "force",
    logger: "info",
  })

  // --- Message handlers ---

  botInstance.onDirectMessage(async (thread, message) => {
    try {
      await thread.subscribe()
      await handleLaborQuery(thread, message, true)
    } catch (error) {
      console.error("Direct message error:", error)
      await thread.post(ERROR_MESSAGE).catch(() => {})
    }
  })

  botInstance.onNewMention(async (thread, message) => {
    try {
      await thread.subscribe()
      await handleLaborQuery(thread, message, true)
    } catch (error) {
      console.error("Mention error:", error)
      await thread.post(ERROR_MESSAGE).catch(() => {})
    }
  })

  botInstance.onSubscribedMessage(async (thread, message) => {
    if (!message.isMention && !thread.isDM) return
    try {
      await handleLaborQuery(thread, message, false)
    } catch (error) {
      console.error("Subscribed message error:", error)
      await thread.post(ERROR_MESSAGE).catch(() => {})
    }
  })

  // --- Country code via text (e.g. user sends "gt") ---

  botInstance.onNewMessage(/^[a-z]{2}$/i, async (thread, message) => {
    if (thread.isDM) return
    const cc = message.text.toLowerCase()
    if (!countryMeta[cc]) return
    await thread.setState({ country: cc } as Record<string, unknown>)
    const name = countryMeta[cc]!.name
    const flag = countryFlag(cc)
    await thread.post({ markdown: COUNTRY_CHANGED(name, flag) })
  })

  // --- Slash commands ---

  botInstance.onSlashCommand("start", async (event) => {
    await event.channel.post({ markdown: WELCOME })
  })

  botInstance.onSlashCommand("help", async (event) => {
    await event.channel.post({ markdown: HELP })
  })

  botInstance.onSlashCommand("status", async (event) => {
    const meta = countryMeta[DEFAULT_COUNTRY]
    if (!meta) {
      await event.channel.post("Justo está operativo.")
      return
    }
    await event.channel.post({
      markdown: STATUS(meta.name, meta.law, "1.0"),
    })
  })

  botInstance.onSlashCommand("pais", async (event) => {
    await event.channel.post({ markdown: COUNTRY_LIST })
  })

  botInstance.onSlashCommand("estimar", async (event) => {
    const args = event.text.trim().split(/\s+/)
    const salary = Number(args[0])
    const years = Number(args[1])

    if (!salary || !years || salary <= 0 || years <= 0) {
      await event.channel.post({ markdown: ESTIMATE_HELP })
      return
    }

    try {
      const streamResult = await generateLaborResponse({
        countryCode: DEFAULT_COUNTRY,
        userMessageText: `Calcula la liquidacion laboral para un trabajador con salario mensual de ${salary} y ${years} años de antiguedad.`,
      })
      await event.channel.post(streamResult.stream.fullStream)
    } catch {
      await event.channel.post(ERROR_MESSAGE)
    }
  })

  botInstance.registerSingleton()

  return botInstance
}

export { getBot }
