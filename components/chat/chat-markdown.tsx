import type { ReactNode } from "react"

type Segment =
  | { type: "text"; content: string }
  | { type: "bold"; content: string }
  | { type: "italic"; content: string }

const parseInline = (text: string): (string | Segment)[] => {
  const parts: (string | Segment)[] = []
  let remaining = text

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/)
    if (boldMatch) {
      if (boldMatch.index && boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index))
      }
      parts.push({ type: "bold", content: boldMatch[2] })
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length)
      // eslint-disable-next-line no-constant-condition
      continue
    }

    const italicMatch = remaining.match(/^(\*|_)(.+?)\1/)
    if (italicMatch) {
      if (italicMatch.index && italicMatch.index > 0) {
        parts.push(remaining.slice(0, italicMatch.index))
      }
      parts.push({ type: "italic", content: italicMatch[2] })
      remaining = remaining.slice(italicMatch.index! + italicMatch[0].length)
      // eslint-disable-next-line no-constant-condition
      continue
    }

    parts.push(remaining)
    break
  }

  return parts
}

const renderSegment = (seg: string | Segment, key: number): ReactNode => {
  if (typeof seg === "string") return seg
  if (seg.type === "bold") return <strong key={key}>{seg.content}</strong>
  if (seg.type === "italic") return <em key={key}>{seg.content}</em>
  return seg.content
}

export function ChatMarkdown({ text }: { text: string }) {
  const lines = text.split("\n")
  const elements: ReactNode[] = []
  let listItems: ReactNode[] | null = null
  let listKey = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const listMatch = line.match(/^[-*]\s+(.+)/)

    if (listMatch) {
      if (!listItems) listItems = []
      const segments = parseInline(listMatch[1])
      listItems.push(
        <li key={i} className="ml-4 list-disc">
          {segments.map((s, j) => renderSegment(s, j))}
        </li>,
      )
      continue
    }

    if (listItems) {
      elements.push(<ul key={`list-${listKey++}`} className="space-y-0.5">{listItems}</ul>)
      listItems = null
    }

    if (line.trim() === "") {
      elements.push(<br key={`br-${i}`} />)
      continue
    }

    const segments = parseInline(line)
    elements.push(
      <p key={`p-${i}`} className="[&:not(:first-child)]:mt-2">
        {segments.map((s, j) => renderSegment(s, j))}
      </p>,
    )
  }

  if (listItems) {
    elements.push(<ul key={`list-${listKey++}`} className="space-y-0.5">{listItems}</ul>)
  }

  return <>{elements}</>
}
