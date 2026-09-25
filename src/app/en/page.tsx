import type { Metadata } from "next"

import { LandingPage } from "@/components/landing-page"

export const metadata: Metadata = {
  title: "aoox — self-hosted PaaS",
  description:
    "Deploy applications from Git to your own server. Build, database, domain, and logs in one dashboard on top of Docker.",
}

export default function Page() {
  // The root layout renders <html lang="id">; this wrapper is the
  // server-rendered signal that this subtree is English (docs stay
  // Indonesian-only, so only the landing page has an /en route).
  return (
    <div lang="en">
      <LandingPage lang="en" />
    </div>
  )
}
