# aoox-landing

Marketing site and documentation for [aoox](https://github.com/hideandseeklab/aoox-api), a
self-hosted PaaS. Built with Next.js and Tailwind CSS.

Website: [aoox.dev](https://aoox.dev) · Docs: [aoox.dev/docs](https://aoox.dev/docs) · Changelog: [aoox.dev/changelog](https://aoox.dev/changelog)

Related repos: [aoox-api](https://github.com/hideandseeklab/aoox-api) (backend) ·
[aoox-web](https://github.com/hideandseeklab/aoox-web) (dashboard) ·
[aoox-cli](https://github.com/hideandseeklab/aoox-cli) (CLI).

## Development

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

- `npm run dev` — dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — eslint
- `npm run typecheck` — `tsc --noEmit`

## SEO

Every ID + EN page is derived from `src/lib/docs-nav.ts` (`DOCS_NAV`/`DOCS_NAV_EN`) and
`src/lib/seo.ts` — that's the single place both `sitemap.ts` and each page's metadata pull
title/description/hreflang from, so a new doc page only needs adding in one spot to stay
correct everywhere else:

1. Add the file under `src/app/(id)/docs/<slug>/page.tsx` and its EN mirror at
   `src/app/(en)/en/docs/<slug>/page.tsx` (same slug, never translated — the ID⇄EN mapping in
   `otherLangPath()` in `src/lib/seo.ts` assumes this).
2. Add an entry with the same `href`/title/description to `DOCS_NAV` and `DOCS_NAV_EN` in
   `src/lib/docs-nav.ts` — this is what puts it in the sidebar, in `sitemap.ts`, and (via
   `getDocNeighbors`) into the prev/next links at the bottom of every doc page.
3. In the page itself, export metadata with the shared helper:
   ```tsx
   export const metadata: Metadata = pageMetadata({
     path: "/docs/<slug>",
     lang: "id", // or "en" in the EN file
     title: "…",
     description: "…", // ~110–160 characters, unique
   })
   ```
   This wires up `<meta name="description">`, the canonical link, reciprocal hreflang
   (`alternates.languages`, only emitted for languages that actually have the page — see
   `otherLangPath()`), and Open Graph/Twitter card data, all in one call. Leave `titleIsFinal`
   unset for a normal doc detail page — `docs/layout.tsx`'s `"%s — Docs aoox"` template applies
   automatically since the page sits one segment deeper than that layout. Only set
   `titleIsFinal: true` for a page in the *same* folder as the layout defining a title template
   (currently: both homepages, and the two `/docs`/`/en/docs` index pages) — see the comment on
   `PageSeoInput.titleIsFinal` in `src/lib/seo.ts` for why Next.js needs that nudge there.

The `<html lang>` attribute itself comes from wherever the page lives, not from anything in
`seo.ts`: `src/app/(id)/layout.tsx` (`lang="id"`) and `src/app/(en)/layout.tsx` (`lang="en"`)
are separate root layouts for the two route groups (Next's "Multiple root layouts" pattern) —
a new page automatically gets the right one from which group its folder sits under.

To sanity-check the whole site after a docs change, `npm run build` then inspect `out/`:
`out/sitemap.xml`/`out/robots.txt` for the URL list, and grep any `out/**/*.html` for
`<title>`/`<meta name="description">`/`<link rel="canonical">`/`hrefLang` to confirm nothing
came out empty or duplicated.

## Versioning

Versioned independently from `aoox-api`, `aoox-web`, and `aoox-cli` — see [CHANGELOG.md](CHANGELOG.md).

The public `/changelog` page and the homepage version badge read `src/content/changelog.ts` (the aoox
product release history). Add an entry there before each release and run `npm run check-release` — see
[RELEASING.md](RELEASING.md).

## License

[Apache 2.0](LICENSE)
