import { PathArrow } from "@/components/arrows"
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

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/template",
  lang: "id",
  title: "Template one-click",
  description:
    "WordPress, Ghost, n8n, dan lainnya dalam beberapa klik.",
})

const SUMMARY = [
  { k: "Katalog", v: "14 template, dibundel di dalam aoox" },
  { k: "Hasil", v: "Stack compose (source: template)" },
  { k: "Rahasia", v: "Password/secret di-generate otomatis" },
]

const CATALOG = [
  { id: "wordpress", ver: "6.8", untuk: "CMS/blog + MySQL", isi: "—", service: "wordpress :80" },
  { id: "ghost", ver: "5", untuk: "Platform publishing", isi: "URL publik", service: "ghost :2368" },
  { id: "n8n", ver: "1.x", untuk: "Automasi workflow", isi: "Host publik; protokol & zona waktu punya default", service: "n8n :5678" },
  { id: "uptime-kuma", ver: "1", untuk: "Monitoring uptime", isi: "—", service: "uptime-kuma :3001" },
  { id: "minio", ver: "latest", untuk: "Object storage S3 — bisa jadi tujuan backup", isi: "Root user punya default", service: "Console :9001 · API S3 :9000" },
  { id: "gitea", ver: "1.24", untuk: "Git hosting ringan", isi: "URL publik", service: "gitea :3000" },
  { id: "vaultwarden", ver: "1.37", untuk: "Password manager (kompatibel Bitwarden)", isi: "URL publik (HTTPS)", service: "vaultwarden :80" },
  { id: "umami", ver: "2.20", untuk: "Analitik web ramah privasi + PostgreSQL", isi: "—", service: "umami :3000" },
  { id: "grafana", ver: "13.0", untuk: "Dashboard metrik & log", isi: "URL publik", service: "grafana :3000" },
  { id: "metabase", ver: "0.63", untuk: "Business intelligence + PostgreSQL", isi: "URL publik", service: "metabase :3000" },
  { id: "directus", ver: "12.4", untuk: "Headless CMS / API data + PostgreSQL", isi: "URL publik, email admin", service: "directus :8055" },
  { id: "mattermost", ver: "11.11", untuk: "Chat tim + PostgreSQL", isi: "URL publik", service: "mattermost :8065" },
  { id: "nextcloud", ver: "32", untuk: "File & kolaborasi + PostgreSQL, Redis, cron", isi: "Domain", service: "nextcloud :80" },
  { id: "odoo", ver: "19.0", untuk: "ERP / bisnis all-in-one (Community) + PostgreSQL", isi: "— (master password di-generate)", service: "odoo :8069" },
]

const NEXT = [
  { title: "Stack compose", description: "Operasi, env, dan batasan yang juga berlaku untuk template.", href: "/docs/compose" },
  { title: "Proxy & domain", description: "Traefik + DNS untuk hostname yang diisi.", href: "/docs/domain" },
  { title: "Backup & restore", description: "Pakai MinIO dari template sebagai tujuan S3.", href: "/docs/backup#s3" },
  { title: "Project", description: "Tempat stack template tinggal.", href: "/docs/project" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/template"
      title="Template one-click"
      description="Katalog aplikasi siap pakai yang dijalankan sebagai stack compose dalam beberapa klik."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="katalog">Katalog</H2>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Template</th>
              <th className="px-3 py-2 text-left font-medium">Versi</th>
              <th className="px-3 py-2 text-left font-medium">Untuk apa</th>
              <th className="px-3 py-2 text-left font-medium">Harus diisi</th>
              <th className="px-3 py-2 text-left font-medium">Service (port)</th>
            </tr>
          </thead>
          <tbody>
            {CATALOG.map((t) => (
              <tr key={t.id} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{t.id}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{t.ver}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.untuk}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.isi}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Katalog ditulis di dalam kode aoox — tidak diambil dari internet
        saat runtime, jadi tetap jalan offline dan isinya tidak bisa diganti
        pihak lain. Semua password, secret, dan key di-generate otomatis
        (alfanumerik) bila dikosongkan.
      </P>

      <H2 id="catatan">Catatan per template</H2>
      <P>
        Template yang memakai database membawa <strong>PostgreSQL sendiri di
        dalam stack</strong> (bukan managed database), dengan volume bernama
        untuk data dan health check agar aplikasi baru start setelah database
        siap. Versi image dipin ke tag tertentu, bukan <Code>latest</Code>.
        Lisensi tiap proyek berbeda; cek di situs proyeknya sebelum dipakai
        untuk keperluan komersial.
      </P>
      <Table
        head={["Template", "Isi stack & hal yang perlu diketahui"]}
        rows={[
          ["vaultwarden", <>Satu container, data di SQLite. Web vault butuh HTTPS (kecuali localhost) — isi URL publik dengan <Code>https://…</Code>. Token <Code>/admin</Code> di-generate; matikan pendaftaran (<Code>SIGNUPS_ALLOWED=false</Code>) setelah akun dibuat.</>],
          ["umami", <>Umami + PostgreSQL. Login awal bawaan Umami <Code>admin</Code> / <Code>umami</Code> — ganti segera.</>],
          ["grafana", <>Satu container (SQLite bawaan). Username dan password admin ada di env stack.</>],
          ["metabase", <>Metabase + PostgreSQL untuk data aplikasinya (bukan data yang kamu analisis). Berbasis Java, jadi start pertama beberapa menit dan memakai RAM cukup besar. Kunci enkripsi kredensial di-generate; jangan diganti setelah dipakai.</>],
          ["directus", <>Directus + PostgreSQL. Akun admin pertama dibuat dari email yang kamu isi dan password di env stack; <Code>KEY</Code> dan <Code>SECRET</Code> di-generate.</>],
          ["mattermost", <>Mattermost Team Edition + PostgreSQL. Akun pertama dibuat lewat web dan otomatis jadi admin sistem.</>],
          ["nextcloud", <>Nextcloud (Apache) + PostgreSQL + Redis (cache dan file locking) + container <Code>cron</Code> untuk tugas latar. Isi domain tanpa <Code>https://</Code>. Protokol publik default <Code>https</Code>; <Code>http</Code> hanya untuk uji lokal. Install pertama lebih lama dan paling berat di antara template.</>],
          ["odoo", <>Odoo <strong>Community</strong> 19.0 (LGPLv3; tanpa modul Enterprise, yang proprietary) + PostgreSQL 16. Buka situsnya: halaman awal meminta <em>Master Password</em>, nama database, email, dan password admin. <strong>Master password</strong> dibuat otomatis; lihat di halaman stack, tab <strong>Pengaturan</strong>, bagian environment, <strong>Tampilkan nilai</strong> (variabel <Code>MASTER_PASSWORD</Code>). Berjalan <strong>satu proses tanpa worker</strong> (<Code>workers = 0</Code>), cukup untuk pemakaian kecil; banyak worker dengan jalur websocket terpisah belum disiapkan. <Code>proxy_mode</Code> menyala agar skema https dan pengalihan benar di belakang Traefik. Daftar database tetap terbuka supaya database pertama bisa dibuat lewat web; master password melindungi pembuatan, penyalinan, backup, dan penghapusan database. Setelah database dibuat, amankan <Code>/web/database/manager</Code>: edit compose stack (tab Pengaturan), tambahkan <Code>list_db = False</Code> dan <Code>dbfilter = ^nama_db$</Code> pada bagian konfigurasi Odoo, lalu deploy ulang. Image memakai tag bertanggal (<Code>19.0-20260926</Code>) agar tidak bergeser tiap malam; untuk pembaruan keamanan, ganti tag-nya dan deploy ulang. Data ada di volume <Code>odoo_data</Code> (filestore) dan database.</>],
        ]}
      />

      <H2 id="langkah">Men-deploy template</H2>
      <Steps>
        <Step title={<>Menu Templates<PathArrow />pilih template</>}>
          <P>
            Atau dari halaman project klik <strong>Dari template</strong> agar
            project sudah terpilih. Ada kotak pencarian untuk katalog.
          </P>
        </Step>
        <Step title="Isi dialog deploy">
          <Table
            head={["Bagian", "Keterangan"]}
            rows={[
              ["Project & Nama", "Nama jadi slug stack; project compose = aoox-<slug>."],
              [
                "Hostname per service + HTTPS",
                "Satu baris per service yang bisa diekspos (mis. MinIO punya dua: Console dan API). Kosongkan bila tidak ingin domain.",
              ],
              [
                "Port host per service",
                <>
                  Alternatif tanpa domain: stack langsung bisa dibuka lewat{" "}
                  <Code>{"<ip-server>:<port>"}</Code>. Bentrokan port ditolak saat
                  menyimpan — lihat <DocLink href="/docs/compose#akses">Akses stack</DocLink>.
                </>,
              ],
              [
                "Variabel",
                <>
                  Field dengan label dan hint dari template. Yang bertanda wajib
                  harus diisi (mis. <em>URL publik</em> untuk Ghost/Gitea/Grafana,{" "}
                  <em>Host publik</em> untuk n8n). Sisanya: kosong = default /
                  di-generate.
                </>,
              ],
            ]}
          />
          <Callout kind="warn" title="URL publik harus sama dengan domain">
            Ghost, Gitea, n8n, Grafana, Metabase, Directus, Mattermost, Vaultwarden, dan Nextcloud memakai URL/host publik untuk membangun tautan
            dan webhook-nya sendiri. Isi persis sesuai hostname yang kamu
            pasang, termasuk skema (<Code>https://blog.example.com</Code>) —
            kalau berbeda, halaman admin/tautan akan salah arah.
          </Callout>
        </Step>
        <Step title="Deploy">
          <P>
            Kamu diarahkan ke halaman stack compose yang baru. Deploy berjalan
            di latar (pull image bisa beberapa menit); pantau{" "}
            <strong>Log aksi terakhir</strong> sampai status <Code>running</Code>.
          </P>
        </Step>
        <Step title="Verifikasi">
          <P>
            Buka hostname yang dipasang. Untuk kredensial admin awal (mis.
            MinIO root password, DB password) lihat env stack di tab{" "}
            <strong>Pengaturan</strong> — nilai yang di-generate tersimpan di
            sana.
          </P>
        </Step>
      </Steps>

      <H2 id="contoh">Contoh: WordPress dengan domain</H2>
      <Pre title="Dialog deploy">{`Project     : toko
Nama        : blog
Service     : wordpress → blog.example.com  [HTTPS ✓]
Variabel    : DB_PASSWORD (kosong → di-generate)
              DB_ROOT_PASSWORD (kosong → di-generate)`}</Pre>
      <P>
        Setelah <Code>running</Code>, buka <Code>https://blog.example.com</Code>{" "}
        dan selesaikan wizard WordPress. Database MySQL ada di dalam stack
        (bukan managed database) — backup-nya jadi tanggung jawab plugin/skrip
        kamu, atau pindahkan ke <DocLink href="/docs/database">managed database</DocLink>{" "}
        dengan mengedit compose.
      </P>

      <H2 id="setelah">Setelah deploy</H2>
      <Ul>
        <li>
          <strong>File compose</strong> tersimpan di aoox dan bisa diedit
          di tab Pengaturan stack (textarea), lalu deploy ulang — mis.
          menambah service, mengubah image tag, atau menunjuk managed database.
        </li>
        <li>
          <strong>Env stack</strong> berisi nilai variabel (termasuk yang
          di-generate); ubah lalu deploy ulang bila perlu.
        </li>
        <li>
          <strong>Domain per service</strong> bisa ditambah/diubah lewat kartu
          Domain; saran service diambil dari katalog.
        </li>
        <li>
          Stop / Start / Hapus sama seperti stack compose lain —{" "}
          <strong>Hapus menghapus volume data</strong>.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["400: variabel wajib kosong", "URL/Host/Domain publik atau email admin (Directus) belum diisi."],
          ["Tautan admin mengarah ke localhost / http", "URL publik tidak sama dengan domain, atau protokol n8n masih http. Perbaiki env stack, deploy ulang."],
          ["Deploy lama di deploying", "Pull image pertama kali. Tunggu; cek Log aksi terakhir untuk progres."],
          ["MinIO tidak bisa dipakai sebagai tujuan backup", <>Pasang domain/hostname untuk service <em>API S3</em> (port 9000), atau pakai endpoint internal <Code>http://&lt;container&gt;:9000</Code> — stack harus di network <Code>aoox</Code>.</>],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Template dari repo/URL kustom; upgrade versi template yang sudah
        di-deploy; ikon template saat offline. Batasan stack compose lainnya
        berlaku — lihat <DocLink href="/docs/compose#perilaku">Stack compose</DocLink>.
      </Callout>

      <H2 id="berikutnya">Langkah berikutnya</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 rounded-lg overflow-hidden">
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
