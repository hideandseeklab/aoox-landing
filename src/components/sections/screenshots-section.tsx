"use client"

import * as React from "react"

import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

/** Every shot is cropped to 16:9 and exported at 960 and 1600 px wide (public/screenshots). */
const WIDTH = 1600
const HEIGHT = 900

type Shot = {
  id: string
  /** File base names in public/screenshots; a theme without its own shot falls back to the other. */
  dark: string
  light: string
  tab: Record<Lang, string>
  caption: Record<Lang, string>
  alt: Record<Lang, string>
}

const SHOTS: Shot[] = [
  {
    id: "projects",
    dark: "projects-dark",
    light: "projects-light",
    tab: { en: "Projects", id: "Project" },
    caption: {
      en: "Projects group applications, databases and stacks, with live status and resource use.",
      id: "Project mengelompokkan aplikasi, database, dan stack, lengkap dengan status dan pemakaian resource.",
    },
    alt: {
      en: "The aoox projects overview with two projects and their running applications and databases",
      id: "Ringkasan project aoox dengan dua project beserta aplikasi dan database yang berjalan",
    },
  },
  {
    id: "deploy",
    dark: "deploy-dark",
    light: "history-light",
    tab: { en: "Deploy", id: "Deploy" },
    caption: {
      en: "Deploy from Git or an image and follow the build log live, with metrics and history beside it.",
      id: "Deploy dari Git atau image dan ikuti log build secara langsung, dengan metrik dan riwayat di sampingnya.",
    },
    alt: {
      en: "An application page showing CPU, memory and network charts and a deployment log",
      id: "Halaman aplikasi dengan grafik CPU, memori, dan jaringan serta log deployment",
    },
  },
  {
    id: "environment",
    dark: "environment-dark",
    light: "environment-dark",
    tab: { en: "Environment", id: "Environment" },
    caption: {
      en: "Environment variables and shared variable sets, with references to your databases.",
      id: "Environment variable dan variable set bersama, dengan referensi ke database kamu.",
    },
    alt: {
      en: "The environment tab of an application listing variables that reference databases",
      id: "Tab environment aplikasi yang berisi variabel dengan referensi ke database",
    },
  },
  {
    id: "data",
    dark: "data-dark",
    light: "data-light",
    tab: { en: "Data browser", id: "Data browser" },
    caption: {
      en: "Browse tables and run SQL on a managed database without leaving the dashboard.",
      id: "Jelajahi tabel dan jalankan SQL di database terkelola tanpa keluar dari dashboard.",
    },
    alt: {
      en: "The data browser of a PostgreSQL database showing a SQL query and a table of rows",
      id: "Data browser database PostgreSQL dengan query SQL dan tabel hasilnya",
    },
  },
  {
    id: "backups",
    dark: "backups-light",
    light: "backups-light",
    tab: { en: "Backups", id: "Backup" },
    caption: {
      en: "Scheduled and manual database backups, optionally copied to S3.",
      id: "Backup database terjadwal dan manual, bisa disalin ke S3.",
    },
    alt: {
      en: "The backups tab of a database with a list of dumps and a schedule",
      id: "Tab backup database dengan daftar dump dan jadwalnya",
    },
  },
]

const COPY = {
  en: {
    label: "what it looks like",
    title: "One dashboard for everything you run",
    description:
      "A look at the aoox dashboard. It follows the theme you pick on this page.",
    tabs: "Dashboard screenshots",
  },
  id: {
    label: "tampilannya",
    title: "Satu dashboard untuk semua yang kamu jalankan",
    description:
      "Sekilas dashboard aoox. Tampilannya mengikuti tema yang kamu pilih di halaman ini.",
    tabs: "Tangkapan layar dashboard",
  },
}

function src(name: string, w: 960 | 1600) {
  return `/screenshots/${name}-${w}.webp`
}

function ShotImage({
  name,
  alt,
  className,
  priority,
}: {
  name: string
  alt: string
  className: string
  priority: boolean
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer
    <img
      src={src(name, 1600)}
      srcSet={`${src(name, 960)} 960w, ${src(name, 1600)} 1600w`}
      sizes="(min-width: 1152px) 1088px, calc(100vw - 32px)"
      width={WIDTH}
      height={HEIGHT}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  )
}

function ScreenshotsSection({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang]
  const [active, setActive] = React.useState(0)
  const shot = SHOTS[active]
  // The Indonesian projects overview exists only as a dark shot.
  const idProjects = lang === "id" && shot.id === "projects"
  const dark = idProjects ? "projects-id-dark" : shot.dark
  const light = idProjects ? "projects-id-dark" : shot.light
  const frame = "block h-auto w-full"

  return (
    <Section id={lang === "en" ? "screenshots" : "tampilan"}>
      <SectionHeading label={t.label} title={t.title} description={t.description} />

      <div className="flex flex-col gap-6">
        <div
          role="tablist"
          aria-label={t.tabs}
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {SHOTS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`shot-tab-${s.id}`}
              aria-selected={i === active}
              aria-controls="shot-panel"
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 rounded-md border px-3 py-1.5 text-xs transition-colors",
                i === active
                  ? "border-primary/60 bg-primary/15 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {s.tab[lang]}
            </button>
          ))}
        </div>

        <figure
          id="shot-panel"
          role="tabpanel"
          aria-labelledby={`shot-tab-${shot.id}`}
          className="flex flex-col gap-4"
        >
          <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="aspect-video w-full">
              <ShotImage
                key={`${shot.id}-${dark}-d`}
                name={dark}
                alt={shot.alt[lang]}
                priority={active === 0}
                className={cn(frame, "hidden dark:block")}
              />
              <ShotImage
                key={`${shot.id}-${light}-l`}
                name={light}
                alt={shot.alt[lang]}
                priority={active === 0}
                className={cn(frame, "dark:hidden")}
              />
            </div>
          </div>
          <figcaption className="text-sm text-muted-foreground">
            {shot.caption[lang]}
          </figcaption>
        </figure>
      </div>
    </Section>
  )
}

export { ScreenshotsSection }
