"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { docsNavFor } from "@/lib/docs-nav"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const COPY: Record<Lang, { placeholder: string; ariaLabel: string; empty: (q: string) => string }> = {
  id: {
    placeholder: "Cari halaman…",
    ariaLabel: "Cari halaman dokumentasi",
    empty: (q) => `Tidak ada halaman untuk "${q}".`,
  },
  en: {
    placeholder: "Search pages…",
    ariaLabel: "Search documentation pages",
    empty: (q) => `No pages found for "${q}".`,
  },
}

function DocsSidebar({ lang = "id" }: { lang?: Lang }) {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const q = query.trim().toLowerCase()
  const t = COPY[lang]
  const docsNav = docsNavFor(lang)

  const groups = q
    ? docsNav.map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        ),
      })).filter((g) => g.items.length > 0)
    : docsNav

  return (
    <div className="flex flex-col gap-5">
      <label className="flex h-8 items-center gap-2 border border-border bg-card px-2 text-xs focus-within:border-ring">
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          aria-label={t.ariaLabel}
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      {groups.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t.empty(query)}</p>
      ) : null}

      <nav className="flex flex-col gap-6 text-xs">
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {group.title}
            </span>
            <ul className="flex flex-col">
              {group.items.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      title={item.description}
                      className={cn(
                        "block border-l py-1 pl-3 transition-colors",
                        active
                          ? "border-primary text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}

export { DocsSidebar }
