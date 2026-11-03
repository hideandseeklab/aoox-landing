/**
 * Tiny inline markup used by the changelog highlights: `**bold**` and
 * `` `code` ``. Code may sit inside bold (`**use `x` now**`); bold never
 * nests in code. An unmatched marker is kept as plain text.
 */
export type InlineNode =
  | { type: "text"; value: string }
  | { type: "code"; value: string }
  | { type: "bold"; children: InlineNode[] }

function parseCodeAndText(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let i = 0
  while (i < text.length) {
    const open = text.indexOf("`", i)
    const close = open === -1 ? -1 : text.indexOf("`", open + 1)
    if (open === -1 || close === -1) {
      nodes.push({ type: "text", value: text.slice(i) })
      break
    }
    if (open > i) nodes.push({ type: "text", value: text.slice(i, open) })
    nodes.push({ type: "code", value: text.slice(open + 1, close) })
    i = close + 1
  }
  return nodes
}

/** Find the next `**` that is outside any code span, at or after `from`. */
function nextBoldMarker(text: string, from: number): number {
  let inCode = false
  for (let i = from; i < text.length; i++) {
    if (text[i] === "`") inCode = !inCode
    else if (!inCode && text.startsWith("**", i)) return i
  }
  return -1
}

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = []
  let i = 0
  while (i < text.length) {
    const open = nextBoldMarker(text, i)
    const close = open === -1 ? -1 : nextBoldMarker(text, open + 2)
    if (open === -1 || close === -1) {
      nodes.push(...parseCodeAndText(text.slice(i)))
      break
    }
    if (open > i) nodes.push(...parseCodeAndText(text.slice(i, open)))
    nodes.push({ type: "bold", children: parseCodeAndText(text.slice(open + 2, close)) })
    i = close + 2
  }
  return nodes
}
