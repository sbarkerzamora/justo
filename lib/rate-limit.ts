import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

const redis =
  redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null

type RateLimitPreset = "chat" | "pdf" | "calculate"

const presets: Record<
  RateLimitPreset,
  { requests: number; window: `${number} s` }
> = {
  chat: { requests: 10, window: "60 s" },
  pdf: { requests: 20, window: "60 s" },
  calculate: { requests: 60, window: "60 s" },
}

const limiters = new Map<
  RateLimitPreset,
  { limiter: Ratelimit; skip: boolean }
>()

function getLimiter(preset: RateLimitPreset) {
  const cached = limiters.get(preset)
  if (cached) return cached

  if (!redis) {
    const skip = { limiter: null as unknown as Ratelimit, skip: true }
    limiters.set(preset, skip)
    return skip
  }

  const cfg = presets[preset]
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.requests, cfg.window),
    analytics: true,
  })

  const entry = { limiter, skip: false }
  limiters.set(preset, entry)
  return entry
}

export async function checkRateLimit(
  preset: RateLimitPreset,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const { limiter, skip } = getLimiter(preset)

  if (skip) {
    return { allowed: true, remaining: 999, reset: 0 }
  }

  const { success, remaining, reset } = await limiter.limit(identifier)
  return { allowed: success, remaining, reset }
}
