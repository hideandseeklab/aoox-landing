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

export const metadata: Metadata = { title: "Backup & restore" }

const SUMMARY = [
  { k: "Apa", v: "Database, volume aplikasi, dan panel sendiri" },
  { k: "Kapan", v: "Manual, atau cron dengan retensi" },
  { k: "Di mana", v: "Volume aoox_backups + S3 opsional" },
]

const FLOW = [
  { s: "dump", d: "container sekali-jalan dari image engine, kredensial via env" },
  { s: "simpan", d: "file di volume aoox_backups" },
  { s: "unggah", d: "rclone ke S3 bila tujuan dipilih" },
  { s: "prune", d: "backup terjadwal tertua > retensi dihapus (lokal + S3)" },
]

const PRESETS = [
  { label: "Nonaktif", cron: "—" },
  { label: "Setiap jam", cron: "0 * * * *" },
  { label: "Setiap hari 02:00", cron: "0 2 * * *" },
  { label: "Setiap minggu (Minggu 03:00)", cron: "0 3 * * 0" },
  { label: "Kustom", cron: "cron 5 kolom, mis. 30 1 * * *" },
]

const NEXT = [
  { title: "Managed database", description: "Database yang di-backup.", href: "/docs/database" },
  { title: "Mount", description: "Volume aplikasi yang bisa di-backup.", href: "/docs/mount" },
  { title: "Notifikasi", description: "Kabar saat backup gagal.", href: "/docs/notifikasi" },
  { title: "Template", description: "MinIO dari katalog sebagai tujuan S3 lokal.", href: "/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/backup"
      title="Backup & restore"
      description="Backup managed database dan volume aplikasi: manual atau terjadwal, retensi otomatis, salinan ke S3, dan restore."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">Alur satu backup</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        File tidak pernah lewat proses API — dump, unggah, dan restore semuanya
        dilakukan container sekali-jalan. Backup <strong>manual tidak pernah
        dipangkas</strong> oleh retensi; hanya yang terjadwal.
      </P>

      <H2 id="database">Backup database</H2>
      <P>
        Halaman database → tab <strong>Backup</strong>.
      </P>
      <Table
        head={["Engine", "Cara dump", "Restore"]}
        rows={[
          ["PostgreSQL", <><Code>pg_dump | gzip</Code> (atau <Code>pg_dumpall</Code> untuk semua database)</>, "Online — stream ke psql, tanpa downtime."],
          ["MySQL / MariaDB", <><Code>mysqldump</Code> / <Code>mariadb-dump</Code> sebagai root</>, "Online — stream ke mysql."],
          ["Redis", <><Code>redis-cli --rdb</Code></>, "Offline — container di-stop, snapshot dipasang sebagai base AOF, lalu di-start lagi."],
        ]}
      />

      <H3>Backup manual</H3>
      <P>
        Klik <strong>Backup</strong>. Baris baru muncul dengan status, ukuran,
        waktu, pemicu (manual/terjadwal), penanda <em>S3</em> bila tersalin
        (atau <em>hanya di S3</em> bila file lokal sudah tidak ada), dan tombol
        unduh / restore / hapus.
      </P>

      <H3>Jadwal & tujuan</H3>
      <Steps>
        <Step title="Form Jadwal & tujuan backup">
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Frekuensi</th>
                  <th className="px-3 py-2 text-left font-medium">Cron</th>
                </tr>
              </thead>
              <tbody>
                {PRESETS.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="px-3 py-2 text-foreground">{row.label}</td>
                    <td className="px-3 py-2"><Code>{row.cron}</Code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Ul>
            <li>
              <strong>Jumlah simpan</strong> — default 7; backup terjadwal
              tertua di luar jumlah ini dihapus setelah backup berikutnya.
            </li>
            <li>
              <strong>Tujuan S3</strong> — <em>Hanya lokal</em> atau salah satu
              tujuan yang terdaftar (lihat bawah).
            </li>
            <li>
              <strong>Semua database di server</strong> — untuk
              PostgreSQL/MySQL/MariaDB dengan{" "}
              <DocLink href="/docs/database#database-tambahan">database tambahan</DocLink>:
              dump mencakup semuanya (PostgreSQL memakai <Code>pg_dumpall</Code>,
              termasuk role). Baris backup ditandai <em>semua database</em>.
            </li>
          </Ul>
        </Step>
        <Step title="Simpan">
          <P>Jadwal langsung didaftarkan ulang tanpa restart API. Zona waktu cron = UTC.</P>
        </Step>
      </Steps>

      <H3>Restore</H3>
      <Steps>
        <Step title="Klik restore pada baris backup → konfirmasi">
          <P>
            Bila file lokalnya sudah tidak ada (dipangkas retensi, disk baru)
            tapi salinan S3 masih ada, baris ditandai <em>hanya di S3</em> —
            restore dan unduh tetap bisa: file ditarik kembali dari S3
            otomatis lebih dulu. Untuk aplikasi di server remote, penarikan itu
            terjadi di daemon server tersebut.
          </P>
        </Step>
        <Step title="Tunggu selesai">
          <P>
            SQL: tanpa downtime, tapi statement <Code>DROP/CREATE</Code> di dump
            akan mengganti isi tabel. Redis: container berhenti sebentar.
          </P>
        </Step>
      </Steps>

      <H2 id="volume">Backup volume aplikasi</H2>
      <P>
        Halaman aplikasi → tab <strong>Mount</strong> → bagian{" "}
        <strong>Backup volume</strong>. Berlaku untuk mount jenis{" "}
        <strong>volume</strong> saja (bind mount belum). Bila aplikasi punya
        lebih dari satu volume, pilih volumenya dulu.
      </P>
      <Table
        head={["Aksi", "Yang terjadi"]}
        rows={[
          ["Backup", <>busybox sekali-jalan, volume di-mount <Code>:ro</Code>, <Code>tar czf</Code> ke <Code>{"<app>/<mount>/<stamp>.tar.gz"}</Code>. Container aplikasi tetap jalan.</>],
          ["Restore", <><strong>Stop container</strong> → kosongkan volume → extract → start. Ada downtime singkat.</>],
          ["Jadwal", "Form Jadwal backup volume: frekuensi, jumlah simpan, tujuan S3 — berlaku untuk semua volume aplikasi; prune per volume."],
        ]}
      />
      <Ul>
        <li>
          Berlaku juga untuk aplikasi di <strong>server remote</strong> — backup,
          unggah/unduh S3, dan restore dijalankan di daemon server itu.
        </li>
        <li>Backup saat aplikasi sedang menulis bisa menangkap file setengah jadi — jadwalkan di jam sepi.</li>
      </Ul>

      <H2 id="instance">Backup instance (panel sendiri)</H2>
      <P>
        <strong>Settings → Backup instance</strong> (owner) menyimpan database
        internal aoox: pengguna, project, aplikasi, database, jadwal,
        kredensial terenkripsi — semuanya sebagai satu file JSON ter-gzip di
        volume backup, tanpa <Code>pg_dump</Code>.
      </P>
      <Table
        head={["Aksi", "Keterangan"]}
        rows={[
          ["Backup sekarang", "Membuat snapshot langsung; muncul di daftar dengan ukuran dan waktu."],
          ["Jadwal", <>Cron 5 kolom + <strong>Tujuan S3</strong> opsional, seperti backup database.</>],
          ["Unduh", "Simpan file di luar server — inilah yang dipakai saat memasang ulang."],
          [
            "Restore dari file",
            "Unggah file backup; seluruh tabel ditulis ulang dalam satu transaksi, lalu penjadwal dan sesi SSH dibangun ulang.",
          ],
        ]}
      />
      <Callout kind="warn" title="Yang perlu diperhatikan saat restore">
        <Ul>
          <li>
            File hanya bisa dipulihkan ke <strong>versi skema yang sama</strong>{" "}
            — restore ke versi aoox yang jauh berbeda ditolak.
          </li>
          <li>
            <Code>ENCRYPTION_KEY</Code> harus sama dengan saat backup dibuat;
            bila berbeda, kredensial tersimpan tidak bisa dibaca dan aoox
            melaporkannya.
          </li>
          <li>
            Ini memulihkan <em>panel</em>, bukan data aplikasi. Container,
            volume, dan image tetap urusan backup database/volume.
          </li>
        </Ul>
      </Callout>
      <P>
        Kombinasi untuk pindah server: backup instance + backup database +
        backup volume, semuanya dengan tujuan S3. Alternatif yang lebih ringan
        untuk memindahkan satu project saja:{" "}
        <DocLink href="/docs/project#export">export/import project</DocLink>.
      </P>

      <H2 id="s3">Tujuan S3</H2>
      <Steps>
        <Step title="Settings → Tujuan backup (S3) → Tujuan backup baru (owner/admin)">
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              ["Nama", "Label."],
              ["Endpoint", <>Kosong = AWS S3. Isi untuk MinIO, Wasabi, R2, dsb. — mis. <Code>https://minio.example.com</Code>, atau <Code>http://aoox-minio-…:9000</Code> untuk MinIO yang berjalan di aoox (satu network).</>],
              ["Region", <>Wajib untuk AWS (<Code>us-east-1</Code>); provider lain biasanya bebas.</>],
              ["Bucket", "Harus sudah ada — aoox tidak membuatnya."],
              ["Prefix", <>Opsional, mis. <Code>aoox/prod</Code>.</>],
              ["Access key ID / Secret access key", "Secret hanya ditulis sekali, disimpan terenkripsi."],
              ["Path-style", "Default aktif (MinIO); matikan untuk virtual-host style (AWS, R2)."],
            ]}
          />
        </Step>
        <Step title="Tes koneksi">
          <P>
            Menjalankan <Code>rclone lsjson</Code> ke bucket lewat container{" "}
            <Code>rclone/rclone</Code>; error provider ditampilkan apa adanya.
          </P>
        </Step>
        <Step title="Pilih di jadwal backup database / volume">
          <P>
            Setiap backup (manual maupun terjadwal) yang sukses diunggah ke{" "}
            <Code>{"<prefix>/<slug>/<stamp>.<ext>"}</Code>. Menghapus/prune
            backup juga menghapus objek remote.
          </P>
        </Step>
      </Steps>
      <Callout>
        Gagal unggah membuat backup berstatus <Code>failed</Code> dan memicu
        notifikasi — file lokal tetap ada untuk diunduh. Tujuan dipasang
        justru supaya salinan ada di tempat lain, jadi kegagalan tidak
        disembunyikan.
      </Callout>

      <H2 id="strategi">Strategi yang disarankan</H2>
      <Table
        head={["Kebutuhan", "Pengaturan"]}
        rows={[
          ["Produksi kecil", "Setiap hari 02:00, simpan 7, tujuan S3. Uji restore sebulan sekali ke database baru."],
          ["Data sering berubah", "Setiap jam, simpan 24–48, tujuan S3."],
          ["Sebelum migrasi/impor besar", "Backup manual (tidak pernah dipangkas) — beri nama di catatan tim."],
          ["Pindah server / pemulihan bencana", "Backup instance + database + volume, ketiganya dengan tujuan S3; simpan juga .env.dist (JWT_SECRET & ENCRYPTION_KEY)."],
          ["Aplikasi dengan upload", "Backup volume harian + backup database pada jam yang sama."],
        ]}
      />

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Backup 20 byte / kosong", "Sudah ditangani (status dump dipropagasi). Bila terjadi, cek pesan error backup — biasanya kredensial atau database belum siap."],
          ["Tes tujuan S3 gagal: NoSuchBucket", "Bucket belum dibuat, atau region salah (AWS)."],
          ["Tes gagal ke MinIO lokal", "Endpoint memakai localhost dari dalam container. Pakai nama container + port 9000, atau domain publiknya."],
          ["Restore Redis: data tidak berubah", "Backup Redis 7 dipasang sebagai base AOF; pastikan container benar-benar di-start ulang (status running kembali) dan tidak ada tulisan baru sebelum restore selesai."],
          ["Volume backup penuh", "Turunkan jumlah simpan, hapus backup manual lama, atau pindahkan ke S3 dan hapus lokal."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Retensi terpisah untuk objek di S3; backup bind mount; backup untuk
        stack compose &amp; database di dalamnya; restore instance lintas versi
        skema.
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
