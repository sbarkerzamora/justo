import { redis } from "@/lib/redis"
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const TTL_SECONDS = 60 * 60 * 24
const corpusRoot = join(
  /* turbopackIgnore: true */ process.cwd(),
  "..",
  "..",
  "content",
  "legal"
)

const l1FileCache = new Map<string, string>()

type CorpusDocument = {
  filename: string
  topic: string
}

export const countryDirMap: Record<string, string> = {
  gt: "gua",
}

let l1ManifestCache: Map<string, CorpusDocument[]> | null = null

export async function readLegalCorpusFile(filePath: string): Promise<string> {
  const l1 = l1FileCache.get(filePath)
  if (l1) return l1

  if (redis) {
    const key = `corpus:file:${filePath}`
    try {
      const cached = await redis.get<string>(key)
      if (cached) {
        l1FileCache.set(filePath, cached)
        return cached
      }
    } catch {
      /* fall through to filesystem */
    }
  }

  const content = await readFile(filePath, "utf8")

  l1FileCache.set(filePath, content)

  if (redis) {
    try {
      await redis.set(`corpus:file:${filePath}`, content, { ex: TTL_SECONDS })
    } catch {
      /* non-critical */
    }
  }

  return content
}

export async function readCountryCorpus(
  countryCode: string
): Promise<CorpusDocument[]> {
  if (!l1ManifestCache) {
    l1ManifestCache = new Map()
  }

  const l1 = l1ManifestCache.get(countryCode)
  if (l1) return l1

  if (redis) {
    const key = `corpus:manifest:${countryCode}`
    try {
      const cached = await redis.get<CorpusDocument[]>(key)
      if (cached) {
        l1ManifestCache.set(countryCode, cached)
        return cached
      }
    } catch {
      /* fall through to filesystem */
    }
  }

  const dir = countryDirMap[countryCode] ?? countryCode
  const corpusDir = join(corpusRoot, dir)
  const filenames = (await readdir(corpusDir)).filter(
    (name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md"
  )

  const docs = filenames.map((filename) => ({
    filename,
    topic: filename.replace(/\.md$/i, ""),
  }))

  l1ManifestCache.set(countryCode, docs)

  if (redis) {
    try {
      await redis.set(`corpus:manifest:${countryCode}`, docs, {
        ex: TTL_SECONDS,
      })
    } catch {
      /* non-critical */
    }
  }

  return docs
}
