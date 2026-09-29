import type { Metadata } from "next"
import type { Lang } from "./lang"

export const SITE_URL = "https://aoox.dev"
export const SITE_NAME = "aoox"

/**
 * Icons, declared explicitly on every root layout (both language groups and
 * `not-found.tsx`). They live in `public/` as plain files: the
 * `app/icon.svg` file convention only reaches pages under the layout in the
 * same folder, and this site has no root `app/layout.tsx` (each route group
 * has its own), so that convention rendered no `<link rel="icon">` at all.
 * ICO first (48x48 is what Google search results want, and the fallback for
 * crawlers and `/favicon.ico` requests), then the SVG for browsers that use it.
 */
export const ICONS: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: "/favicon.ico", sizes: "48x48" },
    { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
  ],
  apple: "/apple-touch-icon.png",
}

/**
 * Static file, not the `next/og`-generated route it replaced — GitHub Pages
 * serves a static `public/og.png` as `image/png`, but served the generated
 * `/opengraph-image` route (no file extension) as
 * `application/octet-stream`, which some social crawlers (WhatsApp, Twitter,
 * Facebook) reject outright. Confirmed live on aoox.dev before switching.
 */
const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
  // Describes the (single, shared) image itself, not the current page.
  alt: "aoox — self-hosted PaaS",
}

/**
 * Given a pathname and the language it's written in, returns the same page's
 * path in the *other* language, or `null` if there isn't one. Single source
 * of truth for the ID⇄EN URL mapping — reused by the header's language
 * switcher (`site-header.tsx`) and by hreflang generation here, so the two
 * can never drift apart.
 *
 * The mapping is purely structural (`/docs/<slug>` ⇄ `/en/docs/<slug>`,
 * `/` ⇄ `/en`, `/changelog` ⇄ `/en/changelog`) — slugs are never translated. If a page without a real
 * counterpart is ever added, this must return `null` for it rather than a
 * guessed path, so callers never emit an hreflang link to a 404.
 */
export function otherLangPath(pathname: string, lang: Lang): string | null {
  if (pathname === "/" || pathname === "/en") {
    return lang === "en" ? "/" : "/en"
  }
  if (pathname === "/changelog" || pathname === "/en/changelog") {
    return lang === "en" ? "/changelog" : "/en/changelog"
  }
  if (lang === "id" && (pathname === "/docs" || pathname.startsWith("/docs/"))) {
    return `/en${pathname}`
  }
  if (lang === "en" && (pathname === "/en/docs" || pathname.startsWith("/en/docs/"))) {
    return pathname.slice("/en".length)
  }
  return null
}

export interface PageSeoInput {
  /** Path of this exact page, e.g. `/docs/registry`, `/en`, `/`. */
  path: string
  lang: Lang
  title: string
  /** ~110–160 characters, unique per page — used for `<meta name="description">` and OG/Twitter. */
  description: string
  /**
   * Next.js only applies an ancestor layout's `title.template` when the page
   * sits in a *deeper* segment than that layout — a page living in the exact
   * same folder as the layout defining the template (every docs index page,
   * and both homepages, which share a folder with their root layout) skips
   * it and falls through to the next ancestor's template instead, which is
   * surprising and inconsistent between /  and /en in particular. Set this
   * to render `title` as-is (`title.absolute`) and sidestep the whole
   * lookup for those cases; leave it off for the ~50 docs detail pages,
   * which sit one segment deeper than `docs/layout.tsx` and get its
   * "%s — Docs aoox" template applied correctly on its own.
   */
  titleIsFinal?: boolean
}

/**
 * Builds a page's `export const metadata` object: description, canonical,
 * hreflang (`alternates.languages`, id/en/x-default — only for languages
 * that actually have a page, via `otherLangPath`), and Open Graph/Twitter
 * card data. `title`/`description` still need to be unique per call site;
 * this only standardizes the URL/social plumbing around them.
 */
export function pageMetadata({
  path,
  lang,
  title,
  description,
  titleIsFinal,
}: PageSeoInput): Metadata {
  const sibling = otherLangPath(path, lang)
  const idPath = lang === "id" ? path : sibling
  const enPath = lang === "en" ? path : sibling

  const languages: Record<string, string> = {}
  if (idPath) languages.id = idPath
  if (enPath) languages.en = enPath
  if (idPath) languages["x-default"] = idPath

  const url = `${SITE_URL}${path}`

  return {
    title: titleIsFinal ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      languages,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: lang === "id" ? "id_ID" : "en_US",
      alternateLocale: lang === "id" ? "en_US" : "id_ID",
      url,
      title,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}

const GITHUB_URL = "https://github.com/hideandseeklab/aoox-api"

/**
 * JSON-LD for the homepage (ID + EN): `SoftwareApplication` (what aoox is),
 * `Organization`, and `WebSite`, combined under one `@graph` so a single
 * `<script>` tag covers all three. Only verifiable facts — no rating/review/
 * price data beyond "it's free and open source", which is true.
 */
export function homeJsonLd(lang: Lang) {
  const description =
    lang === "id"
      ? "aoox adalah PaaS self-hosted di atas Docker untuk deploy aplikasi dari Git, dengan database terkelola, domain otomatis, dan monitoring."
      : "aoox is a self-hosted PaaS on top of Docker for deploying applications from Git, with managed databases, automatic domains, and monitoring."

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Linux",
        description,
        url: SITE_URL,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        sameAs: [GITHUB_URL],
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        sameAs: [GITHUB_URL],
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  }
}
