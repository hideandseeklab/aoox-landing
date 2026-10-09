import type { Metadata } from "next"

import { JsonLd } from "@/components/json-ld"
import { LandingPage } from "@/components/landing-page"
import { homeJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en",
  lang: "en",
  title: "aoox — Self-hosted PaaS to deploy your apps",
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
