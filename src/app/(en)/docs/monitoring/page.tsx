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
  H3,
  P,
  Pre,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/monitoring",
  lang: "en",
  title: "Monitoring",
  description:
    "Host and container metrics, resource limits.",
})

const SUMMARY = [
  { k: "Host", v: "CPU, RAM, storage — every 2 seconds, 5-minute window" },
  { k: "Container", v: "CPU, memory, network — 1h live, 24h/7d/30d stored" },
  { k: "Limits", v: "CPU millicores & memory MiB per app/database" },
]

const SOURCES = [
  { s: "Dashboard", d: "Live host CPU/RAM/Storage + Host & Docker disk cards (owner/admin)" },
  { s: <>Application<PathArrow />Deploy</>, d: "CPU / memory / network KPIs + sparkline" },
  { s: "Database", d: "The same KPIs above the panel" },
  { s: <>Docker<PathArrow />disk strip</>, d: "Image/volume/container/cache breakdown + cleanup (Details)" },
]

const NEXT = [
  { title: "Notifications", description: "Container down, deploy, backup, job.", href: "/docs/notifications" },
  { title: "Registry", description: "Disk maintenance & deployment retention.", href: "/docs/registry#maintenance" },
  { title: "Deploy & rollback", description: "The health check that drops unhealthy containers.", href: "/docs/deploy#health-check" },
  { title: "Installation", description: "STORAGE_PATH and other monitoring env vars.", href: "/docs/installation" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/monitoring"
      title="Monitoring"
      lang="en"
      description="Live host metrics, per-container metrics for applications/databases, disk usage, and resource limits."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="where">Where to find it</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4 rounded-lg overflow-hidden">
        {SOURCES.map((item, i) => (
          <li key={i} className="flex flex-col gap-1 bg-background px-3 py-3">
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
        Below the charts is a <strong>Recent activity</strong> card (owner/admin
        only): the 10 latest <DocLink href="/docs/users-roles">audit log</DocLink>{" "}
        entries with the time, who did it, a readable action (e.g. &ldquo;Deploy
        application&rdquo;, &ldquo;Delete database&rdquo;), the status, and how
        it was done (session, API token, webhook). It refreshes every 30
        seconds while the tab is visible; <strong>View all</strong> opens the
        Audit log page. Request contents are not shown on this card.
      </P>
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
      <H3>The Docker page</H3>
      <P>
        <strong>Infrastructure<PathArrow />Docker</strong> (owner/admin) lists
        containers, images, volumes and networks on the host or on a remote
        server (pick the server above the tabs; the Docker item is in the Platform group of the sidebar). Anything aoox owns is badged
        and shown read-only: aoox containers (panel, proxy, registry,
        applications, databases, stacks) cannot be stopped or removed from
        here — use their own pages.
      </P>
      <Ul>
        <li>
          <strong>Containers</strong>: all of them, stopped ones included. For
          containers aoox does not own: logs (a one-time tail, up to 500
          lines), start, stop, restart, and remove (owner only, with a
          confirmation).
        </li>
        <li>
          <strong>Images</strong>: remove an image no container uses, or clean
          up dangling ones. Images in use are refused.
        </li>
        <li>
          <strong>Volumes</strong> and <strong>Networks</strong>: lists only,
          with size, users and a marker for aoox&apos;s orphaned volumes.
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
          <DocLink href="/docs/swarm#service">Docker Swarm</DocLink>.
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
          <strong>OOM-killed</strong> by the kernel<PathArrow />restarted by Docker<PathArrow />
          a container-down notification if it keeps happening. Check the
          memory sparkline before lowering a limit.
        </li>
        <li>PR previews and <em>separate container</em> jobs inherit their application&apos;s limit.</li>
        <li>
          Compose stacks: set <Code>deploy.resources</Code> in the compose
          file.
        </li>
      </Ul>

      <H2 id="container-down">Detecting a dead container</H2>
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
        Enable it in <DocLink href="/docs/notifications">Notifications</DocLink>{" "}
        <PathArrow />the <strong>Container down</strong> toggle. Applies to the
        local host and to applications on a{" "}
        <DocLink href="/docs/remote-servers#monitoring">remote server</DocLink>{" "}
        (the message names the server).
      </P>

      <H2 id="http">HTTP monitor (optional)</H2>
      <P>
        A running container isn&apos;t necessarily healthy: an application can
        return 5xx or hang without ever dying. Turn on an HTTP check per
        application on the <strong>Monitor</strong> tab (developers and up edit,
        viewers only read).
      </P>
      <Table
        head={["Setting", "Notes"]}
        rows={[
          ["Path", <>Default <Code key="1">/</Code>, e.g. <Code key="2">/health</Code>. The only thing you choose — it must start with a single <Code key="3">/</Code>, no spaces/control characters, no <Code key="4">..</Code>, at most 200 characters.</>],
          ["Interval", "1–60 minutes (default 5)."],
          ["Timeout", "5–30 seconds (default 10)."],
          ["Healthy status", <>Default <Code key="5">200-399</Code>; can be a list of codes/ranges, e.g. <Code key="6">200,204</Code>.</>],
          ["Consecutive failures", "How many failures in a row before an alert (default 2)."],
          ["Internal address", "Skip the public domain and check through the host port / container name."],
        ]}
      />
      <H3>What is checked, and from where</H3>
      <Ul>
        <li>
          <strong>You never type the host</strong>. The target is derived from
          the application itself: its first domain (the public URL through the
          proxy, so the proxy path is tested too); if there is none, its host
          port (<Code>host:port</Code>, the server&apos;s address for a remote
          server); if there is none either, the container&apos;s name on the{" "}
          <Code>aoox</Code> network (only when the API runs in that network, i.e.
          the distribution stack). The target in use is shown on the tab. That way
          the panel cannot be pointed at scanning an internal network or cloud
          metadata.
        </li>
        <li>
          Redirects are followed at most 3 times and only to the same host and
          port; a redirect anywhere else is not followed (its 3xx status is what
          is judged). The response body is read up to a small cap and dropped —
          it is never stored.
        </li>
        <li>
          The check runs <strong>from the panel machine</strong>: it does not
          prove the application is reachable from the wider internet, and with a
          public domain the result can be affected by hairpin NAT.
        </li>
      </Ul>
      <H3>When it checks, when it stays quiet</H3>
      <Ul>
        <li>
          Only <em>running</em> applications. A stopped application is not
          &quot;down&quot;: its monitor just goes back to &quot;not checked&quot;.
        </li>
        <li>
          No checks while a deploy runs and for 60 seconds after, and a streak of
          failures that spans a deploy starts over — so a deploy doesn&apos;t
          trigger an alert.
        </li>
        <li>
          The last status is stored in the database, so an API restart in the
          middle of an outage doesn&apos;t announce it again and doesn&apos;t send
          a false &quot;down&quot; for a healthy application.
        </li>
      </Ul>
      <H3>Notifications, uptime and history</H3>
      <P>
        Once the consecutive-failure count is reached, one{" "}
        <strong>HTTP monitor failing</strong> notification is sent (reminders at
        most every 6 hours while it stays down) and one recovery message with the
        downtime when it is healthy again — see{" "}
        <DocLink href="/docs/notifications">Notifications</DocLink>. The Monitor
        tab shows the status, 24-hour and 7-day uptime, average and p95 latency, a
        24-hour latency chart, and the latest down incidents. Results are kept for
        7 days; the response body is never stored. The monitor&apos;s settings
        travel with project export/import (without history).
      </P>

      <H2 id="alerts">Resource alerts (optional)</H2>
      <P>
        Get a notification when an application or database keeps using too much
        CPU or memory. Each has a <strong>Resource alerts</strong> card: on an
        application it sits under the HTTP monitor on the{" "}
        <strong>Monitor</strong> tab, on a database on the{" "}
        <strong>Overview</strong> tab. CPU and memory are separate rules.
      </P>
      <Table
        head={["Setting", "Notes"]}
        rows={[
          ["Active", "Off by default. The switch saves at once."],
          ["Above", "The threshold in percent. Default 90%. Memory is capped at 100%."],
          ["For", "How long the value must stay above the threshold. Default 5 minutes. The two selects need Save."],
        ]}
      />
      <Ul>
        <li><strong>CPU</strong> is the percent of <em>one</em> core, the same number the charts show, so it can go above 100 on several cores (it is not divided by the CPU limit).</li>
        <li><strong>Memory</strong> is the percent of the container&apos;s memory limit, or of the host&apos;s RAM when no limit is set (see <a href="#limit">Resource limits</a>).</li>
        <li>The check runs once a minute on the stored per-minute metrics, so it also covers applications on a <DocLink href="/docs/remote-servers">remote server</DocLink>. The alert arrives about a minute after the value has been above the threshold for the whole duration; one missing minute of data is tolerated, a gap is never treated as high.</li>
        <li>A rule alerts once, reminds every <strong>6 hours</strong> while the value stays high, and sends one <em>back to normal</em> message when it drops. Each rule shows a badge (normal / checking / alerting) and the last reading.</li>
        <li>Nothing is sent while the application or database is <strong>stopped</strong> or while the application is <strong>deploying</strong>, and readings from before the last finished deployment do not count. Changing a rule resets its state without a message.</li>
        <li>The state is stored, so restarting the API neither repeats an alert nor forgets a breach.</li>
        <li>Messages go to every channel with the <strong>CPU or memory alert</strong> toggle on (on by default) and to the notification bell — see <DocLink href="/docs/notifications#event">Notifications</DocLink>. Developers and up edit the rules; viewers see them read-only. The rules travel with project export/import.</li>
      </Ul>
      <Callout title="Not covered">
        Compose stacks have no resource alerts, and there is no alert for the
        disk usage of volumes.
      </Callout>

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
        The usual follow-up is <strong>Clean now</strong> in the disk strip at
        the top of the Docker page, lowering deployment retention, or pruning old backups —
        see <DocLink href="/docs/registry#maintenance">Registry</DocLink>.
      </P>

      <H2 id="pitfalls">Common pitfalls</H2>
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

      <H2 id="next-steps">Next steps</H2>
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
