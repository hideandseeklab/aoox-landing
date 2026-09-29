import { Inter, JetBrains_Mono } from "next/font/google"

// Shared between the (id) and (en) root layouts (see "Multiple root layouts"
// in the Next.js App Router docs) so both languages load the exact same
// font instances instead of subsetting twice.
export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})
