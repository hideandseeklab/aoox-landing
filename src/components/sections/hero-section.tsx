import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

type Line =
  | { kind: "cmd"; text: string }
  | { kind: "step"; label: string; detail: string; status: string; time?: string }
  | { kind: "done"; text: string }
  | { kind: "blank" }

const LINES: Line[] = [
  { kind: "cmd", text: "git push origin main" },
  { kind: "blank" },
  { kind: "step", label: "deployment", detail: "#a1b2c3", status: "queued" },
  { kind: "step", label: "build", detail: "nixpacks", status: "ok", time: "42s" },
  { kind: "step", label: "push", detail: "registry", status: "ok", time: "3s" },
  { kind: "step", label: "start", detail: "blue/green", status: "healthy" },
  { kind: "done", text: "https://app.example.com" },
]

const STACK = ["Docker", "Swarm", "Traefik", "Nixpacks", "PostgreSQL"]

const COPY_ID = {
  badge: "self-hosted PaaS · Docker · open source",
  titleLead: "Deploy aplikasi dari Git ke ",
  titleHighlight: "server sendiri.",
  description:
    "aoox menjalankan build, deploy, database, domain, dan log di server milikmu — satu dashboard, tanpa vendor lock-in.",
  ctaPrimary: "Pasang di server",
  ctaSecondary: "Lihat fitur",
  stackLabel: "Dibangun di atas",
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    badge: "self-hosted PaaS · Docker · open source",
    titleLead: "Deploy apps from Git to ",
    titleHighlight: "your own server.",
    description:
      "aoox runs your build, deploy, database, domain, and logs on your own server — one dashboard, no vendor lock-in.",
    ctaPrimary: "Install on your server",
    ctaSecondary: "See features",
    stackLabel: "Built on",
  },
}

function HeroSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* grid latar */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_70%)]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 border border-border bg-card px-2.5 py-1 text-[0.7rem] text-muted-foreground">
            <span className="size-1.5 bg-primary" />
            {t.badge}
          </span>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.05]">
            {t.titleLead}
            <span className="text-primary-foreground dark:text-primary">
              {t.titleHighlight}
            </span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href={lang === "en" ? "/en/docs/instalasi" : "/docs/instalasi"}>
                {t.ctaPrimary}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#fitur">{t.ctaSecondary}</a>
            </Button>
          </div>

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.7rem] text-muted-foreground">
            <li className="text-foreground/60">{t.stackLabel}</li>
            {STACK.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <Terminal />
      </div>
    </section>
  )
}

function Terminal() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-px bg-primary/20 blur-2xl dark:bg-primary/10"
      />
      <div className="relative border border-border bg-card text-card-foreground shadow-[0_0_0_1px_var(--background)]">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="size-2 border border-border" />
          <span className="size-2 border border-border" />
          <span className="size-2 bg-primary" />
          <span className="ml-2 text-[0.65rem] text-muted-foreground">
            deploy — aoox
          </span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
          <code className="grid">
            {LINES.map((line, i) => (
              <span
                key={i}
                className="hero-line"
                style={{ "--i": i } as React.CSSProperties}
              >
                <LineView line={line} />
              </span>
            ))}
            <span
              className="hero-line"
              style={{ "--i": LINES.length } as React.CSSProperties}
            >
              <span className="text-primary-foreground dark:text-primary">$</span>{" "}
              <span className="hero-caret inline-block h-[1.1em] w-[0.6em] translate-y-[0.2em] bg-foreground/80" />
            </span>
          </code>
        </pre>
      </div>
    </div>
  )
}

function LineView({ line }: { line: Line }) {
  switch (line.kind) {
    case "cmd":
      return (
        <>
          <span className="text-primary-foreground dark:text-primary">$</span>{" "}
          <span className="text-foreground">{line.text}</span>
        </>
      )
    case "blank":
      return <>&nbsp;</>
    case "step": {
      const ok = line.status !== "queued"
      return (
        <>
          <span className="text-muted-foreground">→ </span>
          <span className="inline-block w-[11ch] text-foreground">{line.label}</span>
          <span className="inline-block w-[12ch] text-muted-foreground">
            {line.detail}
          </span>
          <span
            className={cn(
              "inline-block w-[8ch]",
              ok ? "text-primary-foreground dark:text-primary" : "text-muted-foreground"
            )}
          >
            {line.status}
          </span>
          {line.time ? (
            <span className="text-muted-foreground">{line.time}</span>
          ) : null}
        </>
      )
    }
    case "done":
      return (
        <>
          <span className="text-primary-foreground dark:text-primary">✓</span>{" "}
          <span className="text-foreground underline decoration-primary/60 underline-offset-4">
            {line.text}
          </span>
        </>
      )
  }
}

export { HeroSection }
