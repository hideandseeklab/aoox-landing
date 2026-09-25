"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { Lang } from "@/lib/lang"

type Group = { title: string; links: { label: string; href: string; external?: boolean }[] }

const GROUPS_ID: Group[] = [
  {
    title: "Produk",
    links: [
      { label: "Fitur", href: "/#fitur" },
      { label: "Cara kerja", href: "/#cara-kerja" },
      { label: "Cara build", href: "/#build" },
      { label: "Self-host", href: "/#self-host" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Dokumentasi",
    links: [
      { label: "Ikhtisar", href: "/docs" },
      { label: "Instalasi", href: "/docs/instalasi" },
      { label: "Membuat aplikasi", href: "/docs/aplikasi" },
      { label: "Managed database", href: "/docs/database" },
      { label: "Troubleshooting", href: "/docs/troubleshooting" },
    ],
  },
  {
    title: "Kode",
    links: [
      { label: "aoox-api", href: "https://github.com/hideandseeklab/aoox-api", external: true },
      { label: "aoox-web", href: "https://github.com/hideandseeklab/aoox-web", external: true },
      { label: "aoox-landing", href: "https://github.com/hideandseeklab/aoox-landing", external: true },
      { label: "Laporkan issue", href: "https://github.com/hideandseeklab/aoox-api/issues", external: true },
    ],
  },
]

const GROUPS_EN: Group[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/en#fitur" },
      { label: "How it works", href: "/en#cara-kerja" },
      { label: "Build methods", href: "/en#build" },
      { label: "Self-host", href: "/en#self-host" },
      { label: "FAQ", href: "/en#faq" },
    ],
  },
  {
    title: "Docs (Indonesian)",
    links: [
      { label: "Overview", href: "/docs" },
      { label: "Installation", href: "/docs/instalasi" },
      { label: "Creating an app", href: "/docs/aplikasi" },
      { label: "Managed database", href: "/docs/database" },
      { label: "Troubleshooting", href: "/docs/troubleshooting" },
    ],
  },
  {
    title: "Code",
    links: [
      { label: "aoox-api", href: "https://github.com/hideandseeklab/aoox-api", external: true },
      { label: "aoox-web", href: "https://github.com/hideandseeklab/aoox-web", external: true },
      { label: "aoox-landing", href: "https://github.com/hideandseeklab/aoox-landing", external: true },
      { label: "Report an issue", href: "https://github.com/hideandseeklab/aoox-api/issues", external: true },
    ],
  },
]

const COPY_ID = {
  tagline:
    "Self-hosted PaaS di atas Docker. Deploy aplikasi dari Git ke server sendiri — build, database, domain, dan log dalam satu dashboard.",
  copyright: (year: number) => `© ${year} aoox. Dibuat untuk dijalankan di server sendiri.`,
  hotkey: (
    <>
      Tekan <kbd className="border border-border px-1 text-foreground">d</kbd> untuk
      ganti tema.
    </>
  ),
  groups: GROUPS_ID,
  home: "/",
}

const COPY: Record<Lang, typeof COPY_ID> = {
  id: COPY_ID,
  en: {
    tagline:
      "A self-hosted PaaS on top of Docker. Deploy apps from Git to your own server — build, database, domain, and logs in one dashboard.",
    copyright: (year: number) => `© ${year} aoox. Built to run on your own server.`,
    hotkey: (
      <>
        Press <kbd className="border border-border px-1 text-foreground">d</kbd> to
        toggle the theme.
      </>
    ),
    groups: GROUPS_EN,
    home: "/en",
  },
}

function SiteFooter() {
  const pathname = usePathname()
  const lang: Lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "id"
  const t = COPY[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="text-xs text-muted-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8">
        <div className="flex flex-col gap-3">
          <Link href={t.home} className="text-sm font-semibold tracking-tight text-foreground">
            <span className="text-primary-foreground dark:text-primary">$</span>{" "}
            aoox
          </Link>
          <p className="max-w-xs leading-relaxed">{t.tagline}</p>
          <p className="flex items-center gap-1.5 text-[0.7rem]">
            <span className="size-1.5 bg-primary" />
            NestJS · Next.js · PostgreSQL · Traefik
          </p>
        </div>

        {t.groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <span className="text-[0.65rem] tracking-wider text-foreground uppercase">
              {group.title}
            </span>
            <ul className="flex flex-col gap-1.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {link.label}
                      <span aria-hidden className="text-[0.6rem]">↗</span>
                    </a>
                  ) : (
                    <Link href={link.href} className="transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-[0.7rem] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{t.copyright(year)}</p>
          <p>{t.hotkey}</p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
