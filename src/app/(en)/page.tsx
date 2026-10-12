import type { Metadata } from "next"

import { JsonLd } from "@/components/json-ld"
import { LandingPage } from "@/components/landing-page"
import { homeJsonLd, pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/",
  lang: "en",
  title: "aoox — Self-hosted PaaS to deploy your apps",
  description:
    "aoox is a self-hosted PaaS on top of Docker: deploy applications straight from Git, managed databases, automatic domains, and monitoring in one dashboard — a Heroku/Vercel alternative that runs on your own server.",
  titleIsFinal: true,
})

// Old Indonesian landing URLs (`/#fitur`, `/#cara-kerja`, `/#tim`) now land on
// the English page; this maps those hashes to the English section ids.
const LEGACY_HASH_SCRIPT =
  '(function(){var m={"fitur":"features","cara-kerja":"how-it-works","tim":"team"},h=location.hash.slice(1);if(m[h])location.replace("#"+m[h])})()'

export default function Page() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: LEGACY_HASH_SCRIPT }} />
      <JsonLd data={homeJsonLd("en")} />
      <LandingPage lang="en" />
    </>
  )
}
