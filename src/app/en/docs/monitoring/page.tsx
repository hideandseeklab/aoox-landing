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
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Monitoring" }

const SUMMARY = [
  { k: "Host", v: "CPU, RAM, storage — every 2 seconds, 5-minute window" },
  { k: "Container", v: "CPU, memory, network — 1h live, 24h/7d/30d stored" },
  { k: "Limits", v: "CPU millicores & memory MiB per app/database" },
]

const SOURCES = [
  { s: "Dashboard", d: "Live host CPU/RAM/Storage + Host & Docker disk cards (owner/admin)" },
  { s: "Application → Deploy", d: "CPU / memory / network KPIs + sparkline" },
  { s: "Database", d: "The same KPIs above the panel" },
  { s: "Settings → Docker disk", d: "Image/volume/container/cache breakdown + cleanup" },
]

const NEXT = [
  { title: "Notifications", description: "Container down, deploy, backup, job.", href: "/en/docs/notifikasi" },
  { title: "Registry", description: "Disk maintenance & deployment retention.", href: "/en/docs/registry#pemeliharaan" },
  { title: "Deploy & rollback", description: "The health check that drops unhealthy containers.", href: "/en/docs/deploy#health-check" },
  { title: "Installation", description: "STORAGE_PATH and other monitoring env vars.", href: "/en/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/monitoring"
      title="Monitoring"
      lang="en"
      description="Live host metrics, per-container metrics for applications/databases, disk usage, and resource limits."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="di-mana">Where to find it</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {SOURCES.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>

      <H2 id="host">Dashboard: live host</H2>
      <P>
        For owner/admin, the Dashboard shows three charts of the last 5
        minutes (sampled every 2 seconds, polled only while the tab is
        visible):
      </P>
      <Table
        head={["Chart", "Source", "Notes"]}
        rows={[
          ["Host CPU", <>Idle/total delta from <Code>os.cpus()</Code> — all cores</>, "The caption also shows the share used by aoox containers (divided by core count)."],
          ["Host RAM", <><Code>totalmem − freemem</Code></>, "Includes OS cache — a higher number than htop is expected."],
          ["Host storage", <><Code>statfs(STORAGE_PATH)</Code>, default <Code>/</Code></>, <>In Docker this is the host disk behind <Code>/var/lib/docker</Code>. Set <Code>STORAGE_PATH</Code> if Docker&apos;s data lives on another partition. <em>Filesystem unreadable</em> means the path doesn&apos;t exist in the container.</>],
        ]}
      />
      <P>
        Inside a Docker container, <Code>/proc/stat</Code> and{" "}
        <Code>/proc/meminfo</Code> belong to the host, so the numbers reflect
        the host with no extra Docker call per tick. History is 150 points
        kept in the API&apos;s memory (lost on restart).
      </P>
      <H3>Host & Docker disk cards</H3>
      <Ul>
        <li>
          <strong>Host</strong>: Docker version, running/total containers, and
          the CPU and memory used by aoox containers (from{" "}
          <Code>docker info</Code> + the sampler).
        </li>
        <li>
          <strong>Docker disk</strong>: a stacked meter for image / volume /
          container / build cache (from <Code>docker system df</Code>) — not
          the whole host filesystem; see the Storage chart for that.
        </li>
        <li>
          Project summary: how many projects have something{" "}
          <em>running</em> (an application, database, or stack).
        </li>
      </Ul>

      <H2 id="container">Per-container metrics</H2>
      <P>
        An application&apos;s Deploy tab and database pages have a{" "}
        <strong>CPU / Memory / Network</strong> KPI row with a sparkline:
        sampled every <strong>15 seconds</strong>. The range picker above the
        chart decides where the data comes from:
      </P>
      <Table
        head={["Range", "Source", "Resolution"]}
        rows={[
          [<Code key="1">1h</Code>, "Live samples in the API's memory (240 points)", "15 seconds"],
          [<Code key="2">24h</Code>, "Rollup stored in the database", "1 minute"],
          [<><Code>7d</Code> / <Code>30d</Code></>, "Rollup stored in the database", "1 hour"],
        ]}
      />
      <Ul>
        <li>
          15-second samples are rolled up into one row per minute per
          application/database (swarm tasks are summed), then averaged into
          hourly rows.
        </li>
        <li>
          Minute rows are pruned after <strong>48 hours</strong>; hourly rows
          after <Code>METRICS_RETENTION_DAYS</Code> days (default{" "}
          <strong>30</strong>).
        </li>
        <li>
          Because it&apos;s stored in the database, history{" "}
          <strong>survives an API restart</strong> — only the last 1-hour
          window is live.
        </li>
      </Ul>
      <Table
        head={["Metric", "Formula", "Notes"]}
        rows={[
          ["CPU %", <>Δcpu_total / Δsystem × online_cpus × 100 — same as <Code>docker stats</Code></>, "Two stats calls one second apart per sample, since non-stream mode doesn't populate precpu."],
          ["Memory", <>usage − inactive_file (cgroup v2) / − cache (v1)</>, <>100% = the container limit if set, otherwise host RAM (<Code>memoryLimitBytes</Code>).</>],
          ["Network", "Cumulative rx/tx bytes across all interfaces", "Shown as a rate between samples."],
        ]}
      />
      <Ul>
        <li>
          <Code>current: null</Code> when the container is stopped or has no
          sample yet (just started &lt; 15 seconds ago).
        </li>
        <li>Per-container disk I/O isn&apos;t available on Docker Desktop, so it isn&apos;t shown.</li>
        <li>
          Containers labeled as an aoox component (app, database) are sampled
          via one stream; compose stack containers via a second stream
          identified by the compose project name (<Code>aoox-&lt;slug&gt;</Code>)
          — jobs and build helpers are still never sampled.
        </li>
        <li>Applications on a <strong>remote server aren&apos;t sampled</strong> — the sampler only reads the aoox host&apos;s daemon.</li>
        <li>
          For applications in <em>service</em> mode, the metric is the sum of
          tasks running on the host — see{" "}
          <DocLink href="/en/docs/swarm#service">Docker Swarm</DocLink>.
        </li>
      </Ul>

      <H2 id="limit">Resource limits</H2>
      <P>
        Applications (Settings) and databases (the{" "}
        <strong>Resource limits</strong> card) have a{" "}
        <strong>CPU (millicores)</strong> and <strong>Memory (MiB)</strong>{" "}
        field. 1000 millicores = 1 core; empty = unlimited.
      </P>
      <Pre title="Example">{`CPU 500    → max half a core (NanoCpus 0.5e9)
Memory 512 → hard limit of 512 MiB, no swap (MemorySwap = Memory)`}</Pre>
      <Table
        head={["Action", "Effect"]}
        rows={[
          ["Setting / changing a value", <>Applied straight to the running container (<Code>docker update</Code>), no restart.</>],
          ["Clearing it", "The container is recreated — Docker can't remove a limit through update. Applications: recreated from the current image; databases: reprovisioned (data on the volume is safe)."],
        ]}
      />
      <Ul>
        <li>
          A container that exceeds its memory limit gets{" "}
          <strong>OOM-killed</strong> by the kernel → restarted by Docker →
          a container-down notification if it keeps happening. Check the
          memory sparkline before lowering a limit.
        </li>
        <li>PR previews and <em>separate container</em> jobs inherit their application&apos;s limit.</li>
        <li>
          Compose stacks: set <Code>deploy.resources</Code> in the compose
          file.
        </li>
      </Ul>

      <H2 id="container-mati">Detecting a dead container</H2>
      <P>
        The API keeps a <Code>docker events</Code> stream (<Code>die</Code>)
        for aoox-labeled containers, plus a second stream for compose stack
        containers (identified by the project name). After a 5-second grace
        period it decides:
      </P>
      <Table
        head={["Condition", "Decision"]}
        rows={[
          ["The container is already gone (replaced by a deploy / deleted)", "Ignored"],
          ["The application/database status is stopped (an intentional stop)", "Ignored"],
          ["Running again with exit code 0 (a clean restart)", "Ignored"],
          ["Anything else (crash, OOM, exit ≠ 0)", <>Send a <Code>containerDown</Code> notification, max once per container every 10 minutes</>],
        ]}
      />
      <P>
        Enable it in <DocLink href="/en/docs/notifikasi">Notifications</DocLink>{" "}
        → the <strong>Container down</strong> toggle. Local host only.
      </P>

      <H2 id="disk">Low disk warning</H2>
      <P>
        Once a day (at <Code>07:00</Code> API time) aoox measures usage on
        the filesystem where Docker&apos;s data lives. Past a threshold — default{" "}
        <strong>90%</strong>, change it with{" "}
        <Code>DISK_ALERT_PERCENT</Code> — a <Code>diskLow</Code> event is sent
        to any channel with the toggle enabled, at most once a day while it
        stays above the threshold.
      </P>
      <P>
        The usual follow-up is <strong>Clean up now</strong> on the Docker
        disk card, lowering deployment retention, or pruning old backups —
        see <DocLink href="/en/docs/registry#pemeliharaan">Registry</DocLink>.
      </P>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Host storage: Filesystem unreadable", <><Code>STORAGE_PATH</Code> points to a path that doesn&apos;t exist in the API container. Leave it blank (default /) or mount that path.</>],
          ["Host CPU 100% while htop looks low", "The 2-second sample is sensitive to bursts; look at the trend, not one point."],
          ["Container metrics empty", "The container just started (< 15 seconds), is stopped, or isn't an app/database container (compose isn't sampled)."],
          ["Memory at 100% after setting a limit", "The application genuinely needs more; raise the limit or check for a leak. 100% means the limit, not host RAM."],
          ["1h history gone after a restart", "The 1h range is live in memory by design; 24h and up are read from the database and persist."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Metrics for applications on a remote server; alerts based on CPU/RAM
        thresholds; export to Prometheus; per-container disk I/O.
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
