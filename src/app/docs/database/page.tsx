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

export const metadata: Metadata = { title: "Managed database" }

const SUMMARY = [
  { k: "Engine", v: "PostgreSQL · MySQL · MariaDB · Redis" },
  { k: "Bentuk", v: "Container + volume per database" },
  { k: "Hubungkan", v: "${{database.<slug>.url}} di env aplikasi" },
]

const ENGINES = [
  { e: "PostgreSQL", img: "postgres", tag: "16-alpine", port: 5432, url: "postgresql://app:pass@host:5432/<db>" },
  { e: "MySQL", img: "mysql", tag: "8", port: 3306, url: "mysql://app:pass@host:3306/<db>" },
  { e: "MariaDB", img: "mariadb", tag: "11", port: 3306, url: "mysql://app:pass@host:3306/<db>" },
  { e: "Redis", img: "redis", tag: "7-alpine", port: 6379, url: "redis://:pass@host:6379/0" },
]

const LIFECYCLE = [
  { s: "creating", d: "pull image, buat volume & container" },
  { s: "running", d: "siap dipakai; kredensial tersedia" },
  { s: "stopped", d: "container berhenti, data tetap" },
  { s: "error", d: "provisioning gagal — lihat pesan" },
]

const NEXT = [
  { title: "Environment variables", description: "Semua bentuk referensi ${{database.…}}.", href: "/docs/environment#referensi" },
  { title: "Data browser", description: "Lihat tabel dan jalankan query dari dashboard.", href: "/docs/data-browser" },
  { title: "Backup & restore", description: "Backup manual, terjadwal, salinan S3.", href: "/docs/backup#database" },
  { title: "Monitoring", description: "Metrik dan batas sumber daya database.", href: "/docs/monitoring#limit" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/database"
      title="Managed database"
      description="Membuat PostgreSQL, MySQL, MariaDB, atau Redis per project dan menghubungkannya ke aplikasi."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="engine">Engine yang didukung</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Engine</th>
              <th className="px-3 py-2 text-left font-medium">Image (tag default)</th>
              <th className="px-3 py-2 text-left font-medium">Port</th>
              <th className="px-3 py-2 text-left font-medium">Bentuk URL internal</th>
            </tr>
          </thead>
          <tbody>
            {ENGINES.map((row) => (
              <tr key={row.e} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{row.e}</td>
                <td className="px-3 py-2"><Code>{row.img}:{row.tag}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{row.port}</td>
                <td className="px-3 py-2"><Code>{row.url}</Code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Container mengikuti env resmi image Docker Hub (<Code>POSTGRES_*</Code>,{" "}
        <Code>MYSQL_*</Code>, <Code>MARIADB_*</Code>, <Code>--requirepass</Code>).
        Username SQL selalu <Code>app</Code>; nama database = slug dengan{" "}
        <Code>-</Code> diganti <Code>_</Code>. Password acak, disimpan terenkripsi.
      </P>

      <H2 id="langkah">Membuat database</H2>
      <Steps>
        <Step title="Halaman project → Database baru">
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              ["Nama", <>Jadi slug unik (global, bukan per project). Container <Code>{"aoox-db-<slug>"}</Code>, volume <Code>{"aoox_db_<slug>"}</Code>.</>],
              ["Engine", "postgres / mysql / mariadb / redis."],
              ["Versi (tag image)", <>Tag Docker Hub. Kosong = default di tabel atas. Contoh: <Code>17</Code>, <Code>8.4</Code>, <Code>7.2</Code>.</>],
              [
                "Port host",
                "Opsional. Isi hanya kalau perlu koneksi dari luar Docker (laptop, server remote). Aplikasi di host aoox tidak membutuhkannya.",
              ],
              ["Batas CPU / memori", "Opsional; bisa diubah nanti."],
            ]}
          />
        </Step>
        <Step title="Tunggu status running">
          <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
            {LIFECYCLE.map((item, i) => (
              <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
                <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-foreground">{item.s}</span>
                <span className="text-muted-foreground">{item.d}</span>
              </li>
            ))}
          </ol>
          <P>
            Provisioning berjalan di latar (pull image bisa lama); halaman
            menyegarkan otomatis selama <Code>creating</Code>.
          </P>
        </Step>
        <Step title="Hubungkan ke aplikasi">
          <P>
            Di env aplikasi (project yang sama), rujuk dengan referensi — bukan
            menyalin password:
          </P>
          <Pre title="Env aplikasi">{`DATABASE_URL=\${{database.app-db.url}}`}</Pre>
          <P>
            Deploy (atau rollback) agar container aplikasi baru mendapat nilainya.
            Bentuk lain (<Code>host</Code>, <Code>port</Code>, <Code>username</Code>,
            …) ada di <DocLink href="/docs/environment#referensi">Environment variables</DocLink>.
          </P>
        </Step>
      </Steps>
      <Callout kind="warn" title="Tidak ada injeksi otomatis">
        Membuat database tidak otomatis menambahkan env ke aplikasi mana pun.
        Referensi hanya berlaku untuk aplikasi/stack di{" "}
        <strong>project yang sama</strong>.
      </Callout>

      <H2 id="koneksi">Koneksi</H2>
      <Table
        head={["Jenis", "Host", "Siapa yang bisa pakai"]}
        rows={[
          [
            <strong key="i">Koneksi internal</strong>,
            <Code key="ih">{"aoox-db-<slug>"}</Code>,
            <>Container di network <Code>aoox</Code>: aplikasi, stack compose yang bergabung ke network itu, job.</>,
          ],
          [
            <strong key="e">Koneksi eksternal</strong>,
            <><Code>{"<ip-server>:<port host>"}</Code> (hanya bila port host diisi)</>,
            "Laptop, client GUI, aplikasi di server remote. Amankan dengan firewall.",
          ],
        ]}
      />
      <P>
        Tab <strong>Ringkasan</strong> menampilkan keduanya beserta kredensial
        (disamarkan, bisa disalin) dan <Code>DATABASE_URL</Code> siap tempel.
      </P>

      <H2 id="database-tambahan">Database tambahan di server yang sama</H2>
      <P>
        Satu container PostgreSQL/MySQL/MariaDB bisa menampung beberapa
        database (schema). Di tab <strong>Data</strong>, owner/admin bisa
        membuat database baru dengan nama <Code>[A-Za-z_][A-Za-z0-9_]*</Code>;
        yang dibuat saat provisioning adalah <em>primary</em> dan tidak bisa
        dihapus.
      </P>
      <Pre title="Merujuk database tambahan dari env">{`REPORTS_DB_URL=\${{database.app-db.url:reports}}`}</Pre>
      <Ul>
        <li>Host, user, dan password sama — hanya bagian nama database yang berbeda.</li>
        <li>Tab Ringkasan menampilkan <strong>Koneksi untuk database</strong> per nama bila ada lebih dari satu.</li>
        <li>Backup punya opsi menyertakan semua database di server (lihat Backup).</li>
        <li>Redis tidak punya fitur ini (pakai nomor DB di URL bila perlu).</li>
      </Ul>

      <H2 id="operasi">Operasi</H2>
      <Table
        head={["Aksi", "Di mana", "Catatan"]}
        rows={[
          ["Stop / Start", "Panel database", "Container berhenti; data di volume tetap. Aplikasi yang terhubung akan error sampai start lagi."],
          ["Batas sumber daya", "Kartu Batas sumber daya", "Berlaku langsung; mencabut batas = container dibuat ulang (restart singkat)."],
          ["Ganti versi (tag)", "—", "Belum ada dari UI. Buat database baru, restore backup ke sana."],
          ["Konfigurasi engine", "Tab Mount", "File mount ke path config; container di-provision ulang."],
          ["Hapus", "Panel database", "Dengan atau tanpa menghapus volume. Daftar backup ikut terhapus (cascade); file di S3 juga."],
        ]}
      />

      <H3>Tab lain</H3>
      <Ul>
        <li>
          <strong>Data</strong> → <DocLink href="/docs/data-browser">Data browser</DocLink>:
          tabel, query, database tambahan.
        </li>
        <li>
          <strong>Backup</strong> → <DocLink href="/docs/backup#database">Backup &amp; restore</DocLink>:
          manual, jadwal, retensi, S3.
        </li>
        <li>
          <strong>Jobs</strong> → perintah terjadwal di container database atau
          container terpisah dari image engine dengan env <Code>DB_*</Code> —{" "}
          <DocLink href="/docs/jobs#pemilik">Scheduled jobs</DocLink>.
        </li>
        <li>
          <strong>Mount</strong> → file konfigurasi engine (<Code>my.cnf</Code>,{" "}
          <Code>redis.conf</Code>) atau volume tambahan —{" "}
          <DocLink href="/docs/mount#database">Mount</DocLink>.
        </li>
        <li>
          Metrik CPU/RAM (sampel 15 detik) di bagian atas panel.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Aplikasi: connection refused / ENOTFOUND", "Memakai URL eksternal/localhost dari dalam container. Pakai URL internal (nama container) lewat referensi."],
          ["400 saat menyimpan env: no database \"x\"", "Slug salah atau database ada di project lain."],
          ["Status error saat membuat", "Tag image tidak ada di Docker Hub, atau port host sudah dipakai. Hapus dan buat ulang."],
          ["Aplikasi di server remote tidak bisa konek", <>Database selalu di host aoox. Isi port host + firewall, lalu pakai koneksi eksternal di env (tanpa referensi).</>],
          ["Data hilang setelah hapus", "Dihapus dengan purge volume. Restore dari backup yang sudah diunduh/S3 ke database baru."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Ganti versi engine dari UI; replika/HA; database di server remote;
        injeksi env otomatis.
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
