import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CopyButton } from "@/components/copy-button"
import { Button } from "@/components/ui/button"
import type { Lang } from "@/lib/lang"

const INSTALL =
  "git clone https://github.com/hideandseeklab/aoox-api.git && cd aoox-api && cp .env.dist.example .env.dist"

const POINTS_ID = ["Satu file compose", "Tanpa telemetri", "Open source"]
const POINTS_EN = ["One compose file", "No telemetry", "Open source"]

const COPY_ID = {
  badge: "siap dalam ± 5 menit",
  titleLead: "Server sudah ada. ",
  titleHighlight: "Tinggal deploy.",
  description: (
    <>
      Clone, isi env, <code className="text-foreground">docker compose up</code> —
      lalu buka <code className="text-foreground">/setup</code> dan deploy
      aplikasi pertamamu.
    </>
  ),
  ctaPrimary: "Panduan instalasi",
  ctaSecondary: "Lihat kode di GitLab",
  points: POINTS_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    badge: "ready in ± 5 minutes",
    titleLead: "The server is already there. ",
    titleHighlight: "Just deploy.",
    description: (
      <>
        Clone, fill in env, <code className="text-foreground">docker compose up</code> —
        then open <code className="text-foreground">/setup</code> and deploy
        your first application.
      </>
    ),
    ctaPrimary: "Installation guide",
    ctaSecondary: "See the code on GitLab",
    points: POINTS_EN,
  },
}

function CtaSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* latar: grid + glow lime */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-[36rem] -translate-x-1/2 -translate-y-1/2 bg-primary/15 blur-3xl dark:bg-primary/10"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="inline-flex items-center gap-2 border border-border bg-background px-2.5 py-1 text-[0.7rem] text-muted-foreground">
          <span className="size-1.5 bg-primary" />
          {t.badge}
        </span>

        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t.titleLead}
          <span className="text-primary-foreground dark:text-primary">
            {t.titleHighlight}
          </span>
        </h2>

        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t.description}
        </p>

        <div className="flex w-full max-w-2xl items-center gap-2 border border-border bg-card p-2 text-left text-xs">
          <span className="pl-2 text-primary-foreground dark:text-primary">$</span>
          <code className="min-w-0 flex-1 truncate text-card-foreground">{INSTALL}</code>
          <CopyButton text={INSTALL} />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/docs/instalasi">
              {t.ctaPrimary}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/hideandseeklab/aoox-api"
              target="_blank"
              rel="noreferrer"
            >
              {t.ctaSecondary}
            </a>
          </Button>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-[0.7rem] text-muted-foreground">
          {t.points.map((point) => (
            <li key={point} className="flex items-center gap-1.5">
              <span className="text-primary-foreground dark:text-primary">✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { CtaSection }
