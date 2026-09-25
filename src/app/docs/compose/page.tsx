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

export const metadata: Metadata = { title: "Stack compose" }

const SUMMARY = [
  { k: "Sumber", v: "Repo Git (file compose) atau template" },
  { k: "Berjalan sebagai", v: "docker compose project aoox-<slug>" },
  { k: "Status", v: "idle → deploying → running | stopped | error" },
]

const DECISION = [
  { q: "Satu repo, satu proses, satu port?", a: "Aplikasi", href: "/docs/aplikasi" },
  { q: "Beberapa service saling terhubung (web + worker + queue) dengan docker-compose.yml?", a: "Stack compose", href: null },
  { q: "Ingin aplikasi siap pakai (WordPress, n8n, …) tanpa repo?", a: "Template", href: "/docs/template" },
]

const FLOW = [
  { s: "helper", d: "container docker:29-cli (compose + git) sekali-jalan" },
  { s: "clone", d: "git clone --depth 1 ke volume checkout" },
  { s: "env", d: ".aoox.env ditulis dari env ter-resolve" },
  { s: "up", d: "docker compose config → up -d --build --remove-orphans" },
]

const NEXT = [
  { title: "Template one-click", description: "Stack dari katalog tanpa repo.", href: "/docs/template" },
  { title: "Environment variables", description: "Referensi ${{…}} yang juga berlaku untuk stack.", href: "/docs/environment" },
  { title: "Proxy & domain", description: "Traefik yang merutekan domain per service.", href: "/docs/domain" },
  { title: "Managed database", description: "Alternatif menjalankan DB di luar stack agar bisa di-backup.", href: "/docs/database" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/compose"
      title="Stack compose"
      description="Men-deploy file docker-compose dari repo sebagai satu stack multi-service, lengkap dengan domain per service."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Aplikasi, stack compose, atau template?</H2>
      <div className="border border-border text-xs">
        {DECISION.map((row, i) => (
          <div
            key={row.q}
            className={`grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <span className="text-foreground">{row.q}</span>
            <span className="text-muted-foreground">
              →{" "}
              {row.href ? (
                <Link href={row.href} className="text-foreground underline underline-offset-4">
                  {row.a}
                </Link>
              ) : (
                <span className="text-primary-foreground dark:text-primary">{row.a}</span>
              )}
            </span>
          </div>
        ))}
      </div>
      <P>
        Stack compose menukar sebagian fitur aplikasi (health check, blue/green,
        rollback, metrik) dengan fleksibilitas menjalankan file compose apa
        adanya — termasuk <Code>build:</Code>, network, dan volume yang
        didefinisikan di dalamnya.
      </P>

      <H2 id="langkah">Membuat stack</H2>
      <Steps>
        <Step title="Halaman project → Stack compose baru">
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              ["Nama", "Slug unik; nama project compose = aoox-<slug> (grup sendiri di Docker Desktop)."],
              ["Git repository / Branch / Kredensial Git", "Sama seperti aplikasi."],
              [
                "File compose",
                <>
                  Path relatif dari root repo, default <Code>docker-compose.yml</Code>.
                  Path relatif <em>di dalam</em> file dihitung dari folder file ini.
                </>,
              ],
              [
                "Environment variables",
                <>
                  Mendukung <Code>{"${{project.KEY}}"}</Code> dan{" "}
                  <Code>{"${{database.<slug>.url}}"}</Code>.
                </>,
              ],
            ]}
          />
        </Step>
        <Step title="Klik Deploy">
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
            Output helper mengalir ke panel <strong>Log aksi terakhir</strong>{" "}
            (menyegarkan tiap 3 detik selama <Code>deploying</Code>). Token Git
            dan password database disensor.
          </P>
        </Step>
        <Step title="Verifikasi">
          <P>
            Halaman stack menampilkan container yang dibuat compose beserta
            statusnya. Status stack <Code>running</Code> berarti{" "}
            <Code>up -d</Code> selesai tanpa error — bukan berarti tiap service
            sehat; cek log service lewat <Code>docker compose logs</Code> di{" "}
            <DocLink href="/docs/terminal">terminal</DocLink>.
          </P>
        </Step>
      </Steps>

      <H2 id="env">Env & interpolasi</H2>
      <Callout kind="warn" title="Env stack ≠ env container">
        <Code>.aoox.env</Code> dipakai sebagai <Code>--env-file</Code>:
        nilainya menjadi sumber interpolasi <Code>{"${VAR}"}</Code> di file
        compose, <strong>bukan</strong> otomatis masuk ke container. Teruskan
        eksplisit lewat <Code>environment:</Code> di service.
      </Callout>
      <Pre title="Env stack di aoox">{`DATABASE_URL=\${{database.app-db.url}}
APP_SECRET=rahasia`}</Pre>
      <Pre title="docker-compose.yml">{`services:
  web:
    build: .
    environment:
      DATABASE_URL: \${DATABASE_URL}   # dari env stack
      APP_SECRET: \${APP_SECRET}
  worker:
    build: .
    command: node worker.js
    environment:
      DATABASE_URL: \${DATABASE_URL}`}</Pre>
      <Ul>
        <li>
          Managed database aoox bisa dijangkau dari stack karena service
          bergabung ke network <Code>aoox</Code> saat ada domain (lihat
          bawah); tanpa domain, tambahkan sendiri{" "}
          <Code>networks: [default, aoox]</Code> + deklarasi network
          eksternal.
        </li>
      </Ul>
      <Pre title="Bergabung ke network aoox secara manual">{`services:
  web:
    networks: [default, aoox]
networks:
  aoox:
    external: true`}</Pre>

      <H2 id="akses">Akses: domain atau IP & port</H2>
      <P>
        Kartu <strong>Akses</strong> di halaman stack punya dua jenis baris
        untuk tiap service yang ingin dijangkau dari luar:
      </P>
      <Table
        head={["Jenis", "Yang diisi", "Hasil"]}
        rows={[
          [
            <strong key="d">Domain</strong>,
            "Service, Port container, Host, toggle HTTPS",
            "Label Traefik di file override; butuh reverse proxy.",
          ],
          [
            <strong key="p">IP &amp; port</strong>,
            "Service, Port container, Port host",
            <>
              Baris <Code>ports:</Code> di file override — stack bisa dibuka
              lewat <Code>{"http://<ip-server>:<port host>"}</Code> tanpa domain.
            </>,
          ],
        ]}
      />
      <Ul>
        <li>
          Bentrokan port dengan aplikasi, database, stack lain, atau container
          apa pun yang sedang berjalan <strong>ditolak saat menyimpan</strong> —
          bukan saat <Code>up</Code>, sehingga stack lama tidak terlanjur
          dibongkar.
        </li>
        <li>
          Perubahan akses baru berlaku setelah <strong>deploy ulang</strong>;
          panel menampilkan pengingatnya.
        </li>
        <li>Deploy dari template juga menerima port host langsung di dialog.</li>
      </Ul>

      <H2 id="domain">Domain per service</H2>
      <Steps>
        <Step title="Kartu Domain di halaman stack">
          <P>
            Pilih <strong>Service</strong>, <strong>Port</strong> di dalam
            container, <strong>Hostname</strong>, dan toggle <strong>HTTPS</strong>.
          </P>
        </Step>
        <Step title="Deploy ulang">
          <P>
            Saat deploy aoox menulis override{" "}
            <Code>docker-compose.aoox.yml</Code> di samping file compose,
            berisi label Traefik (router <Code>{"<slug>-<service>-<port>"}</Code>)
            dan network <Code>aoox</Code> + <Code>default</Code>, lalu
            menjalankan <Code>-f compose -f override</Code>.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          Perubahan domain baru berlaku setelah <strong>deploy ulang</strong>.
        </li>
        <li>
          Stop/start memakai override yang sudah ada di volume, jadi konsisten
          dengan stack yang berjalan.
        </li>
        <li>
          Tanpa domain, tidak ada override — file compose dijalankan apa adanya.
        </li>
      </Ul>

      <H2 id="operasi">Operasi</H2>
      <Table
        head={["Aksi", "Yang dijalankan", "Catatan"]}
        rows={[
          ["Deploy", <><Code>up -d --build --remove-orphans</Code></>, "Clone ulang branch, build image bila ada build:."],
          ["Stop", <><Code>stop</Code></>, "Container berhenti, volume tetap."],
          ["Start", <><Code>start</Code></>, "Tanpa clone/build."],
          ["Hapus", <><Code>down --volumes --remove-orphans</Code> + hapus volume checkout</>, <><strong>Data volume stack ikut hilang.</strong></>],
        ]}
      />

      <H2 id="riwayat">Riwayat, webhook & metrik</H2>
      <P>
        Tiap kali runner compose berjalan — Deploy, Stop, Start, Hapus, atau
        via webhook — ditulis sebagai satu baris riwayat (aksi, pemicu, log,
        commit). Stack adalah N container, jadi ini riwayat{" "}
        <strong>aksi</strong>, bukan riwayat image/rollback seperti Deployment
        aplikasi.
      </P>
      <Ul>
        <li>
          <strong>Auto-deploy dari push</strong>: aktifkan Webhook di tab
          Deploy untuk dapat URL berisi token. Kontrak sama seperti webhook
          aplikasi — tanda tangan GitHub/GitLab opsional, dan push yang tidak
          relevan tetap dibalas 200 supaya provider tidak mematikan hook-nya.
          Stack dari <strong>template</strong> tidak punya repo, jadi push
          diterima tapi diabaikan.
        </li>
        <li>
          <strong>Metrik & notifikasi container mati</strong> kini aktif —
          container stack dikenali lewat nama project compose (
          <Code>aoox-&lt;slug&gt;</Code>), bukan label komponen
          aoox. Notifikasi diam selama sebuah run berlangsung, karena
          <Code>up -d --build</Code> mematikan lalu menghidupkan ulang setiap
          container.
        </li>
        <li>
          Batas sumber daya tetap tidak diatur dari UI — pakai{" "}
          <Code>deploy.resources</Code> di file compose.
        </li>
      </Ul>

      <H2 id="perilaku">Perilaku & batasan</H2>
      <Ul>
        <li>
          <Code>build:</Code> didukung penuh — CLI compose memakai BuildKit
          (berbeda dari aplikasi Nixpacks).
        </li>
        <li>
          Tidak ada rollback atau health check/blue-green per stack — Deploy
          selalu <Code>up -d --build</Code> ulang, bukan swap image seperti
          aplikasi.
        </li>
        <li>
          Tidak ada mount dari UI untuk stack — atur volume di file compose.
        </li>
        <li>
          <strong>Jobs</strong> tersedia di tab Jobs stack: pilih{" "}
          <strong>Service</strong>, lalu exec di container service itu atau
          container terpisah dari image-nya — lihat{" "}
          <DocLink href="/docs/jobs#pemilik">Scheduled jobs</DocLink>.
        </li>
        <li>
          Database di dalam stack tidak ikut fitur backup aoox — untuk data
          penting, pakai <DocLink href="/docs/database">managed database</DocLink>.
        </li>
        <li>
          File compose dari repo boleh minta <Code>privileged</Code> / mount host
          — perlakukan repo seperti kode yang dijalankan di host.
        </li>
        <li>Gagal deploy mengirim notifikasi deployment gagal.</li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Service tidak melihat env", "Env stack hanya untuk interpolasi. Tambahkan environment: di service."],
          ["Bind mount ./file gagal: not a directory", "Sudah ditangani (checkout di mountpoint volume). Bila tetap gagal, path relatif dihitung dari folder file compose, bukan root repo."],
          ["Service tidak saling menemukan setelah menambah domain", "Override sudah menyertakan network default. Bila file compose kamu mendeklarasikan networks: sendiri di service, sertakan default."],
          ["Tidak bisa konek ke managed database", "Service tidak di network aoox. Tambahkan domain (otomatis) atau networks eksternal manual."],
          ["Domain 404", "Belum deploy ulang setelah menambah domain, atau port service salah."],
          ["Port host ditolak saat menyimpan", "Port sudah dipakai aplikasi, database, stack lain, atau container yang sedang berjalan. Pilih port lain."],
          ["Push tidak memicu deploy", "Stack dari template tidak punya repo — push selalu diabaikan. Untuk stack dari repo, cek URL webhook dan tanda tangan provider."],
        ]}
      />

      <H3>Template</H3>
      <P>
        Stack dari katalog (<Code>source: template</Code>) memakai runner yang
        sama, tapi isi compose disimpan di aoox dan bisa diedit dari UI
        tanpa repo — lihat <DocLink href="/docs/template">Template one-click</DocLink>.
      </P>

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
