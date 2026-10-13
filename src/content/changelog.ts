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
    version: "0.1.0-alpha.9",
    date: "2026-10-13",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Environment project (development, staging, production)**: setiap project punya environment dengan variabel terenkripsi; aplikasi dan stack ditautkan ke satu environment dan `${{project.KEY}}` diambil darinya. `production` dilindungi: hanya admin project yang bisa menampilkan, mengubah, atau menautkan ke sana.",
            en: "**Project environments (development, staging, production)**: every project has environments with encrypted variables; applications and stacks are linked to one and `${{project.KEY}}` resolves from it. `production` is protected: only project admins can reveal, edit or link to it.",
          },
          {
            id: "**Riwayat, restore, bandingkan, dan promosikan variabel**: tiap perubahan environment tersimpan sebagai versi (siapa, kapan, nama variabel yang berubah) dan bisa dipulihkan; dua environment bisa dibandingkan per variabel dan variabel bisa disalin dari satu ke yang lain.",
            en: "**History, restore, compare and promote for variables**: every change to an environment is stored as a version (who, when, which names changed) and can be restored; two environments can be compared variable by variable and variables copied from one into another.",
          },
          {
            id: "**Tanda Rahasia per variabel**: variabel rahasia selalu disamarkan di log deployment, output job, dan notifikasi; nama seperti password, token, atau key otomatis ditandai.",
            en: "**A Secret switch per variable**: secret variables are always masked in deployment logs, job output and notifications; names such as password, token or key are marked automatically.",
          },
          {
            id: "**`aoox env` dan `aoox run`**: `list`, `pull`, `push`, `set`, `unset`, `history`, `diff`, dan `promote` dari terminal, plus `aoox run -- <perintah>` yang menjalankan perintah dengan variabel sebuah environment tanpa menulisnya ke disk.",
            en: "**`aoox env` and `aoox run`**: `list`, `pull`, `push`, `set`, `unset`, `history`, `diff` and `promote` from the terminal, plus `aoox run -- <command>` to start a command with an environment's variables without writing them to disk.",
          },
          {
            id: "**API token bisa dibatasi ke environment tertentu**: misalnya token CI yang hanya boleh membaca `development`.",
            en: "**API tokens can be limited to certain environments**: for example a CI token that may only read `development`.",
          },
          {
            id: "**Peringatan port container**: bila image mendeklarasikan port `EXPOSE` tetapi Container port bukan salah satunya, log deployment dan tab Pengaturan serta Domain memperingatkan (sumber umum \"Bad Gateway\"), dengan tombol sekali klik untuk memakai port yang benar.",
            en: "**Container port warning**: when an image declares `EXPOSE` ports and the Container port is none of them, the deployment log and the Settings and Domains tabs warn about it (a common cause of \"Bad Gateway\"), with a one-click button to use the right port.",
          },
          {
            id: "**`aoox registry build --push`**: build dan push image dalam satu langkah.",
            en: "**`aoox registry build --push`**: build and push an image in one step.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "**Env bersama project pindah ke `production`**: upgrade menyalin env bersama lama ke environment `production` dan menautkan semua aplikasi dan stack ke sana, jadi deploy berjalan seperti sebelumnya. Aplikasi atau stack baru yang dibuat non-admin dimulai di `development`.",
            en: "**The project's shared env moved into `production`**: the upgrade copies the old shared env into the `production` environment and links every application and stack to it, so deploys behave as before. A new application or stack created by a non-admin starts in `development`.",
          },
          {
            id: "**Ekspor project tidak lagi selalu menyertakan env bersama**: variabel environment hanya ikut diekspor dengan database passwords (khusus owner).",
            en: "**Project export no longer always includes the shared env**: environment variables are only exported together with database passwords (owner only).",
          },
          {
            id: "**Layar update lebih jelas**: overlay penuh layar dengan langkah dan timer saat panel diperbarui, dan tidak lagi macet setelah \"Apply update\".",
            en: "**A clearer update screen**: a full-screen overlay with steps and a timer while the panel updates, and it no longer hangs after \"Apply update\".",
          },
          {
            id: "Halaman 404 situs ini kini memakai ilustrasi yang sama dengan panel.",
            en: "The site's 404 page now uses the same illustration as the panel.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "**Mengubah Container port aplikasi yang berjalan kini langsung berlaku**: sebelumnya hanya tersimpan sehingga proxy tetap ke port lama (\"Bad Gateway\") sampai deploy berikutnya; aplikasi yang dihentikan memakai port baru saat dinyalakan.",
            en: "**Changing the Container port of a running application now takes effect**: it used to be saved only, so the proxy kept the old port (\"Bad Gateway\") until the next deploy; a stopped application uses the new port when started.",
          },
          {
            id: "**Impor project berisi stack compose tidak lagi gagal dengan 500**, dan pesan error CLI memakai tanda ❌ yang tampil benar di Windows Terminal.",
            en: "**Importing a project that contains a compose stack no longer fails with a 500**, and CLI error lines use a ❌ that renders correctly in Windows Terminal.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.8",
    date: "2026-10-12",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Ganti nama dan email akun**: di Pengaturan, Akun, tombol Edit profil mengubah nama dan email Anda; password saat ini hanya diminta saat email berubah. Owner juga bisa mengubah nama dan email anggota lain dari tab Tim.",
            en: "**Change your name and email**: in Settings, Account, Edit profile changes your name and email; your current password is only asked for when the email changes. Owners can also edit other members' names and emails from the Team tab.",
          },
          {
            id: "**`aoox registry build` dan `aoox registry push`**: bangun image dari `./Dockerfile` dengan nama dan versi, lalu kirim ke registry lokal aoox dengan satu perintah. Versi yang sudah ada di registry ditolak dengan pesan yang jelas.",
            en: "**`aoox registry build` and `aoox registry push`**: build an image from `./Dockerfile` with a name and version, then send it to aoox's local registry with one command. A version that already exists in the registry is refused with a clear message.",
          },
          {
            id: "**`aoox` tanpa argumen menunjukkan koneksi**: alamat dashboard, API, dan registry yang sedang dipakai CLI, plus peringatan satu baris saat versi CLI lebih lama dari panel.",
            en: "**Plain `aoox` shows the connection**: the dashboard, API and registry the CLI is using, plus a one-line warning when the CLI is older than the panel.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "**Perubahan besar di CLI: `aoox update` kini memperbarui CLI itu sendiri.** Pembaruan panel (aoox-api dan aoox-web) pindah ke `aoox update panel`.",
            en: "**Breaking CLI change: `aoox update` now updates the CLI itself.** The panel update (aoox-api and aoox-web) moved to `aoox update panel`.",
          },
          {
            id: "**`aoox login` cukup dengan alamat dashboard**: CLI menemukan alamat API sendiri, dan pesan error koneksi kini menjelaskan apa yang salah. Dialog token API baru menampilkan perintah login yang siap disalin.",
            en: "**`aoox login` only needs the dashboard address**: the CLI finds the API address itself, and connection errors now say what is wrong. The new API token dialog shows a copy-ready login command.",
          },
          {
            id: "**Halaman aplikasi, database, compose, dan proyek ditata ulang**: kartu header dengan status dan tombol utama, judul bagian di tiap tab, daftar berupa tabel dengan tombol \"+ Tambah\" yang membuka dialog, dan tombol hapus pindah ke kartu Zona berbahaya.",
            en: "**Redesigned application, database, compose and project pages**: a header card with the status and main actions, section headings on each tab, lists shown as tables with a \"+ Add\" button that opens a dialog, and delete moved to a Danger zone card.",
          },
          {
            id: "**Integrasi punya grup sendiri di sidebar**: kredensial Git, Notifikasi, Tujuan backup, Secret manager, Penyedia DNS, dan Sertifikat SSL kini satu halaman masing-masing.",
            en: "**Integrations have their own sidebar group**: Git credentials, Notifications, Backup destinations, Secret manager, DNS providers and SSL certificates now have a page each.",
          },
          {
            id: "**Tampilan lebih seragam**: semua tab memakai ikon dan garis bawah, menu pilihan terbuka di bawah kolomnya, teks terminal lebih proporsional, dan menu SSH terminal di Infrastruktur kini bernama Akses terminal.",
            en: "**A more consistent look**: every tab strip uses icons and an underline, select menus open below their field, terminal text is in proportion, and the terminal SSH menu under Infrastructure is now called Terminal access.",
          },
          {
            id: "**Membuka alamat API langsung** kini menampilkan JSON berisi nama dan versi API yang berjalan, bukan teks \"Hello World!\".",
            en: "**Opening the API address directly** now shows JSON with the API name and running version instead of \"Hello World!\".",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Logo template berwarna tidak lagi terbalik warnanya di mode gelap; hanya logo hitam yang dibalik.",
            en: "Coloured template logos are no longer inverted in dark mode; only black logos are.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.7",
    date: "2026-10-12",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Dashboard dua bahasa**: seluruh panel kini berbahasa Inggris dengan terjemahan Bahasa Indonesia. Ganti bahasa dari menu pengguna di sidebar; pilihan diingat di browser, dan notifikasi di kotak masuk ikut bahasa yang aktif. Dokumentasi dan situs ini juga English-first, dengan terjemahan Indonesia di `/id`.",
            en: "**A two-language dashboard**: the whole panel is now in English with an Indonesian translation. Switch language from the user menu in the sidebar; the choice is remembered in the browser, and inbox notifications follow the active language. This site and the documentation are English-first too, with the Indonesian translation under `/id`.",
          },
          {
            id: "**Integrasi Cloudflare DNS**: hubungkan token API Cloudflare di Pengaturan, Integrasi, lalu aoox membuatkan record A/AAAA untuk domain aplikasi, dengan opsi proxied (awan oranye). Proxy juga bisa memakai ACME DNS-01 untuk **sertifikat wildcard**, termasuk satu wildcard untuk preview pull request. Token disimpan terenkripsi dan tidak pernah ditampilkan lagi.",
            en: "**Cloudflare DNS integration**: connect a Cloudflare API token in Settings, Integrations, and aoox creates the A/AAAA record for an application domain, with a proxied (orange cloud) option. The proxy can also use ACME DNS-01 for **wildcard certificates**, including one wildcard for pull request previews. The token is stored encrypted and never shown again.",
          },
          {
            id: "**Peringatan ambang sumber daya**: aturan CPU dan memori opsional per aplikasi dan per database, dengan ambang dan durasi sendiri. Notifikasi dikirim saat terlampaui, diingatkan berkala, dan dikirim lagi saat kembali normal.",
            en: "**Resource threshold alerts**: optional CPU and memory rules per application and per database, each with its own threshold and duration. A notification is sent when it is exceeded, repeated as a reminder, and sent again when it is back to normal.",
          },
          {
            id: "**Mode perawatan per aplikasi**: satu saklar menampilkan halaman \"sedang dalam perawatan\" (HTTP 503) di semua domain aplikasi, dengan pesan yang bisa Anda tulis, sementara container tetap berjalan.",
            en: "**Per-application maintenance mode**: one switch shows an \"under maintenance\" page (HTTP 503) on every domain of the application, with a message you can write, while the container keeps running.",
          },
          {
            id: "**Halaman Docker** di sidebar: lihat container, image, volume, dan jaringan di host atau server remote, lihat log, serta start/stop/restart/hapus container yang bukan milik aoox. Resource milik aoox dilindungi dari tindakan di sini.",
            en: "**A Docker page** in the sidebar: browse containers, images, volumes and networks of the host or a remote server, read logs, and start/stop/restart/remove containers aoox does not own. aoox's own resources are protected from actions here.",
          },
          {
            id: "**Editor konfigurasi Traefik dinamis** (Infrastruktur, Reverse proxy) dengan preset (basic auth, header keamanan, rate limit, IP allowlist, redirect www) dan **middleware per domain**. Berkas yang ditolak Traefik dikembalikan otomatis ke versi sebelumnya.",
            en: "**A dynamic Traefik configuration editor** (Infrastructure, Reverse proxy) with presets (basic auth, security headers, rate limit, IP allowlist, www redirect) and **per-domain middlewares**. A file Traefik rejects is automatically restored to the previous version.",
          },
          {
            id: "**Terminal lebih mudah disiapkan**: tombol \"Authorize automatically\" memasang kunci SSH terminal di host dalam satu klik, dan `aoox install` kini menyiapkan kunci itu sendiri serta memakai pengguna `sudo` sebagai user SSH default.",
            en: "**An easier terminal setup**: an \"Authorize automatically\" button installs the terminal's SSH key on the host in one click, and `aoox install` now prepares that key itself and defaults the SSH user to the `sudo` user.",
          },
          {
            id: "**Progres deploy, kotak masuk notifikasi, dan daftar langkah awal**: stepper deploy dengan durasi tiap langkah, lonceng notifikasi dengan penanda belum dibaca, dan checklist untuk owner baru. **Command palette** (Ctrl+K) melompat ke halaman, project, dan resource.",
            en: "**Deploy progress, a notification inbox and a getting-started checklist**: a deploy stepper with per-step durations, a notification bell with an unread badge, and a checklist for a new owner. A **command palette** (Ctrl+K) jumps to pages, projects and resources.",
          },
          {
            id: "Dokumentasi baru untuk Cloudflare DNS, konfigurasi proxy, halaman Docker, peringatan sumber daya, dan mode perawatan, dalam bahasa Inggris dan Indonesia.",
            en: "New documentation for Cloudflare DNS, proxy configuration, the Docker page, resource alerts and maintenance mode, in English and Indonesian.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "**Viewer project hanya melihat**: halaman project (domain, deploy, mount, backup volume, job, webhook, stack) tidak lagi menampilkan tombol yang pasti ditolak API dengan 403.",
            en: "**Project viewers get read-only pages**: project pages (domains, deploy, mounts, volume backups, jobs, webhooks, stacks) no longer show controls that the API would refuse with 403.",
          },
          {
            id: "**Tampilan lebih rapi**: viewer log bersama dengan warna ANSI dan pencarian, grafik metrik halus dengan tooltip, status berupa titik berwarna, status dan tombol di bawah tab pada halaman aplikasi dan database, serta menu pengguna di dasar sidebar.",
            en: "**A tidier look**: a shared log viewer with ANSI colours and search, smooth metric charts with tooltips, status shown as a coloured dot, a status line under the tabs on application and database pages, and the user menu at the foot of the sidebar.",
          },
          {
            id: "Memindahkan aplikasi ke server lain kini ikut membawa sertifikat SSL kustomnya dan membersihkan middleware yang tidak ada di proxy tujuan. Pesan error autentikasi SSH terminal menyebut akun yang harus dipakai.",
            en: "Moving an application to another server now carries its custom SSL certificates along and drops middlewares that do not exist on the destination proxy. The terminal's SSH authentication error now names the account to use.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Menyimpan pengaturan di Infrastruktur, Environment tidak lagi menampilkan \"Cannot reach the server\" padahal perubahan berhasil diterapkan.",
            en: "Saving settings in Infrastructure, Environment no longer shows \"Cannot reach the server\" when the change was applied.",
          },
          {
            id: "Petunjuk environment stack compose kembali menampilkan daftar referensi database, dan error koneksi log menampilkan kalimat, bukan kunci mentah.",
            en: "The compose stack environment hint shows its database reference list again, and the log connection error shows a sentence instead of a raw key.",
          },
        ],
      },
    ],
  },
  {
    version: "0.1.0-alpha.6",
    date: "2026-10-05",
    channel: "alpha",
    groups: [
      {
        kind: "added",
        items: [
          {
            id: "**Sertifikat SSL kustom** untuk domain aplikasi: unggah sertifikat sendiri (CA perusahaan, wildcard beli, Cloudflare Origin CA) beserta kunci privatnya di Pengaturan, Integrasi, lalu pilih per domain di tab Domain sebagai ganti Let's Encrypt. Kunci disimpan terenkripsi dan tidak pernah ditampilkan lagi, pembaruan tidak perlu restart, dan sertifikat yang hampir atau sudah kedaluwarsa memicu notifikasi.",
            en: "**Custom SSL certificates** for application domains: upload your own certificate (company CA, purchased wildcard, Cloudflare Origin CA) with its private key in Settings, Integrations, then pick it per domain on the Domain tab instead of Let's Encrypt. The key is stored encrypted and never shown again, renewing needs no restart, and a certificate that is close to or past its expiry triggers a notification.",
          },
          {
            id: "**Admin UI database** sekali klik: pasang Adminer, phpMyAdmin, pgAdmin, Mongo Express, Redis Commander, atau DbGate di samping database terkelola, dalam container sendiri dengan akses lewat domain dan/atau IP & port.",
            en: "**Database Admin UI** in one click: install Adminer, phpMyAdmin, pgAdmin, Mongo Express, Redis Commander or DbGate next to a managed database, in its own container reachable through a domain and/or an IP and port.",
          },
          {
            id: "Kartu **Aktivitas terakhir** di dashboard (owner/admin) menampilkan 10 entri audit log terbaru dengan teks aksi yang mudah dibaca, dan setiap rute yang dicatat API kini punya teks tersendiri.",
            en: "A **Recent activity** card on the dashboard (owner/admin) shows the 10 latest audit-log entries with readable action texts, and every route the API records now has its own text.",
          },
          {
            id: "**Template Excalidraw** (template satu-klik ke-15): papan tulis open source sebagai klien statis tanpa database, dengan image yang dikunci pada digest.",
            en: "**Excalidraw template** (the 15th one-click template): the open source whiteboard as a static client without a database, with the image pinned by digest.",
          },
          {
            id: "Dokumentasi baru untuk sertifikat SSL kustom dan Admin UI database, serta pembaruan halaman template, dashboard, dan mount, dalam bahasa Indonesia dan Inggris.",
            en: "New documentation for custom SSL certificates and the database Admin UI, plus updates to the template, dashboard and mount pages, in Indonesian and English.",
          },
        ],
      },
      {
        kind: "changed",
        items: [
          {
            id: "**Ukuran teks seragam** di seluruh panel: teks biasa 12 px, judul kartu 13 px, dan field tetap 16 px di layar sentuh agar iOS tidak memperbesar halaman. Logo sidebar kini memenuhi kotaknya.",
            en: "**One text scale** across the panel: normal text is 12 px, card titles 13 px, and fields stay 16 px on touch screens so iOS does not zoom the page. The sidebar logo now fills its square.",
          },
          {
            id: "Semua konfirmasi hapus memakai **satu dialog** yang sama (bukan lagi pop-up browser), dan melepas mount menawarkan dua pilihan jelas: lepas saja, atau lepas dan hapus volume.",
            en: "Every delete confirmation uses **one shared dialog** (no more browser pop-ups), and detaching a mount offers two clear choices: detach only, or detach and delete the volume.",
          },
          {
            id: "Tab Pengaturan, Domain, Webhook, dan Environment kini selebar konten; form Pengaturan menjadi dua kolom di layar lebar. Tambah dan hapus database tambahan pindah ke tab Ringkasan.",
            en: "The Settings, Domain, Webhook and Environment tabs are now full width, and the settings form uses two columns on wide screens. Adding and dropping extra databases moved to the Overview tab.",
          },
        ],
      },
      {
        kind: "fixed",
        items: [
          {
            id: "Mengubah pengaturan aplikasi saat deployment berjalan tidak lagi dibatalkan diam-diam ketika deployment selesai, dan menghapus aplikasi kini ikut menghapus container preview pull request-nya.",
            en: "Changing application settings while a deployment runs is no longer silently reverted when it finishes, and deleting an application now also removes its pull request preview containers.",
          },
          {
            id: "Membuat database dengan port host yang sudah dipakai kini ditolak di awal dengan pesan jelas, bukan berakhir `error`.",
            en: "Creating a database with a host port that is already in use is now rejected up front with a clear message instead of ending in `error`.",
          },
          {
            id: "Mengganti sertifikat kustom tidak lagi memunculkan galat sementara \"private key does not match\" di proxy.",
            en: "Replacing a custom certificate no longer causes a transient \"private key does not match\" error in the proxy.",
          },
        ],
      },
    ],
  },
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
            en: "**External secret source (Infisical)** for application env: register a connection once in Settings, Integrations, then pick the project, environment and path on the application. Secrets are injected when the container is created, either all of them (sync) or through `${{secret.KEY}}` references. Nothing is stored in aoox, values are masked in logs, and pull request previews do not use it.",
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
            en: "The **New application** form and Settings are now split into cards per topic (Source, Build, Network and so on), so they are easier to scan.",
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
            en: "An **Update available** button at the bottom of the sidebar (owner only): the server periodically checks Docker Hub for the newest aoox version and the button opens the Update aoox page. It stays hidden for installs pinned to a tag, and stays silent without internet access.",
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
            en: "The **Apply update** button now asks for confirmation, shows progress while the panel restarts, and reloads the page by itself — without the misleading red error.",
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
