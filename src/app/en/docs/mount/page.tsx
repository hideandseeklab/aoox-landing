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

export const metadata: Metadata = { title: "Mounts" }

const SUMMARY = [
  { k: "Types", v: "Volume · Bind · File" },
  { k: "Effect", v: "Container recreated, no build" },
  { k: "Backup", v: "Volumes only (manual/scheduled, S3)" },
]

const DECISION = [
  { q: "Does data the app writes need to survive between deploys (uploads, SQLite, cache)?", a: "Volume" },
  { q: "Need to read/write a folder that already exists on the host?", a: "Bind (owner/admin)" },
  { q: "Just need to inject a single config file?", a: "File" },
]

const EXAMPLES = [
  { jenis: "Volume", path: "/app/uploads", sumber: "uploads", catatan: "Volume aoox_app_shop_uploads" },
  { jenis: "Volume", path: "/data", sumber: "data", catatan: "SQLite / cache" },
  { jenis: "Bind", path: "/srv/media", sumber: "/mnt/storage/media", catatan: "Host path, owner/admin" },
  { jenis: "File", path: "/etc/nginx/conf.d/app.conf", sumber: "(content in the textarea)", catatan: "Read-only" },
]

const NEXT = [
  { title: "Backup & restore", description: "Manual/scheduled volume backups, S3 copies.", href: "/en/docs/backup#volume" },
  { title: "Deploy & rollback", description: "Blue/green and shared volumes.", href: "/en/docs/deploy#blue-green" },
  { title: "Users & roles", description: "Who's allowed to bind mount.", href: "/en/docs/pengguna-peran" },
  { title: "Managed database", description: "A volume alternative for relational data.", href: "/en/docs/database" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/mount"
      title="Mounts"
      lang="en"
      description="Storing data that must survive between deploys, accessing a host path, or injecting a config file into an application or managed database container."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">When do you need a mount?</H2>
      <P>
        A container&apos;s filesystem <strong>disappears on every deploy</strong> —
        the old container is removed, a new one is created from the image.
        Anything the application writes to disk needs to live in a mount if it
        should survive.
      </P>
      <div className="border border-border text-xs">
        {DECISION.map((row, i) => (
          <div
            key={row.q}
            className={`grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <span className="text-foreground">{row.q}</span>
            <span className="text-muted-foreground">
              → <span className="text-primary-foreground dark:text-primary">{row.a}</span>
            </span>
          </div>
        ))}
      </div>

      <H2 id="jenis">Three kinds of mount</H2>
      <Table
        head={["Kind", "Source", "Who", "Notes"]}
        rows={[
          [
            <strong key="v">Volume</strong>,
            <>
              A Docker volume <Code>{"aoox_app_<app>_<name>"}</Code>
            </>,
            "Any member",
            "Data survives between deploys. Can be backed up.",
          ],
          [
            <strong key="b">Bind</strong>,
            "A path on the host",
            "Owner/admin",
            "Equivalent to host filesystem access. Can't be backed up yet.",
          ],
          [
            <strong key="f">File</strong>,
            "Text content stored in aoox",
            "Any member",
            "Always read-only. Good for config (nginx.conf, a static .env).",
          ],
        ]}
      />

      <H2 id="langkah">Adding a mount</H2>
      <Steps>
        <Step title="Open the Mount tab → Add mount">
          <P>
            Pick a <strong>Kind</strong>, set the <strong>Container path</strong>{" "}
            (unique per application), then <strong>Volume name</strong> /{" "}
            <strong>Host path</strong> / <strong>File content</strong> depending
            on the kind.
          </P>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Kind</th>
                  <th className="px-3 py-2 text-left font-medium">Container path</th>
                  <th className="px-3 py-2 text-left font-medium">Source</th>
                  <th className="px-3 py-2 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLES.map((row) => (
                  <tr key={row.path} className="border-t border-border">
                    <td className="px-3 py-2 text-foreground">{row.jenis}</td>
                    <td className="px-3 py-2"><Code>{row.path}</Code></td>
                    <td className="px-3 py-2"><Code>{row.sumber}</Code></td>
                    <td className="px-3 py-2 text-muted-foreground">{row.catatan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Step>
        <Step title="The container is recreated automatically">
          <P>
            Every add/edit/delete of a mount triggers a container recreate from
            the current image — no build. The application restarts briefly; env
            and domain are re-applied too.
          </P>
        </Step>
        <Step title="Verify">
          <P>
            The Deploy tab&apos;s container log shows the application restarting. To
            confirm the path is mounted, run a manual{" "}
            <DocLink href="/en/docs/jobs">job</DocLink>{" "}
            <Code>ls -la /app/uploads</Code> with target <em>In the container</em>.
          </P>
        </Step>
      </Steps>

      <H2 id="database">Mounts for managed databases</H2>
      <P>
        The database page also has a <strong>Mount</strong> tab with the same
        three kinds — usually for engine config files or an extra volume:
      </P>
      <Table
        head={["Engine", "Example container path", "For what"]}
        rows={[
          ["PostgreSQL", <Code key="p">/etc/postgresql/postgresql.conf</Code>, "Tuning (shared_buffers, etc.) — adjust the image's command/entrypoint if it needs to point at that file."],
          ["MySQL / MariaDB", <Code key="m">/etc/mysql/conf.d/custom.cnf</Code>, "The conf.d folder is read automatically by the official image."],
          ["Redis", <Code key="r">/usr/local/etc/redis/redis.conf</Code>, "Custom configuration."],
        ]}
      />
      <Ul>
        <li>
          Any mount change <strong>reprovisions</strong> the database container
          (a brief restart; data stays in its volume).
        </li>
        <li>The same role rule applies: bind mounts are owner/admin only.</li>
        <li>Volume backup is only for application mounts; a database&apos;s own data volume is already covered by database backup.</li>
      </Ul>

      <H2 id="file">File mounts</H2>
      <P>
        File contents are written directly in the Mount tab (a textarea), then{" "}
        <strong>Save &amp; apply</strong> — handy for config that changes often
        without a repo commit.
      </P>
      <Pre title="Example: /etc/nginx/conf.d/app.conf">{`server {
  listen 80;
  location / { proxy_pass http://127.0.0.1:3000; }
}`}</Pre>
      <Ul>
        <li>
          Under the hood, all of an application&apos;s files are written to one
          dedicated volume
          (<Code>{"aoox_app_<app>_files"}</Code>) and then bind-mounted per path
          as read-only.
        </li>
        <li>
          An application that needs to <em>write</em> to that file must use a
          volume instead of a file mount.
        </li>
      </Ul>

      <H2 id="hapus">Deleting a mount</H2>
      <Table
        head={["Kind", "What happens"]}
        rows={[
          ["Volume", "You're asked whether to delete the volume too (purge). Without purge, the data stays in Docker and can be reattached under the same name."],
          ["Bind", "Only detaches the mount; the folder on the host is untouched."],
          ["File", "The mount is detached and its content is deleted from aoox."],
        ]}
      />

      <H2 id="perilaku">Behavior & limitations</H2>
      <Ul>
        <li>
          <strong>PR previews get no mounts</strong> — don&apos;t share a production
          volume with an arbitrary branch.
        </li>
        <li>
          During <DocLink href="/en/docs/deploy#blue-green">blue/green</DocLink>,
          the two temporary containers share the same volume. Applications that
          lock files (SQLite without WAL) are better off with a host port so
          plain replace is used instead.
        </li>
        <li>
          A job with target <em>Separate container</em> inherits all of the
          application&apos;s mounts — good for migrations or data cleanup.
        </li>
        <li>
          Bind mounts are restricted to owner/admin since they&apos;re equivalent to
          host filesystem access.
        </li>
      </Ul>

      <H3>Volume backup</H3>
      <P>
        The <strong>Volume backup</strong> section on the Mount tab: manual
        backups, a cron schedule, retention, and an S3 destination per
        application. Restore = stop the container → empty the volume → extract
        → start. Details in{" "}
        <DocLink href="/en/docs/backup#volume">Backup &amp; restore</DocLink>.
      </P>

      <Callout kind="warn" title="Not available yet">
        Mounts for compose stacks (configured in the compose file) and
        previews; bind mount backups. Volume backup now also works for
        applications on a remote server.
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
