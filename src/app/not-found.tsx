import type { Metadata } from "next"
import Link from "next/link"

import "./globals.css"
import { fontMono, fontSans } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { SITE_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

// Global 404 — `output: "export"` turns this into a plain `404.html` at the
// site root, which GitHub Pages serves for any unmatched path under
// aoox.dev. It sits outside the (id)/(en) route groups, so (per "Multiple
// root layouts" in the Next.js docs) it needs its own <html>/<body> — there
// is no ambient root layout to fall back on since neither group's layout
// applies to an entirely unmatched URL.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Halaman tidak ditemukan · aoox",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <html lang="id" className={cn("antialiased", fontSans.variable, fontMono.variable)}>
      <body>
        <ThemeProvider>
          <div className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center">
            <p className="font-mono text-sm text-muted-foreground">404</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Halaman tidak ditemukan
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Halaman yang dicari mungkin sudah dipindahkan atau tidak pernah
              ada. Coba mulai dari beranda atau dokumentasi.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/">Beranda</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs">Dokumentasi</Link>
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
