"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { langFromPathname, type Lang } from "@/lib/lang"

const COPY: Record<Lang, { title: string; body: string; home: string; docs: string; homeHref: string; docsHref: string }> = {
  en: {
    title: "Page not found",
    body: "The page you are looking for may have moved or never existed. Try starting from the home page or the documentation.",
    home: "Home",
    docs: "Documentation",
    homeHref: "/",
    docsHref: "/docs",
  },
  id: {
    title: "Halaman tidak ditemukan",
    body: "Halaman yang dicari mungkin sudah dipindahkan atau tidak pernah ada. Coba mulai dari beranda atau dokumentasi.",
    home: "Beranda",
    docs: "Dokumentasi",
    homeHref: "/id",
    docsHref: "/id/docs",
  },
}

// The path never changes while the page is shown, so the subscription is a
// no-op. `getServerSnapshot` (used for the static HTML and during hydration)
// is always English (the default); after hydration React re-reads the real
// path, so /id URLs switch to Indonesian without a hydration mismatch.
function subscribe() {
  return () => {}
}

// One static 404.html serves every unmatched URL, so the language cannot be
// known at build time.
export function NotFoundContent() {
  const lang = React.useSyncExternalStore<Lang>(
    subscribe,
    () => langFromPathname(window.location.pathname),
    () => "en",
  )

  // Next.js does not keep the <html> attributes in the prerendered 404.html,
  // so set the language on the client for both languages.
  React.useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = COPY[lang]

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{t.body}</p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href={t.homeHref}>{t.home}</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={t.docsHref}>{t.docs}</Link>
        </Button>
      </div>
    </div>
  )
}
