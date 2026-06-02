import { getBot } from "@/lib/bot"

export async function POST(request: Request) {
  try {
    const bot = getBot()
    return bot.webhooks.telegram(request)
  } catch {
    return new Response("Telegram bot is not configured", { status: 503 })
  }
}
