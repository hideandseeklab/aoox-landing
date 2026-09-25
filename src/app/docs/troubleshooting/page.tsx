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
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Troubleshooting" }

const SUMMARY = [
  { k: "Mulai dari", v: "Log API + docker ps" },
  { k: "Sumber kebenaran", v: "Log deployment di tab Deploy" },
  { k: "Masih buntu?", v: "Buka issue dengan info di bawah" },
]

const AREAS = [
  { id: "instalasi", title: "Instalasi & akses" },
  { id: "deploy", title: "Build & deploy" },
  { id: "domain", title: "Domain & HTTPS" },
  { id: "database", title: "Database & backup" },
  { id: "server", title: "Terminal & server remote" },
  { id: "lainnya", title: "Notifikasi, jobs, disk" },
]

type Row = [gejala: React.ReactNode, penyebab: React.ReactNode, solusi: React.ReactNode]

const INSTALASI: Row[] = [
  [
    <>Web terbuka, tapi sign-in / API gagal (network error)</>,
    <><Code>PUBLIC_API_URL</Code> tidak bisa dijangkau browser (IP/port salah, firewall 3001).</>,
    <>Samakan dengan alamat yang bisa dibuka dari browser; <Code>curl &lt;PUBLIC_API_URL&gt;/auth/setup-status</Code> dari laptop harus menjawab.</>,
  ],
  [
    <>Terminal: <Code>origin not allowed</Code></>,
    <><Code>WEB_ORIGIN</Code> ≠ URL di browser (skema/host/port).</>,
    <>Samakan persis, lalu <Code>up -d</Code> ulang. Lihat <DocLink href="/docs/domain-panel">Domain untuk panel</DocLink>.</>,
  ],
  [
    <>Kartu Registry/Proxy: <em>Docker tidak terjangkau</em> / permission denied di socket</>,
    <><Code>DOCKER_GID</Code> salah atau socket tidak di-mount.</>,
    <><Code>stat -c %g /var/run/docker.sock</Code> → set <Code>DOCKER_GID</Code> → recreate API.</>,
  ],
  [
    <>Semua pengguna logout mendadak</>,
    <><Code>JWT_SECRET</Code> berubah.</>,
    "Normal setelah rotasi; kembalikan nilai lama bila tidak disengaja.",
  ],
  [
    <>Kredensial registry/Git/notifikasi/S3 tidak bisa dibaca</>,
    <><Code>ENCRYPTION_KEY</Code> berubah.</>,
    "Kembalikan nilai lama; kalau hilang, masukkan ulang semua kredensial.",
  ],
  [
    <><Code>/setup</Code> tidak muncul / 404</>,
    "Sudah ada pengguna.",
    <>Sign in biasa; owner bisa reset password anggota. Untuk mulai dari nol: <Code>down -v</Code>.</>,
  ],
]

const DEPLOY: Row[] = [
  [
    <>Deploy gagal: <em>No self-hosted registry</em></>,
    "Registry lokal belum di-provision.",
    <><DocLink href="/docs/registry">Provision registry</DocLink> dulu.</>,
  ],
  [
    <>Build: <em>repository not found</em> / 128</>,
    "Repo privat tanpa Kredensial Git, token kedaluwarsa, atau branch salah.",
    <>Tambahkan kredensial di Settings dan pilih di aplikasi; cek nama branch.</>,
  ],
  [
    <>Build: <em>unknown flag --mount</em> / heredoc error</>,
    "Sintaks BuildKit di Dockerfile; builder klasik.",
    <>Ganti dengan langkah biasa — lihat <DocLink href="/docs/build#dockerfile">Cara build</DocLink>.</>,
  ],
  [
    <>Health check tidak pernah healthy</>,
    <>Port container ≠ port yang di-listen, listen hanya di <Code>127.0.0.1</Code>, path tidak 2xx, atau image tanpa wget/curl/node/python3.</>,
    <>Listen di <Code>0.0.0.0</Code>, samakan port, sediakan endpoint 200 cepat.</>,
  ],
  [
    <>Env baru tidak terbaca aplikasi</>,
    "Env diterapkan saat container dibuat.",
    "Deploy atau Rollback sekali lagi.",
  ],
  [
    <>400: referensi <Code>{"${{database.x.url}}"}</Code> tidak dikenal</>,
    "Slug salah atau database di project lain.",
    "Referensi hanya dalam project yang sama.",
  ],
  [
    <>Webhook push tidak memicu deploy</>,
    <>Branch beda, event bukan push, deployment masih jalan (<Code>busy</Code>), atau 401 secret.</>,
    <>Cek <em>Recent Deliveries</em> di provider — <DocLink href="/docs/webhook#respons">tabel respons</DocLink>.</>,
  ],
  [
    <>Rollback gagal: <em>image not found</em></>,
    "Tag dipangkas retensi atau dihapus manual.",
    "Deploy ulang commit itu; naikkan Riwayat deployment.",
  ],
  [
    <>Nixpacks/statis: build pertama sangat lama</>,
    "Base image ± 350 MB + helper dibangun sekali.",
    "Tunggu; untuk build cepat pakai Dockerfile.",
  ],
]

const DOMAIN: Row[] = [
  [
    <>Tab Domain: <em>Proxy belum berjalan</em></>,
    "Traefik belum di-provision.",
    <>Settings → Reverse proxy → provision (owner).</>,
  ],
  [
    <>404 page not found dari Traefik</>,
    "Container belum healthy, atau domain ditambah sebelum container dibuat ulang.",
    "Tunggu healthy; cek log deploy; pastikan health check lolos.",
  ],
  [
    <>Sertifikat self-signed / <em>TRAEFIK DEFAULT CERT</em></>,
    "ACME gagal: DNS belum benar, port 80 tertutup, rate limit, atau email kosong saat provision.",
    <><Code>docker logs -f aoox-proxy</Code>; uji dengan <Code>PROXY_ACME_STAGING=true</Code>.</>,
  ],
  [
    <>Redirect loop</>,
    "Cloudflare mode Flexible atau proxy lain men-terminate TLS di depan.",
    "Full (strict), atau matikan HTTPS di aoox.",
  ],
  [
    <>Cek DNS: <Code>?</Code></>,
    "IP publik server tidak terdeteksi (NAT/tanpa internet keluar).",
    <>Set <Code>PUBLIC_IP</Code> di <Code>.env.dist</Code>.</>,
  ],
  [
    <>Preview PR tidak resolve</>,
    "Tanpa DNS wildcard, atau preview domain salah.",
    <><Code>*.preview.example.com A &lt;ip&gt;</Code>.</>,
  ],
]

const DATABASE: Row[] = [
  [
    <>Aplikasi: <Code>ECONNREFUSED</Code> / <Code>ENOTFOUND</Code> ke database</>,
    "Memakai URL eksternal/localhost dari dalam container, atau app di server remote memakai host internal.",
    "Pakai referensi (host internal) untuk app lokal; koneksi eksternal + port host untuk server remote.",
  ],
  [
    <>Database status <em>error</em> saat dibuat</>,
    "Tag image tidak ada, atau port host sudah dipakai.",
    "Hapus, buat ulang dengan tag/port lain.",
  ],
  [
    <>Backup 20 byte / gagal</>,
    "Kredensial/DB belum siap, atau disk penuh.",
    "Baca pesan error di baris backup; cek Disk Docker.",
  ],
  [
    <>Tes tujuan S3: <em>NoSuchBucket</em> / gagal ke MinIO lokal</>,
    "Bucket belum ada, region salah, atau endpoint memakai localhost dari container.",
    <>Buat bucket; pakai nama container MinIO + :9000 sebagai endpoint.</>,
  ],
  [
    <>Data browser: 400 hanya satu statement</>,
    <><Code>;</Code> di akhir atau beberapa statement.</>,
    "Jalankan satu per satu, atau pakai Impor SQL.",
  ],
  [
    <>Member: 403 saat menjalankan query</>,
    "Statement tulis.",
    "Hanya owner/admin; sesi member read-only di engine.",
  ],
]

const SERVER: Row[] = [
  [
    <>Terminal: <em>auth failed</em> + perintah otorisasi</>,
    "Key platform belum di authorized_keys user itu.",
    "Jalankan perintah yang ditampilkan di host sebagai user itu.",
  ],
  [
    <>Terminal: <Code>TERMINAL_SSH_USER is not set</Code></>,
    "Env kosong.",
    <>Isi di <Code>.env.dist</Code>, restart stack.</>,
  ],
  [
    <>Terminal: <Code>ECONNREFUSED</Code> ke host.docker.internal</>,
    "sshd mati/port salah, atau Linux tanpa extra_hosts.",
    <>Pakai IP gateway docker0 (mis. <Code>172.17.0.1</Code>) sebagai <Code>TERMINAL_SSH_HOST</Code>.</>,
  ],
  [
    <>Direktori key tidak writable (uid 1000)</>,
    <><Code>./secrets</Code> milik root.</>,
    <><Code>sudo chown -R 1000:1000 ./secrets</Code>.</>,
  ],
  [
    <>Server remote: <em>docker: command not found</em> / permission denied</>,
    "Docker belum ada di PATH user, atau user tidak di grup docker.",
    <><Code>curl -fsSL https://get.docker.com | sh</Code>, <Code>usermod -aG docker &lt;user&gt;</Code>.</>,
  ],
  [
    <>Deploy remote sukses tapi tidak bisa diakses</>,
    "Port host kosong atau firewall server menutup port.",
    "Isi Port host; buka port di ufw/security group. Domain tidak berlaku di server remote.",
  ],
]

const LAINNYA: Row[] = [
  [
    <>Tes notifikasi sukses, event tidak pernah masuk</>,
    "Toggle event belum aktif, atau event tidak terjadi (mis. container mati di server remote tidak terdeteksi).",
    "Nyalakan toggle; picu event sungguhan.",
  ],
  [
    <>Project tidak terlihat oleh rekan</>,
    "Ia belum ditambahkan sebagai anggota project; member instance hanya melihat project yang ditugaskan.",
    <>Tambahkan di tab Anggota project — lihat <DocLink href="/docs/project#anggota">Project</DocLink>.</>,
  ],
  [
    <>Viewer: tombol ada tapi aksi gagal 403</>,
    "Peran project viewer bersifat baca-saja dan ditegakkan di API.",
    "Naikkan ke developer bila memang perlu mengubah.",
  ],
  [
    <>Swarm: task pending / image pull failed di node lain</>,
    <>Constraint tidak cocok, atau <Code>REGISTRY_PUBLIC_HOST</Code> masih localhost sehingga node lain tak bisa menarik image.</>,
    <>Lihat <DocLink href="/docs/swarm#jebakan">Docker Swarm</DocLink>.</>,
  ],
  [
    <>Job jalan pada jam yang salah</>,
    "Zona waktu API = UTC.",
    "Geser jam di cron (WIB = UTC+7).",
  ],
  [
    <>Job: <em>container not running</em></>,
    "Target Di container tapi aplikasi stopped.",
    "Pakai Container terpisah atau start aplikasi.",
  ],
  [
    <>Disk penuh (atau notifikasi disk hampir penuh)</>,
    "Image deployment lama, dangling image, build cache, backup lokal.",
    <>Settings → Disk Docker → <strong>Bersihkan sekarang</strong>; turunkan Riwayat deployment & jumlah simpan backup; GC registry.</>,
  ],
  [
    <>Stack compose: service tidak melihat env</>,
    "Env stack hanya untuk interpolasi.",
    <>Tambahkan <Code>environment:</Code> di service.</>,
  ],
]

const NEXT = [
  { title: "Instalasi", description: "Env wajib dan verifikasi awal.", href: "/docs/instalasi" },
  { title: "Deploy & rollback", description: "Membaca log deployment.", href: "/docs/deploy#log" },
  { title: "Proxy & domain", description: "Router Traefik dan ACME.", href: "/docs/domain#https" },
  { title: "Pengguna & peran", description: "Audit log untuk melacak siapa mengubah apa.", href: "/docs/pengguna-peran#akun" },
]

function Area({ id, title, rows }: { id: string; title: string; rows: Row[] }) {
  return (
    <>
      <H2 id={id}>{title}</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Gejala</th>
              <th className="px-3 py-2 text-left font-medium">Penyebab</th>
              <th className="px-3 py-2 text-left font-medium">Solusi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border align-top">
                <td className="min-w-[12rem] px-3 py-2 text-foreground">{row[0]}</td>
                <td className="min-w-[12rem] px-3 py-2 text-muted-foreground">{row[1]}</td>
                <td className="min-w-[12rem] px-3 py-2 text-muted-foreground">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <DocPage
      href="/docs/troubleshooting"
      title="Troubleshooting"
      description="Masalah yang paling sering muncul, dikelompokkan per area, dengan cara diagnosis cepat."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="diagnosis">Diagnosis cepat</H2>
      <Pre title="Di server, dari folder aoox-api">{`# status tiga container inti
docker compose -f docker-compose.dist.yml --env-file .env.dist ps

# log API (deploy, backup, notifikasi, SSH) dan web
docker compose -f docker-compose.dist.yml --env-file .env.dist logs -f --tail 200 api
docker compose -f docker-compose.dist.yml --env-file .env.dist logs -f --tail 100 web

# semua container yang dikelola aoox
docker ps -a --filter label=com.docker.compose.project=aoox

# proxy & registry
docker logs -f --tail 100 aoox-proxy
docker logs -f --tail 100 aoox-registry

# API hidup?
curl -s http://localhost:3001/auth/setup-status`}</Pre>
      <Ul>
        <li>
          Masalah <strong>deploy</strong>: log deployment di tab Deploy adalah
          sumber paling lengkap — token dan password sudah disensor, aman
          untuk dibagikan.
        </li>
        <li>
          Masalah <strong>runtime aplikasi</strong>: log container di tab yang
          sama, atau <Code>docker logs aoox-app-&lt;slug&gt;</Code>.
        </li>
        <li>
          Siapa mengubah apa: <DocLink href="/docs/pengguna-peran#akun">Audit log</DocLink>{" "}
          (owner/admin).
        </li>
      </Ul>

      <div className="flex flex-wrap gap-2 text-xs">
        {AREAS.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {a.title}
          </a>
        ))}
      </div>

      <Area id="instalasi" title="Instalasi & akses" rows={INSTALASI} />
      <Area id="deploy" title="Build & deploy" rows={DEPLOY} />
      <Area id="domain" title="Domain & HTTPS" rows={DOMAIN} />
      <Area id="database" title="Database & backup" rows={DATABASE} />
      <Area id="server" title="Terminal & server remote" rows={SERVER} />
      <Area id="lainnya" title="Notifikasi, jobs, disk" rows={LAINNYA} />

      <H2 id="reset">Mulai dari nol (uji coba)</H2>
      <P>Menghapus semua data aoox — <strong>bukan</strong> container aplikasi/database yang sudah dibuat dari dashboard:</P>
      <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist down -v
docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
      <Callout kind="warn">
        Container app/db/registry/proxy tetap ada dan akan yatim setelah
        reset. Hapus dulu dari dashboard, atau:{" "}
        <Code>docker ps -aq --filter label=com.docker.compose.project=aoox | xargs docker rm -f</Code>{" "}
        (dan volume-nya bila memang ingin bersih total).
      </Callout>

      <H2 id="port">Referensi port & env</H2>
      <Table
        head={["Port", "Untuk", "Env"]}
        rows={[
          ["3000", "Web (dashboard)", <Code key="1">WEB_PORT</Code>],
          ["3001", "API", <Code key="2">API_PORT</Code>],
          ["5000", "Registry lokal", <Code key="3">REGISTRY_PORT</Code>],
          ["80 / 443", "Reverse proxy (ACME butuh 80)", <><Code>PROXY_HTTP_PORT</Code> / <Code>PROXY_HTTPS_PORT</Code></>],
          ["22", "SSH ke host (terminal)", <Code key="5">TERMINAL_SSH_PORT</Code>],
          ["9000 / 9001", "MinIO dari template (API / Console)", "—"],
        ]}
      />

      <H2 id="melapor">Melapor issue</H2>
      <P>
        Bila belum teratasi, buka issue di{" "}
        <a
          href="https://github.com/hideandseeklab/aoox-api/issues"
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          GitLab aoox-api ↗
        </a>{" "}
        dengan:
      </P>
      <Ul>
        <li>Versi image API/web (kartu Host di Dashboard, atau tag di <Code>.env.dist</Code>) dan versi Docker.</li>
        <li>Langkah yang dilakukan dan yang diharapkan.</li>
        <li>Potongan log API di sekitar waktu kejadian (rahasia sudah disensor; tetap periksa).</li>
        <li>Untuk deploy: log deployment dari tab Deploy dan cara build yang dipakai.</li>
      </Ul>

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
