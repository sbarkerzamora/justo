import type { StateAdapter, Lock, QueueEntry } from "chat"
import type { Redis } from "@upstash/redis"
import { redis as upstashClient } from "@/lib/redis"

function generateToken(): string {
  return `upstash_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export class UpstashRedisState implements StateAdapter {
  private readonly client: Redis
  private readonly keyPrefix: string

  constructor(options?: { client?: Redis; keyPrefix?: string }) {
    const client = options?.client ?? upstashClient
    if (!client) {
      throw new Error(
        "Upstash Redis is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN."
      )
    }
    this.client = client
    this.keyPrefix = options?.keyPrefix ?? "chat-sdk"
  }

  private key(type: string, id: string): string {
    return `${this.keyPrefix}:${type}:${id}`
  }

  private subscriptionsSetKey(): string {
    return `${this.keyPrefix}:subscriptions`
  }

  async connect(): Promise<void> {}

  async disconnect(): Promise<void> {}

  async subscribe(threadId: string): Promise<void> {
    await this.client.sadd(this.subscriptionsSetKey(), threadId)
  }

  async unsubscribe(threadId: string): Promise<void> {
    await this.client.srem(this.subscriptionsSetKey(), threadId)
  }

  async isSubscribed(threadId: string): Promise<boolean> {
    const result = await this.client.sismember(
      this.subscriptionsSetKey(),
      threadId
    )
    return result === 1
  }

  async acquireLock(threadId: string, ttlMs: number): Promise<Lock | null> {
    const token = generateToken()
    const lockKey = this.key("lock", threadId)
    const acquired = await this.client.set(lockKey, token, {
      nx: true,
      px: ttlMs,
    })
    if (acquired === "OK") {
      return {
        threadId,
        token,
        expiresAt: Date.now() + ttlMs,
      }
    }
    return null
  }

  async forceReleaseLock(threadId: string): Promise<void> {
    const lockKey = this.key("lock", threadId)
    await this.client.del(lockKey)
  }

  async releaseLock(lock: Lock): Promise<void> {
    const lockKey = this.key("lock", lock.threadId)
    const script = [
      `if redis.call("get", KEYS[1]) == ARGV[1] then`,
      `  return redis.call("del", KEYS[1])`,
      `else`,
      `  return 0`,
      `end`,
    ].join("\n")
    await this.client.eval(script, [lockKey], [lock.token])
  }

  async extendLock(lock: Lock, ttlMs: number): Promise<boolean> {
    const lockKey = this.key("lock", lock.threadId)
    const script = [
      `if redis.call("get", KEYS[1]) == ARGV[1] then`,
      `  return redis.call("pexpire", KEYS[1], ARGV[2])`,
      `else`,
      `  return 0`,
      `end`,
    ].join("\n")
    const result = await this.client.eval(
      script,
      [lockKey],
      [lock.token, ttlMs.toString()]
    )
    return result === 1
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const cacheKey = this.key("cache", key)
    const value = await this.client.get(cacheKey)
    if (value === null) return null
    try {
      return JSON.parse(value as string) as T
    } catch {
      return value as T
    }
  }

  async set<T = unknown>(
    key: string,
    value: T,
    ttlMs?: number
  ): Promise<void> {
    const cacheKey = this.key("cache", key)
    const serialized = JSON.stringify(value)
    if (ttlMs) {
      await this.client.set(cacheKey, serialized, { px: ttlMs })
    } else {
      await this.client.set(cacheKey, serialized)
    }
  }

  async setIfNotExists(
    key: string,
    value: unknown,
    ttlMs?: number
  ): Promise<boolean> {
    const cacheKey = this.key("cache", key)
    const serialized = JSON.stringify(value)
    const result = ttlMs
      ? await this.client.set(cacheKey, serialized, { nx: true, px: ttlMs })
      : await this.client.set(cacheKey, serialized, { nx: true })
    return result === "OK"
  }

  async delete(key: string): Promise<void> {
    const cacheKey = this.key("cache", key)
    await this.client.del(cacheKey)
  }

  async appendToList(
    key: string,
    value: unknown,
    options?: { maxLength?: number; ttlMs?: number }
  ): Promise<void> {
    const listKey = `${this.keyPrefix}:list:${key}`
    const serialized = JSON.stringify(value)
    const maxLength = options?.maxLength ?? 0
    const ttlMs = options?.ttlMs ?? 0
    const script = [
      `redis.call("rpush", KEYS[1], ARGV[1])`,
      `if tonumber(ARGV[2]) > 0 then`,
      `  redis.call("ltrim", KEYS[1], -tonumber(ARGV[2]), -1)`,
      `end`,
      `if tonumber(ARGV[3]) > 0 then`,
      `  redis.call("pexpire", KEYS[1], tonumber(ARGV[3]))`,
      `end`,
      `return 1`,
    ].join("\n")
    await this.client.eval(
      script,
      [listKey],
      [serialized, maxLength.toString(), ttlMs.toString()]
    )
  }

  async enqueue(
    threadId: string,
    entry: QueueEntry,
    maxSize: number
  ): Promise<number> {
    const queueKey = this.key("queue", threadId)
    const serialized = JSON.stringify(entry)
    const ttlMs = Math.max(entry.expiresAt - Date.now(), 60000).toString()
    const script = [
      `redis.call("rpush", KEYS[1], ARGV[1])`,
      `if tonumber(ARGV[2]) > 0 then`,
      `  redis.call("ltrim", KEYS[1], -tonumber(ARGV[2]), -1)`,
      `end`,
      `redis.call("pexpire", KEYS[1], ARGV[3])`,
      `return redis.call("llen", KEYS[1])`,
    ].join("\n")
    const result = await this.client.eval(
      script,
      [queueKey],
      [serialized, maxSize.toString(), ttlMs]
    )
    return result as number
  }

  async dequeue(threadId: string): Promise<QueueEntry | null> {
    const queueKey = this.key("queue", threadId)
    const value = await this.client.lpop(queueKey)
    if (value === null) return null
    return JSON.parse(value as string) as QueueEntry
  }

  async queueDepth(threadId: string): Promise<number> {
    const queueKey = this.key("queue", threadId)
    return (await this.client.llen(queueKey)) as number
  }

  async getList<T = unknown>(key: string): Promise<T[]> {
    const listKey = `${this.keyPrefix}:list:${key}`
    const values = await this.client.lrange(listKey, 0, -1)
    return (values as string[]).map((v) => JSON.parse(v)) as T[]
  }
}
