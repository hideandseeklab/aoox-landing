import * as React from "react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import {
  CHANGELOG_REPOS,
  KIND_LABEL,
  RELEASES,
  changelogFileUrl,
  releaseTagUrl,
  type ChangeKind,
} from "@/content/changelog"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const COPY = {
  id: {
    title: "Changelog",
    intro:
      "Perubahan aoox per rilis — panel (API + dashboard), CLI, dan dokumentasi. Versi masih alpha: antarmuka dan perilaku bisa berubah antar rilis.",
    latest: "Latest",
    alpha: "alpha",
    release: "Rilis di GitHub",
    full: "CHANGELOG lengkap",
    locale: "id-ID",
  },
  en: {
    title: "Changelog",
    intro:
      "What changed in aoox, release by release — the panel (API + dashboard), the CLI, and the docs. Versions are still alpha: interfaces and behavior may change between releases.",
    latest: "Latest",
    alpha: "alpha",
    release: "Release on GitHub",
    full: "Full CHANGELOG",
    locale: "en-US",
  },
} as const

const KIND_STYLE: Record<ChangeKind, string> = {
  added: "border-primary/60 text-foreground",
  changed: "border-border text-muted-foreground",
  fixed: "border-border text-muted-foreground",
}

/** Highlights carry a tiny inline markup: `**bold**` and `` `code` `` only. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith("`")) {
          return (
            <code key={i} className="border border-border bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">
              {part.slice(1, -1)}
            </code>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`))
}

function ChangelogPage({ lang }: { lang: Lang }) {
  const t = COPY[lang]
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="flex flex-col gap-3 border-b border-border pb-8">
          <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">{t.title}</h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{t.intro}</p>
        </header>

        <ol className="flex flex-col">
          {RELEASES.map((release, index) => (
            <li
              key={release.version}
              id={`v${release.version}`}
              className="scroll-mt-20 border-b border-border py-10 last:border-b-0"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className="font-mono text-xl font-semibold tracking-tight">
                  v{release.version}
                </h2>
                {index === 0 ? (
                  <span className="border border-primary bg-primary px-1.5 py-0.5 text-[0.65rem] font-medium text-primary-foreground">
                    {t.latest}
                  </span>
                ) : null}
                <span className="border border-border px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
                  {t.alpha}
                </span>
                <time
                  dateTime={release.date}
                  className="text-xs text-muted-foreground sm:ml-auto"
                >
                  {formatDate(release.date, t.locale)}
                </time>
              </div>

              <div className="mt-6 flex flex-col gap-6">
                {release.groups.map((group) => (
                  <section key={group.kind} className="flex flex-col gap-2.5">
                    <h3
                      className={cn(
                        "w-fit border-l-2 pl-2 text-[0.7rem] font-medium uppercase tracking-wider",
                        KIND_STYLE[group.kind],
                      )}
                    >
                      {KIND_LABEL[lang][group.kind]}
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span aria-hidden className="mt-2 size-1 shrink-0 bg-primary" />
                          <span className="min-w-0 break-words">
                            <Inline text={item[lang]} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                <a
                  href={releaseTagUrl(release.version)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary-foreground dark:hover:text-primary"
                >
                  {t.release} ↗
                </a>
                <span className="text-muted-foreground">{t.full}:</span>
                {CHANGELOG_REPOS.map((repo) => (
                  <a
                    key={repo}
                    href={changelogFileUrl(repo, release.version)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    {repo}
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </>
  )
}

export { ChangelogPage }
