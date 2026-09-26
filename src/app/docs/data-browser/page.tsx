import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Data browser" }

const SUMMARY = [
  { k: "Di mana", v: "Halaman database → tab Data" },
  { k: "Bisa", v: "Lihat/edit/hapus baris, struktur tabel, query, CSV, ekspor/impor SQL" },
  { k: "Batas", v: "500 baris, 15 detik, 60 query/menit, riwayat 50 entri" },
]

const LAYOUT = [
  { s: "kiri", d: "daftar tabel (atau key Redis) + perkiraan jumlah baris" },
  { s: "kanan atas", d: "grid baris, 50 per halaman, klik header untuk sort, tab Struktur" },
  { s: "kanan bawah", d: "kotak query — Ctrl+Enter untuk menjalankan, tab Riwayat" },
  { s: "toolbar", d: "pilih database, muat ulang, Ekspor CSV/SQL, Impor SQL" },
]

const NEXT = [
  { title: "Managed database", description: "Database tambahan di server yang sama.", href: "/docs/database#database-tambahan" },
  { title: "Backup & restore", description: "Untuk salinan rutin, bukan ekspor manual.", href: "/docs/backup#database" },
  { title: "Pengguna & peran", description: "Siapa boleh menulis.", href: "/docs/pengguna-peran" },
  { title: "Environment variables", description: "Merujuk database dari aplikasi.", href: "/docs/environment#referensi" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/data-browser"
      title="Data browser"
      description="Melihat isi tabel, menjalankan query, dan ekspor/impor SQL langsung dari dashboard — tanpa client database tambahan."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="tata-letak">Tata letak</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {LAYOUT.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Untuk server dengan{" "}
        <DocLink href="/docs/database#database-tambahan">lebih dari satu database</DocLink>,
        select <strong>Database</strong> di toolbar memilih mana yang dilihat;
        owner/admin bisa membuat database baru dari sana (tombol{" "}
        <em>Buat database</em>).
      </P>

      <H2 id="query">Menjalankan query</H2>
      <Table
        head={["Engine", "Yang dijalankan", "Contoh"]}
        rows={[
          ["PostgreSQL", <>Satu statement SQL via <Code>psql</Code></>, <Code key="p">SELECT id, email FROM users ORDER BY id DESC</Code>],
          ["MySQL / MariaDB", <>Satu statement SQL via <Code>mysql</Code></>, <Code key="m">SHOW CREATE TABLE orders</Code>],
          ["Redis", <>Satu perintah via <Code>redis-cli</Code></>, <Code key="r">HGETALL session:abc</Code>],
        ]}
      />
      <Ul>
        <li>
          Hanya <strong>satu statement</strong> per query — <Code>;</Code> di
          luar tanda kutip ditolak (400). Komentar <Code>--</Code> dan{" "}
          <Code>{"/* */"}</Code> dibersihkan lebih dulu.
        </li>
        <li>
          <Code>SELECT</Code>/<Code>WITH</Code> tanpa <Code>LIMIT</Code>{" "}
          dibungkus <Code>LIMIT 501</Code>: maksimal 500 baris ditampilkan
          dengan tanda <em>truncated</em>. Tambahkan <Code>LIMIT</Code>/
          <Code>OFFSET</Code> sendiri untuk menjelajah lebih jauh.
        </li>
        <li>
          Timeout engine <strong>15 detik</strong> (<Code>statement_timeout</Code> /{" "}
          <Code>max_execution_time</Code> / <Code>max_statement_time</Code>).
        </li>
        <li>
          Hasil membedakan <Code>NULL</Code> dan string kosong; perintah
          non-SELECT mengembalikan pesan engine, mis. <Code>UPDATE 3</Code>.
        </li>
        <li>Rate limit 60 query per menit per pengguna.</li>
      </Ul>

      <H2 id="edit-baris">Edit & hapus baris, struktur tabel</H2>
      <P>
        Grid tidak hanya menampilkan — sel bisa diedit langsung, dan setiap
        baris punya aksi <strong>Hapus</strong> (owner/admin). Tab{" "}
        <strong>Struktur</strong> di sebelah grid menampilkan kolom dan
        indeks tabel tanpa perlu <Code>\d</Code> atau <Code>SHOW COLUMNS</Code>.
      </P>
      <Ul>
        <li>
          Setiap tulis <strong>divalidasi, bukan dipercaya</strong>: klausa{" "}
          <Code>WHERE</Code> harus persis primary key tabel itu — tidak
          sebagian, tidak lebih — dan kolom yang diubah dicocokkan ke kolom
          nyata tabel (bukan regex identifier), jadi nama kolom seperti{" "}
          <Code>first name</Code> tetap berfungsi.
        </li>
        <li>
          Tabel <strong>tanpa primary key</strong> menolak edit/hapus (400)
          alih-alih diam-diam menulis ke seluruh tabel.
        </li>
        <li>
          Setelah menulis, API mengonfirmasi <strong>tepat satu baris</strong>{" "}
          yang berubah — dari command tag Postgres, atau{" "}
          <Code>SELECT ROW_COUNT()</Code> di sesi yang sama untuk MySQL/
          MariaDB. Primary key yang sudah usang (baris terhapus di tempat
          lain) menghasilkan 400, bukan sukses palsu.
        </li>
        <li>Hanya owner/admin — member tetap terbatas baca saja seperti query.</li>
      </Ul>

      <H2 id="hak-tulis">Hak tulis per peran</H2>
      <Table
        head={["Peran", "Boleh", "Pagar"]}
        rows={[
          [
            <strong key="m">member</strong>,
            <>Statement yang diawali <Code>SELECT</Code>, <Code>WITH</Code>, <Code>SHOW</Code>, <Code>EXPLAIN</Code>, <Code>DESCRIBE</Code>, <Code>VALUES</Code>, <Code>TABLE</Code>.</>,
            <>Selain itu → 403, <em>dan</em> sesi engine dibuat read-only (<Code>default_transaction_read_only</Code> / <Code>SET SESSION TRANSACTION READ ONLY</Code>) — bahkan <Code>WITH … DELETE</Code> gagal di engine.</>,
          ],
          [
            <strong key="oa">owner / admin</strong>,
            "INSERT, UPDATE, DELETE, DDL, plus Impor SQL dan buat database.",
            "Tidak ada — pakai dengan hati-hati; tidak ada undo.",
          ],
        ]}
      />
      <P>
        Redis: member hanya boleh perintah baca (<Code>GET</Code>,{" "}
        <Code>MGET</Code>, <Code>HGET*</Code>, <Code>LRANGE</Code>,{" "}
        <Code>SMEMBERS</Code>, <Code>ZRANGE</Code>, <Code>SCAN</Code>, …).
      </P>

      <H2 id="ekspor-impor">Ekspor CSV, ekspor & impor SQL</H2>
      <Steps>
        <Step title="Ekspor CSV per tabel (semua peran)">
          <P>
            Tombol <strong>Ekspor CSV</strong> di grid mengunduh tabel yang
            sedang dibuka sebagai <Code>.csv</Code> — cocok untuk spreadsheet,
            tidak seperti dump SQL yang berisi seluruh database.
          </P>
        </Step>
        <Step title="Ekspor SQL (semua peran)">
          <P>
            Tombol <strong>Ekspor SQL</strong> di toolbar mengunduh dump teks
            biasa database yang sedang dipilih (<Code>{"<slug>[-db].sql"}</Code>).
            Cocok untuk memindahkan data ke tempat lain atau memeriksa struktur.
          </P>
        </Step>
        <Step title="Impor SQL (owner/admin)">
          <P>
            Tombol <strong>Impor SQL</strong> menerima file <Code>.sql</Code>{" "}
            sampai <strong>64 MB</strong> dan menjalankannya apa adanya di
            database yang dipilih — setelah konfirmasi. Daftar tabel dimuat
            ulang otomatis.
          </P>
        </Step>
      </Steps>
      <Callout kind="warn">
        Impor tidak dibungkus transaksi dan tidak ada undo. Untuk data penting,
        buat <DocLink href="/docs/backup#database">backup</DocLink> dulu. Redis
        tidak punya ekspor CSV/SQL — pakai backup.
      </Callout>

      <H2 id="riwayat">Riwayat query</H2>
      <P>
        Tab <strong>Riwayat</strong> mencatat sampai <strong>50 query</strong>{" "}
        terakhir per pengguna per database — baik yang berhasil maupun yang
        gagal, supaya &ldquo;apa yang barusan aku jalankan&rdquo; selalu
        lengkap. Ini tabel terpisah, bukan bagian dari{" "}
        <DocLink href="/docs/pengguna-peran#akun">audit log</DocLink> instance.
      </P>

      <H2 id="cara-kerja">Cara kerja</H2>
      <P>
        Setiap query dijalankan di container sekali-jalan dari image engine
        yang sama (pola yang dipakai backup), dengan kredensial lewat env dan
        output ditulis ke file lalu dibaca kembali. API tidak memuat driver
        database apa pun.
      </P>
      <Pre>{`psql --csv  ·  mysql --batch  ·  redis-cli --json`}</Pre>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["400: hanya satu statement", <>Ada <Code>;</Code> di akhir atau beberapa statement. Jalankan satu per satu, atau pakai Impor SQL.</>],
          ["403 sebagai member", "Statement tulis. Minta owner/admin, atau jalankan lewat migrasi aplikasi (job)."],
          ["Query berhenti di 15 detik", "Tambahkan indeks/WHERE, atau jalankan dari aplikasi. Timeout tidak bisa dinaikkan dari UI."],
          ["Hasil terpotong 500 baris", "Pakai LIMIT/OFFSET atau ekspor SQL."],
          ["Impor gagal di tengah", "Statement sebelumnya sudah tereksekusi. Restore backup, perbaiki file, ulangi."],
          ["400 saat edit/hapus baris", "Tabel tidak punya primary key, atau baris itu sudah berubah/terhapus di tempat lain sejak grid dimuat. Muat ulang lalu coba lagi."],
        ]}
      />

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
