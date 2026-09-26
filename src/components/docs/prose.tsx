import Link from "next/link"

import { CopyButton } from "@/components/copy-button"
import { DocToc } from "@/components/docs/doc-toc"
import { docsNavFor, getDocNeighbors } from "@/lib/docs-nav"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const EDIT_BASE =
  "https://github.com/hideandseeklab/aoox-landing/blob/main/src/app"

const DOC_PAGE_COPY: Record<Lang, { wrong: string; edit: string; prev: string; next: string }> = {
  id: {
    wrong: "Ada yang keliru?",
    edit: "Edit halaman ini di GitLab ↗",
    prev: "← Sebelumnya",
    next: "Berikutnya →",
  },
  en: {
    wrong: "Found a mistake?",
    edit: "Edit this page on GitLab ↗",
    prev: "← Previous",
    next: "Next →",
  },
}

function DocPage({
  href,
  title,
  description,
  lang = "id",
  children,
}: {
  href: string
  title: string
  description: string
  lang?: Lang
  children: React.ReactNode
}) {
  const t = DOC_PAGE_COPY[lang]
  const { prev, next } = getDocNeighbors(href, lang)
  const nav = docsNavFor(lang)
  const group = nav.find((g) => g.items.some((i) => i.href === href))
  const docsRoot = lang === "en" ? "/en/docs" : "/docs"
  // The URL already mirrors the file path 1:1 (src/app/docs/* or src/app/en/docs/*).
  const editHref = `${EDIT_BASE}${href}/page.tsx`

  return (
    <div className="grid min-w-0 gap-10 xl:grid-cols-[1fr_11rem]">
    <article className="flex min-w-0 flex-col gap-8">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        {group ? (
          <p className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
            <Link href={docsRoot} className="hover:text-foreground">
              Docs
            </Link>
            <span aria-hidden>/</span>
            <span>{group.title}</span>
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </header>
      <div className="flex flex-col gap-8">{children}</div>
      <p className="text-[0.7rem] text-muted-foreground">
        {t.wrong}{" "}
        <a
          href={editHref}
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline underline-offset-4 hover:no-underline"
        >
          {t.edit}
        </a>
      </p>
      <nav className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="flex flex-col gap-1 border border-border p-4 transition-colors hover:bg-muted"
          >
            <span className="text-xs text-muted-foreground">{t.prev}</span>
            <span className="text-sm font-medium">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className="flex flex-col gap-1 border border-border p-4 text-right transition-colors hover:bg-muted"
          >
            <span className="text-xs text-muted-foreground">{t.next}</span>
            <span className="text-sm font-medium">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </article>
    <aside className="hidden xl:block">
      <div className="sticky top-24">
        <DocToc lang={lang} />
      </div>
    </aside>
    </div>
  )
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-20 text-lg font-semibold tracking-tight"
    >
      <a href={`#${id}`} className="hover:underline">
        {children}
      </a>
    </h2>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold">{children}</h3>
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground">
      {children}
    </p>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="border border-border bg-muted px-1 py-px text-[0.8em] text-foreground">
      {children}
    </code>
  )
}

function Pre({ children, title }: { children: string; title?: string }) {
  return (
    <div className="group/pre relative border border-border bg-card text-card-foreground">
      {title ? (
        <div className="border-b border-border px-3 py-1.5 text-[0.7rem] text-muted-foreground">
          {title}
        </div>
      ) : null}
      <CopyButton
        text={children}
        className="absolute top-1.5 right-1.5 bg-card opacity-0 transition-opacity group-hover/pre:opacity-100 focus-visible:opacity-100"
      />
      <pre className="overflow-x-auto p-3 pr-10 text-xs leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary-foreground dark:marker:text-primary [&_strong]:text-foreground">
      {children}
    </ul>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return (
    <ol className="flex flex-col gap-4 border-l border-border pl-6 [counter-reset:step]">
      {children}
    </ol>
  )
}

function Step({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <li className="relative flex flex-col gap-2 [counter-increment:step] before:absolute before:-left-[1.9rem] before:flex before:size-6 before:items-center before:justify-center before:border before:border-border before:bg-background before:text-[0.65rem] before:text-primary-foreground before:content-[counter(step,decimal-leading-zero)] dark:before:text-primary">
      <h3 className="text-sm font-semibold">{title}</h3>
      {children}
    </li>
  )
}

function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: "note" | "warn"
  title?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-l-2 bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground [&_strong]:text-foreground",
        kind === "warn" ? "border-destructive" : "border-primary"
      )}
    >
      {title ? (
        <span className="text-xs font-semibold text-foreground">{title}</span>
      ) : null}
      <div>{children}</div>
    </div>
  )
}

function Table({
  head,
  rows,
}: {
  head: string[]
  rows: React.ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto border border-border">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 leading-relaxed text-muted-foreground [&_strong]:text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DocLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-foreground underline underline-offset-4">
      {children}
    </Link>
  )
}

export { DocPage, H2, H3, P, Code, Pre, Ul, Steps, Step, Callout, Table, DocLink }
