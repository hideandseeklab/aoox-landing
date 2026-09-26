import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocPage,
  H2,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Scheduled jobs" }

const SUMMARY = [
  { k: "Scope", v: "Applications, databases, compose stacks" },
  { k: "Target", v: "In the container · Separate container" },
  { k: "History", v: "Last 50 runs, 64 KB output" },
]

const DECISION = [
  { q: "Need state from the running process (in-memory cache, a signal)?", a: "In the container" },
  { q: "Heavy, long-running, or must not disturb the main process (migration, batch)?", a: "Separate container" },
  { q: "Application is stopped but the job still needs to run?", a: "Separate container" },
]

const RECIPES = [
  { name: "DB migration after deploy", cron: "(manual)", cmd: "npm run migrate", target: "Separate container" },
  { name: "Clean up temp files", cron: "0 3 * * *", cmd: "find /app/tmp -mtime +7 -delete", target: "In the container" },
  { name: "Daily report", cron: "0 7 * * 1-5", cmd: "node scripts/report.js", target: "Separate container" },
  { name: "Warm cache every 15 minutes", cron: "*/15 * * * *", cmd: "curl -fsS http://127.0.0.1:3000/warm", target: "In the container" },
]

const NEXT = [
  { title: "Notifications", description: "Job failure/timeout alerts to a channel of your choice.", href: "/en/docs/notifikasi" },
  { title: "Environment variables", description: "The env a job inherits.", href: "/en/docs/environment" },
  { title: "Mounts", description: "Volumes a job can access.", href: "/en/docs/mount" },
  { title: "Backup & restore", description: "Use the built-in backup features instead of a job.", href: "/en/docs/backup" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/jobs"
      title="Scheduled jobs"
      lang="en"
      description="Run scheduled (cron) or manual commands in the context of an application, managed database, or compose stack — migrations, cleanup, reports."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="pemilik">Three kinds of job owner</H2>
      <Table
        head={["Owner", "Where", "In the container", "Separate container"]}
        rows={[
          ["Application", "Application's Jobs tab", "exec in the application container", "Current application image + application env & mounts"],
          [
            "Managed database",
            "Database's Jobs tab",
            "exec in the database container",
            <>The engine image (psql/mysql/redis-cli available) with env <Code>DB_HOST DB_PORT DB_USER DB_PASSWORD DB_NAME</Code> — same as the backup recipes</>,
          ],
          [
            "Compose stack",
            "Stack's Jobs tab",
            <>exec in the chosen <strong>service</strong> container</>,
            "That service's image & env",
          ],
        ]}
      />
      <Pre title="Example database job (Separate container, PostgreSQL)">{`psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "VACUUM ANALYZE"`}</Pre>

      <H2 id="target">Two execution targets</H2>
      <Table
        head={["Target", "How it runs", "Consequences"]}
        rows={[
          [
            <strong key="c">In the container</strong>,
            <>
              <Code>docker exec</Code> in the running application container.
            </>,
            "Shares CPU/RAM with the application. Fails if the application is stopped.",
          ],
          [
            <strong key="r">Separate container</strong>,
            "A one-shot container from the current image with the same env, mounts, and resource limits; removed once it's done.",
            "Isolated. Not visible to monitoring/container-down notifications.",
          ],
        ]}
      />
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

      <H2 id="langkah">Creating a job</H2>
      <Steps>
        <Step title="Open the Jobs tab → New job">
          <Table
            head={["Field", "Details"]}
            rows={[
              ["Name", "The job's label."],
              [
                "Schedule (cron)",
                <>
                  5 fields, e.g. <Code>0 3 * * *</Code>. Leave empty for a
                  manual-only job. Validated on save (400 if invalid).
                </>,
              ],
              [
                "Command",
                <>
                  Run through <Code>sh -c</Code> — pipes, <Code>&amp;&amp;</Code>,
                  and quotes are all fine.
                </>,
              ],
              ["Target", "In the container / Separate container."],
              ["Timeout (seconds)", "Default 600. Enforced inside the container."],
            ]}
          />
        </Step>
        <Step title="Run it manually to try it out">
          <P>
            Click <strong>Run</strong>. Run history appears when the job row is
            expanded: status, exit code, duration, and output. The page
            refreshes every 2 seconds while a run is in progress.
          </P>
        </Step>
        <Step title="Turn on the schedule">
          <P>
            Toggle <strong>active</strong> on the job row. The schedule is
            registered immediately, no API restart needed; the timezone follows
            the API container (UTC in the distribution image).
          </P>
        </Step>
      </Steps>

      <H2 id="contoh">Example jobs</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Job</th>
              <th className="px-3 py-2 text-left font-medium">Cron</th>
              <th className="px-3 py-2 text-left font-medium">Command</th>
              <th className="px-3 py-2 text-left font-medium">Target</th>
            </tr>
          </thead>
          <tbody>
            {RECIPES.map((r) => (
              <tr key={r.name} className="border-t border-border align-top">
                <td className="px-3 py-2 text-foreground">{r.name}</td>
                <td className="px-3 py-2"><Code>{r.cron}</Code></td>
                <td className="px-3 py-2"><Code>{r.cmd}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{r.target}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pre title="5-field cron">{`┌─ minute (0-59)
│ ┌─ hour (0-23)
│ │ ┌─ day of month (1-31)
│ │ │ ┌─ month (1-12)
│ │ │ │ ┌─ day of week (0-6, 0 = Sunday)
* * * * *

*/15 * * * *   every 15 minutes
0 3 * * *      every day at 03:00
0 0 * * 0      every Sunday at 00:00`}</Pre>

      <H2 id="perilaku">Behavior</H2>
      <Ul>
        <li>
          A cron tick is <strong>skipped</strong> (not queued) while the
          previous run is still going. Running manually while a run is active →
          409.
        </li>
        <li>
          Run status: <Code>success</Code> (exit 0) / <Code>failed</Code> (exit
          ≠ 0) / <Code>timeout</Code>. A failure or timeout sends a{" "}
          <Code>jobFailure</Code> notification if enabled.
        </li>
        <li>
          Stdout+stderr output is kept up to 64 KB per run; the last 50 runs per
          job. The UI shows the last 20.
        </li>
        <li>
          A new deploy doesn&apos;t stop a run in progress in a{" "}
          <em>Separate container</em>; a run <em>In the container</em> dies
          along with the old container.
        </li>
        <li>
          For applications in <em>service</em> mode (Swarm), target{" "}
          <em>In the container</em> execs into a task that exists{" "}
          <strong>on the host</strong> — the Engine API can&apos;t exec into a task
          on another node.
        </li>
      </Ul>

      <H2 id="timeout">How timeouts work</H2>
      <P>
        The timeout is enforced <strong>inside</strong> the container via the{" "}
        <Code>timeout</Code> command (if present in the image), because an exec
        can&apos;t be killed from the outside. The API only gives up waiting after{" "}
        <Code>timeout + 30 seconds</Code>.
      </P>
      <Callout kind="warn">
        An image without <Code>timeout</Code> (e.g. distroless) can&apos;t bound the
        duration: a run is only marked <Code>timeout</Code> once the API stops
        waiting, while the command may still be running. Include coreutils or
        busybox in the image if a job might run long.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Run fails: container not running", "Target is In the container but the application is stopped. Use Separate container, or start the application."],
          ["command not found", "The image doesn't have that binary (e.g. curl on minimal alpine). Use wget, or add it to the Dockerfile."],
          ["Schedule doesn't run at the expected time", "The API's timezone is UTC. Offset the hour in the cron expression accordingly."],
          ["Job stays failed even though the command succeeded", <>The last exit code was ≠ 0 — e.g. <Code>grep</Code> with no matches. End with <Code>|| true</Code> if that&apos;s actually fine.</>],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Streaming output while a run is in progress; history beyond 20 in the UI.
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
