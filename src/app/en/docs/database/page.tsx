import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  H3,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Managed database" }

const SUMMARY = [
  { k: "Engines", v: "PostgreSQL · MySQL · MariaDB · Redis" },
  { k: "Shape", v: "One container + volume per database" },
  { k: "Connect", v: "${{database.<slug>.url}} in the application's env" },
]

const ENGINES = [
  { e: "PostgreSQL", img: "postgres", tag: "16-alpine", port: 5432, url: "postgresql://app:pass@host:5432/<db>" },
  { e: "MySQL", img: "mysql", tag: "8", port: 3306, url: "mysql://app:pass@host:3306/<db>" },
  { e: "MariaDB", img: "mariadb", tag: "11", port: 3306, url: "mysql://app:pass@host:3306/<db>" },
  { e: "Redis", img: "redis", tag: "7-alpine", port: 6379, url: "redis://:pass@host:6379/0" },
]

const LIFECYCLE = [
  { s: "creating", d: "pull the image, create the volume & container" },
  { s: "running", d: "ready to use; credentials available" },
  { s: "stopped", d: "container stopped, data kept" },
  { s: "error", d: "provisioning failed — check the message" },
]

const NEXT = [
  { title: "Environment variables", description: "Every form of the ${{database.…}} reference.", href: "/en/docs/environment#referensi" },
  { title: "Data browser", description: "Browse tables and run queries from the dashboard.", href: "/en/docs/data-browser" },
  { title: "Backup & restore", description: "Manual and scheduled backups, S3 copies.", href: "/en/docs/backup#database" },
  { title: "Monitoring", description: "Database metrics and resource limits.", href: "/en/docs/monitoring#limit" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/database"
      title="Managed database"
      lang="en"
      description="Create a PostgreSQL, MySQL, MariaDB, or Redis database per project and connect it to an application."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="engine">Supported engines</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Engine</th>
              <th className="px-3 py-2 text-left font-medium">Image (default tag)</th>
              <th className="px-3 py-2 text-left font-medium">Port</th>
              <th className="px-3 py-2 text-left font-medium">Internal URL shape</th>
            </tr>
          </thead>
          <tbody>
            {ENGINES.map((row) => (
              <tr key={row.e} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{row.e}</td>
                <td className="px-3 py-2"><Code>{row.img}:{row.tag}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{row.port}</td>
                <td className="px-3 py-2"><Code>{row.url}</Code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        The container follows the official Docker Hub image&apos;s env vars
        (<Code>POSTGRES_*</Code>, <Code>MYSQL_*</Code>, <Code>MARIADB_*</Code>,{" "}
        <Code>--requirepass</Code>). The SQL username is always <Code>app</Code>;
        the database name is the slug with <Code>-</Code> replaced by{" "}
        <Code>_</Code>. The password is random and stored encrypted.
      </P>

      <H2 id="langkah">Creating a database</H2>
      <Steps>
        <Step title="Project page → New database">
          <Table
            head={["Field", "Notes"]}
            rows={[
              ["Name", <>Becomes a unique slug (global, not per project). Container <Code>{"aoox-db-<slug>"}</Code>, volume <Code>{"aoox_db_<slug>"}</Code>.</>],
              ["Engine", "postgres / mysql / mariadb / redis."],
              ["Version (image tag)", <>A Docker Hub tag. Blank = the default in the table above. Examples: <Code>17</Code>, <Code>8.4</Code>, <Code>7.2</Code>.</>],
              [
                "Host port",
                "Optional. Fill it in only if you need a connection from outside Docker (a laptop, a remote server). Applications on the aoox host don't need it.",
              ],
              ["CPU / memory limit", "Optional; can be changed later."],
            ]}
          />
        </Step>
        <Step title="Wait for the running status">
          <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
            {LIFECYCLE.map((item, i) => (
              <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
                <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium text-foreground">{item.s}</span>
                <span className="text-muted-foreground">{item.d}</span>
              </li>
            ))}
          </ol>
          <P>
            Provisioning runs in the background (the image pull can take a
            while); the page refreshes automatically while it&apos;s{" "}
            <Code>creating</Code>.
          </P>
        </Step>
        <Step title="Connect it to an application">
          <P>
            In the application&apos;s env (same project), reference it — don&apos;t
            copy the password:
          </P>
          <Pre title="Application env">{`DATABASE_URL=\${{database.app-db.url}}`}</Pre>
          <P>
            Deploy (or roll back) so the new application container picks up
            the value. Other forms (<Code>host</Code>, <Code>port</Code>,{" "}
            <Code>username</Code>, …) are covered in{" "}
            <DocLink href="/en/docs/environment#referensi">Environment variables</DocLink>.
          </P>
        </Step>
      </Steps>
      <Callout kind="warn" title="No automatic injection">
        Creating a database doesn&apos;t automatically add env to any application.
        References only work for applications/stacks in the{" "}
        <strong>same project</strong>.
      </Callout>

      <H2 id="koneksi">Connections</H2>
      <Table
        head={["Type", "Host", "Who can use it"]}
        rows={[
          [
            <strong key="i">Internal connection</strong>,
            <Code key="ih">{"aoox-db-<slug>"}</Code>,
            <>Containers on the <Code>aoox</Code> network: applications, compose stacks joined to that network, jobs.</>,
          ],
          [
            <strong key="e">External connection</strong>,
            <><Code>{"<server-ip>:<host port>"}</Code> (only if a host port is set)</>,
            "Laptops, GUI clients, applications on a remote server. Secure it with a firewall.",
          ],
        ]}
      />
      <P>
        The <strong>Overview</strong> tab shows both, along with credentials
        (masked, copyable) and a ready-to-paste <Code>DATABASE_URL</Code>.
      </P>

      <H2 id="database-tambahan">Extra databases on the same server</H2>
      <P>
        A single PostgreSQL/MySQL/MariaDB container can hold several
        databases (schemas). Under the <strong>Data</strong> tab, an
        owner/admin can create a new database named{" "}
        <Code>[A-Za-z_][A-Za-z0-9_]*</Code>; the one created at provisioning
        time is the <em>primary</em> one and can&apos;t be deleted.
      </P>
      <Pre title="Referencing an extra database from env">{`REPORTS_DB_URL=\${{database.app-db.url:reports}}`}</Pre>
      <Ul>
        <li>The host, user, and password are the same — only the database name part differs.</li>
        <li>The Overview tab shows a <strong>Connection for database</strong> per name when there&apos;s more than one.</li>
        <li>Backups have an option to include every database on the server (see Backup).</li>
        <li>Redis doesn&apos;t have this feature (use the DB number in the URL if needed).</li>
      </Ul>

      <H2 id="operasi">Operations</H2>
      <Table
        head={["Action", "Where", "Notes"]}
        rows={[
          ["Stop / Start", "Database panel", "Container stops; data on the volume is kept. Connected applications will error until it's started again."],
          ["Resource limits", "Resource limits card", "Applies immediately; removing a limit recreates the container (a brief restart)."],
          ["Change version (tag)", "—", "Not available from the UI yet. Create a new database and restore a backup into it."],
          ["Engine configuration", "Mount tab", "Mount a file at a config path; the container is re-provisioned."],
          ["Delete", "Database panel", "With or without deleting the volume. The backup list is deleted too (cascade); S3 files as well."],
        ]}
      />

      <H3>Other tabs</H3>
      <Ul>
        <li>
          <strong>Data</strong> → <DocLink href="/en/docs/data-browser">Data browser</DocLink>:
          tables, queries, extra databases.
        </li>
        <li>
          <strong>Backup</strong> → <DocLink href="/en/docs/backup#database">Backup &amp; restore</DocLink>:
          manual, schedule, retention, S3.
        </li>
        <li>
          <strong>Jobs</strong> → scheduled commands in the database container
          or a separate container from the engine image with{" "}
          <Code>DB_*</Code> env — {" "}
          <DocLink href="/en/docs/jobs#pemilik">Scheduled jobs</DocLink>.
        </li>
        <li>
          <strong>Mount</strong> → engine config files (<Code>my.cnf</Code>,{" "}
          <Code>redis.conf</Code>) or extra volumes —{" "}
          <DocLink href="/en/docs/mount#database">Mounts</DocLink>.
        </li>
        <li>
          CPU/RAM metrics (15-second samples) at the top of the panel.
        </li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Application: connection refused / ENOTFOUND", "It's using the external/localhost URL from inside a container. Use the internal URL (container name) via a reference."],
          ["400 when saving env: no database \"x\"", "The slug is wrong, or the database is in a different project."],
          ["Error status when creating", "The image tag doesn't exist on Docker Hub, or the host port is already in use. Delete and recreate."],
          ["An application on a remote server can't connect", <>The database always runs on the aoox host. Fill in a host port + firewall, then use the external connection in the env (without a reference).</>],
          ["Data missing after deleting", "It was deleted with the volume purged. Restore from a downloaded/S3 backup into a new database."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Changing the engine version from the UI; replicas/HA; databases on a
        remote server; automatic env injection.
      </Callout>

      <H2 id="berikutnya">Next steps</H2>
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
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
