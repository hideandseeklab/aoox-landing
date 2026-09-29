# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Versions below 1.0.0 may include breaking changes in a minor release.

## [Unreleased]

### Fixed

- **Favicon missing on aoox.dev.** Since the SEO work split the root layout into the `(id)`/`(en)` route groups,
  no page rendered a `<link rel="icon">` (only `apple-touch-icon`): the `app/icon.svg` file convention only reaches
  pages under the layout in the same folder, and this site has no root `app/layout.tsx` any more; there was no
  `favicon.ico` fallback either, so browsers found nothing. Both layouts and `not-found.tsx` now declare the icons
  explicitly from one shared `ICONS` constant in `src/lib/seo.ts`, pointing at plain files in `public/` (static files
  with an extension are served with the right MIME type by GitHub Pages, and do not depend on the file convention):
  `/favicon.ico` (16/32/48 px, generated from the same `$` mark by a one-off script, no new dependency) with
  `sizes="48x48"` first, then `/icon.svg`, then the existing `apple-touch-icon.png`. `icon.svg` moved from
  `src/app/` to `public/` (same file). Checked across every built page (60, including `404.html`).

## [0.1.0-alpha.4] - 2026-09-29

### Added

- **Changelog page and version badge** (ID + EN): `/changelog` and `/en/changelog` list the aoox product releases (newest first, "Latest" + "alpha" labels, Added/Changed/Fixed highlights in both languages, links to the GitHub
  release and each repo's CHANGELOG at that tag), built from a single typed source `src/content/changelog.ts`. Both
  homepages get a version pill (`v0.1.0-alpha.4` at this release) in the hero (read from that same file's newest entry, not hard-coded) and a
  "Changelog" button next to the existing CTAs; "Changelog" also joins the header nav (desktop + mobile) and the footer.
  `otherLangPath()` maps `/changelog` ⇄ `/en/changelog` so hreflang/canonical/OG and the language switcher work, and both
  pages are in the sitemap (58 URLs). New `scripts/check-release.mjs` (`npm run check-release [-- <version>]`) compares
  `package.json`'s version with the newest changelog entry — a manual pre-release reminder, deliberately not wired into
  `build`/CI; documented in RELEASING.md and README.
- **SEO overhaul** — the site had no sitemap/robots, no per-page description, no canonical/hreflang,
  no Open Graph/Twitter/JSON-LD, and every page (including `/en/**`) rendered `<html lang="id">`.
  - `src/app/sitemap.ts`/`src/app/robots.ts` (`force-static`, required for `output: "export"`):
    the sitemap lists every ID+EN page (56 at the time; 58 with the changelog pages) with per-URL `alternates.languages`, generated from
    `docs-nav.ts` rather than hand-maintained; `robots.txt` allows everything except
    `install.sh`/`install-cli.sh` (installer scripts, not pages) and points at the sitemap.
  - New `src/lib/seo.ts`: `pageMetadata()` builds each page's description, canonical, reciprocal
    hreflang (`id`/`en`/`x-default` — only emitted for languages that actually have the page,
    via `otherLangPath()`, moved here from `site-header.tsx`'s language switcher so the URL
    mapping has one source of truth), and Open Graph/Twitter card data from one call. Every ID +
    EN doc page (52 files) and both homepages now call it with a unique ~110–160-character
    description instead of a bare `{ title }`; the two `/docs`/`/en/docs` index pages, which
    previously had no `metadata` export at all, now have one too.
  - **`<html lang>` per language**: split the single root layout into two — `src/app/(id)/layout.tsx`
    (`lang="id"`) and `src/app/(en)/layout.tsx` (`lang="en"`) — using Next's "Multiple root
    layouts" route-group pattern, and moved `/`+`/docs/**` under `(id)` and `/en`+`/en/docs/**`
    under `(en)`. Previously *every* page served `lang="id"`, including all of `/en/**`; the EN
    homepage's old `<div lang="en">` client-side wrapper (which never reached `/en/docs/**` at
    all) is removed, since the real `<html lang="en">` now covers the whole `/en` subtree
    server-side. `metadataBase` (`https://aoox.dev`) now lives on these two layouts.
  - Open Graph + Twitter: every page gets `openGraph`/`twitter` metadata with a shared 1200×630
    `public/og.png` and a 180×180 `public/apple-touch-icon.png` — both static files, referenced
    via `icons.apple` and `pageMetadata()`'s `images`. Both started out generated at build time
    via `next/og`'s `ImageResponse` (`opengraph-image.tsx`/`apple-icon.tsx`, no extra dependency),
    but GitHub Pages serves those extensionless generated routes as
    `Content-Type: application/octet-stream`, which some social crawlers (WhatsApp, Twitter,
    Facebook) reject outright — confirmed live on aoox.dev before switching. A static file with a
    real extension is served with the correct MIME type instead, so both routes are now removed
    in favor of the two `public/` files (the touch icon regenerated from `icon.svg` via a one-off
    `next/og` script, same visual mark; the OG image is the real designed graphic).
  - JSON-LD on both homepages (`src/components/json-ld.tsx` + `homeJsonLd()` in `seo.ts`):
    `SoftwareApplication`, `Organization`, and `WebSite` under one `@graph`, `<` escaped in the
    serialized JSON so a description containing a stray tag-like string can't break out of the
    `<script>` element. Only verifiable facts (no invented ratings/reviews/pricing beyond "free
    and open source").
  - `src/app/not-found.tsx`: a real 404 page (`robots: noindex`, links back to the homepage and
    docs) — `output: "export"` turns this into `out/404.html`, which GitHub Pages serves for any
    unmatched path under aoox.dev. It sits outside the (id)/(en) groups and needed since neither
    group's root layout applies to a URL that doesn't match any route.
  - README gets a new "SEO" section explaining how to add a docs page while keeping it in the
    sitemap and correctly cross-linked (single source of truth: `docs-nav.ts` + `pageMetadata()`).
- `public/install-cli.sh`: standalone installer for the `aoox` CLI itself (distinct from
  `install.sh`, which installs the panel) — `curl -fsSL https://aoox.dev/install-cli.sh | sh`
  downloads a prebuilt tarball with its own bundled Node.js runtime from aoox-cli's GitHub
  Releases (built by its new `release-tarballs.yml` workflow) and installs it with no Node.js on
  the target machine at all. Detects OS/arch (Linux/macOS, x64/arm64) and musl libc (e.g. Alpine,
  which the bundled binary can't run on) with a clear error pointing at the npm install instead;
  verifies a SHA-256 checksum before extracting; installs to `/usr/local/lib/aoox` +
  `/usr/local/bin/aoox` when root or passwordless `sudo` is available, otherwise
  `~/.local/lib/aoox` + `~/.local/bin` with a PATH warning (a `curl | sh` pipe can't safely relay
  an interactive sudo password prompt, so it never tries one); re-running it upgrades in place.
  Resolves the latest release — prereleases included, since aoox hasn't had a stable one yet — via
  the GitHub API, or an explicit `AOOX_VERSION` to skip that call entirely. Tested for real in
  clean `ubuntu`/`debian` containers with no Node.js installed: first install and upgrade
  (`.tar.xz` and the `.tar.gz` fallback when `xz` is missing), non-root without passwordless sudo
  falling back to `~/.local`, a corrupted checksum refusing to install, and an `alpine` container
  correctly rejected with the musl message. CLI docs (ID + EN) now lead with this script for
  Linux/macOS, keeping npm documented for Windows, Alpine, or anyone who already has Node.js
  (corrected to the actual **Node.js 22+** requirement — a "20+" typo from the same change).
- **Docs for `aoox reinstall`** (ID + EN): new "Memperbaiki instalasi / Repairing an install" section on the CLI page
  (what it backs up, rewrites, merges, and never touches, flags, idempotency, warning against `aoox install --force`,
  no-CLI alternative), a row in the command table, a new troubleshooting entry ("fixes/new features don't show up after
  a panel update") plus the existing `TERMINAL_SSH_USER is not set` row now pointing to it, and the installation
  page's update note now names the `aoox update` limitation and recommends `aoox reinstall`.

### Changed

- Installation doc (ID + EN), "Memperbarui versi": the "Update tersedia" button in the sidebar — owner
  only, checked by the server from Docker Hub (after boot, then every few hours), silent without
  internet, only for installs following `:latest`.
- Installation doc (ID + EN) "Upgrading"/"Memperbarui versi" section gets a new paragraph describing
  what actually happens after clicking "Terapkan update"/"Apply update" on the dashboard: the confirm
  dialog, the "Sedang memperbarui"/"Applying" mode with disabled buttons, automatic polling and page
  reload once the panel is back on the new version, a connection drop during the restart being
  expected rather than an error, and the 5-minute manual-recovery fallback.
- Installation doc (ID + EN): the callout next to `aoox install` now also notes that `aoox install`
  needs the CLI itself already installed on the target server, unlike `install.sh` (which needs
  only `curl`/`sh`), and links to the CLI doc's Node.js-free install script
  (`curl -fsSL https://aoox.dev/install-cli.sh | sh`) for installing the CLI itself.
- Application doc (ID + EN), Settings row: Port host, domains and resource limits now apply directly to a
  running application (container recreated from the same image, no build; brief downtime with a host
  port), a stopped app picks its new port up when started, a host port change is refused (409) while a
  deployment is active, and everything else still waits for the next deploy.
- Terminal doc and troubleshooting (ID + EN): `TERMINAL_SSH_USER` left empty now falls back to
  `root` instead of failing, so the "is not set" row was dropped from the terminal doc and reframed in
  troubleshooting as an older-versions error (cause: pre-default installs; fix: update, or set it in
  Environment). The terminal doc also mentions the link to Environment shown on connection errors.
- Build docs (ID + EN): the static-site section now notes that the create form pre-fills Container port 80.

## [0.1.0-alpha.3] - 2026-09-28

### Added

- Registry doc (ID + EN) gets a new **"Hapus image"/"Delete image"** bullet under "Browsing &
  cleaning up contents" explaining the difference from deleting a single tag — it removes the whole
  repository (every tag/manifest, its storage folder, then an automatic garbage collect) — and why
  it's needed for a repository stuck showing "0 tags" that garbage collect alone never clears
  (garbage collect only reclaims unused blobs, never the repository's own folder). A matching row is
  added to the "Common pitfalls" table for that exact "0 tags won't go away" symptom.
- Application doc (ID + EN) gets a new **Console** row in the tabs table and a "Console" section:
  what it is (`docker exec -it` into the running container, distinct from the host-level Terminal
  page), access (project developer+, audit-logged), the swarm task picker, bash-vs-sh shell selection
  with a note on distroless/shell-less images, and that file changes made through it don't survive a
  redeploy unless they're on a mounted volume.
- Notifications doc (ID + EN) gets a new "Application error" event row (off by default, log-pattern
  detection + cooldown explained) and an `app.error` webhook payload example. Application doc (ID +
  EN) gets a new "Log error detection"/"Deteksi error di log" section explaining the per-app "Ignore
  error logs" switch.
- Managed database doc (ID + EN) gets a new engine row for **Valkey** (drop-in Redis, same
  `redis://` URL/CLI/backup path) and a new "PostgreSQL variants" section covering pgvector,
  PostGIS, and TimescaleDB — verified image/tag table, what stays identical to plain Postgres
  (protocol, backups, env references), and that switching engine/variant after creation isn't
  supported yet.
- Notifications doc (ID + EN) gets a new **"DNS domain bermasalah"/"DNS domain issue"** event row
  (checked every 15 minutes, fires after two consecutive failed checks, capped at once a day per
  domain) — the toggle already existed in the dashboard and API, it just wasn't documented; the
  event-count summary and the intro line are updated from 9 to 10 toggles, and a "Domain & TLS" link
  is added to Next steps.
- Managed database doc (ID + EN) gets a new engine row for **MongoDB** and two callouts: one
  explaining that Mongo creates databases lazily so aoox writes a placeholder document right after
  provisioning (so the primary database shows up immediately instead of only after the app's first
  write), and an updated "Not available yet" callout listing the query box's current find()-only,
  read-only limitation and that extended-JSON operators like `{"$oid":"..."}` aren't specially
  interpreted in filters yet.

### Changed

- Site font switched from Geist to **Inter** for both body text and headings (`layout.tsx`'s
  `--font-sans`, and `globals.css`'s `--font-heading` now points at it too). Code blocks and inline
  `<code>` keep JetBrains Mono unchanged.
- Headings now carry tight letter-spacing (helipod.io-style), scaled to size: the hero title gets
  a `-0.05em` "display" tier (`tracking-tighter`), other `h1`/`h2` (section headings, docs page
  titles) get `-0.03em`, and `h3` (feature card titles) gets `-0.015em`. Rules live centrally in
  `globals.css` as low-specificity element selectors, so a `tracking-*` utility on one element can
  still override them; redundant `tracking-tight` classes on individual headings were removed in
  favor of this. Body text, buttons, labels, and badges are untouched, and any `.font-mono` element
  is explicitly reset to normal tracking.

## [0.1.0-alpha.2] - 2026-09-27

### Added

- `install.sh` now defaults `TERMINAL_SSH_USER` to `root` in the generated `.env.dist` (override by
  piping `TERMINAL_SSH_USER=<user>` like the other env vars), instead of leaving it blank — the
  script itself already requires root, so the web terminal is ready to use against the host right
  after install (still needs the one-time authorize command from Settings → Terminal).
- Creating an application doc (ID + EN) now covers the new Akses/Access step in the New Application
  dialog (IP+port / Domain / set up later), and troubleshooting gets a matching entry for "deploy
  succeeded but the app isn't reachable" pointing at the missing host port/domain.
- Installation doc (ID + EN) now documents that `aoox update` / the "Terapkan update"/"Apply update"
  button only `pull`s and restarts the existing `docker-compose.dist.yml` on the server — it never
  rewrites that file, so a release that adds a new compose variable needs a manual edit to
  `docker-compose.dist.yml` in `INSTALL_DIR` before the update actually takes effect.
- Webhook doc (ID + EN) gets a curl-based ping test (no need to wait on GitHub/GitLab), a dedicated
  "Redeliver" section with full click-by-click steps for GitHub (Settings → Webhooks → Recent
  Deliveries → Redeliver → check the Response tab) and GitLab (Recent events → Resend request, or
  Test → Push events) — called out as the step that actually resolves most webhook issues, since
  neither provider resends automatically after a fix and the "Last delivery was not successful"
  status only clears once a new delivery is attempted — plus three more common-pitfalls rows found
  testing a real GitHub webhook against a VPS: the Webhook tab showing `localhost:3001` after a
  domain was set (with the manual `docker-compose.dist.yml` fix for older installs), GitHub's
  `Invalid HTTP Response: 404` from pointing the Payload URL at the dashboard domain instead of the
  API domain, and telling apart Traefik's plain-text 404 from the API's JSON 404.

### Fixed

- Installation doc and landing sections now show `curl -fsSL https://aoox.dev/install.sh | sudo sh`
  (was missing `sudo`) with a callout explaining the script needs root to install Docker and write
  to `/opt/aoox` — otherwise it fails with `must be run as root`.
- Domain for the panel doc corrected: Compose does **not** auto-include `docker-compose.override.yml`
  when the base file is named explicitly (`-f docker-compose.dist.yml`) — only when it's the
  implicit default `docker-compose.yml`. Also documents that the reverse proxy is now
  auto-provisioned when saving the panel domain, and adds a pitfall entry (in both the panel-domain
  and troubleshooting pages, ID + EN) for "DNS and `ufw` look fine but the domain is still
  unreachable" pointing at the VPS provider's own firewall/security group — found testing this
  exact scenario on a real VPS.

## [0.1.0-alpha.1] - 2026-09-26

### Added

- One-line installer: `curl -fsSL https://aoox.dev/install.sh | sh` (`public/install.sh`) sets up
  the panel on a fresh Linux VPS — installs Docker if missing, generates secrets, and starts the
  stack, configurable via env vars (`WEB_DOMAIN`/`API_DOMAIN`/`ACME_EMAIL`, `ADMIN_EMAIL`/
  `ADMIN_PASSWORD`/`ADMIN_NAME`). Mirrors `aoox install` in aoox-cli but needs no Node.js to run.
  Featured on the landing page's self-host section and CTA, and as the primary path in the
  Installation doc.
- English translation of every documentation page (`/en/docs/*`, mirroring `/docs/*` 1:1) — the
  language switcher now works on docs pages too, not just the landing page.
- New "Domain panel" doc content covering the dashboard/CLI way to set a custom domain for the
  panel itself (`aoox domain set`), alongside the existing manual `docker-compose.domain.yml` steps.
- CLI docs updated for the published `@hideandseeklab/aoox` npm package and the new `aoox domain
  set` command.
- Registry doc updated with a "Custom domain" section covering the new Traefik-routed registry
  domain feature (dashboard field + `aoox registry domain` CLI command).
- Installation and CLI docs updated with the new "Update aoox" feature (Settings button and
  `aoox update` command) as the primary upgrade path, manual SSH steps kept as an alternative.
- Registry doc updated with a note on the optional S3 storage backend for the self-hosted registry.
- CI (`.github/workflows/ci.yml`): typecheck + lint + build on every pull request and push to
  `main` — previously the only workflow ran on push to `main` for deploy (`deploy-pages.yml`),
  with no check at all on pull requests.

### Fixed

- Landing page's "Multi-node with Swarm" feature card linked to the wrong doc page (`/docs/deploy`
  instead of `/docs/swarm`).
- "Monitoring & notifications" feature card text omitted webhook as a notification channel.
- `npm run lint` failed immediately on every file (`contextOrFilename.getFilename is not a
  function`) because `eslint@10` removed the legacy `context.getFilename()` API that
  `eslint-plugin-react` (bundled by `eslint-config-next`) still relied on — no version of
  `eslint-plugin-react` supports ESLint 10 yet. Pinned `eslint` back to the latest 9.x
  (`^9.39.0`) and bumped `eslint-config-next` to `16.3.6`. Also fixed the ~300 pre-existing
  `react/no-unescaped-entities` errors and a handful of unused-import warnings this uncovered,
  since lint had never actually run to completion before.
- The `react/no-unescaped-entities` autofix above corrupted `{" "}` whitespace expressions and a
  few JSX attribute values in 4 of the newly-added `/en/docs/*` pages (turned working code like
  `{" "}` into invalid `{&quot; &quot;}`), breaking the TypeScript build. Repaired by hand and
  re-verified with a full `tsc`/`next build` pass.

## [0.1.0-alpha.0] - 2026-09-25

### Added

- Initial public alpha release: marketing site and documentation for aoox (Next.js, Tailwind CSS).
- Landing page (Indonesian + English) covering features, self-host quickstart, and FAQ.
- Documentation pages: installation, creating an application, managed databases, compose,
  previews, registry, webhooks, user roles, the CLI, and troubleshooting.
- Static export + automatic deploy to GitHub Pages on every push to `main`.

[Unreleased]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.4...HEAD
[0.1.0-alpha.4]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.3...v0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.2...v0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.1...v0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.0...v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/hideandseeklab/aoox-landing/releases/tag/v0.1.0-alpha.0
