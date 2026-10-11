/**
 * Two languages: `id` (default, `/` and `/docs/*`) and `en` (`/en` and
 * `/en/docs/*`). Every doc page under `/docs/*` has an English counterpart
 * under `/en/docs/*`, but the slugs can differ — the pairing lives in
 * `doc-slugs.ts`; see also `docsNavFor`/`getDocNeighbors` in `docs-nav.ts`.
 */
export type Lang = "id" | "en"
