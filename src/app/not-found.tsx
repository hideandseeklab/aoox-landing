import type { Metadata } from "next"

import "./globals.css"
import { fontMono, fontSans } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { NotFoundContent } from "@/components/not-found-content"
import { ICONS, SITE_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

// Global 404 — `output: "export"` turns this into a plain `404.html` at the
// site root, which GitHub Pages serves for any unmatched path under
// aoox.dev. It sits outside the (id)/(en) route groups, so (per "Multiple
// root layouts" in the Next.js docs) it needs its own <html>/<body> — there
// is no ambient root layout to fall back on since neither group's layout
// applies to an entirely unmatched URL.
//
// Static metadata cannot depend on the path, so the title is bilingual. The
// visible text is chosen on the client by `NotFoundContent` (English for
// /en URLs, Indonesian otherwise).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page not found · Halaman tidak ditemukan · aoox",
  robots: { index: false, follow: false },
  icons: ICONS,
}

export default function NotFound() {
  return (
    <html lang="id" className={cn("antialiased", fontSans.variable, fontMono.variable)}>
      <body>
        <ThemeProvider>
          <NotFoundContent />
        </ThemeProvider>
      </body>
    </html>
  )
}
