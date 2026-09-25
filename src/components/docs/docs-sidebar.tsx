"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"

import { DOCS_NAV } from "@/lib/docs-nav"
import { cn } from "@/lib/utils"

function DocsSidebar() {
  const pathname = usePathname()
  const [query, setQuery] = React.useState("")
  const q = query.trim().toLowerCase()

  const groups = q
    ? DOCS_NAV.map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        ),
      })).filter((g) => g.items.length > 0)
    : DOCS_NAV

  return (
    <div className="flex flex-col gap-5">
      <label className="flex h-8 items-center gap-2 border border-border bg-card px-2 text-xs focus-within:border-ring">
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari halaman…"
          aria-label="Cari halaman dokumentasi"
          className="min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      {groups.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Tidak ada halaman untuk &quot;{query}&quot;.
        </p>
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
