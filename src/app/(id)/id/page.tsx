import type { Metadata } from "next"

import { JsonLd } from "@/components/json-ld"
import { LandingPage } from "@/components/landing-page"
import { homeJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/id",
  lang: "id",
  title: "aoox — Self-hosted PaaS untuk deploy aplikasi Anda",
  description:
    "aoox adalah PaaS self-hosted di atas Docker: deploy aplikasi langsung dari Git, database terkelola, domain otomatis, dan monitoring dalam satu dashboard — alternatif Heroku/Vercel yang jalan di server sendiri.",
  titleIsFinal: true,
})

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd("id")} />
      <LandingPage lang="id" />
    </>
  )
}
