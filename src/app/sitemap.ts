import type { MetadataRoute } from "next"
import { DOCS_FLAT, DOCS_FLAT_EN } from "@/lib/docs-nav"
import { langFromPathname } from "@/lib/lang"
import { otherLangPath, SITE_URL } from "@/lib/seo"

// Required for `output: "export"` — a dynamic sitemap route has no server to
// render it on demand, so it must be resolvable entirely at build time.
export const dynamic = "force-static"

/**
 * Every EN + ID page, derived from `docs-nav.ts` (the same single source of
 * truth the docs sidebar and metadata use) plus the two homepages and the two changelog pages — never
 * hand-maintained, so a new doc page only needs adding there to also show up
 * here. `install.sh`/`install-cli.sh` in `public/` are scripts, not pages,
 * and are intentionally left out (see `robots.ts`), as are the redirect stubs
 * for old URLs (see `doc-slugs.ts`).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = [
    "/",
    "/id",
    "/changelog",
    "/id/changelog",
    ...DOCS_FLAT_EN.map((doc) => doc.href),
    ...DOCS_FLAT.map((doc) => doc.href),
  ]

  return paths.map((path) => {
    const lang = langFromPathname(path)
    const sibling = otherLangPath(path, lang)
    // Fail the build if a nav entry has no counterpart in `doc-slugs.ts`.
    if (!sibling) throw new Error(`No paired page for ${path} — add it to src/lib/doc-slugs.ts`)
    if (!paths.includes(sibling)) throw new Error(`${path} pairs with ${sibling}, which is not in the docs nav`)
    const idPath = lang === "id" ? path : sibling
    const enPath = lang === "en" ? path : sibling

    const languages: Record<string, string> = {}
    if (enPath) languages.en = `${SITE_URL}${enPath}`
    if (idPath) languages.id = `${SITE_URL}${idPath}`
    if (enPath) languages["x-default"] = `${SITE_URL}${enPath}`

    return {
      url: `${SITE_URL}${path}`,
      lastModified,
      alternates: { languages },
    }
  })
}
