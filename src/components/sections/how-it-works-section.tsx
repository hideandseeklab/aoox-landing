import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const STEPS_ID = [
  {
    step: "01",
    title: "Buat project & hubungkan repo",
    description:
      "Satu project bisa berisi beberapa aplikasi dan database. Tempelkan URL Git dan branch yang mau di-deploy.",
    visual: <RepoForm labels={{ repo: "Git repository", branch: "Branch", port: "Port container" }} />,
  },
  {
    step: "02",
    title: "Pilih cara build",
    description:
      "Dockerfile yang sudah ada, deteksi otomatis Nixpacks, atau situs statis via nginx. Tambahkan env dan port container.",
    visual: <BuildChoice label="Cara build" auto="deteksi otomatis" />,
  },
  {
    step: "03",
    title: "Deploy & pantau",
    description:
      "Build berjalan di daemon Docker, image di-push ke registry lokal, container baru naik setelah health check lolos — atau sebagai service Swarm dengan rolling update.",
    visual: <DeployLog running="Running" />,
  },
]

const STEPS_EN = [
  {
    step: "01",
    title: "Create a project & connect a repo",
    description:
      "One project can hold several apps and databases. Paste the Git URL and the branch to deploy.",
    visual: <RepoForm labels={{ repo: "Git repository", branch: "Branch", port: "Container port" }} />,
  },
  {
    step: "02",
    title: "Choose how to build",
    description:
      "An existing Dockerfile, auto-detected with Nixpacks, or a static site via nginx. Add env and the container port.",
    visual: <BuildChoice label="Build method" auto="auto-detected" />,
  },
  {
    step: "03",
    title: "Deploy & watch",
    description:
      "The build runs on the Docker daemon, the image is pushed to the local registry, and a new container comes up once its health check passes — or as a Swarm service with a rolling update.",
    visual: <DeployLog running="Running" />,
  },
]

const COPY_ID = {
  label: "cara kerja",
  title: "Dari repo ke URL dalam tiga langkah.",
  description: "Tidak ada file konfigurasi khusus aoox di repo — semuanya diatur dari dashboard.",
  guide: "Panduan lengkap membuat aplikasi",
  note: "Push berikutnya deploy otomatis lewat webhook.",
  steps: STEPS_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    label: "how it works",
    title: "From repo to URL in three steps.",
    description: "No aoox-specific config file in the repo — everything is set from the dashboard.",
    guide: "Full guide to creating an application",
    note: "The next push deploys automatically via webhook.",
    steps: STEPS_EN,
  },
}

function HowItWorksSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <Section id="cara-kerja">
      <SectionHeading label={t.label} title={t.title} description={t.description} />

      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        {/* garis penghubung */}
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-3 w-px bg-border md:top-3 md:right-[16.6%] md:bottom-auto md:left-[16.6%] md:h-px md:w-auto"
        />

        {t.steps.map((item, i) => (
          <li key={item.step} className="relative flex flex-col gap-4 pl-10 md:pl-0">
            <span
              className={cn(
                "absolute top-0 left-0 flex size-6 items-center justify-center border bg-background text-[0.65rem] md:relative md:mx-auto md:mb-2",
                i === t.steps.length - 1
                  ? "border-primary text-primary-foreground dark:text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              {item.step}
            </span>

            <div className="flex flex-col gap-2 md:text-center">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>

            <div className="flex-1 border border-border bg-card p-3 text-[0.7rem] text-card-foreground">
              {item.visual}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
        <Link
          href="/docs/aplikasi"
          className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:no-underline"
        >
          {t.guide}
          <ArrowRight className="size-3" />
        </Link>
        <span>{t.note}</span>
      </div>
    </Section>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[0.6rem] text-muted-foreground">{label}</span>
      <span className="truncate border border-border bg-background px-2 py-1 text-foreground">
        {value}
      </span>
    </div>
  )
}

function RepoForm({ labels }: { labels: { repo: string; branch: string; port: string } }) {
  return (
    <div className="flex flex-col gap-2">
      <Field label={labels.repo} value="https://github.com/acme/shop" />
      <div className="grid grid-cols-2 gap-2">
        <Field label={labels.branch} value="main" />
        <Field label={labels.port} value="3000" />
      </div>
    </div>
  )
}

function BuildChoice({ label, auto }: { label: string; auto: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.6rem] text-muted-foreground">{label}</span>
      <div className="grid grid-cols-2 gap-px border border-border bg-border">
        <div className="flex flex-col gap-0.5 bg-background p-2">
          <span className="text-foreground">Dockerfile</span>
          <span className="text-muted-foreground">./Dockerfile</span>
        </div>
        <div className="flex flex-col gap-0.5 bg-primary/10 p-2">
          <span className="flex items-center justify-between text-foreground">
            Nixpacks
            <span className="size-1.5 bg-primary" />
          </span>
          <span className="text-muted-foreground">{auto}</span>
        </div>
      </div>
      <div className="flex gap-2 text-muted-foreground">
        <span className="border border-border px-1.5 py-px">NODE_ENV=production</span>
        <span className="border border-border px-1.5 py-px">+2 env</span>
      </div>
    </div>
  )
}

const LOG = [
  { k: "build", v: "ok", ok: true },
  { k: "push", v: "ok", ok: true },
  { k: "health", v: "healthy", ok: true },
  { k: "swap", v: "blue → green", ok: true },
]

function DeployLog({ running }: { running: string }) {
  return (
    <div className="flex flex-col gap-1">
      {LOG.map((line) => (
        <div key={line.k} className="flex items-center gap-2">
          <span className="text-primary-foreground dark:text-primary">✓</span>
          <span className="w-[6ch] text-foreground">{line.k}</span>
          <span className="text-muted-foreground">{line.v}</span>
        </div>
      ))}
      <div className="mt-1 flex items-center gap-2 border-t border-border pt-2">
        <span className="size-1.5 bg-primary" />
        <span className="text-foreground">{running}</span>
        <span className="ml-auto truncate text-muted-foreground">shop.example.com</span>
      </div>
    </div>
  )
}

export { HowItWorksSection }
