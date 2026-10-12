# Backlink & visibility — manual actions

This file is for the **project owner**, not a site page (it is not deployed). It contains things that cannot be set up
through code and must be done yourself from the GitHub, Docker Hub, and npm accounts and from the community. The text
below is ready to paste. All facts about directory requirements were taken from their sources on 2026-09-30 — re-check
them before submitting, because community rules change.

## Honest notes first

- Links from our own repos/profiles (GitHub, npm, Docker Hub) are mostly `nofollow` or carry no ranking weight. Their
  purpose is **to help search engines find** `aoox.dev` and to make the official profiles reinforce each other (entity
  signals). They are not a substitute for natural links from other sites.
- The largest weight comes from links that **other people give voluntarily** because the product is useful: articles,
  discussions, curated lists. That grows from the quality of the docs, a regular changelog, and a project that is
  actually used. Do not buy links, trade links in bulk, or ask friends to upvote — besides violating community rules,
  it risks a Google penalty.
- Already set up through code (next release): `homepage`/`repository`/`bugs`/`keywords` in all four `package.json`
  files, `https://aoox.dev` links in the README of all four repos, OCI labels on the api/web Docker images, GitHub/npm/
  Docker Hub links in the site footer, and JSON-LD `sameAs`.

## Suggested order

1. **GitHub** — About/topics for all four repos + the organization profile (10 minutes, immediate impact).
2. **Release alpha.4** (`npm version`, push tag) → `homepage`, README, and OCI labels start showing on npm and Docker
   Hub. After that, decide on the npm `latest` tag (see the npm section).
3. **Docker Hub** — short description + overview for `aoox-api` and `aoox-web`.
4. **Google Search Console + Bing Webmaster Tools** — verify `aoox.dev` and submit
   `https://aoox.dev/sitemap.xml`. This is what speeds up indexing the most.
5. Content worth linking to: 1–2 genuine technical articles (e.g. how we deploy with Nixpacks/Railpack on our own server,
   or lessons from building a PaaS) on our own blog, then shared on dev.to and Indonesian developer communities.
6. **Show HN**, **r/selfhosted**, AlternativeTo, Product Hunt — after there are some real users, a running changelog,
   and a smooth demo/installation. Do not do them all on the same day.
7. Curated lists (awesome-*): **postpone** — see the "Directories" section (aoox does not meet the requirements yet).

## 1. GitHub

Description max 350 characters; topics max 20, lowercase and hyphenated. Run these yourself (no one else runs these
commands; they need `gh auth login` with repo admin rights):

```bash
gh repo edit hideandseeklab/aoox-api \
  --homepage https://aoox.dev \
  --description "Backend of aoox, a self-hosted PaaS: deploy apps from Git or images on Docker, managed databases, custom domains with automatic HTTPS, and monitoring." \
  --add-topic self-hosted --add-topic paas --add-topic docker --add-topic deployment \
  --add-topic devops --add-topic git-deploy --add-topic nixpacks --add-topic railpack \
  --add-topic traefik --add-topic nestjs

gh repo edit hideandseeklab/aoox-web \
  --homepage https://aoox.dev \
  --description "Dashboard of aoox, a self-hosted PaaS: deploy from Git, manage databases, domains, logs and servers in one place." \
  --add-topic self-hosted --add-topic paas --add-topic docker --add-topic deployment \
  --add-topic dashboard --add-topic nextjs --add-topic devops

gh repo edit hideandseeklab/aoox-cli \
  --homepage https://aoox.dev \
  --description "The aoox command line: install aoox on a VPS, log in, link a repo and deploy — for the self-hosted aoox PaaS." \
  --add-topic self-hosted --add-topic paas --add-topic docker --add-topic deployment \
  --add-topic cli --add-topic oclif --add-topic git-deploy --add-topic devops

gh repo edit hideandseeklab/aoox-landing \
  --homepage https://aoox.dev \
  --description "Website and documentation of aoox, a self-hosted PaaS (aoox.dev)." \
  --add-topic self-hosted --add-topic paas --add-topic documentation --add-topic nextjs
```

Via the web (if you are not using `gh`): repo page → gear icon in the **About** box → fill in Description, Website
(`https://aoox.dev`), and Topics.

**Organization `hideandseeklab`** (Settings → Profile): a short Description, e.g.
`Building aoox, a self-hosted PaaS — deploy from Git to your own server. https://aoox.dev`, set the URL to
`https://aoox.dev`, and upload the logo. If you want a README for the organization profile, create a public repo named
`.github` with `profile/README.md`. Suggested contents:

```markdown
# hideandseeklab

**aoox** is a self-hosted PaaS: deploy apps from Git or images to your own server, with managed
databases, custom domains with automatic HTTPS, and monitoring in one dashboard.

Website: https://aoox.dev · Docs: https://aoox.dev/docs · Changelog: https://aoox.dev/changelog

| Repo | What it is |
| --- | --- |
| [aoox-api](https://github.com/hideandseeklab/aoox-api) | Backend (NestJS) and the Docker distribution |
| [aoox-web](https://github.com/hideandseeklab/aoox-web) | Dashboard (Next.js) |
| [aoox-cli](https://github.com/hideandseeklab/aoox-cli) | The `aoox` command line ([npm](https://www.npmjs.com/package/@hideandseeklab/aoox)) |
| [aoox-landing](https://github.com/hideandseeklab/aoox-landing) | Website and documentation |
```

## 2. Docker Hub (`hideandseeklab/aoox-api`, `hideandseeklab/aoox-web`)

Repository → **General** → edit **Short description** (max. 100 characters) and **Overview** (Markdown). The OCI labels
in the Dockerfile are read after the image is re-released, but the fields above are filled in manually.

**Short description**

- `aoox-api` (96 characters):
  `API of aoox, a self-hosted PaaS: deploy from Git on your own server. Docs: https://aoox.dev/docs`
- `aoox-web` (89 characters):
  `Dashboard of aoox, a self-hosted PaaS: deploy, databases, domains, logs. https://aoox.dev`

**Overview `aoox-api`**

````markdown
# aoox-api

The API of **[aoox](https://aoox.dev)**, a self-hosted PaaS: deploy apps from Git or images on your own
server with Docker, managed databases, custom domains with automatic HTTPS, and monitoring.

- Website: https://aoox.dev
- Docs: https://aoox.dev/docs
- Changelog: https://aoox.dev/changelog
- Source: https://github.com/hideandseeklab/aoox-api (Apache-2.0)

## Run it

Use the one-line installer on a fresh VPS (installs Docker if needed and starts postgres + api + web):

```bash
curl -fsSL https://aoox.dev/install.sh | sudo sh
```

Or install the CLI and run `aoox install` — see https://aoox.dev/docs/installation. This image is meant to run
together with `hideandseeklab/aoox-web` and PostgreSQL through the compose file the installer writes.

## Tags

- `latest` — newest release · `0.1.0-alpha.N` — pinned versions. aoox is in alpha; see the changelog.
````

**Overview `aoox-web`**

````markdown
# aoox-web

The dashboard of **[aoox](https://aoox.dev)**, a self-hosted PaaS: create apps from Git or images, manage
databases, domains, logs and remote servers from one place.

- Website: https://aoox.dev
- Docs: https://aoox.dev/docs
- Changelog: https://aoox.dev/changelog
- Source: https://github.com/hideandseeklab/aoox-web (Apache-2.0)

Runs together with `hideandseeklab/aoox-api` and PostgreSQL. Install everything on a VPS with:

```bash
curl -fsSL https://aoox.dev/install.sh | sudo sh
```

Details: https://aoox.dev/docs/installation
````

## 3. npm (`@hideandseeklab/aoox`)

- `homepage`, `repository`, `bugs`, `keywords`, and the README (with the `aoox.dev` link) only appear on the npm page
  **after the next release is published** (`npm version` → push tag → `npm-publish` workflow).
- **Important finding — `latest` tag:** as of 2026-09-30 the npm registry has `latest` = `0.1.0-alpha.0` and
  `alpha` = `0.1.0-alpha.4`. The page `https://www.npmjs.com/package/@hideandseeklab/aoox` shows the version that
  `latest` points to, so what appears there (README, homepage) is still alpha.0, and
  `npm install -g @hideandseeklab/aoox` without `@alpha` installs alpha.0. The publish workflow intentionally does not
  move `latest` for pre-releases. While the project is still alpha, a sensible option is:
  ```bash
  npm dist-tag add @hideandseeklab/aoox@0.1.0-alpha.4 latest   # after alpha.4 is published
  ```
  (requires npm login with publish rights/2FA; this decision is yours. Impact: installs without a tag will follow the
  latest pre-release.) The alternative is to leave it as is and make sure all docs use `@alpha` (already the case on the
  CLI page).
- After the release, open the npm page and make sure the Homepage link points to `https://aoox.dev`.

## 4. Search engines

- Google Search Console: add the property `https://aoox.dev` (DNS TXT verification is the most stable), submit
  `https://aoox.dev/sitemap.xml`, then "Request indexing" for the home page, `/docs`, `/docs/installation`, and
  `/changelog` (English at the root, Indonesian under `/id`). Check the Pages report and make sure `hreflang` en/id is not reported as an error.
- Bing Webmaster Tools: import from Search Console (one click).
- Bing, Yandex, and several other engines use IndexNow; optional, not required.

## 5. Directories and communities

Short draft texts; **nobody else submits them** — only you. Write them yourself in your own words if a community
prohibits machine-generated text (see the note on each entry).

### awesome-selfhosted — **does not meet the requirements** (do not submit)

Source: `CONTRIBUTING.md` in `awesome-selfhosted/awesome-selfhosted-data`. Objective requirements: first release more
than 4 months ago (aoox: alpha.0 on 2026-09-25 → earliest 2027-01-25), actively maintained, working installation
instructions, free license (Apache-2.0 satisfies this). **But** the "What does not qualify" section explicitly rejects
"Software acts as a platform to build and deploy arbitrary applications (PaaS, 'serverless'...)". Their README also
directs PaaS projects to awesome-sysadmin. In addition, machine- or LLM-generated contributions "will result in a
ban". Conclusion: it is pointless; do not submit it.

### awesome-sysadmin (PaaS category) — **not yet**, long-term candidate

Source: `PULL_REQUEST_TEMPLATE.md` in `awesome-foss/awesome-sysadmin-data`. This list has a PaaS category (containing
CapRover, Coolify, and Dokku). The requirements in the template: free software (Apache-2.0 ✓), not already listed on
awesome-selfhosted, actively maintained, working installation instructions — and **"first released more than 12 months
ago"** (aoox: earliest 2027-09-25) plus "not your own, unless you have a healthy ecosystem with a few contributors (which
aren't your sock puppet accounts)". So: it does not meet the requirements now; do not submit until 12 months have passed
**and** there are contributors/users outside the team. When the time comes, submit one item per PR and fill in "Why is it
awesome?" honestly (real strengths, without exaggerated claims).

### AlternativeTo — worthwhile, low risk

An alternative software directory site; the "Suggest new app" form is free and skips moderation. I have not verified it
automatically yet (the site blocks automated checks), so read their guidelines before submitting. If you write
comparisons ("alternative to X"), make sure they are accurate and not misleading. Draft:

- Name: `aoox`
- Tagline: `Self-hosted PaaS: deploy from Git to your own server`
- Description: `aoox is an open-source (Apache-2.0) self-hosted PaaS. Connect a Git repo or pick an image and aoox builds (Dockerfile, Nixpacks, Railpack, or static sites), deploys with health checks and rollback, and serves it behind Traefik with automatic HTTPS. It also runs managed databases (PostgreSQL, MySQL, MariaDB, Redis/Valkey, MongoDB) with backups, one-click templates, scheduled jobs, monitoring, notifications and a CLI. One dashboard, your own server, no vendor lock-in. Alpha.`
- Links: https://aoox.dev · Source: https://github.com/hideandseeklab/aoox-api

### Product Hunt — optional, postpone

Requires a maker account, visual assets (gallery, icon), and a planned launch day. The effect is a momentary spike; for an
alpha project it is better to wait for a stable release and a polished demo. Do not ask friends to upvote. Not verified
automatically.

### Hacker News — "Show HN"

Official rules (`news.ycombinator.com/showhn.html`, read 2026-09-30): Show HN is for work people can **try**, not landing
pages; the project must be non-trivial and you must be there to discuss it; make it easy for people to try without
sign-up; "New features and upgrades (Foo 1.3.1 is out)" is not eligible; do not ask friends to upvote or comment. Format:
the title `Show HN: aoox – self-hosted PaaS (deploy from Git to your own server)`, a link to `https://aoox.dev` or the
repo, then **your own first comment** telling the story: why it was built, what is different (e.g. Nixpacks/Railpack
builds + Traefik + blue/green in one panel), what is not there yet (alpha, one main node, etc.), and how to try it (one
install command). Timing: a weekday morning US time (Tuesday–Thursday), when you can reply to comments for hours. Risks:
harsh criticism of alpha quality and competition from Coolify/Dokku/CapRover — prepare honest answers. Submit **once**;
do not repeat it.

### r/selfhosted — check the rules first

I **cannot verify** this subreddit's rules (Reddit blocks automated access and the rules box is not readable). Before
posting, read the **Rules** and the wiki yourself — large subreddits like this usually limit self-promotion (e.g. a ratio
of contributions to promotion, a specific format or day for new projects, or a requirement to state that you built the
project yourself). If there is a thread or day for new projects, use that. General draft: an honest title ("Built a
self-hosted PaaS (alpha) — feedback welcome"), state that you are the creator, what it does, what is not there yet, links
to the repo and docs, and ask specific questions. Do not repost on every release. Risk: removal by moderators and being
seen as spam.

### dev.to / Medium / Indonesian developer communities

Most valuable as a **useful article** (not an ad), e.g. "Deploy Next.js from Git to your own VPS without vendor lock-in"
or "Running a PaaS on one VPS: Traefik, blue/green, and health checks". Include the `aoox.dev` link naturally in the
middle of the content, not only at the end. For Indonesian communities (developer Telegram groups, Discord, forums), read
each one's promotion rules and post in the channel meant for "showcase". Write in the language that suits the audience.

## 6. Maintenance (routine, not one-time)

- Every release: fill in the entry in `src/content/changelog.ts`, then run `npm run check-release` (see `RELEASING.md`).
  A living changelog is what brings people back and gets them to link to it.
- Do not create dead links: if you move a repo or URL, update `package.json`, the README, `sameAs` in
  `src/lib/seo.ts`, and the text in this file.
