import type { Components } from "react-markdown"
import type { Role } from "@/components/chat/types"
import { Markdown } from "@/components/ui/markdown"
import { cn } from "@/lib/utils"

const safeHref = (href: string | undefined) => {
  if (!href) return "#"
  if (/^(https?:|mailto:|\/)/i.test(href)) return href
  return "#"
}

const chatMarkdownComponents: Partial<Components> = {
  a: ({ children, href }) => {
    const resolvedHref = safeHref(href)
    const isExternal = /^https?:\/\//i.test(resolvedHref)

    return (
      <a
        href={resolvedHref}
        className="font-medium underline decoration-current/40 underline-offset-2 transition-opacity hover:opacity-80"
        {...(isExternal
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {children}
      </a>
    )
  },
  blockquote: ({ children }) => (
    <blockquote className="my-2 rounded-xl border border-current/15 bg-current/5 px-3 py-2 text-xs leading-relaxed text-current">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="my-2 max-w-full overflow-x-auto rounded-xl border border-current/15 bg-current/5">
      <table className="min-w-max border-collapse text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-current/10">{children}</thead>,
  th: ({ children }) => (
    <th className="border-b border-current/15 px-3 py-2 text-left font-semibold text-current last:text-right">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-current/15 px-3 py-2 align-top text-current last:text-right">
      {children}
    </td>
  ),
}

export function RichChatMarkdown({
  id,
  text,
  role,
}: {
  id: string
  text: string
  role: Role
}) {
  return (
    <Markdown
      id={id}
      components={chatMarkdownComponents}
      className={cn(
        "prose prose-sm max-w-none min-w-0 break-words dark:prose-invert",
        "prose-headings:my-2 prose-headings:font-semibold prose-p:my-1.5 prose-strong:text-current prose-ol:my-1.5 prose-ul:my-1.5 prose-li:my-0.5",
        "prose-code:rounded-md prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.82em] prose-code:before:content-none prose-code:after:content-none",
        role === "user" &&
          "prose-p:text-primary-foreground prose-strong:text-primary-foreground prose-code:bg-primary-foreground/15 prose-code:text-primary-foreground prose-li:text-primary-foreground"
      )}
    >
      {text}
    </Markdown>
  )
}
