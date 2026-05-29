import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

const safeHref = (href: string | undefined) => {
  if (!href) return "#"
  if (/^(https?:|mailto:|\/)/i.test(href)) return href
  return "#"
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h3 className="mt-3 mb-1 text-base font-semibold tracking-tight text-current first:mt-0">
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h3 className="mt-3 mb-1 text-sm font-semibold tracking-tight text-current first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-2.5 mb-1 text-sm font-medium text-current first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-current">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="my-1.5 list-disc space-y-1 pl-5 marker:text-current">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 list-decimal space-y-1 pl-5 marker:text-current">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5 leading-relaxed">{children}</li>,
  a: ({ children, href }) => {
    const resolvedHref = safeHref(href)
    const isExternal = /^https?:\/\//i.test(resolvedHref)

    return (
      <a
        href={resolvedHref}
        className="font-medium underline decoration-current/50 underline-offset-2 transition-opacity hover:opacity-80"
        {...(isExternal ? { target: "_blank", rel: "noreferrer noopener" } : {})}
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
  hr: () => <hr className="my-3 border-current/15" />,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith("language-")

    if (!isBlock) {
      return (
        <code className="rounded-md bg-current/10 px-1.5 py-0.5 font-mono text-[0.8em] text-current">
          {children}
        </code>
      )
    }

    return (
      <code className="block overflow-x-auto whitespace-pre rounded-xl bg-current/10 p-3 font-mono text-xs leading-relaxed text-current">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <pre className="my-2 min-w-0">{children}</pre>,
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

export function ChatMarkdown({ text }: { text: string }) {
  return (
    <div className="min-w-0 break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={markdownComponents}
      >
        {text}
      </ReactMarkdown>
    </div>
  )
}
