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
  Steps,
  Step,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en/docs/admin-database",
  lang: "en",
  title: "Database admin UI",
  description:
    "Adminer, phpMyAdmin, pgAdmin, Mongo Express, Redis Commander, or DbGate for a managed database, installed in one click.",
})

const SUMMARY = [
  { k: "Where", v: <>Database page<PathArrow />Overview tab<PathArrow />Admin UI card</> },
  { k: "Form", v: "One web-admin container per database, on the aoox host" },
  { k: "Who", v: "Developers and up install it; viewers can't see the credentials" },
]

const TOOLS = [
  { s: "Adminer", d: "MySQL, MariaDB, PostgreSQL (including variants)", v: "adminer:5.4.2" },
  { s: "phpMyAdmin", d: "MySQL, MariaDB", v: "phpmyadmin:5.2.3" },
  { s: "pgAdmin", d: "PostgreSQL (including variants)", v: "dpage/pgadmin4:9.18.0" },
  { s: "Mongo Express", d: "MongoDB", v: "mongo-express:1.0.2-20-alpine3.19" },
  { s: "Redis Commander", d: "Redis, Valkey", v: "ghcr.io/joeferner/redis-commander:0.9.1" },
  { s: "DbGate", d: "All engines", v: "dbgate/dbgate:7.3.1-alpine" },
]

const NEXT = [
  { title: "Managed databases", description: "Engines, connections, and extra databases.", href: "/en/docs/database" },
  { title: "Data browser", description: "The lightweight built-in alternative.", href: "/en/docs/data-browser" },
  { title: "Proxy & domain", description: "Traefik and HTTPS for the Admin UI domain.", href: "/en/docs/domain" },
  { title: "Users & roles", description: "Who may install it and see the credentials.", href: "/en/docs/pengguna-peran" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/admin-database"
      title="Database admin UI"
      description="Install a web admin interface (Adminer, phpMyAdmin, pgAdmin, Mongo Express, Redis Commander, or DbGate) for a managed database in one click, then open it from a domain or an IP and port."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="apa-itu">What it is</H2>
      <P>
        The <DocLink href="/en/docs/data-browser">Data browser</DocLink> is
        enough for looking at tables and running queries. When you need a more
        complete tool, aoox can install one <strong>Admin UI</strong> per
        managed database: a popular web-admin container that runs next to the
        database and connects to that database server. The container is named{" "}
        <Code>aoox-dbadmin-&lt;slug&gt;</Code> and runs on the aoox host.
      </P>

      <H2 id="alat">Tools per engine</H2>
      <Table
        head={["Tool", "Engines", "Image (pinned version)"]}
        rows={TOOLS.map((t) => [
          <strong key={t.s}>{t.s}</strong>,
          t.d,
          <Code key={t.v}>{t.v}</Code>,
        ])}
      />
      <P>
        The tools offered in the install dialog follow the database&apos;s
        engine. Image versions are pinned so an install looks the same over
        time; Redis Commander comes from GHCR because Docker Hub only has an
        old <Code>latest</Code> tag.
      </P>

      <H2 id="memasang">Installing</H2>
      <Steps>
        <Step title={<>Open the database<PathArrow />Overview tab</>}>
          <P>
            The database must be <strong>running</strong> (otherwise the install
            is rejected with 409). Each database has at most one Admin UI.
          </P>
        </Step>
        <Step title="Click Install Admin UI on the Admin UI card">
          <P>Pick a tool, then pick how to open it:</P>
          <Ul>
            <li>
              <strong>Domain</strong> — through the reverse proxy with your own
              hostname (point its DNS at this server). The proxy is installed
              automatically if it isn&apos;t running; HTTPS turns on once an ACME
              email is set. The hostname can&apos;t already be used by another
              domain.
            </li>
            <li>
              <strong>IP &amp; port</strong> — published on a host port of this
              server, with no domain. The port must not be in use by an
              application, database, stack, or any other container.
            </li>
          </Ul>
          <P>At least one of the two is required; you can also use both a domain and an IP &amp; port at once, as with applications.</P>
        </Step>
        <Step title="Wait for the status to go from creating to running">
          <P>
            The install runs in the background; pulling the image can take a few
            minutes. If it fails, the card shows the error message. The address
            button appears once it is <Code>running</Code>.
          </P>
        </Step>
      </Steps>

      <H2 id="login">Signing in</H2>
      <Table
        head={["Tool", "How to sign in"]}
        rows={[
          [
            <strong key="a">Adminer, phpMyAdmin</strong>,
            "They use the database's own login. Take the username and password from the Internal connection card on the Overview tab (the Show password button); no extra password is created.",
          ],
          [
            <strong key="o">pgAdmin, Mongo Express, Redis Commander, DbGate</strong>,
            <>
              They use credentials aoox generates (username <Code>admin</Code>;
              pgAdmin uses <Code>admin@example.com</Code>). Click{" "}
              <strong>Show credentials</strong> on the Admin UI card. pgAdmin
              asks for the database password when you connect to the server.
            </>,
          ],
        ]}
      />
      <P>
        Members with the <strong>viewer</strong> role can&apos;t see those
        credentials, and can&apos;t install or delete the Admin UI.
      </P>

      <H2 id="menghapus">Removing</H2>
      <Ul>
        <li>
          <strong>Delete Admin UI</strong> on the card stops and removes its
          container. The database data is not affected.
        </li>
        <li>
          Deleting the <strong>database</strong> also deletes its Admin UI.
        </li>
        <li>
          Stopping the database does not stop the Admin UI, but it can&apos;t
          connect until the database is started again.
        </li>
        <li>
          The Admin UI is <strong>not included</strong> in a project
          export/import; install it again after importing.
        </li>
        <li>
          The Admin UI container has no volume: its settings come from aoox
          every time it is created, so nothing is lost when you delete it.
        </li>
      </Ul>

      <H2 id="keamanan">Security</H2>
      <Callout kind="warn">
        An Admin UI gives access to everything in the database. DbGate, Mongo
        Express, and Redis Commander already carry the database password inside
        their container, so anyone who has their login has full access. Don&apos;t
        open one over plain HTTP on the public internet.
      </Callout>
      <Ul>
        <li>Use a <strong>domain with HTTPS</strong> for access from outside, or IP &amp; port only on a trusted network / behind a firewall.</li>
        <li>Adminer can be pointed at other hosts on the <Code>aoox</Code> network if the user has that host&apos;s credentials.</li>
        <li>Delete the Admin UI when it is not in use, and limit who has developer or higher in this project.</li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["409 when installing", "The database isn't running, or it already has an Admin UI. Start the database first."],
          ["409 / 400: hostname or port", "The hostname is used by another domain or Admin UI (409), or the host port is in use (400). Pick another."],
          ["Status error: container no longer exists", "The container was removed outside aoox. Delete the Admin UI and install it again."],
          ["Can't sign in to Adminer/phpMyAdmin", "Use the database login (not an Admin UI credential); see the Internal connection card on the Overview tab."],
          ["The page doesn't open through the domain", "Check that DNS points at this server and the proxy is running. HTTPS needs an ACME email in the proxy settings."],
        ]}
      />

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
