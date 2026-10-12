/**
 * Two languages. English is the default and lives at the site root (`/`,
 * `/docs/*`, `/changelog`); Indonesian is a translation and lives under
 * `/id` (`/id`, `/id/docs/*`, `/id/changelog`). Every doc page has a
 * counterpart in the other language, but the slugs can differ — the pairing
 * lives in `doc-slugs.ts`; see also `docsNavFor`/`getDocNeighbors` in
 * `docs-nav.ts`.
 */
export type Lang = "en" | "id"

/** Path prefix of the Indonesian site. */
export const ID_PREFIX = "/id"

/** `/id` and `/id/...` are Indonesian; everything else is English (the default). */
export function langFromPathname(pathname: string): Lang {
  return pathname === ID_PREFIX || pathname.startsWith(`${ID_PREFIX}/`) ? "id" : "en"
}
