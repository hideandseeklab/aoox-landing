import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const REQUIREMENTS_ID = [
  { k: "VPS Linux + root", v: "1 vCPU / 1 GB cukup untuk mulai" },
  { k: "Docker", v: "dipasang otomatis oleh installer bila belum ada" },
  { k: "Port 3000 & 3001", v: "dashboard & API; 80/443 bila pakai domain" },
]

const REQUIREMENTS_EN = [
  { k: "Linux VPS + root", v: "1 vCPU / 1 GB is enough to start" },
  { k: "Docker", v: "installed automatically by the installer if missing" },
  { k: "Port 3000 & 3001", v: "dashboard & API; 80/443 if you use a domain" },
]

const INSTALL: { prompt?: boolean; text: string; comment?: boolean }[] = [
  { prompt: true, text: "curl -fsSL https://aoox.dev/install.sh | sh" },
  { text: "" },
  { text: "→ buka http://<server>:3000/setup" },
]

const INSTALL_EN: typeof INSTALL = [
  { prompt: true, text: "curl -fsSL https://aoox.dev/install.sh | sh" },
  { text: "" },
  { text: "→ open http://<server>:3000/setup" },
]

const STACK_ID = [
  { name: "web", sub: "Next.js · :3000" },
  { name: "api", sub: "NestJS · :3001" },
  { name: "postgres", sub: "data aoox" },
]

const STACK_EN = [
  { name: "web", sub: "Next.js · :3000" },
  { name: "api", sub: "NestJS · :3001" },
  { name: "postgres", sub: "aoox data" },
]

const COPY_ID = {
  label: "self-host",
  title: "Jalan di server kamu sendiri.",
  description:
    "Tiga container dari satu file compose. Tidak ada akun cloud, tidak ada telemetri — data dan image tetap di server-mu.",
  ctaPrimary: "Panduan instalasi",
  ctaSecondary: "Pasang di domain sendiri",
  terminalTitle: "ssh root@server",
  network: "docker compose · network aoox",
  extra: "+ registry, proxy, app, db saat dibutuhkan",
  requirements: REQUIREMENTS_ID,
  install: INSTALL,
  stack: STACK_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    label: "self-host",
    title: "Runs on your own server.",
    description:
      "Three containers from one compose file. No cloud account, no telemetry — your data and images stay on your server.",
    ctaPrimary: "Installation guide",
    ctaSecondary: "Install on your own domain",
    terminalTitle: "ssh root@server",
    network: "docker compose · aoox network",
    extra: "+ registry, proxy, app, db as needed",
    requirements: REQUIREMENTS_EN,
    install: INSTALL_EN,
    stack: STACK_EN,
  },
}

function SelfHostSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <Section id="self-host">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-8">
          <SectionHeading label={t.label} title={t.title} description={t.description} />

          <ul className="-mt-10 flex flex-col divide-y sm:-mt-14 divide-border border-y border-border text-xs">
            {t.requirements.map((req) => (
              <li key={req.k} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-baseline sm:gap-3">
                <span className="flex items-baseline gap-3">
                  <span className="text-primary-foreground dark:text-primary">✓</span>
                  <span className="text-foreground">{req.k}</span>
                </span>
                <span className="pl-6 text-muted-foreground sm:ml-auto sm:pl-0 sm:text-right">{req.v}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={lang === "en" ? "/en/docs/instalasi" : "/docs/instalasi"}>
                {t.ctaPrimary}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={lang === "en" ? "/en/docs/domain-panel" : "/docs/domain-panel"}>
                {t.ctaSecondary}
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0 border border-border bg-card text-card-foreground">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="size-2 border border-border" />
              <span className="size-2 border border-border" />
              <span className="size-2 bg-primary" />
              <span className="ml-2 text-[0.65rem] text-muted-foreground">
                {t.terminalTitle}
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
              <code className="grid">
                {t.install.map((line, i) => (
                  <span
                    key={i}
                    className={cn(
                      line.comment ? "text-muted-foreground" : "text-foreground",
                      line.text === "" && "h-[1.5em]"
                    )}
                  >
                    {line.prompt ? (
                      <span className="text-primary-foreground dark:text-primary">
                        ${" "}
                      </span>
                    ) : null}
                    {line.text}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          <div className="grid gap-px border border-border bg-border text-[0.7rem] sm:grid-cols-3">
            {t.stack.map((svc) => (
              <div key={svc.name} className="flex flex-col gap-0.5 bg-background p-3">
                <span className="flex items-center gap-1.5 text-foreground">
                  <span className="size-1.5 bg-primary" />
                  {svc.name}
                </span>
                <span className="text-muted-foreground">{svc.sub}</span>
              </div>
            ))}
            <div className="flex flex-col gap-1 bg-muted/40 px-3 py-2 text-muted-foreground sm:col-span-3 sm:flex-row sm:items-center sm:justify-between">
              <span>{t.network}</span>
              <span>{t.extra}</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export { SelfHostSection }
