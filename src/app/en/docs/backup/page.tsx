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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Backup & restore" }

const SUMMARY = [
  { k: "What", v: "Databases, application volumes, and the panel itself" },
  { k: "When", v: "Manual, or a cron schedule with retention" },
  { k: "Where", v: "The aoox_backups volume + optional S3" },
]

const FLOW = [
  { s: "dump", d: "a one-off container from the engine image, credentials via env" },
  { s: "store", d: "a file on the aoox_backups volume" },
  { s: "upload", d: "rclone to S3 if a destination is set" },
  { s: "prune", d: "the oldest scheduled backup past retention is removed (local + S3)" },
]

const PRESETS = [
  { label: "Off", cron: "—" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Daily at 02:00", cron: "0 2 * * *" },
  { label: "Weekly (Sunday 03:00)", cron: "0 3 * * 0" },
  { label: "Custom", cron: "5-field cron, e.g. 30 1 * * *" },
]

const NEXT = [
  { title: "Managed database", description: "The database being backed up.", href: "/en/docs/database" },
  { title: "Mounts", description: "Application volumes that can be backed up.", href: "/en/docs/mount" },
  { title: "Notifications", description: "Get notified when a backup fails.", href: "/en/docs/notifikasi" },
  { title: "Templates", description: "MinIO from the catalog as a local S3 destination.", href: "/en/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/backup"
      title="Backup & restore"
      lang="en"
      description="Back up managed databases and application volumes: manual or scheduled, automatic retention, S3 copies, and restore."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">One backup&apos;s flow</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Files never pass through the API process — dump, upload, and restore
        are all done by one-off containers. <strong>Manual backups are never
        pruned</strong> by retention; only scheduled ones are.
      </P>

      <H2 id="database">Database backups</H2>
      <P>
        Database page → <strong>Backup</strong> tab.
      </P>
      <Table
        head={["Engine", "How it dumps", "Restore"]}
        rows={[
          ["PostgreSQL", <><Code>pg_dump | gzip</Code> (or <Code>pg_dumpall</Code> for all databases)</>, "Online — streamed into psql, no downtime."],
          ["MySQL / MariaDB", <><Code>mysqldump</Code> / <Code>mariadb-dump</Code> as root</>, "Online — streamed into mysql."],
          ["Redis", <><Code>redis-cli --rdb</Code></>, "Offline — the container is stopped, the snapshot is mounted as the base AOF, then it's started again."],
        ]}
      />

      <H3>Manual backup</H3>
      <P>
        Click <strong>Backup</strong>. A new row appears with its status,
        size, time, trigger (manual/scheduled), an <em>S3</em> badge if
        copied over (or <em>S3 only</em> if the local file is already gone),
        and download / restore / delete buttons.
      </P>

      <H3>Schedule & destination</H3>
      <Steps>
        <Step title="The Backup schedule & destination form">
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Frequency</th>
                  <th className="px-3 py-2 text-left font-medium">Cron</th>
                </tr>
              </thead>
              <tbody>
                {PRESETS.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="px-3 py-2 text-foreground">{row.label}</td>
                    <td className="px-3 py-2"><Code>{row.cron}</Code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Ul>
            <li>
              <strong>Keep count</strong> — defaults to 7; the oldest
              scheduled backup beyond this count is removed after the next
              one runs.
            </li>
            <li>
              <strong>S3 destination</strong> — <em>Local only</em>, or one of
              the registered destinations (see below).
            </li>
            <li>
              <strong>All databases on the server</strong> — for
              PostgreSQL/MySQL/MariaDB with{" "}
              <DocLink href="/en/docs/database#database-tambahan">extra databases</DocLink>:
              the dump covers all of them (PostgreSQL uses{" "}
              <Code>pg_dumpall</Code>, including roles). The backup row is
              marked <em>all databases</em>.
            </li>
          </Ul>
        </Step>
        <Step title="Save">
          <P>The schedule is re-registered immediately, no API restart needed. Cron runs in UTC.</P>
        </Step>
      </Steps>

      <H3>Restore</H3>
      <Steps>
        <Step title="Click restore on a backup row → confirm">
          <P>
            If the local file is already gone (pruned by retention, a new
            disk) but an S3 copy still exists, the row is marked{" "}
            <em>S3 only</em> — restore and download still work: the file is
            pulled back from S3 automatically first. For applications on a
            remote server, that pull happens on that server&apos;s daemon.
          </P>
        </Step>
        <Step title="Wait for it to finish">
          <P>
            SQL: no downtime, but <Code>DROP/CREATE</Code> statements in the
            dump will replace table contents. Redis: the container stops
            briefly.
          </P>
        </Step>
      </Steps>

      <H2 id="volume">Application volume backups</H2>
      <P>
        Application page → <strong>Mount</strong> tab → the{" "}
        <strong>Volume backup</strong> section. Applies only to{" "}
        <strong>volume</strong>-type mounts (bind mounts aren&apos;t supported
        yet). If the application has more than one volume, pick it first.
      </P>
      <Table
        head={["Action", "What happens"]}
        rows={[
          ["Backup", <>A one-off busybox container, the volume mounted <Code>:ro</Code>, <Code>tar czf</Code> into <Code>{"<app>/<mount>/<stamp>.tar.gz"}</Code>. The application container keeps running.</>],
          ["Restore", <><strong>Stop the container</strong> → clear the volume → extract → start. There&apos;s brief downtime.</>],
          ["Schedule", "The Volume backup schedule form: frequency, keep count, S3 destination — applies to all of an application's volumes; pruning is per volume."],
        ]}
      />
      <Ul>
        <li>
          Also works for applications on a <strong>remote server</strong> —
          backup, S3 upload/download, and restore run on that server&apos;s
          daemon.
        </li>
        <li>Backing up while the app is writing can capture a half-written file — schedule it during quiet hours.</li>
      </Ul>

      <H2 id="instance">Instance backup (the panel itself)</H2>
      <P>
        <strong>Settings → Instance backup</strong> (owner) saves aoox&apos;s own
        internal database: users, projects, applications, databases,
        schedules, encrypted credentials — all as a single gzipped JSON file
        on the backup volume, without <Code>pg_dump</Code>.
      </P>
      <Table
        head={["Action", "Detail"]}
        rows={[
          ["Backup now", "Creates a snapshot immediately; it appears in the list with its size and time."],
          ["Schedule", <>A 5-field cron + an optional <strong>S3 destination</strong>, same as database backups.</>],
          ["Download", "Save the file off-server — this is what's used when reinstalling."],
          [
            "Restore from file",
            "Upload a backup file; every table is rewritten in a single transaction, then the scheduler and SSH sessions are rebuilt.",
          ],
        ]}
      />
      <Callout kind="warn" title="Things to watch out for when restoring">
        <Ul>
          <li>
            A file can only be restored to the <strong>same schema
            version</strong> — restoring to a much different aoox version is
            rejected.
          </li>
          <li>
            <Code>ENCRYPTION_KEY</Code> must match what it was when the
            backup was made; if it differs, stored credentials can&apos;t be read
            and aoox reports it.
          </li>
          <li>
            This restores the <em>panel</em>, not application data.
            Containers, volumes, and images remain the job of the
            database/volume backups.
          </li>
        </Ul>
      </Callout>
      <P>
        For moving to a new server: instance backup + database backup +
        volume backup, all with an S3 destination. A lighter alternative for
        moving just one project:{" "}
        <DocLink href="/en/docs/project#export">export/import project</DocLink>.
      </P>

      <H2 id="s3">S3 destinations</H2>
      <Steps>
        <Step title="Settings → Backup destinations (S3) → New backup destination (owner/admin)">
          <Table
            head={["Field", "Detail"]}
            rows={[
              ["Name", "A label."],
              ["Endpoint", <>Empty = AWS S3. Fill in for MinIO, Wasabi, R2, etc. — e.g. <Code>https://minio.example.com</Code>, or <Code>http://aoox-minio-…:9000</Code> for a MinIO running inside aoox (same network).</>],
              ["Region", <>Required for AWS (<Code>us-east-1</Code>); other providers usually don&apos;t care.</>],
              ["Bucket", "Must already exist — aoox doesn't create it."],
              ["Prefix", <>Optional, e.g. <Code>aoox/prod</Code>.</>],
              ["Access key ID / Secret access key", "The secret is shown only once and stored encrypted."],
              ["Path-style", "On by default (MinIO); turn off for virtual-host style (AWS, R2)."],
            ]}
          />
        </Step>
        <Step title="Test connection">
          <P>
            Runs <Code>rclone lsjson</Code> against the bucket via the{" "}
            <Code>rclone/rclone</Code> container; provider errors are shown
            as-is.
          </P>
        </Step>
        <Step title="Pick it in a database / volume backup schedule">
          <P>
            Every backup (manual or scheduled) that succeeds is uploaded to{" "}
            <Code>{"<prefix>/<slug>/<stamp>.<ext>"}</Code>. Deleting/pruning a
            backup also removes the remote object.
          </P>
        </Step>
      </Steps>
      <Callout>
        A failed upload leaves the backup as <Code>failed</Code> and triggers
        a notification — the local file is still there to download. The
        whole point of a destination is having a copy elsewhere, so failures
        aren&apos;t hidden.
      </Callout>

      <H2 id="strategi">Suggested strategies</H2>
      <Table
        head={["Need", "Settings"]}
        rows={[
          ["Small production", "Daily at 02:00, keep 7, S3 destination. Test a restore to a new database once a month."],
          ["Frequently changing data", "Every hour, keep 24–48, S3 destination."],
          ["Before a big migration/import", "A manual backup (never pruned) — name it in your team notes."],
          ["Moving servers / disaster recovery", "Instance + database + volume backups, all with an S3 destination; also keep a copy of .env.dist (JWT_SECRET & ENCRYPTION_KEY)."],
          ["Applications with uploads", "Daily volume backup + a database backup at the same time."],
        ]}
      />

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["A 20-byte / empty backup", "Already handled (the dump's exit status is propagated). If it happens, check the backup's error message — usually credentials or a database that wasn't ready."],
          ["S3 destination test fails: NoSuchBucket", "The bucket hasn't been created, or the region is wrong (AWS)."],
          ["Test fails against a local MinIO", "The endpoint is using localhost from inside the container. Use the container name + port 9000, or its public domain."],
          ["Redis restore: data doesn't change", "A Redis 7 backup is mounted as the base AOF; make sure the container was actually restarted (status back to running) and nothing wrote to it before the restore finished."],
          ["Backup volume is full", "Lower the keep count, delete old manual backups, or move to S3 and delete locally."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Separate retention for S3 objects; bind mount backups; backups for
        compose stacks &amp; the databases inside them; cross-schema-version
        instance restore.
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
