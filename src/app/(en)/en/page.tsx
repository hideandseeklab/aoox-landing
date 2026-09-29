import type { Metadata } from "next"

import { JsonLd } from "@/components/json-ld"
import { LandingPage } from "@/components/landing-page"
import { homeJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en",
  lang: "en",
  title: "aoox — self-hosted PaaS for deploying from Git",
  description:
    "aoox is a self-hosted PaaS on top of Docker: deploy applications straight from Git, managed databases, automatic domains, and monitoring in one dashboard — a Heroku/Vercel alternative that runs on your own server.",
  titleIsFinal: true,
})

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd("en")} />
      <LandingPage lang="en" />
    </>
  )
}
