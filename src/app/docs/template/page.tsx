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

export const metadata: Metadata = { title: "Template one-click" }

const SUMMARY = [
  { k: "Katalog", v: "6 template, dibundel di dalam aoox" },
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
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="katalog">Katalog</H2>
      <div className="overflow-x-auto border border-border">
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

      <H2 id="langkah">Men-deploy template</H2>
      <Steps>
        <Step title="Menu Templates → pilih template">
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
                  harus diisi (mis. <em>URL publik</em> untuk Ghost/Gitea,{" "}
                  <em>Host publik</em> untuk n8n). Sisanya: kosong = default /
                  di-generate.
                </>,
              ],
            ]}
          />
          <Callout kind="warn" title="URL publik harus sama dengan domain">
            Ghost, Gitea, dan n8n memakai URL/host publik untuk membangun tautan
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
          ["400: variabel wajib kosong", "URL/Host publik belum diisi (Ghost, Gitea, n8n)."],
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
