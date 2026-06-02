import { Chat, toAiMessages } from "chat"
import { createTelegramAdapter } from "@chat-adapter/telegram"
import { UpstashRedisState } from "@/lib/chat-state"
import { generateLaborResponse } from "@/lib/ai/respond"

let botInstance: Chat | null = null

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
    onLockConflict: "force",
    logger: "info",
  })

  botInstance.onDirectMessage(async (thread, message) => {
    await thread.subscribe()
    await thread.startTyping()

    const streamResult = await generateLaborResponse({
      countryCode: "ni",
      userMessageText: message.text,
    })

    await thread.post(streamResult.fullStream)
  })

  botInstance.onNewMention(async (thread, message) => {
    await thread.subscribe()
    await thread.startTyping()

    const streamResult = await generateLaborResponse({
      countryCode: "ni",
      userMessageText: message.text,
    })

    await thread.post(streamResult.fullStream)
  })

  botInstance.onSubscribedMessage(async (thread, message) => {
    if (!message.isMention && !thread.isDM) return
    await thread.startTyping()

    const { messages } = await thread.adapter.fetchMessages(thread.id, {
      limit: 20,
    })
    const history = await toAiMessages(messages)

    const streamResult = await generateLaborResponse({
      countryCode: "ni",
      userMessageText: message.text,
      modelMessages: history as Parameters<typeof generateLaborResponse>[0]["modelMessages"],
    })

    await thread.post(streamResult.fullStream)
  })

  botInstance.registerSingleton()

  return botInstance
}

export { getBot }
