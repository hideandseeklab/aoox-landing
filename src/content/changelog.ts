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
    version: "0.1.0-alpha.5",
    date: "2026-10-02",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Root directory untuk monorepo**: aplikasi bisa membangun satu subfolder repo (mis. `apps/web`) untuk Dockerfile, Nixpacks, Railpack, dan situs statis, termasuk preview pull request. Path Dockerfile dan folder output dihitung dari folder itu, dan folder yang salah menggagalkan deployment dengan pesan jelas tanpa menyentuh container yang berjalan.",
            en: "**Root directory for monorepos**: an application can build one subfolder of its repo (e.g. `apps/web`) for Dockerfile, Nixpacks, Railpack and static sites, pull request previews included. The Dockerfile path and output folder are relative to that folder, and a wrong folder fails the deployment with a clear message without touching the running container.",
          },
          {
            id: "Opsi webhook **deploy hanya bila folder berubah**: push yang hanya menyentuh folder lain dijawab `ignored`. Bila aoox tidak bisa memastikan (tanpa daftar file, merge commit, 20 commit atau lebih, force push), deploy tetap berjalan.",
            en: "A webhook option to **deploy only when the folder changed**: a push that only touches other folders is answered `ignored`. When aoox cannot tell (no file lists, merge commits, 20 or more commits, force pushes), it deploys anyway.",
          },
          {
            id: "**Monitor HTTP per aplikasi** (tab Monitor): pemeriksaan path dengan interval dan batas kegagalan, uptime 24 jam/7 hari, latensi rata-rata dan p95, grafik 24 jam, riwayat insiden, dan notifikasi saat down dan pulih. Host selalu diturunkan dari aplikasi, bukan dari input pengguna.",
            en: "**Per-application HTTP monitor** (Monitor tab): a path check with an interval and failure threshold, 24 h/7 d uptime, average and p95 latency, a 24 h chart, incident history, and notifications when it goes down and recovers. The host is always derived from the application, never from user input.",
          },
          {
            id: "**Pemantauan server remote**: metrik CPU, memori, dan jaringan aplikasi di server remote (live dan riwayat), notifikasi saat container mati, status terjangkau/tidak terjangkau di daftar server, dan notifikasi saat server tidak terjangkau serta saat pulih.",
            en: "**Remote server monitoring**: CPU, memory and network metrics for applications on remote servers (live and history), a notification when a container dies, a reachable/unreachable status in the server list, and notifications when a server becomes unreachable and when it recovers.",
          },
          {
            id: "**Template satu-klik bertambah dari 6 menjadi 14**: Vaultwarden, Umami, Grafana, Metabase, Directus, Mattermost, Nextcloud, dan Odoo Community (edisi Community, LGPLv3). Semua memakai tag image yang dikunci, health check, dan password yang dibuat otomatis.",
            en: "**One-click templates grow from 6 to 14**: Vaultwarden, Umami, Grafana, Metabase, Directus, Mattermost, Nextcloud, and Odoo Community (Community edition, LGPLv3). All use pinned image tags, health checks and generated passwords.",
          },
          {
            id: "Kartu aplikasi, stack, dan database di halaman project menampilkan **alamat untuk membukanya** (domain atau `host:port`), dan aplikasi menampilkan root directory-nya di header.",
            en: "Application, stack and database cards on the project page show **where to open them** (domain or `host:port`), and applications show their root directory in the header.",
          },
          {
            id: "**Sumber secret eksternal (Infisical)** untuk env aplikasi: daftarkan koneksi sekali di Pengaturan, Integrasi, lalu pilih project, environment, dan path di aplikasi. Secret disuntikkan saat container dibuat, semuanya (sync) atau lewat referensi `${{secret.KEY}}`. Tidak disimpan di aoox, nilainya disensor dari log, dan preview pull request tidak ikut memakainya.",
            en: "**External secret source (Infisical)** for application env: register a connection once in Settings, Integrasi, then pick the project, environment and path on the application. Secrets are injected when the container is created, either all of them (sync) or through `${{secret.KEY}}` references. Nothing is stored in aoox, values are masked in logs, and pull request previews do not use it.",
          },
          {
            id: "Halaman aplikasi punya **tab Environment** tersendiri, berisi editor env dan sumber secret.",
            en: "The application page has its own **Environment tab** with the env editor and the secret source.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "**Radius sedang** di seluruh panel dan situs, ikon menggantikan panah `→` di teks, kartu katalog template satu tinggi, dan dialog Buat tabel kini rata dengan kolomnya. Field dan tombol dalam satu baris memiliki tinggi yang sama.",
            en: "**Medium border radius** across the panel and the site, icons replace the `→` arrows in text, template catalog cards share one height, and the Create table dialog now lines up with its columns. Fields and buttons on one row have the same height.",
          },
          {
            id: "Header halaman aplikasi, database, compose, dan project tidak lagi meluap di layar ponsel, dan deretan tab bisa digeser bila lebih lebar dari layar.",
            en: "The headers of the application, database, compose and project pages no longer overflow on a phone, and tab strips scroll when wider than the screen.",
          },
          {
            id: "Metadata proyek dan tautan antar situs (aoox.dev, GitHub, npm, Docker Hub) dirapikan agar mudah ditemukan; tidak ada perubahan perilaku.",
            en: "Project metadata and links between the site, GitHub, npm and Docker Hub were tidied up for discoverability; no behavior change.",
          },
          {
            id: "Form **Aplikasi baru** dan Pengaturan kini berbentuk kartu per topik (Sumber, Build, Jaringan, dan seterusnya), jadi lebih mudah dipindai.",
            en: "The **New application** form and Pengaturan are now split into cards per topic (Source, Build, Network and so on), so they are easier to scan.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "`docker-compose.dist.yml` kini meneruskan `API_IMAGE`, `WEB_IMAGE`, `WEBHOOK_VERIFY_GITHUB_IP`, dan `PREVIEW_DOMAIN` ke container api. Instalasi lama menerimanya lewat `aoox reinstall`, bukan `aoox update`.",
            en: "`docker-compose.dist.yml` now forwards `API_IMAGE`, `WEB_IMAGE`, `WEBHOOK_VERIFY_GITHUB_IP` and `PREVIEW_DOMAIN` to the api container. Existing installs get them through `aoox reinstall`, not `aoox update`.",
          },
          {
            id: "`/favicon.ico` tidak lagi 404 di panel dan situs, dan favicon kini memenuhi seluruh kanvas agar tampil benar saat dipotong bulat oleh mesin pencari.",
            en: "`/favicon.ico` no longer returns 404 on the panel and the site, and the favicon fills the whole canvas so it looks right when search engines crop it to a circle.",
          },
        ],
      },
    ],
  },
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
