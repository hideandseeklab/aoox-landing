import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { RedirectStub, legacyEnDocTarget, redirectMetadata } from "@/components/redirect-stub"
import { EN_DOC_SLUGS, LEGACY_EN_DOCS } from "@/lib/doc-slugs"

// Old `/en/docs/<slug>` URLs: every English slug (the site moved to the
// root) and the older English URLs that still carried an Indonesian slug.
export const dynamicParams = false

export function generateStaticParams() {
  return [...EN_DOC_SLUGS, ...LEGACY_EN_DOCS.map((e) => e.from)].map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = legacyEnDocTarget(slug)
  return entry ? redirectMetadata(entry.target) : {}
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = legacyEnDocTarget(slug)
  if (!entry) notFound()
  return <RedirectStub {...entry} />
}
