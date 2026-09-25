"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Menu, Moon, Sun, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const NAV_ID = [
  { href: "/#fitur", label: "Fitur" },
  { href: "/#cara-kerja", label: "Cara kerja" },
  { href: "/#self-host", label: "Self-host" },
  { href: "/#faq", label: "FAQ" },
  { href: "/docs", label: "Docs" },
]

const NAV_EN = [
  { href: "/en#fitur", label: "Features" },
  { href: "/en#cara-kerja", label: "How it works" },
  { href: "/en#self-host", label: "Self-host" },
  { href: "/en#faq", label: "FAQ" },
  { href: "/docs", label: "Docs (ID)" },
]

const REPO = "https://github.com/hideandseeklab/aoox-api"

function langFromPathname(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "id"
}

function SiteHeader() {
  const pathname = usePathname()
  const lang = langFromPathname(pathname)
  const nav = lang === "en" ? NAV_EN : NAV_ID
  const cta = lang === "en" ? "Get started" : "Mulai"

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href={lang === "en" ? "/en" : "/"} className="text-sm font-semibold tracking-tight">
          <span className="text-primary-foreground dark:text-primary">$</span>{" "}
          aoox
        </Link>

        <nav className="ml-6 hidden items-center gap-1 text-xs md:flex">
          {nav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a
            href={REPO}
            target="_blank"
            rel="noreferrer"
            className="hidden px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex sm:items-center sm:gap-1"
          >
            GitLab
            <span aria-hidden className="text-[0.6rem]">↗</span>
          </a>
          <LangSwitch pathname={pathname} lang={lang} />
          <ThemeToggle lang={lang} />
          <Button size="sm" className="hidden sm:inline-flex" asChild>
            <Link href="/docs/instalasi">{cta}</Link>
          </Button>
          {/* key = pathname: menu otomatis tertutup saat pindah halaman */}
          <MobileMenu key={pathname} pathname={pathname} lang={lang} nav={nav} cta={cta} />
        </div>
      </div>
    </header>
  )
}

function isActive(href: string, pathname: string) {
  if (href.includes("#")) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  item,
  pathname,
  className,
  onClick,
}: {
  item: { href: string; label: string }
  pathname: string
  className?: string
  onClick?: () => void
}) {
  const active = isActive(item.href, pathname)
  return (
    <Link
      href={item.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "px-2 py-1 transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {item.label}
    </Link>
  )
}

/** Landing page only has two languages — hidden on /docs, which stays Indonesian. */
function LangSwitch({ pathname, lang }: { pathname: string; lang: Lang }) {
  if (pathname !== "/" && pathname !== "/en") return null
  return (
    <Link
      href={lang === "en" ? "/" : "/en"}
      className="inline-flex h-7 items-center px-2 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      title={lang === "en" ? "Lihat dalam Bahasa Indonesia" : "View in English"}
    >
      {lang === "en" ? "ID" : "EN"}
    </Link>
  )
}

function ThemeToggle({ lang }: { lang: Lang }) {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={lang === "en" ? "Toggle theme" : "Ganti tema"}
      title={lang === "en" ? "Toggle theme (d)" : "Ganti tema (d)"}
      className="inline-flex size-7 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground"
    >
      {/* dua ikon, dipilih lewat CSS agar tidak ada hydration mismatch */}
      <Sun className="size-3.5 dark:hidden" />
      <Moon className="hidden size-3.5 dark:block" />
    </button>
  )
}

function MobileMenu({
  pathname,
  lang,
  nav,
  cta,
}: {
  pathname: string
  lang: Lang
  nav: { href: string; label: string }[]
  cta: string
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? (lang === "en" ? "Close menu" : "Tutup menu") : (lang === "en" ? "Open menu" : "Buka menu")}
        aria-expanded={open}
        className="inline-flex size-7 items-center justify-center border border-transparent text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-14 border-b border-border bg-background">
          <nav className="mx-auto flex w-full max-w-6xl flex-col px-4 py-3 text-sm sm:px-6">
            {nav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                pathname={pathname}
                onClick={() => setOpen(false)}
                className="border-l border-border py-2 pl-3"
              />
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
              <Button size="sm" asChild>
                <Link href="/docs/instalasi">{cta}</Link>
              </Button>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                GitLab ↗
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  )
}

export { SiteHeader }
