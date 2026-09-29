import type { Lang } from "@/lib/lang"

/**
 * Product-level changelog for aoox (panel api + web, CLI, and this site) —
 * the single source of the "current release" shown on the homepage badge and
 * of the /changelog pages. Newest release first; `RELEASES[0]` IS the current
 * release. Add an entry here BEFORE `npm version` on release day, then run
 * `npm run check-release` (see RELEASING.md). `[Unreleased]` items in the
 * per-repo CHANGELOG.md files belong to the *next* release — never list them.
 */

export type ChangeKind = "added" | "changed" | "fixed"

export interface Highlight {
  id: string
  en: string
}

export interface Release {
  /** Same string as package.json's `version`, without a leading "v". */
  version: string
  /** ISO date (from the CHANGELOG.md header). */
  date: string
  channel: "alpha"
  groups: { kind: ChangeKind; items: Highlight[] }[]
}

export const GITHUB_ORG = "https://github.com/hideandseeklab"
export const CHANGELOG_REPOS = ["aoox-api", "aoox-web", "aoox-cli", "aoox-landing"] as const

export const RELEASES: Release[] = [
  {
    version: "0.1.0-alpha.4",
    date: "2026-09-29",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "Tombol **Update tersedia** di bagian bawah sidebar (khusus owner): server memeriksa versi aoox terbaru di Docker Hub secara berkala dan tombolnya membuka halaman Update aoox. Tidak muncul untuk instalasi dengan tag yang dikunci, dan diam saja tanpa akses internet.",
            en: "An **Update tersedia** (update available) button at the bottom of the sidebar (owner only): the server periodically checks Docker Hub for the newest aoox version and the button opens the Update aoox page. It stays hidden for installs pinned to a tag, and stays silent without internet access.",
          },
          {
            id: "**`aoox reinstall`** untuk memperbaiki atau menyegarkan instalasi yang sudah ada tanpa kehilangan data, dan **installer CLI tanpa Node.js** (`curl -fsSL https://aoox.dev/install-cli.sh | sh`) untuk Linux dan macOS.",
            en: "**`aoox reinstall`** to repair or refresh an existing install without losing data, and a **Node.js-free CLI installer** (`curl -fsSL https://aoox.dev/install-cli.sh | sh`) for Linux and macOS.",
          },
          {
            id: "**Bar progres navigasi** di bagian atas layar dan kerangka (skeleton) halaman saat berpindah halaman, jadi sidebar dan navbar tidak ikut berkedip.",
            en: "A **navigation progress bar** at the top of the screen and page skeletons while switching pages, so the sidebar and navbar stay put.",
          },
          {
            id: "Situs ini punya halaman **Changelog** (ID dan EN) dan SEO yang lengkap: sitemap, canonical, hreflang, Open Graph, dan `<html lang>` yang benar per bahasa.",
            en: "This site now has a **Changelog** page (ID and EN) and complete SEO: sitemap, canonical, hreflang, Open Graph, and the correct `<html lang>` per language.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "Header sidebar memakai logo aoox yang sama dengan favicon dan menampilkan **versi aoox yang sedang berjalan** (mis. `v0.1.0-alpha.4`) sebagai pengganti teks statis.",
            en: "The sidebar header uses the same aoox logo as the favicon and shows the **running aoox version** (e.g. `v0.1.0-alpha.4`) instead of static text.",
          },
          {
            id: "Situs statis: form pembuatan mengisi Port container 80, dan nginx menampilkan `404.html` milik repo untuk path yang tidak ada.",
            en: "Static sites: the create form pre-fills Container port 80, and nginx serves the repo's own `404.html` for missing paths.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Mengubah **Port host** pada aplikasi yang sedang berjalan sebelumnya tidak berpengaruh sampai deploy berikutnya; kini langsung diterapkan (container dibuat ulang tanpa build), dan bila gagal port lama dipulihkan.",
            en: "Changing an application's **host port** while it runs used to do nothing until the next deploy; it is now applied right away (container recreated without a build), and the previous port is restored if that fails.",
          },
          {
            id: "Terminal gagal dengan `TERMINAL_SSH_USER is not set` pada instalasi lama — kini memakai `root` sebagai default, dan kegagalan koneksi menampilkan tautan ke pengaturan yang relevan.",
            en: "The Terminal failed with `TERMINAL_SSH_USER is not set` on older installs — it now defaults to `root`, and connection failures link to the relevant settings.",
          },
          {
            id: "Tombol **Terapkan update** kini meminta konfirmasi, menampilkan progres selama panel restart, dan memuat ulang halaman sendiri — tanpa error merah yang menyesatkan.",
            en: "The **Terapkan update** (apply update) button now asks for confirmation, shows progress while the panel restarts, and reloads the page by itself — without the misleading red error.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.3",
    date: "2026-09-28",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Console** interaktif untuk aplikasi: shell `docker exec -it` ke container aplikasi langsung dari dashboard (juga untuk task Swarm dan server remote).",
            en: "Interactive **Console** for applications: a `docker exec -it` shell into the app's container straight from the dashboard (also for Swarm tasks and remote servers).",
          },
          {
            id: "Engine database baru **Valkey** dan **MongoDB**, plus varian PostgreSQL (pgvector, PostGIS, TimescaleDB) — lengkap dengan backup, restore, dan data browser.",
            en: "New database engines **Valkey** and **MongoDB**, plus PostgreSQL variants (pgvector, PostGIS, TimescaleDB) — with backup, restore, and the data browser.",
          },
          {
            id: "Notifikasi **error aplikasi** yang dideteksi dari log (opt-in), dengan switch \"Abaikan error di log\" per aplikasi.",
            en: "**Application error** notifications detected from logs (opt-in), with a per-app \"ignore error logs\" switch.",
          },
          {
            id: "**Pemakaian resource per project** (CPU, RAM, jaringan) tampil di kartu project.",
            en: "**Resource usage per project** (CPU, RAM, network) on the project cards.",
          },
          {
            id: "**Hapus image** dari registry lokal sampai tuntas, dengan peringatan bila image masih dipakai aplikasi.",
            en: "**Delete image** from the local registry completely, with a warning when an application still uses it.",
          },
          {
            id: "Membuat aplikasi, database, dan stack compose kini di halaman sendiri, bukan dialog.",
            en: "Creating an application, database, or compose stack now happens on its own page instead of a dialog.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "Tampilan: font **Inter** dan judul dengan letter-spacing rapat di dashboard dan situs ini.",
            en: "Look and feel: the **Inter** font and tightly tracked headings across the dashboard and this site.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Membuat aplikasi dengan build type selain Dockerfile (Nixpacks, Railpack, situs statis) atau sumber image gagal 400 — sudah diperbaiki.",
            en: "Creating an application with a build type other than Dockerfile (Nixpacks, Railpack, static site) or an image source failed with a 400 — fixed.",
          },
          {
            id: "Toggle notifikasi \"DNS domain bermasalah\" akhirnya benar-benar tersimpan.",
            en: "The \"DNS domain issue\" notification toggle now actually saves.",
          },
          {
            id: "Registry lokal gagal (`Invalid URL`) bila `REGISTRY_INTERNAL_URL` di `.env` dikosongkan.",
            en: "The local registry failed (`Invalid URL`) when `REGISTRY_INTERNAL_URL` was left blank in `.env`.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.2",
    date: "2026-09-27",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "Halaman **Environment** (owner): ubah sebagian `.env.dist` panel dari dashboard tanpa SSH.",
            en: "**Environment** page (owner): edit part of the panel's `.env.dist` from the dashboard, no SSH needed.",
          },
          {
            id: "Domain panel dan domain aplikasi kini memasang reverse proxy otomatis bila belum ada, dan menampilkan langkah troubleshooting (DNS, firewall, ACME).",
            en: "Panel and application domains now auto-provision the reverse proxy when it is missing, and show troubleshooting steps (DNS, firewall, ACME).",
          },
          {
            id: "Cek bentrok **port host** saat membuat/mengubah aplikasi — bentrok terdeteksi di awal, bukan gagal diam-diam saat deploy.",
            en: "**Host port** collision check when creating/updating an application — caught up front instead of failing silently at deploy time.",
          },
          {
            id: "Riwayat deployment mencatat pemicunya (manual, webhook, auto-update) beserta commit, dan daftar deploy diperbarui realtime.",
            en: "Deployment history records what triggered it (manual, webhook, auto-update) with the commit, and the list updates in real time.",
          },
          {
            id: "Notifikasi **deploy dimulai** (opt-in) dan badge \"deploy…\" di kartu project.",
            en: "**Deploy started** notification (opt-in) and a \"deploy…\" badge on project cards.",
          },
          {
            id: "Langkah **Akses** (IP & port / Domain / Nanti saja) saat membuat aplikasi, plus pemilih image dari registry.",
            en: "An **Access** step (IP & port / Domain / Later) when creating an application, plus an image picker from the registry.",
          },
          {
            id: "CLI: `aoox install` mengisi `TERMINAL_SSH_USER=root`; `aoox domain set` mencetak langkah troubleshooting.",
            en: "CLI: `aoox install` writes `TERMINAL_SSH_USER=root`; `aoox domain set` prints troubleshooting steps.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Menyimpan Pengaturan aplikasi ditolak (`imageRef must be an…`) untuk aplikasi non-image — diperbaiki.",
            en: "Saving an application's settings was rejected (`imageRef must be an…`) for non-image apps — fixed.",
          },
          {
            id: "URL webhook di dashboard menampilkan `localhost` walau domain API sudah diatur.",
            en: "Webhook URLs in the dashboard showed `localhost` even after the API domain was set.",
          },
          {
            id: "Update panel dan domain panel tidak lagi menghilangkan file compose override yang dibuat dashboard.",
            en: "Panel update and panel domain no longer drop the compose override file the dashboard creates.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.1",
    date: "2026-09-26",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Domain panel**: pasang domain kustom (HTTPS otomatis) untuk dashboard dan API dari Settings atau `aoox domain set`.",
            en: "**Panel domain**: put the dashboard and API on a custom domain (automatic HTTPS) from Settings or `aoox domain set`.",
          },
          {
            id: "**Update aoox** dari dashboard atau `aoox update [--apply]`: cek dan terapkan versi baru panel.",
            en: "**Update aoox** from the dashboard or `aoox update [--apply]`: check for and apply a new panel version.",
          },
          {
            id: "Domain kustom untuk registry lokal (`aoox registry domain`) dan opsi penyimpanan S3 untuk isi registry.",
            en: "Custom domain for the local registry (`aoox registry domain`) and an S3 storage option for registry contents.",
          },
          {
            id: "Installer satu baris: `curl -fsSL https://aoox.dev/install.sh | sh`.",
            en: "One-line installer: `curl -fsSL https://aoox.dev/install.sh | sh`.",
          },
          {
            id: "Dokumentasi lengkap dalam bahasa Inggris (`/en/docs/*`) di samping Bahasa Indonesia.",
            en: "The full documentation in English (`/en/docs/*`) next to Indonesian.",
          },
          {
            id: "CI (lint, build, test) di setiap repo pada pull request dan push ke `main`.",
            en: "CI (lint, build, test) in every repo on pull requests and pushes to `main`.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Prefix API token tersimpan 11 karakter, bukan 10 sesuai dokumentasi.",
            en: "API token prefix was stored as 11 characters instead of the documented 10.",
          },
          {
            id: "Salinan compose yang dibundel di CLI tertinggal dari `aoox-api`, sehingga `aoox install` bisa memasang konfigurasi basi.",
            en: "The compose copy bundled in the CLI lagged behind `aoox-api`, so `aoox install` could set up a stale configuration.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.0",
    date: "2026-09-25",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "Rilis publik alpha pertama: PaaS self-hosted (API NestJS + dashboard Next.js + CLI) yang berjalan di atas Docker.",
            en: "First public alpha: a self-hosted PaaS (NestJS API + Next.js dashboard + CLI) running on top of Docker.",
          },
          {
            id: "Deploy dari Git (Dockerfile, Nixpacks, Railpack, situs statis) atau dari image, dengan log realtime, rollback, webhook, dan preview pull request.",
            en: "Deploy from Git (Dockerfile, Nixpacks, Railpack, static site) or from an image, with realtime logs, rollback, webhooks, and pull request previews.",
          },
          {
            id: "Managed database (PostgreSQL, MySQL, MariaDB, Redis) dengan data browser, backup terjadwal, dan tujuan S3.",
            en: "Managed databases (PostgreSQL, MySQL, MariaDB, Redis) with a data browser, scheduled backups, and S3 destinations.",
          },
          {
            id: "Stack Docker Compose, template satu klik (WordPress, Ghost, n8n, Uptime Kuma, MinIO, Gitea), dan jobs terjadwal.",
            en: "Docker Compose stacks, one-click templates (WordPress, Ghost, n8n, Uptime Kuma, MinIO, Gitea), and scheduled jobs.",
          },
          {
            id: "Reverse proxy Traefik dengan HTTPS otomatis, registry Docker sendiri, server remote lewat SSH, dan Docker Swarm.",
            en: "Traefik reverse proxy with automatic HTTPS, a self-hosted Docker registry, remote servers over SSH, and Docker Swarm.",
          },
          {
            id: "Autentikasi JWT, 2FA TOTP, anggota project berperan, API token ber-scope, dan audit log.",
            en: "JWT auth, TOTP two-factor, role-based project members, scoped API tokens, and an audit log.",
          },
          {
            id: "Monitoring dengan riwayat metrik, notifikasi (Telegram, Slack, Discord, email, webhook), pembersihan disk, dan ekspor/impor project.",
            en: "Monitoring with metric history, notifications (Telegram, Slack, Discord, email, webhook), disk cleanup, and project export/import.",
          },
          {
            id: "CLI `aoox` (`login`, `link`, `deploy`, `install`, `whoami`) dan situs dokumentasi ini.",
            en: "The `aoox` CLI (`login`, `link`, `deploy`, `install`, `whoami`) and this documentation site.",
          },
        ],
      },
    ],
  },
]

export const LATEST_RELEASE = RELEASES[0]

export function releaseTagUrl(version: string): string {
  return `${GITHUB_ORG}/aoox-api/releases/tag/v${version}`
}

export function changelogFileUrl(repo: string, version: string): string {
  return `${GITHUB_ORG}/${repo}/blob/v${version}/CHANGELOG.md`
}

export const KIND_LABEL: Record<Lang, Record<ChangeKind, string>> = {
  id: { added: "Baru", changed: "Berubah", fixed: "Diperbaiki" },
  en: { added: "Added", changed: "Changed", fixed: "Fixed" },
}
