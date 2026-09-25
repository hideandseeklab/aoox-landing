import Link from "next/link"
import { ArrowRight, Boxes, Globe, Rocket, type LucideIcon } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  P,
  Step,
  Steps,
  Table,
} from "@/components/docs/prose"
import { DOCS_NAV } from "@/lib/docs-nav"

const START: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: Rocket,
    title: "Pasang aoox",
    description: "Docker Compose di VPS, lalu buat akun owner di /setup.",
    href: "/docs/instalasi",
  },
  {
    icon: Boxes,
    title: "Deploy aplikasi pertama",
    description: "Hubungkan repo, pilih cara build, tekan Deploy.",
    href: "/docs/aplikasi",
  },
  {
    icon: Globe,
    title: "Pasang domain & HTTPS",
    description: "Provision Traefik, arahkan DNS, sertifikat otomatis.",
    href: "/docs/domain",
  },
]

const ARCH = [
  { name: "web", sub: "Next.js · dashboard" },
  { name: "api", sub: "NestJS · Docker Engine API" },
  { name: "postgres", sub: "data aoox" },
]

const MANAGED = ["app-*", "db-*", "registry", "proxy", "compose"]

export default function Page() {
  return (
    <DocPage
      href="/docs"
      title="Dokumentasi aoox"
      description="Panduan lengkap memasang dan memakai aoox: dari instalasi di server sendiri sampai deploy, database, backup, dan notifikasi."
    >
      {/* mulai dari sini */}
      <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {START.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-3 bg-background p-5 transition-colors hover:bg-muted/60"
          >
            <item.icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary-foreground dark:group-hover:text-primary" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </span>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground transition-colors group-hover:text-foreground">
              Buka
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <H2 id="apa-itu">Apa itu aoox?</H2>
      <P>
        aoox adalah <strong>self-hosted PaaS</strong> di atas Docker.
        Kamu menjalankannya di server sendiri, lalu dari dashboard web kamu
        bisa men-deploy aplikasi dari repo Git, membuat database, mengatur
        domain, melihat log, menjadwalkan backup, dan menerima notifikasi —
        tanpa menyentuh <Code>docker</Code> secara manual.
      </P>

      <H2 id="arsitektur">Arsitektur</H2>
      <div className="flex flex-col gap-px border border-border bg-border text-xs">
        <div className="flex items-center justify-between bg-muted/40 px-4 py-2 text-muted-foreground">
          <span>browser</span>
          <span>→ WEB_ORIGIN (:3000) · PUBLIC_API_URL (:3001)</span>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {ARCH.map((svc) => (
            <div key={svc.name} className="flex flex-col gap-0.5 bg-background px-4 py-3">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-1.5 bg-primary" />
                {svc.name}
              </span>
              <span className="text-muted-foreground">{svc.sub}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-background px-4 py-3">
          <span className="text-muted-foreground">Docker Engine di host →</span>
          {MANAGED.map((c) => (
            <span key={c} className="border border-border px-1.5 py-px text-muted-foreground">
              aoox-{c}
            </span>
          ))}
        </div>
      </div>
      <P>
        Tiga container inti berjalan dari satu file compose. Semua yang kamu
        buat dari dashboard — aplikasi, database, registry, proxy, stack
        compose — adalah container Docker biasa di host yang sama, di network{" "}
        <Code>aoox</Code>. Untuk menambah mesin ada dua jalan:{" "}
        <DocLink href="/docs/server-remote">server remote</DocLink> lewat SSH,
        atau <DocLink href="/docs/swarm">Docker Swarm</DocLink> untuk menyebar
        replika satu aplikasi.
      </P>

      <H2 id="konsep">Konsep dasar</H2>
      <Table
        head={["Istilah", "Arti"]}
        rows={[
          [
            <strong key="p">Project</strong>,
            "Wadah untuk aplikasi, stack compose, dan database yang saling terkait. Punya environment bersama.",
          ],
          [
            <strong key="a">Aplikasi</strong>,
            "Satu repo Git yang di-build, atau image siap pakai, dijalankan sebagai container (atau service Swarm).",
          ],
          [
            <strong key="d">Deployment</strong>,
            "Satu kali proses build → push → start untuk sebuah aplikasi. Punya log dan status sendiri; bisa di-rollback.",
          ],
          [
            <strong key="c">Stack compose</strong>,
            "File docker-compose dari repo (atau template) yang dijalankan sebagai sekumpulan container.",
          ],
          [
            <strong key="m">Managed database</strong>,
            "Container PostgreSQL/MySQL/MariaDB/Redis yang dibuat dan di-backup oleh aoox.",
          ],
          [
            <strong key="s">Server</strong>,
            "Host lain yang dihubungkan lewat SSH sebagai target deploy tambahan, dengan proxy dan backup volume sendiri.",
          ],
          [
            <strong key="n">Node (Swarm)</strong>,
            "Mesin dalam satu cluster Docker Swarm; aplikasi mode service disebar ke node-node ini.",
          ],
        ]}
      />

      <H2 id="alur-cepat">Alur cepat</H2>
      <Steps>
        <Step title="Instal & buat akun owner">
          <P>
            <Link href="/docs/instalasi" className="text-foreground underline underline-offset-4">
              Instalasi
            </Link>{" "}
            → buka <Code>/setup</Code>.
          </P>
        </Step>
        <Step title="Provision registry lokal (dan proxy bila pakai domain)">
          <P>
            Menu <strong>Registry</strong> dan <strong>Settings → Reverse proxy</strong>.
            Registry wajib sebelum deploy pertama —{" "}
            <Link href="/docs/registry" className="text-foreground underline underline-offset-4">
              Registry
            </Link>
            .
          </P>
        </Step>
        <Step title="Buat project, lalu aplikasi dari repo Git">
          <P>
            <strong>Projects → Project baru → Aplikasi baru</strong>, klik{" "}
            <strong>Deploy</strong> —{" "}
            <Link href="/docs/aplikasi" className="text-foreground underline underline-offset-4">
              Membuat aplikasi
            </Link>
            .
          </P>
        </Step>
        <Step title="Tambahkan yang dibutuhkan">
          <P>
            Domain, database, backup, webhook, notifikasi — semuanya per
            aplikasi/project dari dashboard.
          </P>
        </Step>
      </Steps>

      <H2 id="peta">Peta dokumentasi</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        {DOCS_NAV.map((group) => (
          <div key={group.title} className="flex flex-col border border-border">
            <span className="border-b border-border bg-muted/40 px-4 py-2 text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {group.title}
            </span>
            <ul className="flex flex-col divide-y divide-border">
              {group.items
                .filter((item) => item.href !== "/docs")
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <ArrowRight className="size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <Callout title="Lingkungan yang cocok">
        aoox dirancang untuk server yang kamu percaya (VPS pribadi, tim
        kecil). Peran instance membatasi akses ke infrastruktur (terminal,
        server, registry, proxy), sementara{" "}
        <DocLink href="/docs/pengguna-peran#project">keanggotaan per project</DocLink>{" "}
        menentukan siapa melihat dan mengubah project mana.
      </Callout>
    </DocPage>
  )
}
