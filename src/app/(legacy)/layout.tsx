import type { Metadata } from "next"

import "../globals.css"
import { fontMono, fontSans } from "../fonts"
import { ICONS, SITE_URL } from "@/lib/seo"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Redirecting…",
  robots: { index: false, follow: true },
  icons: ICONS,
}

// Root layout for the redirect stubs kept at old URLs (`/en/**`, and the old
// Indonesian `/docs/<slug>` URLs whose slug no English page uses) — see
// `RedirectStub`. A separate root layout keeps them out of the language
// groups; they carry no navigation and are never indexed.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("antialiased", fontSans.variable, fontMono.variable)}>
      <body>{children}</body>
    </html>
  )
}
