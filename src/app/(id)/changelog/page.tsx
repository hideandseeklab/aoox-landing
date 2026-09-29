import type { Metadata } from "next"

import { ChangelogPage } from "@/components/changelog-page"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/changelog",
  lang: "id",
  title: "Changelog — perubahan aoox per rilis",
  description:
    "Riwayat rilis aoox (panel, CLI, dokumentasi): fitur baru, perubahan, dan perbaikan di setiap versi alpha, lengkap dengan tautan ke rilis dan CHANGELOG tiap repo.",
  titleIsFinal: true,
})

export default function Page() {
  return <ChangelogPage lang="id" />
}
