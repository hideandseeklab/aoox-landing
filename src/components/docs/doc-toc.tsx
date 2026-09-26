"use client"

import * as React from "react"

import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

type Heading = { id: string; text: string }

const COPY: Record<Lang, string> = {
  id: "Di halaman ini",
  en: "On this page",
}

/**
 * Daftar isi per halaman: membaca h2[id] di dalam <article> setelah mount,
 * lalu menyorot heading yang sedang terlihat lewat IntersectionObserver.
 */
function DocToc({ lang = "id" }: { lang?: Lang }) {
  const [headings, setHeadings] = React.useState<Heading[]>([])
  const [active, setActive] = React.useState<string | null>(null)

  React.useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article h2[id]")
    )
    // Headings only exist in the DOM after mount, so this can't be derived at render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(nodes.map((n) => ({ id: n.id, text: n.textContent ?? "" })))
    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  if (headings.length < 2) return null

  return (
    <nav aria-label={COPY[lang]} className="flex flex-col gap-2 text-xs">
      <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
        {COPY[lang]}
      </span>
      <ul className="flex flex-col">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block border-l py-1 pl-3 transition-colors",
                active === h.id
                  ? "border-primary text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export { DocToc }
