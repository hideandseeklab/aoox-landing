import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  H3,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/cli",
  lang: "id",
  title: "Mulai dengan CLI",
  description:
    "Pasang aoox, simpan token panel, dan pakai di CI.",
})

const SUMMARY = [
  { k: "Perintah", v: "aoox" },
  { k: "Autentikasi", v: "API token aoox_… dari panel" },
  { k: "Butuh", v: "Script installer (tanpa Node.js), atau Node.js 22+ (npm)" },
]

const COMMANDS = [
  {
    cmd: "aoox install",
    what: "Memasang aoox (postgres + api + web) di VPS baru lewat Docker Compose.",
    flags: "--web-domain, --api-domain, --acme-email, --admin-email/-name/-password, --dir, --force, --yes/-y",
  },
  {
    cmd: "aoox login",
    what: "Menyimpan URL panel dan API token untuk perintah lain.",
    flags: "--url/-u, --token/-t",
  },
  {
    cmd: "aoox whoami",
    what: "Menampilkan akun dan panel yang sedang dipakai.",
    flags: "--url/-u, --token/-t, --json",
  },
  {
    cmd: "aoox link",
    what: "Menghubungkan folder repo ke sebuah aplikasi di panel (dipakai aoox deploy).",
    flags: "--project, --app",
  },
  {
    cmd: "aoox deploy",
    what: "Build image lokal, push ke registry, lalu deploy — mengikuti log sampai selesai.",
    flags: "--tag, --dockerfile/-f, --context, --registry",
  },
  {
    cmd: "aoox domain set",
    what: "Set domain kustom untuk panel itu sendiri (dashboard + API) tanpa SSH.",
    flags: "--web, --api, --acme-email",
  },
  {
    cmd: "aoox registry domain",
    what: "Set atau hapus domain kustom untuk registry self-hosted.",
    flags: "--set, --clear",
  },
  {
    cmd: "aoox update",
    what: "Cek atau terapkan update untuk panel aoox itu sendiri.",
    flags: "--apply",
  },
  {
    cmd: "aoox reinstall",
    what: "Perbaiki/segarkan instalasi panel yang ada tanpa kehilangan data (compose ditulis ulang, .env.dist digabung, pull + recreate).",
    flags: "--dir, --dry-run, --yes, --no-pull, --terminal-ssh-user",
  },
  {
    cmd: "aoox help [PERINTAH]",
    what: "Daftar perintah, atau bantuan satu perintah.",
    flags: "—",
  },
]

const NEXT = [
  { title: "Pengguna & peran", description: "Membuat API token dan scope-nya.", href: "/docs/pengguna-peran#akun" },
  { title: "Instalasi", description: "Langkah manual yang di-otomatisasi aoox install.", href: "/docs/instalasi" },
  { title: "Registry", description: "Tempat image dari aoox deploy disimpan.", href: "/docs/registry" },
  { title: "Deploy & rollback", description: "Apa yang terjadi di balik layar saat deploy.", href: "/docs/deploy" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/cli"
      title="Mulai dengan CLI"
      description="aoox adalah CLI resmi aoox: menyimpan kredensial panel di mesinmu dan berbicara ke API yang sama dengan dashboard."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <Callout kind="warn" title="Tahap awal">
        CLI sudah bisa memasang aoox (<Code>install</Code>), masuk (
        <Code>login</Code>/<Code>whoami</Code>), dan build + deploy repo lokal
        (<Code>link</Code>/<Code>deploy</Code>). Perintah untuk project,
        database, log tail, dan lainnya belum ada — untuk itu pakai dashboard,{" "}
        <DocLink href="/docs/webhook">webhook</DocLink>, atau panggil API
        langsung dengan token yang sama.
      </Callout>

      <H2 id="instalasi-cli">Memasang CLI</H2>
      <P>
        Di Linux atau macOS, script installer memasang <Code>aoox</Code> tanpa
        perlu Node.js sama sekali — tarball-nya membawa runtime Node sendiri:
      </P>
      <Pre title="Linux / macOS, tanpa Node.js">{`curl -fsSL https://aoox.dev/install-cli.sh | sh

aoox --version`}</Pre>
      <P>
        Terpasang ke <Code>/usr/local/lib/aoox</Code> +{" "}
        <Code>/usr/local/bin/aoox</Code> (root/sudo), atau{" "}
        <Code>~/.local/lib/aoox</Code> kalau tidak ada akses itu. Menjalankan
        ulang perintah yang sama berarti upgrade. Mendukung Linux (glibc —{" "}
        <strong>bukan</strong> Alpine/musl) dan macOS, x64 maupun arm64.
      </P>
      <Callout kind="note" title="Windows, Alpine, atau sudah punya Node.js?">
        Pakai npm — butuh <strong>Node.js 22+</strong> lebih dulu. Masih rilis{" "}
        <Code>alpha</Code> — pasang eksplisit dengan tag itu.
      </Callout>
      <Pre title="Dari npm">{`npm install -g @hideandseeklab/aoox@alpha

aoox --version`}</Pre>
      <P>
        Perintah terpasang sebagai <Code>aoox</Code> meski nama paketnya{" "}
        <Code>@hideandseeklab/aoox</Code>. Untuk ikut <Code>main</Code> sebelum
        dirilis, pasang dari source:
      </P>
      <Pre title="Dari source">{`git clone https://github.com/hideandseeklab/aoox-cli.git
cd aoox-cli
npm install
npm run build
npm link          # menyediakan perintah aoox secara global

aoox --version`}</Pre>

      <H2 id="install">Memasang aoox lewat aoox install</H2>
      <P>
        Perintah ini berbeda dari bagian sebelumnya: <Code>aoox install</Code>{" "}
        tidak menyambung ke panel yang sudah ada — ia{" "}
        <strong>memasang panelnya sendiri</strong> (postgres + api + web) di
        VPS Linux yang masih kosong, sebagai alternatif cara manual di{" "}
        <DocLink href="/docs/instalasi">Instalasi</DocLink>. Jalankan sebagai
        root, langsung di server tujuan.
      </P>
      <Pre title="Paling sederhana (tanpa domain, akses lewat IP)">{`$ sudo aoox install
==> Mendeteksi IP publik server
Pasang aoox di /opt/aoox dan jalankan docker compose up -d? (Y/n)
==> Menjalankan docker compose up -d
==> Menunggu API siap

aoox terpasang di /opt/aoox.
Buka: http://203.0.113.10:3000
Buat akun owner pertama di /setup.`}</Pre>
      <Pre title="Dengan domain + HTTPS otomatis dan owner langsung dibuat">{`sudo aoox install \\
  --web-domain panel.example.com \\
  --api-domain api.panel.example.com \\
  --acme-email saya@example.com \\
  --admin-email saya@example.com \\
  --admin-name "Admin" \\
  --admin-password "kata-sandi-kuat" \\
  --yes`}</Pre>
      <Ul>
        <li>
          Docker dipasang otomatis lewat <Code>get.docker.com</Code> bila
          belum ada — minta konfirmasi kecuali <Code>--yes</Code>.
        </li>
        <li>
          <Code>--web-domain</Code> dan <Code>--api-domain</Code> saling
          mensyaratkan, dan keduanya butuh <Code>--acme-email</Code> untuk
          sertifikat Let&apos;s Encrypt lewat proxy bawaan.
        </li>
        <li>
          Tanpa <Code>--admin-email</Code>, buat akun owner lewat{" "}
          <Code>/setup</Code> di browser seperti instalasi manual.
        </li>
        <li>
          Folder instalasi default <Code>/opt/aoox</Code> (ubah dengan{" "}
          <Code>--dir</Code>); instalasi yang sudah ada di folder itu ditolak
          kecuali diberi <Code>--force</Code>.
        </li>
        <li>
          Secret (<Code>JWT_SECRET</Code>, <Code>ENCRYPTION_KEY</Code>,
          password Postgres) dibuat acak dan ditulis ke{" "}
          <Code>.env.dist</Code> dengan mode <Code>0600</Code> — tidak perlu
          <Code>openssl rand</Code> manual.
        </li>
      </Ul>
      <Callout>
        Perintah ini menjalankan ulang langkah-langkah di{" "}
        <DocLink href="/docs/instalasi">Instalasi</DocLink> secara otomatis:
        clone compose distribusi, isi env, <Code>docker compose up -d</Code>,
        lalu tunggu <Code>/auth/setup-status</Code> menjawab. Bukan pengganti
        <Code>aoox login</Code> — setelah panel terpasang, login seperti biasa
        untuk memakai <Code>aoox link</Code>/<Code>aoox deploy</Code>.
      </Callout>

      <H2 id="login">Masuk ke panel</H2>
      <Steps>
        <Step title="Buat API token di panel">
          <P>
            <strong>Settings → API token</strong>: beri nama (mis.{" "}
            <Code>laptop-saya</Code>), pilih kedaluwarsa, lalu salin token{" "}
            <Code>aoox_…</Code> yang hanya tampil sekali. Token bertindak{" "}
            <strong>sebagai pemiliknya</strong> dengan peran yang sama — lihat{" "}
            <DocLink href="/docs/pengguna-peran#akun">Keamanan akun</DocLink>.
          </P>
        </Step>
        <Step title="Jalankan aoox login">
          <Pre>{`$ aoox login
URL panel  https://panel.example.com
API token (aoox_…) ********
Memverifikasi token... ok
Masuk sebagai kamu@example.com (owner) di https://panel.example.com
Token disimpan di /home/kamu/.config/aoox/config.json`}</Pre>
          <P>
            Token diminta lewat prompt tersembunyi, bukan argumen, supaya tidak
            tertinggal di riwayat shell atau daftar proses. Sebelum disimpan,
            CLI memanggil <Code>GET /auth/me</Code> — kredensial yang ditolak
            tidak pernah ditulis ke disk.
          </P>
        </Step>
        <Step title="Pastikan tersambung">
          <Pre>{`$ aoox whoami
kamu@example.com · owner · Admin
Panel: https://panel.example.com`}</Pre>
          <P>
            Tambahkan <Code>--json</Code> untuk keluaran yang bisa diproses
            skrip; baris teks di atas otomatis disembunyikan.
          </P>
        </Step>
      </Steps>

      <H2 id="link-deploy">Build & deploy dari repo lokal</H2>
      <P>
        <Code>aoox link</Code> menghubungkan folder repo ke satu aplikasi di
        panel, lalu <Code>aoox deploy</Code> membangun image di mesinmu,
        mem-push-nya ke registry, dan memicu deploy — mengikuti log sampai
        selesai seperti tab Deploy di dashboard.
      </P>
      <Steps>
        <Step title="Link folder ke aplikasi">
          <Pre>{`$ cd repo-aplikasiku
$ aoox link
? Pilih project › toko
? Pilih aplikasi › shop (shop)
Ter-link: toko / shop (shop)
Ditulis ke .aoox.json — aman di-commit, tidak memuat rahasia.`}</Pre>
          <P>
            <Code>--project</Code>/<Code>--app</Code> melewati pemilihan
            interaktif — dipakai di CI. File <Code>.aoox.json</Code>{" "}
            yang dihasilkan tidak berisi token, aman masuk repo.
          </P>
        </Step>
        <Step title="Deploy">
          <Pre>{`$ aoox deploy
==> Build localhost:5000/toko/shop:a1b2c3d
==> docker login localhost:5000
==> Push localhost:5000/toko/shop:a1b2c3d
==> Memutakhirkan aplikasi & memicu deploy
[building] Building localhost:5000/toko/shop:a1b2c3d from https://…
...
Deployed: localhost:5000/toko/shop:a1b2c3d`}</Pre>
          <P>
            Build berjalan di Docker lokal (<Code>docker build</Code> dengan{" "}
            <Code>--dockerfile</Code>/<Code>--context</Code>), lalu di-push ke
            registry aplikasi itu — default registry self-hosted bila ada
            lebih dari satu, pilih manual dengan <Code>--registry</Code>. Tag
            default git short SHA (<Code>+ -dirty</Code> bila ada perubahan
            belum di-commit); timpa dengan <Code>--tag</Code>.
          </P>
        </Step>
      </Steps>
      <Callout>
        Aplikasi otomatis dipindah ke <Code>sourceType: image</Code> memakai
        registry dan tag yang baru saja di-push — bukan mem-build ulang di
        server seperti build dari Git.{" "}
        <DocLink href="/docs/aplikasi#sumber">Dua sumber aplikasi</DocLink>.
        Deploy yang masih berjalan untuk aplikasi yang sama ditolak (409) —
        tunggu selesai dulu.
      </Callout>

      <H2 id="domain">Ganti domain panel</H2>
      <P>
        Alternatif dari Settings → Domain panel di dashboard — cocok untuk
        skrip provisioning. Lihat{" "}
        <DocLink href="/docs/domain-panel">Domain untuk panel</DocLink> untuk
        detail apa yang terjadi di baliknya.
      </P>
      <Pre>{`$ aoox domain set --web panel.example.com --api api.panel.example.com \\
  --acme-email kamu@example.com
Domain disimpan: panel.example.com (dashboard), api.panel.example.com (API).
Panel akan restart beberapa detik untuk menerapkannya — koneksi ke API ini akan sempat terputus.`}</Pre>
      <Callout>
        Panel harus sudah punya <Code>INSTALL_DIR</Code> terisi di{" "}
        <Code>.env.dist</Code> (path absolut folder <Code>docker-compose.dist.yml</Code>{" "}
        di host itu) — tanpa itu perintah gagal dengan 400.
      </Callout>

      <H2 id="update">Update aoox</H2>
      <P>
        Cek dan terapkan update untuk panel itu sendiri (bukan aplikasi yang
        di-deploy) — bandingkan digest image <Code>aoox-api</Code>/
        <Code>aoox-web</Code> di registry, bukan sekadar nomor versi.
      </P>
      <Pre>{`$ aoox update
Versi berjalan: 0.1.0-alpha.1
  api: hideandseeklab/aoox-api:latest (update tersedia)
  web: hideandseeklab/aoox-web:latest (terbaru)
Update tersedia. Jalankan dengan --apply untuk menerapkannya.

$ aoox update --apply
Update diterapkan — panel akan restart beberapa detik untuk menerapkannya.`}</Pre>
      <P>
        Sama seperti <Code>aoox domain set</Code>, butuh <Code>INSTALL_DIR</Code>{" "}
        terisi. Lihat <DocLink href="/docs/instalasi#update">Memperbarui versi</DocLink>{" "}
        untuk cara manual lewat SSH sebagai alternatif.
      </P>

      <H2 id="reinstall">Memperbaiki instalasi (aoox reinstall)</H2>
      <P>
        <Code>aoox update</Code> hanya <Code>pull</Code> + <Code>up -d</Code>: ia
        tidak menulis ulang <Code>docker-compose.dist.yml</Code> dan tidak
        menambah variabel baru ke <Code>.env.dist</Code>. Instalasi lama karena
        itu tidak menerima perbaikan yang butuh perubahan compose atau env
        (contoh nyata: Terminal error <Code>TERMINAL_SSH_USER is not set</Code>{" "}
        setelah update, karena instalasi lama tidak pernah menulis variabel
        itu). <Code>aoox reinstall</Code> memperbaikinya <strong>tanpa
        menyentuh data</strong>. Jalankan di server panel, sebagai root:
      </P>
      <Pre title="Lihat dulu apa yang akan berubah, lalu terapkan">{`$ sudo aoox reinstall --dry-run
$ sudo aoox reinstall`}</Pre>
      <Table
        head={["Langkah", "Yang terjadi"]}
        rows={[
          [
            "Backup",
            <>File yang akan berubah disalin ke <Code>&lt;dir&gt;/backups/&lt;waktu&gt;/</Code> (<Code>.env.dist</Code> tetap izin 600).</>,
          ],
          [
            "Compose",
            <><Code>docker-compose.dist.yml</Code> (dan <Code>docker-compose.domain.yml</Code> bila ada) ditulis ulang dari salinan yang dibundel di CLI. <Code>docker-compose.override.yml</Code> milik fitur Domain panel/Environment <strong>tidak disentuh</strong>.</>,
          ],
          [
            ".env.dist",
            <>Digabung, bukan dibuat ulang: semua nilai, urutan, komentar, dan key tak dikenal dipertahankan; hanya key yang belum ada dan punya default aman yang ditambahkan (mis. <Code>TERMINAL_SSH_USER=root</Code>, <Code>INSTALL_DIR</Code>). <Code>POSTGRES_PASSWORD</Code>, <Code>JWT_SECRET</Code>, <Code>ENCRYPTION_KEY</Code> tidak pernah diubah — bila salah satunya hilang, perintah berhenti dengan pesan jelas.</>,
          ],
          [
            "Jalankan ulang",
            <><Code>docker compose pull</Code> lalu <Code>up -d --force-recreate</Code> memakai daftar file compose yang sama dengan stack yang sedang berjalan. Volume (database) tidak disentuh. Lalu menunggu API sehat dan mencetak ringkasan.</>,
          ],
        ]}
      />
      <P>
        Aman dijalankan berulang: bila tidak ada yang perlu diubah, tidak ada
        file yang ditulis dan tidak ada backup — container tetap disegarkan.
        Opsi: <Code>--dir</Code> (default <Code>/opt/aoox</Code>),{" "}
        <Code>--yes</Code> (tanpa konfirmasi), <Code>--no-pull</Code>,{" "}
        <Code>--terminal-ssh-user &lt;user&gt;</Code> (mengisi atau menimpa nilai
        itu), dan <Code>--dry-run</Code> (hanya cetak rencana).
      </P>
      <Callout kind="warn" title="Jangan pakai aoox install --force untuk memperbaiki">
        <Code>aoox install --force</Code> menulis <Code>.env.dist</Code> baru
        dengan secret acak baru: database lama tidak bisa diakses lagi dan semua
        kredensial tersimpan tidak bisa didekripsi. Untuk instalasi yang sudah
        berjalan, selalu pakai <Code>aoox reinstall</Code>.
      </Callout>
      <P>
        Tanpa CLI: edit <Code>.env.dist</Code> langsung (mis. tambah{" "}
        <Code>TERMINAL_SSH_USER=root</Code>) atau pakai halaman{" "}
        <DocLink href="/docs/environment">Environment</DocLink> di Settings, lalu{" "}
        <Code>docker compose … up -d</Code>.
      </P>

      <H2 id="perintah">Referensi perintah</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Perintah</th>
              <th className="px-3 py-2 text-left font-medium">Fungsi</th>
              <th className="px-3 py-2 text-left font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {COMMANDS.map((row) => (
              <tr key={row.cmd} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{row.cmd}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{row.what}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.flags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="konfigurasi">Konfigurasi & variabel lingkungan</H2>
      <Table
        head={["Sumber", "Isi", "Catatan"]}
        rows={[
          [
            <Code key="1">config.json</Code>,
            <>
              <Code>{'{ "url": "…", "token": "aoox_…" }'}</Code> di direktori
              konfigurasi oclif (<Code>~/.config/aoox/</Code> di Linux).
            </>,
            <>Ditulis dengan mode <Code>0600</Code>; jalur lengkapnya dicetak saat login.</>,
          ],
          [
            <><Code>--url</Code> / <Code>--token</Code></>,
            "Menimpa isi file untuk satu perintah.",
            "Berguna saat berpindah antar panel (produksi vs staging).",
          ],
          [
            <><Code>AOOX_URL</Code> / <Code>AOOX_TOKEN</Code></>,
            "Sumber yang sama lewat environment.",
            "Dipakai CI; muncul juga di --help.",
          ],
        ]}
      />
      <Ul>
        <li>
          Urutan: flag → environment → isi <Code>config.json</Code>. Bila tidak
          ada yang lengkap, CLI menyuruh menjalankan <Code>aoox login</Code>.
        </li>
        <li>
          Beberapa panel? Jangan login ulang bolak-balik — simpan satu sebagai
          default lalu timpa dengan <Code>--url</Code>/<Code>--token</Code>{" "}
          seperlunya.
        </li>
      </Ul>

      <H3>Di CI (tanpa terminal)</H3>
      <P>
        <Code>aoox login</Code> butuh terminal interaktif. Di pipeline, lewati
        login dan berikan kredensial lewat environment:
      </P>
      <Pre title=".gitlab-ci.yml">{`deploy:
  image: node:20
  variables:
    AOOX_URL: https://panel.example.com
  script:
    - npx -p @hideandseeklab/aoox aoox whoami   # AOOX_TOKEN dari CI variable (masked)`}</Pre>
      <Callout>
        Simpan token sebagai variabel CI yang <em>masked</em>, dan buat token
        terpisah per pipeline agar bisa dicabut tanpa mengganggu yang lain.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Pesan", "Penyebab & solusi"]}
        rows={[
          [
            <>Token ditolak panel (401)</>,
            <>Token kedaluwarsa, dicabut, atau salah salin. Buat token baru di Settings → API token.</>,
          ],
          [
            <>Tidak ada terminal interaktif</>,
            <>Berjalan di CI/skrip. Beri <Code>--url</Code> dan <Code>--token</Code>, atau set <Code>AOOX_URL</Code> dan <Code>AOOX_TOKEN</Code>.</>,
          ],
          [
            <>Tidak bisa menghubungi panel</>,
            <>URL salah atau API tidak terjangkau dari mesin ini. Pakai <Code>PUBLIC_API_URL</Code> panel (bukan URL dashboard) dan uji dengan <Code>curl &lt;url&gt;/auth/setup-status</Code>.</>,
          ],
          [
            <>Config rusak (bukan JSON yang sah)</>,
            <>File konfigurasi teredit manual. Hapus file itu lalu <Code>aoox login</Code> lagi.</>,
          ],
          [
            <>403 pada perintah tertentu</>,
            <>Peran akun pemilik token tidak cukup — token tidak menambah hak apa pun di atas pemiliknya. Bila tokennya punya scope, lihat <DocLink href="/docs/pengguna-peran#akun">token read-only/project-limited</DocLink>.</>,
          ],
          [
            <>Repo ini belum di-link</>,
            <><Code>aoox deploy</Code> dijalankan sebelum <Code>aoox link</Code>. Jalankan <Code>aoox link</Code> dulu di folder repo.</>,
          ],
          [
            <>Sudah ada deployment yang berjalan (409)</>,
            <>Aplikasi yang sama sedang di-deploy — dari dashboard, webhook, atau <Code>aoox deploy</Code> lain. Tunggu selesai, cek tab Deploy.</>,
          ],
          [
            <>aoox install: perlu root</>,
            <>Jalankan dengan <Code>sudo</Code> — instalasi menulis ke path sistem dan mengelola Docker.</>,
          ],
          [
            <>aoox install: sudah ada instalasi di …</>,
            <>Folder <Code>--dir</Code> (default <Code>/opt/aoox</Code>) sudah terisi. Untuk memperbaiki instalasi itu, pakai <Code>aoox reinstall</Code>. <Code>--force</Code> hanya untuk instalasi ulang dari nol (membuat secret baru — data lama tidak terbaca), atau pakai <Code>--dir</Code> lain.</>,
          ],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Perintah untuk project, log tail mandiri, dan database; paket npm
        resmi; autocomplete shell; keluaran <Code>--json</Code> untuk semua
        perintah (baru <Code>whoami</Code>).
      </Callout>

      <H2 id="berikutnya">Langkah berikutnya</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
        {NEXT.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 bg-background p-4 transition-colors hover:bg-muted/60"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </span>
            <ArrowRight className="mt-1 size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </DocPage>
  )
}
