# Releasing

Unlike `aoox-api`/`aoox-web`/`aoox-cli`, this site has no versioned artifact people install or
pin to — it's a live website. [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
deploys to GitHub Pages automatically on every push to `main`. There is no separate release step
to publish it.

`package.json`'s `version` and [CHANGELOG.md](CHANGELOG.md) are still kept, purely as a record of
what changed and when — see the [Versioning](README.md#versioning) note in the README. Bumping the
version does **not** trigger a deploy; merging to `main` does.

## Product changelog page and the homepage version badge

The site's `/changelog` and `/en/changelog` pages and the version badge on both homepages are
generated from one typed file, [src/content/changelog.ts](src/content/changelog.ts) — the
**product-level** changelog for the whole aoox release (panel API + dashboard, CLI, docs), not a copy
of the per-repo CHANGELOG.md files. `RELEASES[0]` is the current release and is what the badge shows.
On every aoox release (i.e. whenever the four repos get a new `v0.1.0-alpha.N` tag):

1. Add a new entry **at the top** of `RELEASES` in `src/content/changelog.ts`: version, date (same as
   the CHANGELOG header), and 5–12 user-facing highlights in both Indonesian and English (summarize
   across the four repos; `[Unreleased]` items belong to the *next* release — never list them early).
2. Do this **before** `npm version` (below), then run the reminder script:
   ```bash
   npm run check-release                       # package.json version must equal the newest entry
   npm run check-release -- 0.1.0-alpha.4      # or check the version you are about to release
   ```
   It only compares versions and prints a message; it is deliberately **not** part of `build` or CI so it
   can't block a deploy between a feature commit and `npm version`.

## Checklist for a CHANGELOG entry

1. Move the `## [Unreleased]` entries in [CHANGELOG.md](CHANGELOG.md) into a new version section
   (e.g. `## [0.1.0-alpha.1] - 2026-10-01`), and add the compare/tag links at the bottom of the file.
2. Bump, tag, and push — all in one command:
   ```bash
   npm version 0.1.0-alpha.1
   ```
   This updates `package.json`, commits it, creates the git tag, and (via `postversion`) pushes the
   commit and the tag. The push to `main` (not the tag) is what deploys the site.

   First release only: `postversion` only runs on a *version change*, so this repo's first tag
   (`v0.1.0-alpha.0`) was cut manually with `git tag v0.1.0-alpha.0 && git push --follow-tags`.
