# Releasing

Unlike `aoox-api`/`aoox-web`/`aoox-cli`, this site has no versioned artifact people install or
pin to — it's a live website. [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
deploys to GitHub Pages automatically on every push to `main`. There is no separate release step
to publish it.

`package.json`'s `version` and [CHANGELOG.md](CHANGELOG.md) are still kept, purely as a record of
what changed and when — see the [Versioning](README.md#versioning) note in the README. Bumping the
version does **not** trigger a deploy; merging to `main` does.

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
