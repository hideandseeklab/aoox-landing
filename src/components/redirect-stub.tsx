import type { Metadata } from "next"
import Link from "next/link"

import { EN_DOC_SLUGS, LEGACY_EN_DOCS } from "@/lib/doc-slugs"

/**
 * Where an old URL now lives. `anchors` maps old heading/section ids to the
 * new ones (only needed where an id was renamed; unknown ids pass through).
 */
export type RedirectTarget = { target: string; anchors?: Record<string, string> }

/** Old `/en/docs/<slug>` URL -> its target, or `null` when `slug` never existed. */
export function legacyEnDocTarget(slug: string): RedirectTarget | null {
  if (EN_DOC_SLUGS.includes(slug)) return { target: `/docs/${slug}` }
  const old = LEGACY_EN_DOCS.find((e) => e.from === slug)
  return old ? { target: `/docs/${old.to}`, anchors: old.anchors } : null
}

/** Metadata for a redirect stub: not indexable, canonical points at the new URL. */
export function redirectMetadata(target: string): Metadata {
  return {
    title: "Redirecting…",
    robots: { index: false, follow: true },
    alternates: { canonical: target },
  }
}

/**
 * Static redirect page kept at an old URL (GitHub Pages has no server-side
 * redirects). Three layers, in order of speed: an inline script that
 * preserves the hash fragment (mapping renamed ids to their new names), a
 * `<meta http-equiv="refresh">` for clients without JavaScript, and a
 * visible link.
 */
function RedirectStub({ target, anchors = {} }: RedirectTarget) {
  const script =
    "(function(){var m=" +
    JSON.stringify(anchors) +
    ",h=location.hash.slice(1);location.replace(" +
    JSON.stringify(target) +
    '+(h?"#"+(m[h]||h):""))})()'

  return (
    <article className="flex flex-col gap-3 p-6">
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <script dangerouslySetInnerHTML={{ __html: script.replace(/</g, "\u003c") }} />
      <h1 className="text-2xl font-semibold">This page has moved</h1>
      <p className="text-sm text-muted-foreground">
        Redirecting to{" "}
        <Link href={target} className="text-foreground underline underline-offset-4">
          {target}
        </Link>
        …
      </p>
    </article>
  )
}

export { RedirectStub }
