import type { ReactNode } from "react"

type Segment =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "italic"; content: string }
  | { type: "code"; content: string }

const parseInline = (text: string): (string | Segment)[] => {
  const parts: (string | Segment)[] = []
  const regex = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3|`(.+?)`/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      parts.push({ type: "bold", content: match[2] })
    } else if (match[3]) {
      parts.push({ type: "italic", content: match[4] })
    } else if (match[5]) {
      parts.push({ type: "code", content: match[5] })
    }

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts
}

const renderSegment = (seg: string | Segment, key: string): ReactNode => {
  if (typeof seg === "string") return seg
  if (seg.type === "bold") return <strong key={key}>{seg.content}</strong>
  if (seg.type === "italic") return <em key={key}>{seg.content}</em>
  if (seg.type === "code")
    return (
      <code
        key={key}
        className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs"
      >
        {seg.content}
      </code>
    )
  return seg.content
}

const headerMatch = /^(#{1,3})\s+(.+)/
const numberedListMatch = /^(\d+)\.\s+(.+)/

export function ChatMarkdown({ text }: { text: string }) {
  const lines = text.split("\n")
  const elements: ReactNode[] = []
  let listItems: ReactNode[] | null = null
  let listType: "ul" | "ol" | null = null
  let listKey = 0
  let elementKey = 0
  let nodeKey = 0

  const flushList = () => {
    if (!listItems) return
    const Tag = listType === "ol" ? "ol" : "ul"
      elements.push(
        <Tag key={`list-${listKey++}`} className={`space-y-0.5 ${listType === "ul" ? "list-disc" : "list-decimal"} pl-5`}>
          {listItems}
        </Tag>,
      )
    listItems = null
    listType = null
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Headers
    const hMatch = trimmed.match(headerMatch)
    if (hMatch) {
      flushList()
      const level = hMatch[1].length as 1 | 2 | 3
      const segments = parseInline(hMatch[2])
      const Tag = level === 1 ? "h3" : level === 2 ? "h4" : "h5"
      const size = level === 1 ? "text-base font-semibold" : level === 2 ? "text-sm font-semibold" : "text-sm font-medium"
      elements.push(
        <Tag key={`h-${nodeKey++}`} className={`mt-4 mb-1 ${size}`}>
          {segments.map((s) => renderSegment(s, `h-${elementKey++}`))}
        </Tag>,
      )
      continue
    }

    // Unordered list
    const ulMatch = trimmed.match(/^[-*]\s+(.+)/)
    if (ulMatch) {
      if (!listItems || listType !== "ul") {
        flushList()
        listItems = []
        listType = "ul"
      }
      const segments = parseInline(ulMatch[1])
      listItems.push(
        <li key={`li-${nodeKey++}`}>
          {segments.map((s) => renderSegment(s, `ul-${elementKey++}`))}
        </li>,
      )
      continue
    }

    // Ordered list
    const olMatch = trimmed.match(numberedListMatch)
    if (olMatch) {
      if (!listItems || listType !== "ol") {
        flushList()
        listItems = []
        listType = "ol"
      }
      const segments = parseInline(olMatch[2])
      listItems.push(
        <li key={`li-${nodeKey++}`}>
          {segments.map((s) => renderSegment(s, `ol-${elementKey++}`))}
        </li>,
      )
      continue
    }

    flushList()

    if (trimmed === "") {
      elements.push(<br key={`br-${nodeKey++}`} />)
      continue
    }

    const segments = parseInline(trimmed)
    elements.push(
      <p key={`p-${nodeKey++}`} className="[&:not(:first-child)]:mt-2">
        {segments.map((s) => renderSegment(s, `p-${elementKey++}`))}
      </p>,
    )
  }

  flushList()

  return <>{elements}</>
}
