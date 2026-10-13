import type { Lang } from "./lang"

/**
 * Single source of truth for pairing a documentation page with its
 * counterpart in the other language. English pages live at `/docs/<en>`,
 * Indonesian pages at `/id/docs/<id>` — the slugs are NOT always the same, so
 * the language switch, hreflang, the sitemap and the docs nav must all go
 * through this table instead of assuming "same path with an /id prefix".
 */
export const DOC_SLUGS: readonly { id: string; en: string }[] = [
  { id: "admin-database", en: "database-admin" },
  { id: "aplikasi", en: "applications" },
  { id: "backup", en: "backup" },
  { id: "build", en: "build" },
  { id: "cli", en: "cli" },
  { id: "compose", en: "compose" },
  { id: "data-browser", en: "data-browser" },
  { id: "database", en: "database" },
  { id: "deploy", en: "deploy" },
  { id: "dns-cloudflare", en: "cloudflare-dns" },
  { id: "domain", en: "domain" },
  { id: "domain-panel", en: "panel-domain" },
  { id: "environment", en: "environment" },
  { id: "instalasi", en: "installation" },
  { id: "jobs", en: "jobs" },
  { id: "konfigurasi-proxy", en: "proxy-configuration" },
  { id: "monitoring", en: "monitoring" },
  { id: "mount", en: "mount" },
  { id: "notifikasi", en: "notifications" },
  { id: "pengguna-peran", en: "users-roles" },
  { id: "preview", en: "preview" },
  { id: "project", en: "project" },
  { id: "registry", en: "registry" },
  { id: "sertifikat-ssl", en: "ssl-certificates" },
  { id: "server-remote", en: "remote-servers" },
  { id: "swarm", en: "swarm" },
  { id: "template", en: "template" },
  { id: "terminal", en: "terminal" },
  { id: "troubleshooting", en: "troubleshooting" },
  { id: "variabel", en: "variables" },
  { id: "webhook", en: "webhook" },
]

const ID_TO_EN = new Map(DOC_SLUGS.map((p) => [p.id, p.en]))
const EN_TO_ID = new Map(DOC_SLUGS.map((p) => [p.en, p.id]))

/**
 * Returns the same documentation page's path in the other language, or
 * `null` if `pathname` is not a known docs page (so callers never emit a
 * link or hreflang to a 404). The docs index maps `/docs` ⇄ `/id/docs`.
 */
export function otherLangDocPath(pathname: string, lang: Lang): string | null {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
  const root = lang === "en" ? "/docs" : "/id/docs"
  const otherRoot = lang === "en" ? "/id/docs" : "/docs"
  if (path === root) return otherRoot
  if (!path.startsWith(`${root}/`)) return null
  const slug = path.slice(root.length + 1)
  const other = (lang === "en" ? EN_TO_ID : ID_TO_EN).get(slug)
  return other ? `${otherRoot}/${other}` : null
}

/**
 * Old URLs that are now static redirect pages. GitHub Pages has no
 * server-side redirects, so each one is a tiny page (see `RedirectStub`).
 * They are not real pages: excluded from the sitemap and the docs nav.
 *
 * - `LEGACY_EN_DOCS`: English docs URLs that once had an Indonesian slug
 *   (`/en/docs/<from>`). They now redirect straight to `/docs/<to>`;
 *   `anchors` maps the old Indonesian heading ids to the English ones.
 * - Old `/en/...` URLs in general (`/en`, `/en/docs`, `/en/changelog`,
 *   `/en/docs/<en-slug>`) redirect to the same path without `/en`.
 * - Old Indonesian `/docs/<id-slug>` URLs whose slug is not an English slug
 *   (`ID_ONLY_DOC_SLUGS`) redirect to `/id/docs/<id-slug>`. Indonesian URLs
 *   whose path is reused by an English page cannot be redirected.
 */
export const LEGACY_EN_DOCS: readonly {
  from: string
  to: string
  anchors: Record<string, string>
}[] = [
  { from: "instalasi", to: "installation", anchors: {"satu-perintah":"one-command","prasyarat":"prerequisites","langkah":"steps","verifikasi":"verification","setelah-instalasi":"after-installation","dari-source":"from-source","hapus":"uninstall"} },
  { from: "domain-panel", to: "panel-domain", anchors: {"kenapa":"why","prasyarat":"prerequisites","langkah":"steps","verifikasi":"verification","variasi":"variations","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "pengguna-peran", to: "users-roles", anchors: {"peran":"roles","owner-pertama":"first-owner","undang":"invite","kelola":"manage","akun":"account","praktik":"best-practices","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "aplikasi", to: "applications", anchors: {"prasyarat":"prerequisites","sumber":"source","langkah":"steps","verifikasi":"verification","tab":"tabs","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "notifikasi", to: "notifications", anchors: {"alur":"flow","langkah":"steps","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "admin-database", to: "database-admin", anchors: {"apa-itu":"what-is-it","alat":"tools","memasang":"install","menghapus":"remove","keamanan":"security","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "konfigurasi-proxy", to: "proxy-configuration", anchors: {"konsep":"concepts","buat":"create","pasang":"attach","proxy-lama":"legacy-proxy","terapkan-ulang":"reapply","batas":"limits","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "sertifikat-ssl", to: "ssl-certificates", anchors: {"kapan":"when","unggah":"upload","pasang":"attach","kedaluwarsa":"expiry","menghapus":"removing","batas":"limits","keamanan":"security","jebakan":"pitfalls","berikutnya":"next-steps"} },
  { from: "server-remote", to: "remote-servers", anchors: {"kapan":"when","prasyarat":"prerequisites","cara-kerja":"how-it-works","langkah":"steps","pemantauan":"monitoring","hapus":"remove","jebakan":"pitfalls","berikutnya":"next-steps"} },
]

/** Indonesian slugs that no English page uses: their old `/docs/<slug>` URL is a redirect to `/id/docs/<slug>`. */
export const ID_ONLY_DOC_SLUGS: readonly string[] = DOC_SLUGS.filter(
  (p) => !DOC_SLUGS.some((q) => q.en === p.id),
).map((p) => p.id)

/** English slugs, for the old `/en/docs/<slug>` redirects. */
export const EN_DOC_SLUGS: readonly string[] = DOC_SLUGS.map((p) => p.en)
