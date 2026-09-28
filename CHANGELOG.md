# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Versions below 1.0.0 may include breaking changes in a minor release.

## [Unreleased]

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

[Unreleased]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.3...HEAD
[0.1.0-alpha.3]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.2...v0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.1...v0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.0...v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/hideandseeklab/aoox-landing/releases/tag/v0.1.0-alpha.0
