import { Index } from "@upstash/vector"

let cached: Index | null = null

export function getVectorIndex(): Index {
  if (cached) return cached

  const url = process.env.UPSTASH_VECTOR_REST_URL
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN
  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN",
    )
  }
  cached = new Index({ url, token })
  return cached
}

export function hasVectorConfig(): boolean {
  return Boolean(
    process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN,
  )
}
