# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Versions below 1.0.0 may include breaking changes in a minor release.

## [Unreleased]

### Changed

- **Docs: image name and version from the project (English and Indonesian)**: the CLI page explains that `aoox registry build` / `push` without `name:version` take the name and version from `package.json`, `pyproject.toml`, `Cargo.toml`, `composer.json`, `pubspec.yaml`, a single `*.csproj`, `pom.xml`, a `VERSION` file or the git tag (in that order, the folder name as a last resort for the name), and ask `(Y/n/e)` before building unless `--yes` is passed.
- **Docs: removing the panel domain and the Compose version guard (English and Indonesian)**: the panel domain page has a new section (`#remove`, `#hapus-domain`) on **Remove domain** / `aoox domain clear` (what is reset, that the proxy and application domains stay, `INSTALL_DIR` and Docker requirements); the CLI page lists `aoox domain clear` and says `aoox reinstall` stops when the restrict-ports override needs a newer Docker Compose (2.24.4).
- **Docs: only allow access through the domain (English and Indonesian)**: the panel domain page has a new section for the opt-in switch (`--domain-only` in the CLI) that closes ports 3000/3001 to the outside, with the lock-out warning and the SSH recovery steps; Troubleshooting has a matching row; the CLI page lists the flag.
- **Docs: client IP behind a proxy (English and Indonesian)**: Troubleshooting has a new row for rate limits and the audit log seeing the proxy's address, explaining `TRUST_PROXY` and its trade-off.
- **Docs: CLI behind an antivirus or corporate proxy (English and Indonesian)**: a new section on the CLI page (`#antivirus`) explaining that the CLI now trusts the operating system certificate store on Node 22.19+ / 24.5+, the `AOOX_SYSTEM_CA=0` opt-out, `NODE_EXTRA_CA_CERTS`, `NODE_OPTIONS=--use-system-ca` for older Node, and that verification is never disabled.
- **Docs: CLI error examples (English and Indonesian)**: the CLI page shows error lines starting with the red `error` label instead of the old ❌ emoji.
- **Docs: job schedule switch (English and Indonesian)**: the Jobs page now calls the table switch **Schedule on**, says it only turns the automatic schedule off (Run still works), and that manual jobs show a dash instead.
- **Docs: revealing variables (English and Indonesian)**: the Variables page describes the per-row eye and copy buttons, **Reveal all** (secret-flagged values stay masked until their own eye button), **Edit** instead of "Reveal and edit", the 60-second auto-hide, and that one audit entry covers the environment for that window. The notes and secret-flag sections now say **Edit** and "reveal or copy".

## [0.1.0-alpha.11] - 2026-10-15

### Added

- **Docs: Local development (English and Indonesian)**: a new section on the CLI page (`#local-development`) for running an app on a laptop with `aoox run --set <slug> --env <name>` without `aoox link`: a narrow read-only token, the `package.json` script, why to always pass `--set`/`--env`, fail-closed behaviour, `aoox env pull`, when `aoox link` is needed, CI, and limits. The `aoox run` example in the env section now says it reproduces the deployed app. The Variables page's Secret variables section also says what the flag does not do (values are always encrypted; it only controls log masking), the `MONKEY`/`KEYBOARD` false positive, and when to turn it on or off.
- **Docs: variable notes (English and Indonesian)**: a Notes section on the Variables page (`#notes`, `#catatan`): the `#` lines directly above a variable are its note (a blank line breaks the link), notes are visible without revealing values so they must not hold secrets, and they travel with history, promote, `aoox env pull`/`push` and export. The CLI page's `aoox env set` row links to it.
- **Docs: leftover containers and domain conflicts (English and Indonesian)**: the Monitoring page's Docker section explains the leftover containers list in the disk Details dialog (what is listed, what never is, the per-row remove and the switch, volumes and remote servers not covered), and the Proxy & domain page describes the warning shown when another container already routes a domain.

### Changed

- **Docs: New database form (English and Indonesian)**: the Database page's create step now says the engine is picked from cards, lists **Plain** as the first PostgreSQL variant, and says a blank version uses the default of the chosen engine and variant (shown under the field).

### Fixed

- **Docs: deleting a project (English and Indonesian)**: the Project page no longer says containers are left running. It now describes that everything in the project is removed, the **Also delete data** option (what is kept or deleted for database, application, compose and stack volumes), the retry behaviour when Docker cannot be reached, and that deleting an application also removes its blue/green container.

## [0.1.0-alpha.10] - 2026-10-13

### Added

- **Docs: Variables (English and Indonesian)**: a new page `/docs/variables` (`/id/docs/variabel`) for variable sets: concepts and slugs, sharing with all or selected projects, who may reveal and edit (protected environments are instance owner/admin only), linking to applications and stacks and the merge order, `${{vars.KEY}}` (one level), history and restore, compare and promote, secret flags, API token `variableScopes` (`set/env`, `set/*`, `*/env`), export/import, and the upgrade note for 0.1.0-alpha.9 environments. Added to the docs sidebar, the core concepts table and the sitemap.

### Changed

- **Docs: project environments replaced by variable sets (English and Indonesian)**: the Environment variables page now describes the merge order with linked variable set environments and `${{vars.KEY}}`; its project environment, history, compare/promote and secret-flag sections moved to the Variables page. The Project page drops the per-project environments (a short Variables section and new export/import wording), and the Applications, Compose and Users & roles pages use variable sets, `${{vars.KEY}}` and the new token scope.
- **Docs: CLI reference for the new `aoox env` (English and Indonesian)**: `--set`/`--env` with their defaults, `env list`/`sets`, `diff`/`promote --from --to`, the new `env links`, `env link` and `env unlink`, and what `aoox run` passes (linked environments in order, then the own env; `${{vars.KEY}}` resolved, database and secret references left as written).

## [0.1.0-alpha.9] - 2026-10-13

### Added

- **Docs: Environment variables in the CLI (English and Indonesian)**: a new section on the CLI page for `aoox env list|pull|set|unset` and `aoox run` (examples, quoting rules, concurrent edits, roles, tokens in CI) and two rows in the command reference. The Environment and Project pages describe the linking rule (a protected environment needs a project admin to link to or from) and the token restriction to environments.
- **Docs: environment history, compare/promote and secret variables (English and Indonesian)**: the Environment page gains "History and restore" (who/when/names changed, Restore this version, 50 versions kept, same rights as editing), "Compare and promote" (key-level compare, Promote with confirmation, developers cannot touch production) and "Secret variables" (the Secret switch, the masking rule including unmarked variables and what not-secret means, migration of existing names). The CLI page documents `aoox env push|history|diff|promote`, `env set --secret/--no-secret`, `env pull --format dotenv|json|shell` and `--file -`, and `aoox run --file` with its precedence.
- **Troubleshooting (English and Indonesian):** a row for "Bad Gateway from a domain while the container runs" (Container port is not the port the app listens on) and the new EXPOSE warning with its one-click fix.

### Changed

- **Docs: environment corrections (English and Indonesian).** Where an application or stack is linked when no environment is chosen is now stated correctly everywhere (production for project admins, development for everyone else, 403 for a non-admin when the project has only production; the Indonesian Project page gained the protected-linking rule the English page already had). The log-masking rule is explained in full (Secret always masked, not secret never masked, unmarked masked by the 8-character heuristic, names that look secret marked automatically) on the Environment and Project pages. The CLI command tables list every flag of `aoox env *` and `aoox run` (`--project`, `--url`, `--token`, `--file`, `--json`), and the `set` row describes automatic secret marking. The Applications Environment row renders `${{project.KEY}}` as code, and a few stiff Indonesian phrases on the CLI page were reworded.
- **CLI docs (English and Indonesian):** `aoox registry build --push` (build and push in one step). The example error lines of `aoox registry build|push` start with ❌, as the CLI now prints.
- **404 page**: shows the dashboard's not-found illustration above the 404 label, title and buttons (light and dark), and no longer reports a hydration mismatch in development (the 404 now uses Next.js's `global-not-found` page, the documented way to do a 404 in an app with several root layouts, instead of a `not-found` file that rendered its own `<html>`; the static `404.html` is still produced).

## [0.1.0-alpha.8] - 2026-10-12

### Added

- **Docs: changing name and email** (Users & roles, English and Indonesian): the Edit profile dialog in Settings > Account (current password only for an email change, uniqueness and pending-invitation rules, API tokens cannot do it) and the owner's edit action in Settings > Team.

### Changed

- **Terminal docs (English and Indonesian)** name the renamed Infrastructure menu: Infrastructure > Terminal access (Akses terminal).
- **Docs follow the new Integrations sidebar group (English and Indonesian).** Git credentials, Notifications, Backup destinations, Secret manager, DNS providers and SSL certificates are no longer a tab under Settings; the docs now say Integrations > Git credentials, Notifications, Backup destinations, Secret manager, DNS providers or SSL certificates (Webhook, Notifications, Backup, Environment, Cloudflare DNS, Custom SSL certificates and Troubleshooting pages).
- **CLI docs (English and Indonesian): `aoox update` and `aoox registry build|push`.** `aoox update` now updates the CLI and `aoox update panel` the panel (all other pages that mentioned the panel update say `aoox update panel`); new sections for building and pushing images with the existence check and its errors, and for the connection block that plain `aoox` prints. npm installs no longer need the `@alpha` tag (`install-cli.sh` too).
- **CLI docs follow the new `aoox login`.** The English and Indonesian CLI pages now describe signing in with the dashboard address (the CLI finds the API address itself), the optional scheme and the `IP:3000` fallback, where to get the token and the copy-ready command in Settings → Account → API token, the new `config.json` shape, and the new error messages and version warning.

## [0.1.0-alpha.7] - 2026-10-12

### Added

- **Round favicon and new page titles.** The favicon (`icon.svg` and the 16/32/48 px `favicon.ico`) is now a dark circle with a transparent background, so it no longer shows as a dark square inside the round icon in search results; the Apple touch icon stays square. The home page titles are now "aoox — Self-hosted PaaS untuk deploy aplikasi Anda" (Indonesian) and "aoox — Self-hosted PaaS to deploy your apps" (English).
- **Docs: the Docker page** (Indonesian and English, on the Monitoring page): Infrastructure > Docker lists containers, images, volumes and networks of the host or a remote server; what aoox-owned items show and why they cannot be stopped or removed there; logs, start/stop/restart and remove for other containers, removing unused images.

- **Docs: proxy configuration** (new page in Indonesian and English, "Proxy configuration", in the Infrastructure group, linked from Proxy & domain): the Traefik dynamic-configuration editor (files stored in aoox and written to the proxy as `user-<name>.yml`, only the `http` section, unique names per proxy, Traefik errors roll the change back), the five presets (basic auth with a bcrypt hash only, security headers, rate limit, IP allowlist, www redirect), attaching middlewares per domain on the Domain tab (order, what a domain on HTTP/HTTPS gets, 409 while a domain uses a middleware), the one-time proxy recreation on a proxy from an older aoox, "Apply again" after a restore, and the limits (dynamic only, Traefik does not report every wrong value, remote servers untested).

- **Docs: Cloudflare DNS** (new page in English and Indonesian, "Cloudflare DNS", in the Infrastructure group): creating an API token (Zone:Zone:Read, Zone:DNS:Edit), adding and testing the connection in Settings > Integrations, the per-domain DNS record choice and the Proxied (orange cloud) switch and why it is off by default, what aoox creates and deletes (only its own records), warnings instead of failures and the sync button, the DNS-01 certificates card on the Reverse proxy page (ACME email needed, proxy recreated after confirmation, token visible to `docker inspect`), the certificate modes (HTTP-01, DNS-01, wildcard), the wildcard certificate for pull request previews, and the limits. The Proxy & domain, Custom SSL certificates and Preview pages point to it.
- **Docs: resource alerts and maintenance mode** (English and Indonesian): a "Resource alerts" section on the Monitoring page (CPU and memory rules for applications and databases, defaults, how the values are measured, reminders, when nothing is sent) and a "CPU or memory alert" row on the Notifications page; a "Maintenance mode" section on the Applications page (instant 503 page on all domains, message, what it does not cover) with a pointer from the Proxy & domain page.

### Changed

- **The site is now English-first.** English is served at the root (`/`, `/docs`, `/docs/<slug>`, `/changelog`) and Indonesian is a translation under `/id` (`/id`, `/id/docs`, `/id/docs/<slug>`, `/id/changelog`), instead of the other way round. The language toggle, hreflang alternates (`x-default` is now the English URL), canonical URLs, sitemap, navigation, footer and the Edit-on-GitHub links follow the new scheme; the 404 page and the copy button default to English and switch to Indonesian under `/id`. Old URLs keep working as static redirect pages (meta refresh plus a script that keeps the `#anchor`, `noindex`, left out of the sitemap): every `/en/**` URL redirects to the same path without `/en` (the older `/en/docs/<indonesian-slug>` URLs go straight to the English page and anchor), and old Indonesian `/docs/<slug>` URLs that no English page reuses (for example `/docs/instalasi`) redirect to `/id/docs/<slug>`. Old Indonesian URLs whose path is now an English page (`/`, `/docs`, `/changelog`, `/docs/cli`, …) cannot be redirected and now show English with a language toggle; the old Indonesian landing anchors `#fitur`, `#cara-kerja` and `#tim` on `/` are mapped to the English anchors.
- **English docs use English URLs and anchors.** The English documentation pages moved to English slugs (for example `/docs/installation`, `/docs/users-roles`, `/docs/applications`, `/docs/proxy-configuration`) and their section anchors are English too (`#what-is-it`, `#account`, `#pitfalls`); the Indonesian pages keep their Indonesian slugs (under `/id`). The language switch, hreflang alternates, sitemap and prev/next links now go through one explicit slug table (`src/lib/doc-slugs.ts`) instead of assuming the same path under `/en`. Every old English URL keeps working as a static redirect page (meta refresh plus a script that keeps the `#anchor`, mapped to the new anchor), marked `noindex` and left out of the sitemap. On the landing page the English section anchors are `#features`, `#how-it-works` and `#team`. The English docs also quote the dashboard's English labels now (for example "Update available", "Reconnect", "Authorize automatically").
- **Copy button label follows the page language.** The copy button on code blocks and the install command says "Copy command"/"Copied" on English pages and "Salin perintah"/"Tersalin" on Indonesian pages.

- **Docs: CLI messages** (Indonesian and English): the CLI pages now quote the CLI's English messages and prompts exactly as `aoox` prints them (for example `Logged in as`, `Verifying token...`, `Select a project`, `The panel rejected the token (401)`).

- **Docs: proxy configuration and terminal limits** (Indonesian and English): the Proxy configuration page now says that files are per proxy, are not part of project export/import (imported domains have no middlewares), and that moving an application to another server drops the middlewares its domains use that the destination proxy does not define; the Web terminal page lists the custom Docker bridge/gateway case among the limits of automatic authorization (the button does not appear; use the manual command).

- **Docs: terminal SSH user on cloud VPS** (Indonesian and English): a new "SSH user on a cloud VPS" section on the Web terminal page (the user in Environment, authorizing the key as that same user, root login usually refused by sshd), the new default (both `sudo aoox install` and the one-line `install.sh` use the user who ran `sudo`; existing installs unchanged) on the Web terminal and Installation pages, and "SSH authentication failed" rows in the terminal troubleshooting tables. The one-line installer (`public/install.sh`) now follows the same rule as `aoox install`: `TERMINAL_SSH_USER` defaults to `SUDO_USER` when it is a plain login name other than root, otherwise root, and an explicit `TERMINAL_SSH_USER` still wins. The installer also authorizes the terminal's SSH key itself: it creates the key in `secrets/` and adds its public half to that user's `~/.ssh/authorized_keys` (idempotent, same rules as `aoox install`: refuses a symlinked `~/.ssh` or `authorized_keys`, tightens loose modes, only warns on failure; skip with `AOOX_NO_TERMINAL_AUTHORIZE=1`). The Web terminal page documents the "Authorize automatically" button for existing installs, its limits (remote servers, non-standard `AuthorizedKeysFile`, SELinux), and the installation and troubleshooting pages mention the automatic step.

### Fixed

- **404 page in English for /en URLs.** The global 404 page now shows English text and English links (Home, Documentation) for `/en` and `/en/...` URLs; it was Indonesian only. Other URLs keep the Indonesian text.

## [0.1.0-alpha.6] - 2026-10-05

### Added

- **Docs: custom SSL certificates** (new page in Indonesian and English): when to use your own certificate, uploading PEM (bundle, unencrypted key), attaching it to an HTTPS domain, wildcards, expiry and renewal, limits and security; the Proxy & domain page now points to it.

- **Docs: database Admin UI** (new page in Indonesian and English): the tools per engine with their pinned image versions, how to install one from the Admin UI card (domain or IP & port), how to sign in, removal, and security notes.
- **Docs updated** for adding/dropping extra databases on the Overview tab, the dashboard's Recent activity card and readable audit-log actions, the shared confirmation dialog when detaching a mount (detach only, or detach and delete the volume), PR previews removed with their application, and settings changes made during a deploy no longer being overwritten.

- **Excalidraw in the template documentation** (Indonesian and English): catalog row and a note (static client on port 80, no database, no live collaboration), and the template count updated from 14 to 15.

## [0.1.0-alpha.5] - 2026-10-02

### Added

- Docs for the new monitoring: remote servers (metrics, container-down and reachability notifications, the status in the server list, and what stays local-only) on the Server remote page; the optional HTTP monitor (settings, how the target is derived and why the host is never typed, redirects, when it stays quiet, notifications, uptime and history) on the Monitoring page; and the two new events on the Notifications page (12 toggles). Indonesian and English.

- **Root directory (monorepo) documentation**: new section in the build types page (what is relative to the folder per build type, an example with three applications, and the limits such as
  files outside the folder not being available), a "deploy only when the folder changed" section in the webhook page (what it reads and when it deploys anyway), and a pitfall entry in
  the application page. Indonesian and English.

- **Template documentation updated for 13 templates**: catalog table with the seven new ones (Vaultwarden, Umami, Grafana, Metabase, Directus, Mattermost, Nextcloud), a new "notes per
  template" section (what each stack contains, PostgreSQL/Redis inside the stack, HTTPS and first-login notes, which ones are heavy), the catalog count on the page, and the template
  teaser on the home page. Indonesian and English.

- **Odoo Community in the template documentation**: catalog table row, the count updated to 14, and a section entry explaining what the stack contains, where to find the generated master
  password, creating the first database, securing the database manager afterwards, the single-process mode and its limit, and that it is the LGPLv3 Community Edition without Enterprise
  modules. Indonesian and English.

- Docs for the application's Environment tab and for the secret source (Infisical): connections in Settings → Integrations, the "Secret source" section (project, environment, path, sync, key preview), `${{secret.KEY}}` references, precedence and what happens when the secret manager is down. Indonesian and English.

### Changed

- Project metadata for discoverability (no behavior change): `package.json` gets `description`, `keywords`, `homepage`, `repository` and `bugs`; the README links to
  the docs/changelog and the other repos. Footer "Kode" group now also links `aoox-cli`, npm and Docker Hub, external
  links use `rel="noopener"` (own links, no `nofollow`/`noreferrer`), the header/docs "GitLab" labels now say GitHub (the
  URLs already pointed there), and the JSON-LD `sameAs` lists the GitHub org, the api repo, the npm package and the
  Docker Hub profile (all URLs checked to exist). `BACKLINKS.md` (repo file, not a page) lists the manual steps.

- Docs (ID + EN): installation (pinned tags and the "Update available" button, `API_IMAGE` now forwarded), webhook
  (`WEBHOOK_VERIFY_GITHUB_IP`) and preview (`PREVIEW_DOMAIN` in `.env.dist`) — with the note that older installs only
  get the new compose variables through `aoox reinstall`, not `aoox update`.

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

### UI UX Improvement

- **`→` in running text became icons.** Arrows between the steps of a path or flow in a sentence (docs tables, lists, steps: "Settings → Access") are a small chevron, `PathArrow`, and the prev/next links in docs (`←`/`→`) and the hero version pill / "Baca docs" links use `ArrowLeft`/`ArrowRight` that nudge on hover; both live in `components/arrows.tsx`. `PathArrow` carries a visually hidden "→" (and its own spaces), so screen readers and copy-paste still get "Settings → Audit log" ("→" rather than ">", which reads as "greater than"). The hidden text sits in a `relative` wrapper: `sr-only` is absolutely positioned and otherwise escaped the `overflow-x-auto` of wide table cells, which made `/docs/notifikasi` and `/docs/troubleshooting` scroll sideways at 375 px. Kept as `→` on purpose: code blocks (`Pre`), inline code, terminal-style mockups (hero, self-host, build options, blue → green), code comments and SEO metadata (`<title>`, description, OG — unchanged, checked for all pages).

- **Full-bleed favicon.** Google Search crops favicons to a circle on a white background, and the old icon (a dark
  rounded tile with a transparent margin around it) showed up as a small dark square inside a white circle, with white
  gaps at the edges. `public/favicon.ico` (16/32/48 px), `public/icon.svg` and `public/apple-touch-icon.png` are now
  regenerated with the whole square canvas filled with the same dark color (`#0c1013`), no rounded corners and no
  transparent margin, and the `$` glyph (same outline, only scaled and re-centered) at about 59% of the canvas so it stays
  inside the inscribed circle; it still reads at 16 px. Checked by rendering the icons cropped to a circle on white, dark and
  light-grey backgrounds. `icon.svg` is only used as the favicon here (the header logo is text and the JSON-LD has no
  logo), so it was changed in place; the panel keeps its own rounded logo. Browsers and Google cache favicons, so the new
  one can take a while to show up.

- **Medium border radius across the whole site.** `--radius` goes from `0` (every corner square) to `0.5rem`,
  using the existing scale (`sm` 0.6×, `md` 0.8×, `lg` 1×, `xl` 1.4×), the same values as aoox-web. Most of the site
  is hand-built markup that never used the radius variable, so the change is applied to it explicitly, by role:
  panels, cards, tables, code blocks, the terminal mockups and the grid-of-cells sections (`gap-px` lines) are
  `rounded-lg` (with `overflow-hidden` where children have their own background or border, so nothing pokes out of a
  corner); boxes nested inside a card, version/badge pills, icon boxes, the docs search field, header links,
  copy/theme/language buttons and the numbered step markers are `rounded-md`; tiny tags, inline code, `kbd` and the
  changelog badges are `rounded-sm`; the small status dots are circles. Left square on purpose: full-width bars
  (header, footer, section dividers, docs sidebar rules), rules/accents that are a single side border (docs table of
  contents, timeline, changelog group headings), the callout's left edge (its accent bar; only the right corners are
  rounded), the terminal cursor block, the FAQ list (dividers only), the logo, icons and images. Colors, spacing and
  layout are unchanged.

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

- Installation doc (ID + EN), "Upgrading": the "Update available" button in the sidebar — owner
  only, checked by the server from Docker Hub (after boot, then every few hours), silent without
  internet, only for installs following `:latest`.
- Installation doc (ID + EN) "Upgrading"/"Upgrading" section gets a new paragraph describing
  what actually happens after clicking "Apply update" on the dashboard: the confirm
  dialog, the "Applying" mode with disabled buttons, automatic polling and page
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
- Installation doc (ID + EN) now documents that `aoox update` / the "Apply update"
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

[Unreleased]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.11...HEAD
[0.1.0-alpha.11]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.10...v0.1.0-alpha.11
[0.1.0-alpha.10]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.9...v0.1.0-alpha.10
[0.1.0-alpha.9]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.8...v0.1.0-alpha.9
[0.1.0-alpha.8]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.7...v0.1.0-alpha.8
[0.1.0-alpha.7]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.6...v0.1.0-alpha.7
[0.1.0-alpha.6]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.5...v0.1.0-alpha.6
[0.1.0-alpha.5]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.4...v0.1.0-alpha.5
[0.1.0-alpha.4]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.3...v0.1.0-alpha.4
[0.1.0-alpha.3]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.2...v0.1.0-alpha.3
[0.1.0-alpha.2]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.1...v0.1.0-alpha.2
[0.1.0-alpha.1]: https://github.com/hideandseeklab/aoox-landing/compare/v0.1.0-alpha.0...v0.1.0-alpha.1
[0.1.0-alpha.0]: https://github.com/hideandseeklab/aoox-landing/releases/tag/v0.1.0-alpha.0
