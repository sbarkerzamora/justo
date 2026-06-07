import { readdir, readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { config as loadEnv } from "dotenv"
import { Index } from "@upstash/vector"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "../../..")

loadEnv({ path: join(repoRoot, ".env.local") })
loadEnv({ path: join(repoRoot, "apps/web/.env.local") })

const CORPUS_ROOT = join(repoRoot, "content", "legal")
const TARGET_CHUNK = 1_200
const MAX_CHUNK = 1_800
const OVERLAP = 200

type ChunkMetadata = {
  country: string
  topic: string
  filename: string
  section: string
  part: number
  version: string
  title: string
}

type Chunk = {
  id: string
  data: string
  metadata: ChunkMetadata
}

const stripFrontmatter = (raw: string): string => {
  if (!raw.startsWith("---")) return raw
  const end = raw.indexOf("---", 3)
  return end === -1 ? raw : raw.slice(end + 3).trim()
}

const parseFrontmatter = (raw: string): Record<string, string> => {
  if (!raw.startsWith("---")) return {}
  const end = raw.indexOf("---", 3)
  if (end === -1) return {}
  const out: Record<string, string> = {}
  for (const line of raw.slice(3, end).split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z_]+):\s*"?([^"\n]+)"?\s*$/)
    if (m && m[1] && m[2]) out[m[1]] = m[2].trim()
  }
  return out
}

const parseSections = (body: string): Array<[string, string]> => {
  const out: Array<[string, string]> = []
  const lines = body.split(/\r?\n/)
  let current = "_intro"
  let buf: string[] = []

  const flush = () => {
    const text = buf.join("\n").trim()
    if (text) out.push([current, text])
    buf = []
  }

  for (const line of lines) {
    if (line.startsWith("# ")) continue
    const h = line.match(/^##\s+(.+?)\s*$/)
    if (h && h[1]) {
      flush()
      current = h[1].trim()
    } else {
      buf.push(line)
    }
  }
  flush()
  return out
}

const splitByParagraphs = (text: string): string[] => {
  if (text.length <= MAX_CHUNK) return [text]
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
  const chunks: string[] = []
  let current = ""

  for (const p of paragraphs) {
    const candidate = current ? `${current}\n\n${p}` : p
    if (candidate.length <= TARGET_CHUNK) {
      current = candidate
      continue
    }
    if (current) chunks.push(current)
    if (p.length > MAX_CHUNK) {
      let i = 0
      while (i < p.length) {
        const end = Math.min(i + MAX_CHUNK, p.length)
        chunks.push(p.slice(i, end))
        if (end === p.length) break
        i = end - OVERLAP
      }
      current = ""
    } else {
      current = p
    }
  }
  if (current) chunks.push(current)
  return chunks
}

const stableId = (parts: Array<string | number>): string =>
  createHash("sha1").update(parts.join("::")).digest("hex").slice(0, 24)

const buildChunks = (filename: string, raw: string): Chunk[] => {
  const meta = parseFrontmatter(raw)
  const body = stripFrontmatter(raw)
  const country = meta.country ?? "unknown"
  const topic = meta.topic ?? filename.replace(/\.md$/i, "")
  const version = meta.version ?? "unknown"
  const title = body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? topic

  const sections = parseSections(body)
  const chunks: Chunk[] = []

  for (const [section, content] of sections) {
    const parts = splitByParagraphs(content)
    parts.forEach((part, idx) => {
      chunks.push({
        id: stableId([country, filename, section, idx]),
        data: `## ${section}\n${part}`,
        metadata: { country, topic, filename, section, part: idx, version, title },
      })
    })
  }
  return chunks
}

const listMarkdownFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir)
  return entries.filter(
    (n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md",
  )
}

async function main() {
  const url = process.env.UPSTASH_VECTOR_REST_URL
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN
  if (!url || !token) {
    throw new Error(
      "Faltan UPSTASH_VECTOR_REST_URL o UPSTASH_VECTOR_REST_TOKEN. Agregalas a .env.local",
    )
  }

  const index = new Index({ url, token })
  const reset = process.argv.includes("--reset")
  const countryFilter = process.env.INGEST_COUNTRY

  const countryDirs = await readdir(CORPUS_ROOT, { withFileTypes: true })
  const countries = countryDirs
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((c) => (countryFilter ? c === countryFilter : true))

  let total = 0
  for (const country of countries) {
    const countryDir = join(CORPUS_ROOT, country)
    const files = await listMarkdownFiles(countryDir)

    if (reset) {
      console.log(`[reset] borrando namespace country=${country}`)
      await index.delete({ filter: `country = '${country}'` })
    }

    const allChunks: Chunk[] = []
    for (const file of files) {
      const raw = await readFile(join(countryDir, file), "utf8")
      allChunks.push(...buildChunks(file, raw))
    }

    console.log(
      `[${country}] ${files.length} archivos -> ${allChunks.length} chunks`,
    )

    for (let i = 0; i < allChunks.length; i += 100) {
      const batch = allChunks.slice(i, i + 100)
      await index.upsert(
        batch.map((c) => ({
          id: c.id,
          data: c.data,
          metadata: c.metadata,
        })),
      )
    }
    total += allChunks.length
  }

  console.log(`\nListo. ${total} chunks indexados.`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
