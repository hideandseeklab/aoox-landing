import { PathArrow } from "@/components/arrows"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en/docs/template",
  lang: "en",
  title: "One-click templates",
  description:
    "WordPress, Ghost, n8n, and more in a few clicks.",
})

const SUMMARY = [
  { k: "Catalog", v: "14 templates, bundled inside aoox" },
  { k: "Result", v: "A compose stack (source: template)" },
  { k: "Secrets", v: "Passwords/secrets generated automatically" },
]

const CATALOG = [
  { id: "wordpress", ver: "6.8", untuk: "CMS/blog + MySQL", isi: "—", service: "wordpress :80" },
  { id: "ghost", ver: "5", untuk: "Publishing platform", isi: "Public URL", service: "ghost :2368" },
  { id: "n8n", ver: "1.x", untuk: "Workflow automation", isi: "Public host; protocol & timezone have defaults", service: "n8n :5678" },
  { id: "uptime-kuma", ver: "1", untuk: "Uptime monitoring", isi: "—", service: "uptime-kuma :3001" },
  { id: "minio", ver: "latest", untuk: "S3 object storage — can serve as a backup destination", isi: "Root user has a default", service: "Console :9001 · S3 API :9000" },
  { id: "gitea", ver: "1.24", untuk: "Lightweight Git hosting", isi: "Public URL", service: "gitea :3000" },
  { id: "vaultwarden", ver: "1.37", untuk: "Password manager (Bitwarden compatible)", isi: "Public URL (HTTPS)", service: "vaultwarden :80" },
  { id: "umami", ver: "2.20", untuk: "Privacy-friendly web analytics + PostgreSQL", isi: "—", service: "umami :3000" },
  { id: "grafana", ver: "13.0", untuk: "Metrics and log dashboards", isi: "Public URL", service: "grafana :3000" },
  { id: "metabase", ver: "0.63", untuk: "Business intelligence + PostgreSQL", isi: "Public URL", service: "metabase :3000" },
  { id: "directus", ver: "12.4", untuk: "Headless CMS / data API + PostgreSQL", isi: "Public URL, admin email", service: "directus :8055" },
  { id: "mattermost", ver: "11.11", untuk: "Team chat + PostgreSQL", isi: "Public URL", service: "mattermost :8065" },
  { id: "nextcloud", ver: "32", untuk: "Files and collaboration + PostgreSQL, Redis, cron", isi: "Domain", service: "nextcloud :80" },
  { id: "odoo", ver: "19.0", untuk: "ERP / all-in-one business suite (Community) + PostgreSQL", isi: "— (master password is generated)", service: "odoo :8069" },
]

const NEXT = [
  { title: "Compose stacks", description: "Operations, env, and limits that also apply to templates.", href: "/en/docs/compose" },
  { title: "Proxy & domain", description: "Traefik + DNS for the hostname you fill in.", href: "/en/docs/domain" },
  { title: "Backup & restore", description: "Use MinIO from a template as an S3 destination.", href: "/en/docs/backup#s3" },
  { title: "Project", description: "Where a template stack lives.", href: "/en/docs/project" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/template"
      title="One-click templates"
      lang="en"
      description="A catalog of ready-made applications, deployed as a compose stack in a few clicks."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="katalog">Catalog</H2>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Template</th>
              <th className="px-3 py-2 text-left font-medium">Version</th>
              <th className="px-3 py-2 text-left font-medium">What it&apos;s for</th>
              <th className="px-3 py-2 text-left font-medium">Required</th>
              <th className="px-3 py-2 text-left font-medium">Service (port)</th>
            </tr>
          </thead>
          <tbody>
            {CATALOG.map((t) => (
              <tr key={t.id} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{t.id}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{t.ver}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.untuk}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.isi}</td>
                <td className="px-3 py-2 text-muted-foreground">{t.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        The catalog is written into aoox&apos;s own code — it isn&apos;t fetched from
        the internet at runtime, so it still works offline and can&apos;t be
        swapped out by anyone else. All passwords, secrets, and keys are
        generated automatically (alphanumeric) when left blank.
      </P>

      <H2 id="catatan">Notes per template</H2>
      <P>
        Templates that need a database ship <strong>their own PostgreSQL inside
        the stack</strong> (not a managed database), with named volumes for the
        data and health checks so the app only starts once the database is
        ready. Image versions are pinned to a specific tag, not{" "}
        <Code>latest</Code>. Licenses differ per project; check the project
        website before using one commercially.
      </P>
      <Table
        head={["Template", "Stack contents and what to know"]}
        rows={[
          ["vaultwarden", <>One container, data in SQLite. The web vault needs HTTPS (except on localhost), so enter the public URL as <Code>https://…</Code>. The <Code>/admin</Code> token is generated; turn sign-ups off (<Code>SIGNUPS_ALLOWED=false</Code>) once your account exists.</>],
          ["umami", <>Umami + PostgreSQL. Umami&apos;s built-in first login is <Code>admin</Code> / <Code>umami</Code>; change it right away.</>],
          ["grafana", <>One container (built-in SQLite). The admin username and password are in the stack env.</>],
          ["metabase", <>Metabase + PostgreSQL for its own application data (not the data you analyse). It is a Java app, so the first start takes a few minutes and uses a fair amount of RAM. The credential encryption key is generated; do not change it once in use.</>],
          ["directus", <>Directus + PostgreSQL. The first admin account is created from the email you enter and the password in the stack env; <Code>KEY</Code> and <Code>SECRET</Code> are generated.</>],
          ["mattermost", <>Mattermost Team Edition + PostgreSQL. The first account is created on the web and becomes the system admin.</>],
          ["nextcloud", <>Nextcloud (Apache) + PostgreSQL + Redis (cache and file locking) + a separate <Code>cron</Code> container for background jobs. Enter the domain without <Code>https://</Code>. The public protocol defaults to <Code>https</Code>; use <Code>http</Code> only for local tests. The first install takes longer, and it is the heaviest template.</>],
          ["odoo", <>Odoo <strong>Community</strong> 19.0 (LGPLv3; no Enterprise modules, which are proprietary) + PostgreSQL 16. Open the site: the first page asks for the <em>Master Password</em>, a database name, an email and an admin password. The <strong>master password</strong> is generated; find it on the stack page, <strong>Pengaturan</strong> tab, environment section, <strong>Tampilkan nilai</strong> (the <Code>MASTER_PASSWORD</Code> variable). It runs as <strong>a single process without workers</strong> (<Code>workers = 0</Code>), fine for small use; multiple workers with a separate websocket route are not set up. <Code>proxy_mode</Code> is on so the https scheme and redirects are right behind Traefik. The database list stays open so the first database can be created from the web; the master password guards creating, duplicating, backing up and deleting databases. Once the database exists, secure <Code>/web/database/manager</Code>: edit the stack compose (Pengaturan tab), add <Code>list_db = False</Code> and <Code>dbfilter = ^db_name$</Code> to the Odoo configuration part, and redeploy. The image uses a dated tag (<Code>19.0-20260926</Code>) so it does not move every night; for security updates, change the tag and redeploy. Data lives in the <Code>odoo_data</Code> volume (filestore) and the database.</>],
        ]}
      />

      <H2 id="langkah">Deploying a template</H2>
      <Steps>
        <Step title={<>Templates menu<PathArrow />pick a template</>}>
          <P>
            Or, from a project page, click <strong>From template</strong> so
            the project is already selected. A search box is available for
            the catalog.
          </P>
        </Step>
        <Step title="Fill in the deploy dialog">
          <Table
            head={["Section", "Notes"]}
            rows={[
              ["Project & Name", "The name becomes the stack's slug; the compose project = aoox-<slug>."],
              [
                "Hostname per service + HTTPS",
                "One row per exposable service (e.g. MinIO has two: Console and API). Leave blank if you don't want a domain.",
              ],
              [
                "Host port per service",
                <>
                  An alternative to a domain: the stack can then be opened at{" "}
                  <Code>{"<server-ip>:<port>"}</Code>. Port clashes are
                  rejected when saving — see{" "}
                  <DocLink href="/en/docs/compose#akses">Stack access</DocLink>.
                </>,
              ],
              [
                "Variables",
                <>
                  Fields with a label and hint from the template. Ones marked
                  required must be filled in (e.g. <em>Public URL</em> for
                  Ghost/Gitea, <em>Public host</em> for n8n). The rest: blank
                  = default / generated.
                </>,
              ],
            ]}
          />
          <Callout kind="warn" title="Public URL must match the domain">
            Ghost, Gitea, n8n, Grafana, Metabase, Directus, Mattermost, Vaultwarden, and Nextcloud use the public URL/host to build their own
            links and webhooks. Fill it in exactly matching the hostname
            you&apos;ve set up, scheme included (<Code>https://blog.example.com</Code>)
            — if it differs, the admin pages/links will point to the wrong place.
          </Callout>
        </Step>
        <Step title="Deploy">
          <P>
            You&apos;re taken to the new compose stack&apos;s page. The deploy runs in
            the background (the first image pull can take a few minutes);
            watch the <strong>Last action log</strong> until the status is{" "}
            <Code>running</Code>.
          </P>
        </Step>
        <Step title="Verify">
          <P>
            Open the hostname you set up. For the initial admin credentials
            (e.g. the MinIO root password, DB password), check the stack&apos;s env
            under the <strong>Settings</strong> tab — generated values are
            stored there.
          </P>
        </Step>
      </Steps>

      <H2 id="contoh">Example: WordPress with a domain</H2>
      <Pre title="Deploy dialog">{`Project     : shop
Name        : blog
Service     : wordpress → blog.example.com  [HTTPS ✓]
Variables   : DB_PASSWORD (blank → generated)
              DB_ROOT_PASSWORD (blank → generated)`}</Pre>
      <P>
        Once it&apos;s <Code>running</Code>, open <Code>https://blog.example.com</Code>{" "}
        and finish the WordPress wizard. The MySQL database lives inside the
        stack (not a managed database) — backing it up is then up to a
        plugin/script of your own, or move it to a{" "}
        <DocLink href="/en/docs/database">managed database</DocLink> by
        editing the compose file.
      </P>

      <H2 id="setelah">After deploying</H2>
      <Ul>
        <li>
          The <strong>compose file</strong> is stored in aoox and can be
          edited under the stack&apos;s Settings tab (a textarea), then
          redeployed — e.g. to add a service, change an image tag, or point
          at a managed database.
        </li>
        <li>
          The <strong>stack env</strong> holds the variable values
          (including generated ones); change it and redeploy if needed.
        </li>
        <li>
          A <strong>domain per service</strong> can be added/changed via the
          Domain card; suggested services come from the catalog.
        </li>
        <li>
          Stop / Start / Delete work the same as any other compose stack —{" "}
          <strong>Delete removes the volume data</strong>.
        </li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["400: required variable is empty", "The public URL/host/domain or the admin email (Directus) hasn't been filled in."],
          ["Admin links point to localhost / http", "The public URL doesn't match the domain, or n8n's protocol is still http. Fix the stack env, redeploy."],
          ["Deploy stays in deploying", "The first image pull. Wait, and check the Last action log for progress."],
          ["MinIO can't be used as a backup destination", <>Set up a domain/hostname for the <em>S3 API</em> service (port 9000), or use the internal endpoint <Code>http://&lt;container&gt;:9000</Code> — the stack must be on the <Code>aoox</Code> network.</>],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Templates from a custom repo/URL; upgrading the version of an already
        deployed template; offline template icons. The other compose stack
        limitations still apply — see{" "}
        <DocLink href="/en/docs/compose#perilaku">Compose stacks</DocLink>.
      </Callout>

      <H2 id="berikutnya">Next steps</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 rounded-lg overflow-hidden">
        {NEXT.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 bg-background p-4 transition-colors hover:bg-muted/60"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{item.title}</span>
              <span className="text-xs text-muted-foreground">{item.description}</span>
            </span>
            <ArrowRight className="mt-1 size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          </Link>
        ))}
      </div>
    </DocPage>
  )
}
