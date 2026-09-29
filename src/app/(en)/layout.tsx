import type { Metadata } from "next"

import "../globals.css"
import { fontMono, fontSans } from "../fonts"
import { ThemeProvider } from "@/components/theme-provider"
import { ICONS, SITE_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "aoox — self-hosted PaaS for deploying from Git",
    template: "%s · aoox",
  },
  description:
    "Deploy applications from Git to your own server. Build, database, domain, and logs in one dashboard on top of Docker — a self-hosted alternative to Heroku/Vercel.",
  // Plain files in public/ (see ICONS in seo.ts): GitHub Pages serves a static
  // file with an extension under the right MIME type, and unlike the
  // `app/icon.svg` convention they work under these route-group layouts.
  icons: ICONS,
}

// Root layout for every English-language route (`/en`, `/en/docs/**`) — see
// "Multiple root layouts" in the Next.js docs. The (id) group has its own
// sibling layout with lang="id"; each `<html>` is only ever rendered once
// per request since the two groups never share a route.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
