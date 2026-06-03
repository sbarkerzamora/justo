import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

function getLegalPagesDir() {
  const candidates = [
    join(process.cwd(), "content", "pages"),
    join(process.cwd(), "..", "..", "content", "pages"),
  ]

  const dir = candidates.find((candidate) => existsSync(candidate))
  if (!dir) throw new Error("Legal pages directory not found")
  return dir
}

const backLabel: Record<string, string> = {
  es: "Volver al inicio",
  en: "Back to home",
}

export function LegalPageContent({
  locale,
  slug,
}: {
  locale: "es" | "en"
  slug: string
}) {
  const filePath = join(getLegalPagesDir(), locale, `${slug}.md`)
  if (!existsSync(filePath)) notFound()

  const content = readFileSync(filePath, "utf-8")

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        <div className="mt-12 border-t border-border pt-6 text-center">
          <a
            href={locale === "en" ? "/en/ni" : "/es/ni"}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            &larr; {backLabel[locale]}
          </a>
        </div>
      </article>
    </main>
  )
}
