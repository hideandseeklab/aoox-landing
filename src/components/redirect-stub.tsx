import type { Metadata } from "next"
import Link from "next/link"

import { LEGACY_EN_DOCS } from "@/lib/doc-slugs"

function entryFor(from: string) {
  const entry = LEGACY_EN_DOCS.find((e) => e.from === from)
  if (!entry) throw new Error(`No legacy English docs redirect for "${from}"`)
  return { ...entry, target: `/en/docs/${entry.to}` }
}

/** Metadata for a redirect stub: not indexable, canonical points at the new URL. */
export function redirectMetadata(from: string): Metadata {
  const { target } = entryFor(from)
  return {
    title: "Redirecting…",
    robots: { index: false, follow: true },
    alternates: { canonical: target },
  }
}

/**
 * Static redirect page kept at an old English docs URL (GitHub Pages has no
 * server-side redirects). Three layers, in order of speed: an inline script
 * that preserves the hash fragment (mapping old Indonesian heading ids to the
 * new English ones), a `<meta http-equiv="refresh">` for clients without
 * JavaScript, and a visible link.
 */
function RedirectStub({ from }: { from: string }) {
  const { target, anchors } = entryFor(from)
  const script =
    "(function(){var m=" +
    JSON.stringify(anchors) +
    ",h=location.hash.slice(1);location.replace(" +
    JSON.stringify(target) +
    '+(h?"#"+(m[h]||h):""))})()'

  return (
    <article className="flex flex-col gap-3">
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
