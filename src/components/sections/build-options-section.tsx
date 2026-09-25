import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"

type Option = {
  name: string
  file: string
  description: string
  fit: string
  href: string
  snippet: React.ReactNode
}

const OPTIONS_ID: Option[] = [
  {
    name: "Dockerfile",
    file: "./Dockerfile",
    description: "Kontrol penuh. Tunjuk path Dockerfile di repo, sisanya urusan Docker.",
    fit: "Produksi, image ramping",
    href: "/docs/build#dockerfile",
    snippet: (
      <Code
        lines={[
          ["FROM", " node:22-alpine"],
          ["WORKDIR", " /app"],
          ["COPY", " . ."],
          ["RUN", " npm ci && npm run build"],
          ["CMD", ' ["node", "server.js"]'],
        ]}
      />
    ),
  },
  {
    name: "Nixpacks",
    file: "(tanpa Dockerfile)",
    description: "Stack dideteksi otomatis dari isi repo, Dockerfile dibuat untukmu.",
    fit: "Prototipe, repo tanpa Dockerfile",
    href: "/docs/build#nixpacks",
    snippet: (
      <div className="flex flex-col gap-1">
        <Row k="detected" v="node · npm" ok />
        <Row k="install" v="npm ci" />
        <Row k="build" v="npm run build" />
        <Row k="start" v="npm start" />
      </div>
    ),
  },
  {
    name: "Situs statis",
    file: "dist/ → nginx",
    description: "Tahap build Node opsional, lalu nginx melayani folder output. Mode SPA untuk client-side routing.",
    fit: "Vite, Astro, dokumentasi",
    href: "/docs/build#static",
    snippet: (
      <div className="flex flex-col gap-1">
        <Row k="build" v="npm ci && npm run build" />
        <Row k="output" v="dist/" />
        <Row k="serve" v="nginx:1.27-alpine :80" ok />
        <Row k="spa" v="index.html fallback" />
      </div>
    ),
  },
  {
    name: "Image siap pakai",
    file: "registry → pull",
    description: "Tanpa build: tarik image dari Docker Hub, GHCR, atau registry sendiri. Update otomatis saat digest tag berubah.",
    fit: "n8n, Uptime Kuma, image internal",
    href: "/docs/deploy",
    snippet: (
      <div className="flex flex-col gap-1">
        <Row k="image" v="ghcr.io/acme/api:latest" />
        <Row k="auth" v="registry eksternal" />
        <Row k="cek" v="tiap 60 menit (bisa diatur)" />
        <Row k="update" v="digest berubah → deploy" ok />
      </div>
    ),
  },
  {
    name: "Docker Compose",
    file: "./docker-compose.yml",
    description: "Deploy stack multi-service dari file compose yang sudah ada.",
    fit: "web + worker + queue",
    href: "/docs/compose",
    snippet: (
      <Code
        lines={[
          ["services", ":"],
          ["  web", ": { build: . }"],
          ["  worker", ": { build: . }"],
          ["  redis", ": { image: redis:7 }"],
        ]}
      />
    ),
  },
  {
    name: "Template",
    file: "katalog bawaan",
    description: "Aplikasi siap pakai, dijalankan sebagai stack compose dalam beberapa klik.",
    fit: "WordPress, Ghost, n8n, …",
    href: "/docs/template",
    snippet: (
      <ul className="grid grid-cols-2 gap-1">
        {["wordpress", "ghost", "n8n", "uptime-kuma", "minio", "gitea"].map((t) => (
          <li
            key={t}
            className="truncate border border-border px-1.5 py-0.5 text-muted-foreground"
          >
            {t}
          </li>
        ))}
      </ul>
    ),
  },
]

const OPTIONS_EN: Option[] = [
  {
    name: "Dockerfile",
    file: "./Dockerfile",
    description: "Full control. Point at the Dockerfile in your repo, Docker handles the rest.",
    fit: "Production, lean images",
    href: "/docs/build#dockerfile",
    snippet: (
      <Code
        lines={[
          ["FROM", " node:22-alpine"],
          ["WORKDIR", " /app"],
          ["COPY", " . ."],
          ["RUN", " npm ci && npm run build"],
          ["CMD", ' ["node", "server.js"]'],
        ]}
      />
    ),
  },
  {
    name: "Nixpacks",
    file: "(no Dockerfile)",
    description: "The stack is auto-detected from your repo's contents, a Dockerfile is generated for you.",
    fit: "Prototypes, repos without a Dockerfile",
    href: "/docs/build#nixpacks",
    snippet: (
      <div className="flex flex-col gap-1">
        <Row k="detected" v="node · npm" ok />
        <Row k="install" v="npm ci" />
        <Row k="build" v="npm run build" />
        <Row k="start" v="npm start" />
      </div>
    ),
  },
  {
    name: "Static site",
    file: "dist/ → nginx",
    description: "An optional Node build stage, then nginx serves the output folder. SPA mode for client-side routing.",
    fit: "Vite, Astro, docs sites",
    href: "/docs/build#static",
    snippet: (
      <div className="flex flex-col gap-1">
        <Row k="build" v="npm ci && npm run build" />
        <Row k="output" v="dist/" />
        <Row k="serve" v="nginx:1.27-alpine :80" ok />
        <Row k="spa" v="index.html fallback" />
      </div>
    ),
  },
  {
    name: "Ready-made image",
    file: "registry → pull",
    description: "No build: pull an image from Docker Hub, GHCR, or your own registry. Auto-updates when the tag's digest changes.",
    fit: "n8n, Uptime Kuma, internal images",
    href: "/docs/deploy",
    snippet: (
      <div className="flex flex-col gap-1">
        <Row k="image" v="ghcr.io/acme/api:latest" />
        <Row k="auth" v="external registry" />
        <Row k="check" v="every 60 min (configurable)" />
        <Row k="update" v="digest changes → deploy" ok />
      </div>
    ),
  },
  {
    name: "Docker Compose",
    file: "./docker-compose.yml",
    description: "Deploy a multi-service stack from an existing compose file.",
    fit: "web + worker + queue",
    href: "/docs/compose",
    snippet: (
      <Code
        lines={[
          ["services", ":"],
          ["  web", ": { build: . }"],
          ["  worker", ": { build: . }"],
          ["  redis", ": { image: redis:7 }"],
        ]}
      />
    ),
  },
  {
    name: "Template",
    file: "built-in catalog",
    description: "Ready-made apps, run as a compose stack in a few clicks.",
    fit: "WordPress, Ghost, n8n, …",
    href: "/docs/template",
    snippet: (
      <ul className="grid grid-cols-2 gap-1">
        {["wordpress", "ghost", "n8n", "uptime-kuma", "minio", "gitea"].map((t) => (
          <li
            key={t}
            className="truncate border border-border px-1.5 py-0.5 text-muted-foreground"
          >
            {t}
          </li>
        ))}
      </ul>
    ),
  },
]

const COPY_ID = {
  label: "build",
  title: "Bawa repo apa adanya.",
  description:
    "Enam cara menjalankan aplikasi — dari repo apa adanya atau langsung dari image. Pilih per aplikasi, bisa berbeda-beda dalam satu project.",
  footnote:
    "Build args untuk Dockerfile & Nixpacks; env diterapkan saat runtime, jadi rahasia tidak pernah ikut tersimpan di image.",
  options: OPTIONS_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    label: "build",
    title: "Bring your repo as-is.",
    description:
      "Six ways to run an application — straight from a repo or straight from an image. Pick per app, and mix within one project.",
    footnote:
      "Build args for Dockerfile & Nixpacks; env is applied at runtime, so secrets never end up stored in the image.",
    options: OPTIONS_EN,
  },
}

function BuildOptionsSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <Section id="build">
      <SectionHeading label={t.label} title={t.title} description={t.description} />
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {t.options.map((option) => (
          <Link
            key={option.name}
            href={option.href}
            className="group flex flex-col gap-4 bg-background p-5 transition-colors hover:bg-muted/60"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{option.name}</h3>
                <ArrowRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
              <span className="text-[0.65rem] text-muted-foreground">{option.file}</span>
            </div>

            <div className="min-h-[6rem] border border-border bg-card p-2.5 text-[0.65rem] leading-relaxed text-card-foreground">
              {option.snippet}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              {option.description}
            </p>

            <p className="mt-auto flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
              <span className="size-1.5 bg-primary" />
              {option.fit}
            </p>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground">{t.footnote}</p>
    </Section>
  )
}

function Code({ lines }: { lines: [string, string][] }) {
  return (
    <pre className="overflow-hidden">
      <code className="grid">
        {lines.map(([kw, rest], i) => (
          <span key={i} className="truncate">
            <span className="text-primary-foreground dark:text-primary">{kw}</span>
            <span className="text-muted-foreground">{rest}</span>
          </span>
        ))}
      </code>
    </pre>
  )
}

function Row({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={ok ? "text-primary-foreground dark:text-primary" : "text-muted-foreground"}>
        {ok ? "✓" : "→"}
      </span>
      <span className="w-[8ch] text-foreground">{k}</span>
      <span className="truncate text-muted-foreground">{v}</span>
    </div>
  )
}

export { BuildOptionsSection }
