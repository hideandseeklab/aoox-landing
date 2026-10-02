# Backlink & visibilitas — tindakan manual

Berkas ini untuk **pemilik proyek**, bukan halaman situs (tidak di-deploy). Isinya hal-hal yang tidak bisa
dipasang lewat kode dan harus dilakukan sendiri dari akun GitHub, Docker Hub, npm, dan komunitas. Teks di
bawah siap tempel. Semua fakta tentang syarat direktori diambil dari sumbernya pada 2026-09-30 — periksa
ulang sebelum mengirim, aturan komunitas berubah.

## Catatan jujur dulu

- Tautan dari repo/profil kita sendiri (GitHub, npm, Docker Hub) sebagian besar berstatus `nofollow` atau
  tidak membawa bobot peringkat. Gunanya: **membantu mesin pencari menemukan** `aoox.dev` dan membuat
  profil resmi saling menguatkan (sinyal entitas). Ini bukan pengganti tautan alami dari situs lain.
- Bobot terbesar datang dari tautan yang **diberikan orang lain secara sukarela** karena produknya berguna:
  artikel, diskusi, daftar kurasi. Itu tumbuh dari kualitas docs, changelog yang rutin, dan proyek yang
  benar-benar dipakai. Jangan membeli tautan, menukar tautan massal, atau meminta teman meng-upvote —
  selain melanggar aturan komunitas, itu berisiko dihukum Google.
- Yang sudah dipasang lewat kode (rilis berikutnya): `homepage`/`repository`/`bugs`/`keywords` di keempat
  `package.json`, tautan `https://aoox.dev` di README keempat repo, label OCI di image Docker api/web,
  tautan GitHub/npm/Docker Hub di footer situs, dan JSON-LD `sameAs`.

## Urutan yang disarankan

1. **GitHub** — About/topics keempat repo + profil organisasi (10 menit, dampak langsung).
2. **Rilis alpha.4** (`npm version`, push tag) → `homepage`, README, dan label OCI mulai tampil di npm dan
   Docker Hub. Setelah itu putuskan soal tag `latest` npm (lihat bagian npm).
3. **Docker Hub** — short description + overview `aoox-api` dan `aoox-web`.
4. **Google Search Console + Bing Webmaster Tools** — verifikasi `aoox.dev` dan kirim
   `https://aoox.dev/sitemap.xml`. Ini yang paling mempercepat indeks.
5. Konten yang layak ditautkan: 1–2 tulisan teknis sungguhan (mis. cara kami men-deploy dengan Nixpacks/Railpack
   di server sendiri, atau pelajaran dari membangun PaaS) di blog sendiri, lalu dibagikan ke dev.to dan
   komunitas Indonesia.
6. **Show HN**, **r/selfhosted**, AlternativeTo, Product Hunt — setelah ada beberapa pengguna nyata, changelog
   yang berjalan, dan demo/instalasi yang mulus. Jangan semuanya di hari yang sama.
7. Daftar kurasi (awesome-*): **tunda** — lihat bagian "Direktori" (aoox belum memenuhi syaratnya).

## 1. GitHub

Deskripsi maksimal 350 karakter; topics maksimal 20, huruf kecil dan tanda hubung. Jalankan sendiri
(perintah ini **tidak** dijalankan oleh siapa pun selain Anda; butuh `gh auth login` dengan hak admin repo):

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

Lewat web (kalau tidak memakai `gh`): halaman repo → ikon roda gigi di kotak **About** → isi Description,
Website (`https://aoox.dev`), Topics.

**Organisasi `hideandseeklab`** (Settings → Profile): Description singkat, mis.
`Building aoox, a self-hosted PaaS — deploy from Git to your own server. https://aoox.dev`, isi URL
`https://aoox.dev`, dan unggah logo. Bila ingin README profil organisasi, buat repo publik bernama
`.github` dengan `profile/README.md`. Isi yang disarankan:

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

Repositori → **General** → edit **Short description** (maks. 100 karakter) dan **Overview** (Markdown).
Label OCI di Dockerfile terbaca setelah image dirilis ulang, tetapi kolom di atas diisi manual.

**Short description**

- `aoox-api` (96 karakter):
  `API of aoox, a self-hosted PaaS: deploy from Git on your own server. Docs: https://aoox.dev/docs`
- `aoox-web` (89 karakter):
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

Or install the CLI and run `aoox install` — see https://aoox.dev/docs/instalasi. This image is meant to run
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

Details: https://aoox.dev/docs/instalasi
````

## 3. npm (`@hideandseeklab/aoox`)

- `homepage`, `repository`, `bugs`, `keywords`, dan README (dengan tautan `aoox.dev`) baru tampil di halaman
  npm **setelah rilis berikutnya dipublikasikan** (`npm version` → push tag → workflow `npm-publish`).
- **Temuan penting — tag `latest`:** per 2026-09-30 registry npm memberi `latest` = `0.1.0-alpha.0` dan
  `alpha` = `0.1.0-alpha.4`. Halaman `https://www.npmjs.com/package/@hideandseeklab/aoox` menampilkan versi
  yang ditunjuk `latest`, jadi yang tampil di sana (README, homepage) masih alpha.0, dan
  `npm install -g @hideandseeklab/aoox` tanpa `@alpha` memasang alpha.0. Workflow publish sengaja tidak
  menggeser `latest` untuk pra-rilis. Selama proyek masih alpha, pilihan yang masuk akal:
  ```bash
  npm dist-tag add @hideandseeklab/aoox@0.1.0-alpha.4 latest   # setelah alpha.4 terbit
  ```
  (butuh login npm dengan hak publish/2FA; keputusan ini di tangan Anda, dampaknya: instalasi tanpa tag ikut
  ke pra-rilis terbaru). Alternatifnya, biarkan dan pastikan semua docs memakai `@alpha` (sudah begitu di
  halaman CLI).
- Setelah rilis, buka halaman npm dan pastikan tautan Homepage menunjuk `https://aoox.dev`.

## 4. Mesin pencari

- Google Search Console: tambah properti `https://aoox.dev` (verifikasi DNS TXT paling stabil), kirim
  `https://aoox.dev/sitemap.xml`, lalu "Request indexing" untuk beranda, `/docs`, `/docs/instalasi`,
  `/changelog` (ID dan EN). Cek laporan Pages dan pastikan `hreflang` id/en tidak dilaporkan error.
- Bing Webmaster Tools: impor dari Search Console (sekali klik).
- Bing + Yandex dan beberapa mesin lain memakai IndexNow; opsional, tidak wajib.

## 5. Direktori dan komunitas

Draf teks singkat; **tidak dikirim** oleh siapa pun selain Anda. Tulis sendiri dengan kata-kata Anda bila
komunitasnya melarang teks yang digenerasi mesin (lihat catatan tiap baris).

### awesome-selfhosted — **tidak memenuhi syarat** (jangan kirim)

Sumber: `CONTRIBUTING.md` di `awesome-selfhosted/awesome-selfhosted-data`. Syarat objektif: rilis pertama
lebih dari 4 bulan lalu (aoox: alpha.0 pada 2026-09-25 → paling cepat 2027-01-25), dipelihara aktif,
instruksi instalasi yang berfungsi, lisensi bebas (Apache-2.0 memenuhi). **Tetapi** bagian "What does not
qualify" menolak eksplisit "Software acts as a platform to build and deploy arbitrary applications (PaaS,
'serverless'...)". README mereka juga mengarahkan PaaS ke awesome-sysadmin. Selain itu kontribusi yang
digenerasi mesin/LLM "will result in a ban". Kesimpulan: tidak ada gunanya; jangan diajukan.

### awesome-sysadmin (kategori PaaS) — **belum**, kandidat jangka panjang

Sumber: `PULL_REQUEST_TEMPLATE.md` di `awesome-foss/awesome-sysadmin-data`. Daftar ini punya kategori PaaS
(berisi CapRover, Coolify, Dokku). Syarat di templatnya: perangkat lunak bebas (Apache-2.0 ✓), belum terdaftar
di awesome-selfhosted, dipelihara aktif, ada instruksi instalasi yang berfungsi — dan
**"first released more than 12 months ago"** (aoox: paling cepat 2027-09-25) serta "not your own, unless you
have a healthy ecosystem with a few contributors (which aren't your sock puppet accounts)". Jadi: belum
memenuhi syarat sekarang; jangan diajukan sebelum lewat 12 bulan **dan** ada kontributor/pengguna nyata di
luar tim. Bila saatnya, satu item per PR, isi "Why is it awesome?" dengan jujur (kelebihan nyata, tanpa
klaim berlebihan).

### AlternativeTo — layak, risiko rendah

Situs direktori alternatif perangkat lunak; formulir "Suggest new app" gratis dan melewati moderasi.
Belum saya verifikasi otomatis (situsnya memblokir pemeriksaan otomatis) — baca panduan mereka sebelum
mengirim. Bila mengarang perbandingan ("alternatif X"), pastikan benar dan tidak menyesatkan. Draf:

- Nama: `aoox`
- Tagline: `Self-hosted PaaS: deploy from Git to your own server`
- Deskripsi: `aoox is an open-source (Apache-2.0) self-hosted PaaS. Connect a Git repo or pick an image and aoox builds (Dockerfile, Nixpacks, Railpack, or static sites), deploys with health checks and rollback, and serves it behind Traefik with automatic HTTPS. It also runs managed databases (PostgreSQL, MySQL, MariaDB, Redis/Valkey, MongoDB) with backups, one-click templates, scheduled jobs, monitoring, notifications and a CLI. One dashboard, your own server, no vendor lock-in. Alpha.`
- Tautan: https://aoox.dev · Sumber: https://github.com/hideandseeklab/aoox-api

### Product Hunt — opsional, tunda

Butuh akun maker, aset visual (galeri, ikon), dan hari peluncuran yang direncanakan. Efeknya lonjakan
sesaat; untuk proyek alpha, lebih baik menunggu rilis yang stabil dan demo yang rapi. Jangan minta teman
meng-upvote. Belum diverifikasi otomatis.

### Hacker News — "Show HN"

Aturan resmi (`news.ycombinator.com/showhn.html`, dibaca 2026-09-30): Show HN untuk karya yang bisa **dicoba**
orang, bukan landing page; proyek harus non-trivial dan Anda ada untuk berdiskusi; mudahkan orang
mencobanya tanpa sign-up; "New features and upgrades (Foo 1.3.1 is out)" tidak layak; jangan meminta teman
meng-upvote/komentar. Format: judul `Show HN: aoox – self-hosted PaaS (deploy from Git to your own server)`,
tautan ke `https://aoox.dev` atau repo, lalu **komentar pertama Anda sendiri** berisi cerita: kenapa dibuat,
apa yang berbeda (mis. build Nixpacks/Railpack + Traefik + blue/green dalam satu panel), apa yang belum ada
(alpha, satu node utama, dll.), dan cara mencobanya (satu perintah instalasi). Waktu: hari kerja pagi waktu
AS (Selasa–Kamis), saat Anda bisa membalas komentar berjam-jam. Risiko: kritik keras terhadap kualitas alpha
dan kompetisi Coolify/Dokku/CapRover — siapkan jawaban jujur. Kirim **sekali**; jangan diulang.

### r/selfhosted — periksa aturannya dulu

Saya **tidak bisa memverifikasi** aturan subreddit ini (Reddit memblokir akses otomatis dan kotak aturan
tidak terbaca). Sebelum posting, baca sendiri **Rules** dan **wiki** subreddit — subreddit besar seperti
ini biasanya membatasi promosi diri (mis. rasio kontribusi vs promosi, format/hari khusus untuk proyek
baru, atau keharusan menyebut proyek dibuat sendiri). Kalau ada thread/hari khusus proyek baru, pakai itu.
Draf umum: judul jujur ("Built a self-hosted PaaS (alpha) — feedback welcome"), sebutkan bahwa Anda
pembuatnya, apa yang dilakukan, apa yang belum, tautan repo dan docs, dan tanyakan pertanyaan spesifik.
Jangan posting ulang setiap rilis. Risiko: dihapus moderator dan terkesan spam.

### dev.to / Medium / komunitas developer Indonesia

Paling bernilai bila berupa **artikel** yang berguna (bukan iklan): mis. "Deploy Next.js dari Git ke VPS
sendiri tanpa vendor lock-in" atau "Menjalankan PaaS di satu VPS: Traefik, blue/green, dan health check".
Sertakan tautan `aoox.dev` secara wajar di tengah isi, bukan hanya di akhir. Untuk komunitas Indonesia
(grup Telegram/Discord developer, forum), baca aturan promosi masing-masing dan posting di kanal yang
memang untuk "showcase". Tulis dalam bahasa yang sesuai audiensnya.

## 6. Pemeliharaan (rutin, bukan sekali)

- Setiap rilis: isi entri di `src/content/changelog.ts` lalu `npm run check-release` (lihat `RELEASING.md`).
  Changelog yang hidup adalah alasan orang kembali dan menautkan.
- Jangan membuat tautan mati: bila memindahkan repo/URL, perbarui `package.json`, README, `sameAs` di
  `src/lib/seo.ts`, dan teks di berkas ini.
