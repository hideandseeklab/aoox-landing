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

export const metadata: Metadata = { title: "Preview pull request" }

const SUMMARY = [
  { k: "Per PR", v: "Satu container + satu subdomain" },
  { k: "Hidup", v: "Dari PR dibuka sampai ditutup/merge" },
  { k: "Default", v: "Mati — opt-in per aplikasi" },
]

const LIFECYCLE = [
  { s: "PR dibuka", d: "row preview dibuat, build dari branch PR" },
  { s: "running", d: "container <app>-pr<N> dilayani di <app>-pr<N>.<domain>" },
  { s: "push ke PR", d: "build ulang, container diganti" },
  { s: "PR ditutup / merge", d: "container & row dihapus" },
]

const NEXT = [
  { title: "Webhook auto-deploy", description: "Prasyarat: webhook dengan event PR/MR.", href: "/docs/webhook" },
  { title: "Proxy & domain", description: "Traefik dan sertifikat untuk host preview.", href: "/docs/domain" },
  { title: "Deploy & rollback", description: "Health check yang juga dipakai preview.", href: "/docs/deploy#health-check" },
  { title: "Monitoring", description: "Batas sumber daya yang diwarisi preview.", href: "/docs/monitoring#limit" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/preview"
      title="Preview pull request"
      description="Setiap pull request mendapat container dan subdomain sendiri, dibuat saat PR dibuka dan dihapus saat ditutup."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="prasyarat">Prasyarat</H2>
      <Ul>
        <li>
          <DocLink href="/docs/webhook">Webhook</DocLink> aplikasi terdaftar
          dengan event <strong>Pull requests</strong> (GitHub) atau{" "}
          <strong>Merge request events</strong> (GitLab), selain push.
        </li>
        <li>
          <DocLink href="/docs/domain">Reverse proxy</DocLink> berjalan dengan{" "}
          <Code>PROXY_ACME_EMAIL</Code> bila ingin HTTPS.
        </li>
        <li>
          Record DNS <strong>wildcard</strong> ke server:
        </li>
      </Ul>
      <Pre title="DNS">{`*.preview.example.com.   A   203.0.113.10`}</Pre>
      <Ul>
        <li>Aplikasi berjalan di host aoox (bukan server remote).</li>
      </Ul>

      <H2 id="siklus">Siklus hidup</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {LIFECYCLE.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Pre title="Contoh: aplikasi shop, PR #42, preview domain preview.example.com">{`container : aoox-app-shop-pr42
router    : shop-pr42
host      : https://shop-pr42.preview.example.com`}</Pre>

      <H2 id="langkah">Mengaktifkan</H2>
      <Steps>
        <Step title="Pengaturan aplikasi → Preview pull request">
          <P>
            Nyalakan toggle dan isi <strong>Preview domain</strong>, mis.{" "}
            <Code>preview.example.com</Code>. Kosong = memakai env{" "}
            <Code>PREVIEW_DOMAIN</Code> di API (bila diset).
          </P>
        </Step>
        <Step title="Buka pull request di provider">
          <P>
            Webhook menerima event, aoox membangun branch PR dengan cara
            build yang sama (Dockerfile/Nixpacks) dan tag khusus preview.
          </P>
        </Step>
        <Step title="Pantau di tab Webhook → Preview pull request">
          <P>
            Daftar preview: nomor PR, status (<Code>building</Code> →{" "}
            <Code>running</Code> | <Code>failed</Code>), host + tautan buka,
            log build, dan tombol hapus manual. Daftar menyegarkan tiap 5 detik
            selama ada yang <Code>building</Code>.
          </P>
        </Step>
      </Steps>

      <H2 id="event">Event yang ditangani</H2>
      <Table
        head={["Provider", "Membuat / menyegarkan", "Menghapus", "Diabaikan"]}
        rows={[
          ["GitHub (pull_request)", "opened, synchronize, reopened", "closed", "PR dari fork (head repo ≠ base repo)"],
          ["GitLab (merge_request)", "open, update, reopen", "close, merge", "MR dari fork (source project ≠ target project)"],
        ]}
      />
      <P>
        Respons webhook untuk event ini: <Code>preview</Code>,{" "}
        <Code>preview-closed</Code>, atau <Code>ignored</Code> dengan{" "}
        <Code>reason</Code> (<em>previews disabled</em>, <em>fork</em>,{" "}
        <em>preview limit</em>).
      </P>

      <H2 id="yang-diwarisi">Apa yang diwarisi dari aplikasi</H2>
      <Table
        head={["Aspek", "Preview"]}
        rows={[
          ["Cara build, Dockerfile path, build args", "Sama"],
          ["Environment variables (+ referensi project/database)", "Sama — termasuk database produksi bila direferensikan"],
          ["Health check path", "Sama; deployment preview gagal bila tidak healthy"],
          ["Batas CPU / memori", "Sama"],
          ["Mount (volume/bind/file)", <><strong>Tidak</strong> — preview tanpa mount</>],
          ["Port host", <><strong>Tidak</strong> — hanya lewat Traefik</>],
          ["Domain aplikasi", <><strong>Tidak</strong> — host preview sendiri</>],
          ["Blue/green", "Tidak — replace biasa"],
          ["Metrik & notifikasi", "Tidak ditampilkan di UI"],
        ]}
      />
      <Callout kind="warn" title="Env dibagi dengan produksi">
        Preview memakai env aplikasi apa adanya. Bila env merujuk{" "}
        <Code>{"${{database.<slug>.url}}"}</Code>, branch PR{" "}
        <strong>menulis ke database yang sama</strong> dengan produksi. Untuk
        isolasi, buat database terpisah dan pakai env berbeda, atau jangan
        aktifkan preview pada aplikasi yang memodifikasi data.
      </Callout>

      <H2 id="aturan">Aturan keamanan</H2>
      <Ul>
        <li>
          <strong>Opt-in per aplikasi</strong> (default mati) — branch PR adalah
          kode arbitrer yang akan dijalankan di server-mu.
        </li>
        <li>
          PR dari <strong>fork selalu diabaikan</strong>, walau preview aktif.
        </li>
        <li>
          Maksimal <strong>5</strong> preview terbuka per aplikasi
          (<Code>PREVIEW_MAX</Code>); PR keenam mendapat <Code>ignored</Code>{" "}
          sampai ada yang ditutup.
        </li>
        <li>
          PR yang ditutup saat build masih berjalan: container tidak
          ditinggalkan — dicek lagi setelah build dan setelah start.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Webhook 200 ignored: previews disabled", "Toggle belum dinyalakan di Pengaturan aplikasi."],
          ["Host preview tidak resolve", "DNS wildcard belum ada, atau preview domain salah ketik."],
          ["Sertifikat error / lama terbit", <>ACME per host diminta saat pertama diakses. Untuk banyak PR, pakai <Code>PROXY_ACME_STAGING=true</Code> dulu agar tidak kena rate limit.</>],
          ["Preview running tapi 404 dari Traefik", "Container belum healthy, atau health check gagal — lihat log build/preview."],
          ["Preview tidak muncul untuk PR tertentu", "PR dari fork, atau sudah 5 preview terbuka."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Preview untuk aplikasi di server remote; komentar otomatis berisi
        tautan preview di PR; env khusus preview.
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
