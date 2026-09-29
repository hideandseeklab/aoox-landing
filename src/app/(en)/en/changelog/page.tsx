import type { Metadata } from "next"

import { ChangelogPage } from "@/components/changelog-page"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en/changelog",
  lang: "en",
  title: "Changelog — what changed in aoox, release by release",
  description:
    "aoox release history (panel, CLI, docs): new features, changes, and fixes in every alpha version, with links to the release and each repo's full CHANGELOG.",
  titleIsFinal: true,
})

export default function Page() {
  return <ChangelogPage lang="en" />
}
