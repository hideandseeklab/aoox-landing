import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Boxes,
  Database,
  GitBranch,
  Globe,
  HardDriveDownload,
  RefreshCw,
  Terminal,
  type LucideIcon,
} from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
  href: string
  span?: boolean
}

const FEATURES_ID: Feature[] = [
  {
    icon: GitBranch,
    title: "Deploy dari Git atau image",
    description:
      "Hubungkan repo GitHub/GitLab — Dockerfile, Nixpacks, Railpack (dengan cache antar deploy), atau situs statis — dan webhook memicu deploy tiap push. Atau tarik image siap pakai dari registry, lengkap dengan update otomatis saat tag-nya berubah. Tanpa repo, CLI aoox build & push langsung dari mesinmu.",
    tags: ["dockerfile", "nixpacks", "railpack", "image", "cli"],
    href: "/docs/deploy",
    span: true,
  },
  {
    icon: RefreshCw,
    title: "Zero-downtime & rollback",
    description:
      "Health check menentukan sukses/gagal. Blue/green swap tanpa putus, rollback ke image sebelumnya sekali klik.",
    tags: ["blue/green", "healthcheck"],
    href: "/docs/deploy#health-check",
  },
  {
    icon: Boxes,
    title: "Multi-node dengan Swarm",
    description:
      "Jadikan host manager, gabungkan node lain, jalankan aplikasi sebagai service dengan replika. Rolling update, rollback otomatis, dan penempatan per node atau label.",
    tags: ["swarm", "replika", "rolling update"],
    href: "/docs/swarm",
  },
  {
    icon: Database,
    title: "Managed database",
    description:
      "PostgreSQL, MySQL, MariaDB, Redis per project. Referensikan kredensialnya di env, jelajahi tabel dan jalankan query dari dashboard.",
    tags: ["postgres", "mysql", "redis"],
    href: "/docs/database",
  },
  {
    icon: HardDriveDownload,
    title: "Backup & restore",
    description:
      "Database dan volume aplikasi, manual atau terjadwal, dengan retensi dan salinan ke S3. Panel sendiri pun bisa di-backup dan dipulihkan.",
    tags: ["cron", "s3", "instance"],
    href: "/docs/backup",
  },
  {
    icon: Globe,
    title: "Domain & TLS",
    description:
      "Arahkan domain ke aplikasi lewat Traefik, sertifikat Let's Encrypt otomatis, cek DNS dari dashboard — di host maupun di server remote.",
    tags: ["traefik", "acme"],
    href: "/docs/domain",
  },
  {
    icon: Terminal,
    title: "Web terminal & server remote",
    description:
      "Shell ke host atau server lain lewat SSH dari browser. Deploy ke server remote tanpa agen tambahan.",
    tags: ["ssh", "xterm"],
    href: "/docs/terminal",
  },
  {
    icon: Activity,
    title: "Monitoring & notifikasi",
    description:
      "Log realtime, metrik CPU/RAM host dan container dengan riwayat 1 jam sampai 30 hari, notifikasi ke Telegram, Slack, Discord, webhook, email.",
    tags: ["metrics", "alerts"],
    href: "/docs/monitoring",
  },
]

const FEATURES_EN: Feature[] = [
  {
    icon: GitBranch,
    title: "Deploy from Git or an image",
    description:
      "Connect a GitHub/GitLab repo — Dockerfile, Nixpacks, Railpack (with cache between deploys), or a static site — and a webhook triggers a deploy on every push. Or pull a ready-made image from a registry, with auto-update when its tag changes. No repo? The aoox CLI builds and pushes straight from your machine.",
    tags: ["dockerfile", "nixpacks", "railpack", "image", "cli"],
    href: "/en/docs/deploy",
    span: true,
  },
  {
    icon: RefreshCw,
    title: "Zero-downtime & rollback",
    description:
      "A health check decides success or failure. Blue/green swaps without downtime, one-click rollback to the previous image.",
    tags: ["blue/green", "healthcheck"],
    href: "/en/docs/deploy#health-check",
  },
  {
    icon: Boxes,
    title: "Multi-node with Swarm",
    description:
      "Turn the host into a manager, join other nodes, run apps as a service with replicas. Rolling updates, automatic rollback, and placement per node or label.",
    tags: ["swarm", "replicas", "rolling update"],
    href: "/en/docs/swarm",
  },
  {
    icon: Database,
    title: "Managed database",
    description:
      "PostgreSQL, MySQL, MariaDB, Redis per project. Reference credentials in env, browse tables and run queries from the dashboard.",
    tags: ["postgres", "mysql", "redis"],
    href: "/en/docs/database",
  },
  {
    icon: HardDriveDownload,
    title: "Backup & restore",
    description:
      "Database and app volumes, manual or scheduled, with retention and copies to S3. The panel itself can be backed up and restored too.",
    tags: ["cron", "s3", "instance"],
    href: "/en/docs/backup",
  },
  {
    icon: Globe,
    title: "Domain & TLS",
    description:
      "Point a domain at your app through Traefik, automatic Let's Encrypt certificates, DNS checks from the dashboard — on the host or a remote server.",
    tags: ["traefik", "acme"],
    href: "/en/docs/domain",
  },
  {
    icon: Terminal,
    title: "Web terminal & remote servers",
    description:
      "Shell into the host or another server over SSH, right from the browser. Deploy to a remote server without an extra agent.",
    tags: ["ssh", "xterm"],
    href: "/en/docs/terminal",
  },
  {
    icon: Activity,
    title: "Monitoring & notifications",
    description:
      "Realtime logs, host and container CPU/RAM metrics with 1-hour-to-30-day history, notifications to Telegram, Slack, Discord, webhook, email.",
    tags: ["metrics", "alerts"],
    href: "/en/docs/monitoring",
  },
]

const MORE_ID = [
  { label: "Domain sendiri untuk panel (bukan cuma aplikasi)", href: "/docs/domain-panel" },
  { label: "Preview pull request", href: "/docs/preview" },
  { label: "Scheduled jobs", href: "/docs/jobs" },
  { label: "Stack compose: riwayat, webhook, metrik", href: "/docs/compose" },
  { label: "Template one-click", href: "/docs/template" },
  { label: "Export & import project", href: "/docs/project" },
  { label: "Volume & mount", href: "/docs/mount" },
  { label: "Data browser: edit baris & CSV", href: "/docs/data-browser" },
  { label: "2FA, API token dengan scope, audit log", href: "/docs/pengguna-peran#akun" },
  { label: "Registry lokal & cleanup disk", href: "/docs/registry" },
  { label: "CLI aoox: install, link, deploy", href: "/docs/cli" },
]

const MORE_EN = [
  { label: "Your own domain for the panel (not just apps)", href: "/en/docs/domain-panel" },
  { label: "Pull request previews", href: "/en/docs/preview" },
  { label: "Scheduled jobs", href: "/en/docs/jobs" },
  { label: "Compose stacks: history, webhook, metrics", href: "/en/docs/compose" },
  { label: "One-click templates", href: "/en/docs/template" },
  { label: "Project export & import", href: "/en/docs/project" },
  { label: "Volumes & mounts", href: "/en/docs/mount" },
  { label: "Data browser: row edit & CSV", href: "/en/docs/data-browser" },
  { label: "2FA, scoped API tokens, audit log", href: "/en/docs/pengguna-peran#akun" },
  { label: "Local registry & disk cleanup", href: "/en/docs/registry" },
  { label: "aoox CLI: install, link, deploy", href: "/en/docs/cli" },
]

const COPY_ID = {
  label: "fitur",
  title: "Semua yang dibutuhkan untuk menjalankan aplikasi di produksi.",
  description:
    "Dibangun di atas Docker. Tidak ada runtime khusus — kalau bisa jalan di container, bisa jalan di aoox.",
  more: "Dan lainnya",
  readDocs: "Baca docs",
  features: FEATURES_ID,
  more_: MORE_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    label: "features",
    title: "Everything you need to run applications in production.",
    description:
      "Built on Docker. No special runtime — if it runs in a container, it runs on aoox.",
    more: "And more",
    readDocs: "Read docs",
    features: FEATURES_EN,
    more_: MORE_EN,
  },
}

function FeaturesSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <Section id="fitur">
      <SectionHeading label={t.label} title={t.title} description={t.description} />
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {t.features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} readDocs={t.readDocs} />
        ))}

        <div className="flex flex-col gap-4 bg-background p-6 sm:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{t.more}</h3>
            <span className="text-[0.65rem] text-muted-foreground">
              --more
            </span>
          </div>
          <ul className="grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
            {t.more_.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="text-primary-foreground dark:text-primary">
                    →
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

function FeatureCard({ feature, readDocs }: { feature: Feature; readDocs: string }) {
  return (
    <Link
      href={feature.href}
      className={cn(
        "group relative flex flex-col gap-4 bg-background p-6 transition-colors hover:bg-muted/60",
        feature.span && "lg:col-span-2"
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
      />

      <div className="flex items-start justify-between gap-4">
        <feature.icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary-foreground dark:group-hover:text-primary" />
        <ul className="flex flex-wrap justify-end gap-1">
          {feature.tags.map((tag) => (
            <li
              key={tag}
              className="border border-border px-1.5 py-px text-[0.6rem] text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2",
          feature.span && "lg:grid lg:grid-cols-2 lg:items-end lg:gap-8"
        )}
      >
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold">{feature.title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {feature.description}
          </p>
        </div>
        {feature.span ? <Pipeline /> : null}
      </div>

      <span className="mt-auto inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground transition-colors group-hover:text-foreground">
        {readDocs}
        <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

const STAGES = ["git push", "build", "push", "run"]

function Pipeline() {
  return (
    <ol
      aria-hidden
      className="hidden items-center gap-1 text-[0.65rem] lg:flex"
    >
      {STAGES.map((stage, i) => (
        <li key={stage} className="flex items-center gap-1">
          <span
            className={cn(
              "border px-2 py-1",
              i === STAGES.length - 1
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground"
            )}
          >
            {stage}
          </span>
          {i < STAGES.length - 1 ? (
            <span className="h-px w-3 bg-border" />
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export { FeaturesSection }
