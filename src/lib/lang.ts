/**
 * Two languages: `id` (default, `/` and `/docs/*`) and `en` (`/en` and
 * `/en/docs/*`). Every doc page under `/docs/*` has a mirror at `/en/docs/*`
 * with the same slug — see `docsNavFor`/`getDocNeighbors` in `docs-nav.ts`.
 */
export type Lang = "id" | "en"
