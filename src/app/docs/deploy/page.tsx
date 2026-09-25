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
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Deploy & rollback" }

const SUMMARY = [
  { k: "Pemicu", v: "Tombol Deploy, webhook push, auto-update, Rollback" },
  { k: "Berjalan di", v: "Daemon Docker host (atau server remote)" },
  { k: "Jaminan", v: "Gagal build tidak menyentuh container lama" },
]

const STATUSES = [
  { s: "queued", d: "deployment dibuat" },
  { s: "building", d: "clone + build image" },
  { s: "pushing", d: "push ke registry" },
  { s: "starting", d: "container baru, tunggu healthy" },
  { s: "success", d: "container lama diganti", final: true },
]

const BLUE_GREEN = [
  { t: "0 s", old: "melayani", next: "—", note: "Deploy dimulai; image baru sudah di registry." },
  { t: "+1 s", old: "melayani", next: "starting", note: "Container <app>-next dibuat dengan label Traefik yang sama." },
  { t: "+3–90 s", old: "melayani", next: "healthy", note: "Traefik mulai merutekan ke keduanya setelah -next healthy." },
  { t: "+3 s", old: "dihapus", next: "melayani", note: "Tunggu proxy settle, hapus yang lama." },
  { t: "selesai", old: "—", next: "→ <app>", note: "-next di-rename ke nama asli. Deployment success." },
]

const NEXT = [
  { title: "Webhook auto-deploy", description: "Deploy tiap push tanpa menekan tombol.", href: "/docs/webhook" },
  { title: "Preview pull request", description: "Container sementara per PR.", href: "/docs/preview" },
  { title: "Notifikasi", description: "Kabar deploy sukses/gagal ke Telegram, Slack, dll.", href: "/docs/notifikasi" },
  { title: "Monitoring", description: "Metrik CPU/RAM container setelah deploy.", href: "/docs/monitoring" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/deploy"
      title="Deploy & rollback"
      description="Apa yang terjadi saat tombol Deploy ditekan, cara membaca log, health check dan blue/green, serta kembali ke versi sebelumnya."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">Alur satu deployment</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-5">
        {STATUSES.map((item, i) => (
          <li key={item.s} className="relative flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span
              className={cn(
                "font-medium",
                item.final ? "text-primary-foreground dark:text-primary" : "text-foreground"
              )}
            >
              {item.s}
            </span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Setiap tahap bisa berakhir <Code>failed</Code>; deployment selalu
        berakhir di <Code>success</Code> atau <Code>failed</Code>, tidak pernah
        menggantung. Log tiap tahap mengalir ke tab Deploy secara realtime.
      </P>
      <Ul>
        <li>
          Deploy menolak (409) bila masih ada deployment aktif untuk aplikasi
          yang sama. Webhook yang datang saat itu dijawab <Code>busy</Code>{" "}
          dan tidak diantre.
        </li>
        <li>
          Gagal di <Code>building</Code> atau <Code>pushing</Code>{" "}
          <strong>tidak menyentuh</strong> container yang sedang berjalan dan
          tidak mengubah status aplikasi.
        </li>
        <li>
          Di server remote tahap <Code>pushing</Code> dilewati — image tetap di
          daemon server itu.
        </li>
      </Ul>

      <H2 id="mode">Mode deploy: container atau service</H2>
      <Table
        head={["", "container (default)", "service (Swarm)"]}
        rows={[
          ["Yang dibuat", "Satu container di host/server aplikasi", "Service dengan N replika, task disebar scheduler"],
          ["Pergantian versi", "Blue/green atau replace", "Rolling update oleh daemon (paralelisme, jeda, urutan)"],
          ["Gagal", "Container lama tetap melayani", "Rollback otomatis ke spec sebelumnya setelah timeout"],
          ["Stop / Start", "Container di-stop/start", "Skala ke 0 dan kembali ke jumlah replika"],
          ["Metrik", "Container itu", "Jumlah task lokal saja"],
        ]}
      />
      <P>
        Mode service butuh <DocLink href="/docs/swarm">Docker Swarm</DocLink>{" "}
        aktif. Mengubah mode, replika, penempatan, atau batas sumber daya
        dijalankan sebagai deployment <Code>config</Code> — tanpa build, dan
        antrean deployment yang sama tetap berlaku.
      </P>

      <H2 id="auto-update">Update otomatis (aplikasi dari image)</H2>
      <P>
        Aplikasi yang sumbernya <strong>image</strong> (bukan repo Git) bisa
        memperbarui dirinya sendiri: watcher membandingkan digest manifest tag
        yang dipakai lewat API registry setiap{" "}
        <strong>60 menit</strong> (bisa diatur per aplikasi), dan membuat
        deployment <Code>auto-update</Code> begitu digest berubah.
      </P>
      <Ul>
        <li>
          Baseline diambil dari digest yang tercatat saat pull terakhir — bukan
          dari tag, jadi <Code>latest</Code> pun terdeteksi.
        </li>
        <li>
          Mendukung Docker Hub/GHCR (token flow) dan registry sendiri (basic
          auth lewat kredensial registry eksternal).
        </li>
        <li>
          Tombol <strong>cek sekarang</strong> di halaman aplikasi memaksa
          pemeriksaan tanpa menunggu interval.
        </li>
      </Ul>

      <H2 id="log">Log realtime</H2>
      <Table
        head={["Log", "Isi", "Sumber"]}
        rows={[
          ["Log deployment", "Output clone, build, push, start untuk satu deployment. Tersimpan permanen di riwayat.", "Runner → Socket.IO /logs"],
          ["Log container", "stdout/stderr aplikasi yang sedang berjalan (follow).", "docker logs --follow"],
        ]}
      />
      <P>
        Token Git dan password database yang ter-resolve disensor otomatis
        dari kedua log dan dari pesan error. Setiap container yang dibuat
        aoox memakai <strong>rotasi log</strong> (json-file dengan batas
        ukuran dan jumlah file), jadi log container tidak memenuhi disk.
      </P>

      <H2 id="health-check">Health check</H2>
      <P>
        Isi <strong>Health check path</strong> (mis. <Code>/health</Code>) di
        Pengaturan. Container dibuat dengan Docker <Code>HEALTHCHECK</Code> yang
        memanggil <Code>{"127.0.0.1:<port container><path>"}</Code> tiap 3 detik,
        maksimal 30 kali (± 90 detik).
      </P>
      <Pre title="Endpoint yang cukup">{`GET /health → 200 OK
# tidak perlu body; yang penting status 2xx dan cepat`}</Pre>
      <Callout kind="warn" title="Prasyarat di image">
        Perintah health check mencoba <Code>wget</Code> → <Code>curl</Code> →{" "}
        <Code>node -e fetch</Code> → <Code>python3</Code>. Image yang tidak
        punya satu pun (mis. <Code>scratch</Code>, distroless) membuat
        deployment gagal dengan pesan yang menyebutkannya. Container yang
        kemudian menjadi <Code>unhealthy</Code> otomatis dilepas Traefik (404).
      </Callout>

      <H2 id="blue-green">Blue/green</H2>
      <P>
        Aktif otomatis bila aplikasi punya <strong>domain</strong>,{" "}
        <strong>tanpa port host</strong>, dan bukan preview. Tujuannya: tidak
        ada request yang gagal selama pergantian versi.
      </P>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Waktu</th>
              <th className="px-3 py-2 text-left font-medium">Container lama</th>
              <th className="px-3 py-2 text-left font-medium">Container -next</th>
              <th className="px-3 py-2 text-left font-medium">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {BLUE_GREEN.map((row) => (
              <tr key={row.t} className="border-t border-border align-top">
                <td className="px-3 py-2 text-muted-foreground">{row.t}</td>
                <td className={cn("px-3 py-2", row.old === "melayani" ? "text-primary-foreground dark:text-primary" : "text-muted-foreground")}>
                  {row.old}
                </td>
                <td className={cn("px-3 py-2", row.next === "melayani" || row.next === "healthy" ? "text-primary-foreground dark:text-primary" : "text-muted-foreground")}>
                  {row.next}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Table
        head={["Kondisi", "Perilaku"]}
        rows={[
          ["Domain, tanpa port host, ada health check", <><strong>Blue/green</strong> seperti di atas.</>],
          ["Ada port host", "Replace biasa — dua container tidak bisa bind port yang sama. Health check tetap menentukan sukses/gagal."],
          ["Tanpa health check path", "Replace biasa; deployment sukses begitu container start."],
          ["Gagal / timeout saat blue/green", "-next dihapus, container lama tetap melayani, deployment failed."],
        ]}
      />
      <Callout>
        Kedua container sementara memakai volume yang sama. Aplikasi yang
        mengunci file (mis. SQLite tanpa WAL) sebaiknya memakai port host atau
        tanpa health check agar replace biasa yang dipakai.
      </Callout>

      <H2 id="rollback">Rollback</H2>
      <Steps>
        <Step title="Pilih deployment yang berstatus success">
          <P>Di daftar deployment (tab Deploy), klik <strong>Rollback</strong> pada versi tujuan.</P>
        </Step>
        <Step title="Deployment baru berjenis rollback dibuat">
          <P>
            Tanpa build/push — image lama ditarik dari registry (atau yang masih
            ada di server remote) dan container diganti lewat jalur yang sama:
            health check, blue/green.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          Rollback memakai <strong>image</strong> lama tapi <strong>env saat ini</strong>{" "}
          — cocok untuk memperbaiki env yang salah tanpa build ulang.
        </li>
        <li>
          Tag image yang sudah dihapus di <DocLink href="/docs/registry">Registry</DocLink>{" "}
          tidak bisa jadi target rollback.
        </li>
      </Ul>

      <H2 id="stop-start">Stop & start</H2>
      <P>
        Tombol <strong>Stop</strong>/<strong>Start</strong> di tab Deploy
        menghentikan/menjalankan container tanpa build ulang. Notifikasi
        container-mati tidak dikirim untuk stop yang disengaja.
      </P>

      <H2 id="perubahan">Perubahan apa memicu apa</H2>
      <Table
        head={["Yang diubah", "Efek", "Perlu"]}
        rows={[
          ["Kode di repo", "Image baru", "Deploy (atau push + webhook)"],
          ["Tag image berubah (sumber image)", "Pull image baru", "Otomatis bila Update otomatis aktif"],
          ["Build args, Dockerfile path, cara build", "Image baru", "Deploy"],
          ["Environment variables", "Berlaku saat container dibuat", "Deploy atau Rollback"],
          ["Domain, mount, batas sumber daya (cabut)", "Container dibuat ulang dari image saat ini", "Otomatis, tanpa build"],
          ["Mode deploy, replika, penempatan", "Service diperbarui (rolling)", "Deployment config, otomatis"],
          ["Batas sumber daya (ubah nilai)", "Diterapkan langsung", "Tidak ada"],
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
