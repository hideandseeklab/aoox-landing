import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocPage,
  H2,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Scheduled jobs" }

const SUMMARY = [
  { k: "Lingkup", v: "Aplikasi, database, stack compose" },
  { k: "Target", v: "Di container · Container terpisah" },
  { k: "Riwayat", v: "50 run terakhir, output 64 KB" },
]

const DECISION = [
  { q: "Butuh state proses yang sedang jalan (cache di memori, sinyal)?", a: "Di container" },
  { q: "Berat, lama, atau tidak boleh mengganggu proses utama (migrasi, batch)?", a: "Container terpisah" },
  { q: "Aplikasi sedang stopped tapi job tetap harus jalan?", a: "Container terpisah" },
]

const RECIPES = [
  { name: "Migrasi DB setelah deploy", cron: "(manual)", cmd: "npm run migrate", target: "Container terpisah" },
  { name: "Bersihkan file sementara", cron: "0 3 * * *", cmd: "find /app/tmp -mtime +7 -delete", target: "Di container" },
  { name: "Laporan harian", cron: "0 7 * * 1-5", cmd: "node scripts/report.js", target: "Container terpisah" },
  { name: "Warm cache tiap 15 menit", cron: "*/15 * * * *", cmd: "curl -fsS http://127.0.0.1:3000/warm", target: "Di container" },
]

const NEXT = [
  { title: "Notifikasi", description: "Kabar job gagal/timeout ke channel pilihanmu.", href: "/docs/notifikasi" },
  { title: "Environment variables", description: "Env yang diwarisi job.", href: "/docs/environment" },
  { title: "Mount", description: "Volume yang bisa diakses job.", href: "/docs/mount" },
  { title: "Backup & restore", description: "Untuk backup pakai fitur bawaan, bukan job.", href: "/docs/backup" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/jobs"
      title="Scheduled jobs"
      description="Menjalankan perintah terjadwal (cron) atau manual di konteks aplikasi, managed database, atau stack compose — migrasi, pembersihan, laporan."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="pemilik">Tiga pemilik job</H2>
      <Table
        head={["Pemilik", "Di mana", "Di container", "Container terpisah"]}
        rows={[
          ["Aplikasi", "Tab Jobs aplikasi", "exec di container aplikasi", "Image aplikasi saat ini + env & mount aplikasi"],
          [
            "Managed database",
            "Tab Jobs database",
            "exec di container database",
            <>Image engine (psql/mysql/redis-cli tersedia) dengan env <Code>DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME</Code> — sama seperti resep backup</>,
          ],
          [
            "Stack compose",
            "Tab Jobs stack",
            <>exec di container <strong>Service</strong> yang dipilih</>,
            "Image & env service itu",
          ],
        ]}
      />
      <Pre title="Contoh job database (Container terpisah, PostgreSQL)">{`psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "VACUUM ANALYZE"`}</Pre>

      <H2 id="target">Dua target eksekusi</H2>
      <Table
        head={["Target", "Cara jalan", "Konsekuensi"]}
        rows={[
          [
            <strong key="c">Di container</strong>,
            <>
              <Code>docker exec</Code> di container aplikasi yang sedang
              running.
            </>,
            "Berbagi CPU/RAM dengan aplikasi. Gagal bila aplikasi stopped.",
          ],
          [
            <strong key="r">Container terpisah</strong>,
            "Container sekali-jalan dari image saat ini dengan env, mount, dan batas sumber daya yang sama; dihapus setelah selesai.",
            "Terisolasi. Tidak terlihat oleh monitoring/notifikasi container mati.",
          ],
        ]}
      />
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

      <H2 id="langkah">Membuat job</H2>
      <Steps>
        <Step title="Buka tab Jobs → Job baru">
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              ["Nama", "Label job."],
              [
                "Jadwal (cron)",
                <>
                  5 field, mis. <Code>0 3 * * *</Code>. Kosongkan untuk job
                  manual saja. Divalidasi saat simpan (400 bila salah).
                </>,
              ],
              [
                "Perintah",
                <>
                  Dijalankan lewat <Code>sh -c</Code> — boleh pipe, <Code>&amp;&amp;</Code>,
                  dan tanda kutip.
                </>,
              ],
              ["Target", "Di container / Container terpisah."],
              ["Timeout (detik)", "Default 600. Ditegakkan di dalam container."],
            ]}
          />
        </Step>
        <Step title="Jalankan manual untuk mencoba">
          <P>
            Klik <strong>Jalankan</strong>. Riwayat run muncul saat baris job
            dibuka: status, exit code, durasi, dan output. Halaman menyegarkan
            tiap 2 detik selama ada run yang berjalan.
          </P>
        </Step>
        <Step title="Aktifkan jadwal">
          <P>
            Toggle <strong>aktif</strong> di baris job. Jadwal didaftarkan
            langsung tanpa restart API; zona waktu mengikuti container API
            (UTC di image distribusi).
          </P>
        </Step>
      </Steps>

      <H2 id="contoh">Contoh job</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Job</th>
              <th className="px-3 py-2 text-left font-medium">Cron</th>
              <th className="px-3 py-2 text-left font-medium">Perintah</th>
              <th className="px-3 py-2 text-left font-medium">Target</th>
            </tr>
          </thead>
          <tbody>
            {RECIPES.map((r) => (
              <tr key={r.name} className="border-t border-border align-top">
                <td className="px-3 py-2 text-foreground">{r.name}</td>
                <td className="px-3 py-2"><Code>{r.cron}</Code></td>
                <td className="px-3 py-2"><Code>{r.cmd}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{r.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pre title="Cron 5 field">{`┌─ menit (0-59)
│ ┌─ jam (0-23)
│ │ ┌─ tanggal (1-31)
│ │ │ ┌─ bulan (1-12)
│ │ │ │ ┌─ hari (0-6, 0 = Minggu)
* * * * *

*/15 * * * *   tiap 15 menit
0 3 * * *      tiap hari 03:00
0 0 * * 0      tiap Minggu 00:00`}</Pre>

      <H2 id="perilaku">Perilaku</H2>
      <Ul>
        <li>
          Tick cron <strong>dilewati</strong> (tidak antre) bila run sebelumnya
          masih berjalan. Menjalankan manual saat masih ada run aktif → 409.
        </li>
        <li>
          Status run: <Code>success</Code> (exit 0) / <Code>failed</Code> (exit
          ≠ 0) / <Code>timeout</Code>. Gagal atau timeout mengirim notifikasi{" "}
          <Code>jobFailure</Code> bila diaktifkan.
        </li>
        <li>
          Output stdout+stderr disimpan sampai 64 KB per run; 50 run terakhir
          per job. UI menampilkan 20 terakhir.
        </li>
        <li>
          Deploy baru tidak menghentikan run yang sedang berjalan di{" "}
          <em>Container terpisah</em>; run <em>Di container</em> ikut mati
          bersama container lama.
        </li>
        <li>
          Untuk aplikasi mode <em>service</em> (Swarm), target{" "}
          <em>Di container</em> menjalankan exec di task yang ada{" "}
          <strong>di host</strong> — Engine API tidak bisa exec ke task di node
          lain.
        </li>
      </Ul>

      <H2 id="timeout">Cara kerja timeout</H2>
      <P>
        Timeout ditegakkan <strong>di dalam</strong> container lewat perintah{" "}
        <Code>timeout</Code> (bila ada di image), karena exec tidak bisa
        dibunuh dari luar. API baru menyerah menunggu setelah{" "}
        <Code>timeout + 30 detik</Code>.
      </P>
      <Callout kind="warn">
        Image tanpa <Code>timeout</Code> (mis. distroless) tidak bisa membatasi
        durasi: run dianggap <Code>timeout</Code> hanya setelah API berhenti
        menunggu, sementara perintah mungkin masih berjalan. Sertakan coreutils
        atau busybox di image bila job berpotensi lama.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Run gagal: container not running", "Target Di container tapi aplikasi stopped. Pakai Container terpisah atau start aplikasinya."],
          ["command not found", "Image tidak punya binary itu (mis. curl di alpine minimal). Pakai wget, atau tambahkan ke Dockerfile."],
          ["Jadwal tidak jalan pada jam yang diharapkan", "Zona waktu API = UTC. Geser jam di cron (WIB = UTC+7)."],
          ["Job tetap failed padahal perintah sukses", <>Exit code terakhir ≠ 0 — mis. <Code>grep</Code> tanpa hasil. Akhiri dengan <Code>|| true</Code> bila memang tidak masalah.</>],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Streaming output saat run berjalan; riwayat lebih dari 20 di UI.
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
