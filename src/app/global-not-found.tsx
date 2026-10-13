import type { Metadata } from "next"

import "./globals.css"
import { fontMono, fontSans } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { NotFoundContent } from "@/components/not-found-content"
import { ICONS, SITE_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

// Global 404 — `output: "export"` turns this into a plain `404.html` at the
// site root, which GitHub Pages serves for any unmatched path under
// aoox.dev. The app has several root layouts ((en), (id), (legacy)), so per
// "global-not-found.js" in the Next.js docs (`experimental.globalNotFound`)
// this file bypasses every layout and renders the whole document itself:
// it imports the global styles and fonts and mounts the theme provider.
//
// Static metadata cannot depend on the path, so the title is bilingual. The
// visible text is chosen on the client by `NotFoundContent` (Indonesian for
// /id URLs, English otherwise).
//
// `suppressHydrationWarning` on <html> is required by next-themes (as in the
// (en)/(id) root layouts): its inline script sets the theme class and
// `color-scheme` on <html> before React hydrates.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Page not found · Halaman tidak ditemukan · aoox",
  robots: { index: false, follow: false },
  icons: ICONS,
}

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>
          <NotFoundContent />
        </ThemeProvider>
      </body>
    </html>
  )
}
