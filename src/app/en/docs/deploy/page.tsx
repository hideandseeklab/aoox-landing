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
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Deploy & rollback" }

const SUMMARY = [
  { k: "Triggers", v: "Deploy button, push webhook, auto-update, Rollback" },
  { k: "Runs on", v: "The host's Docker daemon (or a remote server)" },
  { k: "Guarantee", v: "A failed build never touches the running container" },
]

const STATUSES = [
  { s: "queued", d: "deployment created" },
  { s: "building", d: "clone + build image" },
  { s: "pushing", d: "push to registry" },
  { s: "starting", d: "new container, wait for healthy" },
  { s: "success", d: "old container replaced", final: true },
]

const BLUE_GREEN = [
  { t: "0 s", old: "serving", next: "—", note: "Deploy starts; the new image is already in the registry." },
  { t: "+1 s", old: "serving", next: "starting", note: "The <app>-next container is created with the same Traefik labels." },
  { t: "+3–90 s", old: "serving", next: "healthy", note: "Traefik starts routing to both once -next is healthy." },
  { t: "+3 s", old: "removed", next: "serving", note: "Wait for the proxy to settle, then remove the old one." },
  { t: "done", old: "—", next: "→ <app>", note: "-next is renamed to the original name. Deployment succeeds." },
]

const NEXT = [
  { title: "Webhook auto-deploy", description: "Deploy on every push without pressing a button.", href: "/en/docs/webhook" },
  { title: "Pull request previews", description: "A temporary container per PR.", href: "/en/docs/preview" },
  { title: "Notifications", description: "Deploy success/failure alerts to Telegram, Slack, and more.", href: "/en/docs/notifikasi" },
  { title: "Monitoring", description: "Container CPU/RAM metrics after a deploy.", href: "/en/docs/monitoring" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/deploy"
      title="Deploy & rollback"
      lang="en"
      description="What happens when you press Deploy, how to read the logs, health checks and blue/green, and rolling back to a previous version."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">Life of a deployment</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-5">
        {STATUSES.map((item, i) => (
          <li key={item.s} className="relative flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span
              className={cn(
                "font-medium",
                item.final ? "text-primary-foreground dark:text-primary" : "text-foreground"
              )}
            >
              {item.s}
            </span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Any stage can end in <Code>failed</Code>; a deployment always ends up as{" "}
        <Code>success</Code> or <Code>failed</Code>, never stuck in between. Logs
        for every stage stream to the Deploy tab in realtime.
      </P>
      <Ul>
        <li>
          A deploy is rejected (409) while another deployment for the same
          application is still active. A webhook arriving in the meantime gets{" "}
          <Code>busy</Code> back and is not queued.
        </li>
        <li>
          Failing during <Code>building</Code> or <Code>pushing</Code>{" "}
          <strong>never touches</strong> the currently running container, and
          doesn&apos;t change the application&apos;s status.
        </li>
        <li>
          On a remote server the <Code>pushing</Code> stage is skipped — the
          image stays on that server&apos;s daemon.
        </li>
      </Ul>

      <H2 id="mode">Deploy mode: container or service</H2>
      <Table
        head={["", "container (default)", "service (Swarm)"]}
        rows={[
          ["What gets created", "A single container on the app's host/server", "A service with N replicas, tasks spread by the scheduler"],
          ["Version changes", "Blue/green or replace", "Rolling update by the daemon (parallelism, delay, order)"],
          ["Failure", "The old container keeps serving", "Automatic rollback to the previous spec after a timeout"],
          ["Stop / Start", "Container is stopped/started", "Scaled to 0 and back to the replica count"],
          ["Metrics", "That container", "Sum of local tasks only"],
        ]}
      />
      <P>
        Service mode needs <DocLink href="/en/docs/swarm">Docker Swarm</DocLink>{" "}
        active. Changing mode, replica count, placement, or resource limits runs
        as a <Code>config</Code> deployment — no build, and the same deployment
        queue still applies.
      </P>

      <H2 id="auto-update">Auto-update (image-based applications)</H2>
      <P>
        Applications whose source is an <strong>image</strong> (not a Git repo)
        can update themselves: a watcher compares the used tag&apos;s manifest
        digest via the registry API every <strong>60 minutes</strong> (configurable
        per application), and creates an <Code>auto-update</Code> deployment as
        soon as the digest changes.
      </P>
      <Ul>
        <li>
          The baseline comes from the digest recorded at the last pull — not
          from the tag, so even <Code>latest</Code> is detected.
        </li>
        <li>
          Supports Docker Hub/GHCR (token flow) and your own registry (basic
          auth via external registry credentials).
        </li>
        <li>
          The <strong>check now</strong> button on the application page forces a
          check without waiting for the interval.
        </li>
      </Ul>

      <H2 id="log">Realtime logs</H2>
      <Table
        head={["Log", "Contents", "Source"]}
        rows={[
          ["Deployment log", "Clone, build, push, and start output for one deployment. Kept permanently in history.", "Runner → Socket.IO /logs"],
          ["Container log", "stdout/stderr of the running application (follow).", "docker logs --follow"],
        ]}
      />
      <P>
        Resolved Git tokens and database passwords are automatically redacted
        from both logs and from error messages. Every container aoox creates
        uses <strong>log rotation</strong> (json-file with a size and file-count
        limit), so container logs never fill up the disk.
      </P>

      <H2 id="health-check">Health check</H2>
      <P>
        Set a <strong>Health check path</strong> (e.g. <Code>/health</Code>) in
        Settings. The container is created with a Docker <Code>HEALTHCHECK</Code>{" "}
        that calls <Code>{"127.0.0.1:<container port><path>"}</Code> every 3
        seconds, up to 30 times (± 90 seconds).
      </P>
      <Pre title="A sufficient endpoint">{`GET /health → 200 OK
# no body needed; a fast 2xx status is all that matters`}</Pre>
      <Callout kind="warn" title="Prerequisite in the image">
        The health check command tries <Code>wget</Code> → <Code>curl</Code> →{" "}
        <Code>node -e fetch</Code> → <Code>python3</Code>. An image with none of
        these (e.g. <Code>scratch</Code>, distroless) makes the deployment fail
        with a message naming it. A container that later becomes{" "}
        <Code>unhealthy</Code> is automatically dropped by Traefik (404).
      </Callout>

      <H2 id="blue-green">Blue/green</H2>
      <P>
        Kicks in automatically when an application has a <strong>domain</strong>,{" "}
        <strong>no host port</strong>, and isn&apos;t a preview. The goal: no request
        ever fails during a version switch.
      </P>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Time</th>
              <th className="px-3 py-2 text-left font-medium">Old container</th>
              <th className="px-3 py-2 text-left font-medium">-next container</th>
              <th className="px-3 py-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {BLUE_GREEN.map((row) => (
              <tr key={row.t} className="border-t border-border align-top">
                <td className="px-3 py-2 text-muted-foreground">{row.t}</td>
                <td className={cn("px-3 py-2", row.old === "serving" ? "text-primary-foreground dark:text-primary" : "text-muted-foreground")}>
                  {row.old}
                </td>
                <td className={cn("px-3 py-2", row.next === "serving" || row.next === "healthy" ? "text-primary-foreground dark:text-primary" : "text-muted-foreground")}>
                  {row.next}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Table
        head={["Condition", "Behavior"]}
        rows={[
          ["Domain, no host port, has a health check", <><strong>Blue/green</strong> as above.</>],
          ["Has a host port", "Plain replace — two containers can't bind the same port. The health check still decides success/failure."],
          ["No health check path", "Plain replace; the deployment succeeds as soon as the container starts."],
          ["Failure/timeout during blue/green", "-next is removed, the old container keeps serving, the deployment is failed."],
        ]}
      />
      <Callout>
        Both temporary containers share the same volume. Applications that lock
        files (e.g. SQLite without WAL) are better off with a host port or no
        health check, so plain replace is used instead.
      </Callout>

      <H2 id="rollback">Rollback</H2>
      <Steps>
        <Step title="Pick a deployment with status success">
          <P>In the deployment list (Deploy tab), click <strong>Rollback</strong> on the target version.</P>
        </Step>
        <Step title="A new rollback-type deployment is created">
          <P>
            No build/push — the old image is pulled from the registry (or
            whatever&apos;s still on the remote server) and the container is
            replaced through the same path: health check, blue/green.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          Rollback uses the old <strong>image</strong> but the{" "}
          <strong>current env</strong> — handy for fixing a bad env without
          rebuilding.
        </li>
        <li>
          An image tag already deleted from the{" "}
          <DocLink href="/en/docs/registry">Registry</DocLink> can&apos;t be a
          rollback target.
        </li>
      </Ul>

      <H2 id="stop-start">Stop & start</H2>
      <P>
        The <strong>Stop</strong>/<strong>Start</strong> buttons on the Deploy
        tab stop/run the container without rebuilding. Container-down
        notifications aren&apos;t sent for an intentional stop.
      </P>

      <H2 id="perubahan">What change triggers what</H2>
      <Table
        head={["What changed", "Effect", "Needs"]}
        rows={[
          ["Code in the repo", "New image", "Deploy (or push + webhook)"],
          ["Image tag changes (image source)", "Pull a new image", "Automatic if auto-update is on"],
          ["Build args, Dockerfile path, build method", "New image", "Deploy"],
          ["Environment variables", "Applied when the container is created", "Deploy or Rollback"],
          ["Domain, mount, resource limit (removed)", "Container recreated from the current image", "Automatic, no build"],
          ["Deploy mode, replicas, placement", "Service updated (rolling)", "Config deployment, automatic"],
          ["Resource limit (changed value)", "Applied immediately", "Nothing"],
        ]}
      />

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
