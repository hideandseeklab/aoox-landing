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

export const metadata: Metadata = { title: "Mount" }

const SUMMARY = [
  { k: "Jenis", v: "Volume · Bind · File" },
  { k: "Efek", v: "Container dibuat ulang, tanpa build" },
  { k: "Backup", v: "Volume saja (manual/terjadwal, S3)" },
]

const DECISION = [
  { q: "Data yang ditulis aplikasi harus bertahan antar deploy (upload, SQLite, cache)?", a: "Volume" },
  { q: "Butuh membaca/menulis folder yang sudah ada di host?", a: "Bind (owner/admin)" },
  { q: "Hanya perlu menyuntikkan satu file konfigurasi?", a: "File" },
]

const EXAMPLES = [
  { jenis: "Volume", path: "/app/uploads", sumber: "uploads", catatan: "Volume aoox_app_shop_uploads" },
  { jenis: "Volume", path: "/data", sumber: "data", catatan: "SQLite / cache" },
  { jenis: "Bind", path: "/srv/media", sumber: "/mnt/storage/media", catatan: "Path host, owner/admin" },
  { jenis: "File", path: "/etc/nginx/conf.d/app.conf", sumber: "(isi di textarea)", catatan: "Read-only" },
]

const NEXT = [
  { title: "Backup & restore", description: "Backup volume manual/terjadwal, salinan S3.", href: "/docs/backup#volume" },
  { title: "Deploy & rollback", description: "Blue/green dan volume bersama.", href: "/docs/deploy#blue-green" },
  { title: "Pengguna & peran", description: "Siapa boleh bind mount.", href: "/docs/pengguna-peran" },
  { title: "Managed database", description: "Alternatif volume untuk data relasional.", href: "/docs/database" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/mount"
      title="Mount"
      description="Menyimpan data yang harus bertahan antar deploy, mengakses path host, atau menyuntikkan file konfigurasi ke container aplikasi maupun managed database."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Kapan butuh mount?</H2>
      <P>
        Filesystem container <strong>hilang setiap deploy</strong> — container
        lama dihapus, yang baru dibuat dari image. Apa pun yang ditulis
        aplikasi ke disk harus ditaruh di mount kalau ingin bertahan.
      </P>
      <div className="border border-border text-xs">
        {DECISION.map((row, i) => (
          <div
            key={row.q}
            className={`grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <span className="text-foreground">{row.q}</span>
            <span className="text-muted-foreground">
              → <span className="text-primary-foreground dark:text-primary">{row.a}</span>
            </span>
          </div>
        ))}
      </div>

      <H2 id="jenis">Tiga jenis mount</H2>
      <Table
        head={["Jenis", "Sumber", "Siapa", "Catatan"]}
        rows={[
          [
            <strong key="v">Volume</strong>,
            <>
              Volume Docker <Code>{"aoox_app_<app>_<nama>"}</Code>
            </>,
            "Semua anggota",
            "Data bertahan antar deploy. Bisa di-backup.",
          ],
          [
            <strong key="b">Bind</strong>,
            "Path di host",
            "Owner/admin",
            "Setara akses filesystem host. Belum bisa di-backup.",
          ],
          [
            <strong key="f">File</strong>,
            "Isi teks yang disimpan di aoox",
            "Semua anggota",
            "Selalu read-only. Cocok untuk config (nginx.conf, .env statis).",
          ],
        ]}
      />

      <H2 id="langkah">Menambah mount</H2>
      <Steps>
        <Step title="Buka tab Mount → Tambah mount">
          <P>
            Pilih <strong>Jenis</strong>, isi <strong>Path di container</strong>{" "}
            (unik per aplikasi), lalu <strong>Nama volume</strong> /{" "}
            <strong>Path di host</strong> / <strong>Isi file</strong> sesuai jenis.
          </P>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Jenis</th>
                  <th className="px-3 py-2 text-left font-medium">Path di container</th>
                  <th className="px-3 py-2 text-left font-medium">Sumber</th>
                  <th className="px-3 py-2 text-left font-medium">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((row) => (
                  <tr key={row.path} className="border-t border-border">
                    <td className="px-3 py-2 text-foreground">{row.jenis}</td>
                    <td className="px-3 py-2"><Code>{row.path}</Code></td>
                    <td className="px-3 py-2"><Code>{row.sumber}</Code></td>
                    <td className="px-3 py-2 text-muted-foreground">{row.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step title="Container dibuat ulang otomatis">
          <P>
            Setiap tambah/ubah/hapus mount memicu recreate container dari image
            saat ini — tanpa build. Aplikasi restart singkat; env dan domain
            ikut diterapkan ulang.
          </P>
        </Step>
        <Step title="Verifikasi">
          <P>
            Tab Deploy → log container menunjukkan aplikasi start ulang. Untuk
            memastikan path terpasang, jalankan{" "}
            <DocLink href="/docs/jobs">job</DocLink> manual{" "}
            <Code>ls -la /app/uploads</Code> dengan target <em>Di container</em>.
          </P>
        </Step>
      </Steps>

      <H2 id="database">Mount untuk managed database</H2>
      <P>
        Halaman database juga punya tab <strong>Mount</strong> dengan tiga
        jenis yang sama — biasanya untuk file konfigurasi engine atau volume
        tambahan:
      </P>
      <Table
        head={["Engine", "Contoh path di container", "Untuk apa"]}
        rows={[
          ["PostgreSQL", <Code key="p">/etc/postgresql/postgresql.conf</Code>, "Tuning (shared_buffers, dsb.) — sesuaikan command/entrypoint image bila perlu menunjuk file itu."],
          ["MySQL / MariaDB", <Code key="m">/etc/mysql/conf.d/custom.cnf</Code>, "Folder conf.d dibaca otomatis oleh image resmi."],
          ["Redis", <Code key="r">/usr/local/etc/redis/redis.conf</Code>, "Konfigurasi kustom."],
        ]}
      />
      <Ul>
        <li>
          Setiap perubahan mount <strong>mem-provision ulang</strong> container
          database (restart singkat; data tetap di volume-nya).
        </li>
        <li>Aturan peran sama: bind mount hanya owner/admin.</li>
        <li>Backup volume hanya untuk mount aplikasi; volume data database sudah dicakup backup database.</li>
      </Ul>

      <H2 id="file">Mount file</H2>
      <P>
        Isi file ditulis langsung di tab Mount (textarea) lalu{" "}
        <strong>Simpan &amp; terapkan</strong> — praktis untuk config yang
        sering diubah tanpa commit ke repo.
      </P>
      <Pre title="Contoh: /etc/nginx/conf.d/app.conf">{`server {
  listen 80;
  location / { proxy_pass http://127.0.0.1:3000; }
}`}</Pre>
      <Ul>
        <li>
          Di balik layar semua file aplikasi ditulis ke satu volume khusus
          (<Code>{"aoox_app_<app>_files"}</Code>) lalu di-bind per path
          sebagai read-only.
        </li>
        <li>
          Aplikasi yang perlu <em>menulis</em> ke file itu harus memakai volume,
          bukan file mount.
        </li>
      </Ul>

      <H2 id="hapus">Menghapus mount</H2>
      <Table
        head={["Jenis", "Yang terjadi"]}
        rows={[
          ["Volume", "Ditanya apakah volume ikut dihapus (purge). Tanpa purge, data tetap ada di Docker dan bisa dipasang lagi dengan nama yang sama."],
          ["Bind", "Hanya melepas mount; folder di host tidak disentuh."],
          ["File", "Mount dilepas dan isinya dihapus dari aoox."],
        ]}
      />

      <H2 id="perilaku">Perilaku & batasan</H2>
      <Ul>
        <li>
          <strong>Preview PR tidak mendapat mount</strong> — jangan berbagi
          volume produksi dengan branch sembarang.
        </li>
        <li>
          Saat <DocLink href="/docs/deploy#blue-green">blue/green</DocLink>, dua
          container sementara memakai volume yang sama. Aplikasi yang mengunci
          file (SQLite tanpa WAL) sebaiknya memakai port host agar replace biasa.
        </li>
        <li>
          Job dengan target <em>Container terpisah</em> mewarisi semua mount
          aplikasi — cocok untuk migrasi atau pembersihan data.
        </li>
        <li>
          Bind mount dibatasi owner/admin karena setara akses filesystem host.
        </li>
      </Ul>

      <H3>Backup volume</H3>
      <P>
        Bagian <strong>Backup volume</strong> di tab Mount: backup manual,
        jadwal cron, retensi, dan tujuan S3 per aplikasi. Restore = stop
        container → kosongkan volume → extract → start. Detail di{" "}
        <DocLink href="/docs/backup#volume">Backup &amp; restore</DocLink>.
      </P>

      <Callout kind="warn" title="Belum tersedia">
        Mount untuk stack compose (atur di file compose) dan preview; backup
        bind mount. Backup volume kini berjalan juga untuk aplikasi di server
        remote.
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
