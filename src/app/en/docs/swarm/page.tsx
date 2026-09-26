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

export const metadata: Metadata = { title: "Docker Swarm" }

const SUMMARY = [
  { k: "What for", v: "Several machines under one panel" },
  { k: "Shape", v: "Applications as a service + replicas" },
  { k: "Who", v: "Owner (init/leave/node), admin sees status" },
]

const FLOW = [
  { s: "init", d: "the host becomes a manager, the aoox-swarm overlay is created" },
  { s: "join", d: "other nodes join using a token from the panel" },
  { s: "service", d: "an application is switched to deploy mode service + replicas" },
  { s: "rolling", d: "the daemon replaces tasks gradually, rolling back on failure" },
]

const COMPARE = [
  {
    k: "Shape",
    server: "The panel controls another daemon over SSH",
    swarm: "One cluster; Docker's scheduler places tasks",
  },
  {
    k: "Application",
    server: "A single container on the chosen server",
    swarm: "N replicas that can be spread across several nodes",
  },
  {
    k: "Domain",
    server: "Proxy per server (or a host port)",
    swarm: "Traefik on the manager with the swarm provider",
  },
  {
    k: "Good for",
    server: "Separate environments, different regions",
    swarm: "Adding capacity for the same application",
  },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Container vs. service mode, rolling updates.", href: "/en/docs/deploy#mode" },
  { title: "Remote servers", description: "A multi-machine alternative without a cluster.", href: "/en/docs/server-remote" },
  { title: "Registry", description: "Other nodes must be able to pull the image.", href: "/en/docs/registry" },
  { title: "Monitoring", description: "Service and per-node task metrics.", href: "/en/docs/monitoring" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/swarm"
      title="Docker Swarm"
      lang="en"
      description="Run applications as a service with replicas across several machines, using the orchestrator already built into Docker — no Kubernetes."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Swarm or remote servers?</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium"></th>
              <th className="px-3 py-2 text-left font-medium">Remote server (SSH)</th>
              <th className="px-3 py-2 text-left font-medium">Swarm</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row) => (
              <tr key={row.k} className="border-t border-border align-top">
                <td className="px-3 py-2 text-foreground">{row.k}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.server}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.swarm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        You can use both at once: the aoox host becomes the swarm manager,
        while a <DocLink href="/en/docs/server-remote">remote server</DocLink>{" "}
        keeps serving other applications separately.
      </P>

      <H2 id="alur">Flow</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>

      <H2 id="aktifkan">Enabling swarm</H2>
      <Steps>
        <Step title="Settings → Docker Swarm → Init swarm (owner)">
          <P>
            Fill in <strong>Advertise address</strong> if the host has more
            than one IP — this is the address other nodes will use to reach
            the manager. Leave it blank for auto-detection.
          </P>
          <P>
            aoox turns the host daemon into a <strong>manager</strong>,
            creates an attachable overlay network called <Code>aoox-swarm</Code>,
            joins the proxy and managed databases to it, then enables
            Traefik&apos;s <em>swarm provider</em>.
          </P>
        </Step>
        <Step title="Join other nodes">
          <P>
            The Swarm card shows the full join command with its token — run it
            on the machine that will join (Docker already installed, ports{" "}
            <Code>2377</Code>, <Code>7946</Code>, and <Code>4789/udp</Code>{" "}
            open between nodes):
          </P>
          <Pre>{`docker swarm join --token SWMTKN-1-… <manager-ip>:2377`}</Pre>
          <P>
            Worker and manager tokens differ; the token is only shown to the
            owner. A joined node appears in the node list a few seconds
            later.
          </P>
        </Step>
        <Step title="Make sure the registry is reachable from other nodes">
          <P>
            Nodes pull images themselves from the local registry. Swarm
            status warns if <Code>REGISTRY_PUBLIC_HOST</Code> is still{" "}
            <Code>localhost</Code> — other nodes won&apos;t be able to pull from
            it. Set it to a reachable hostname/IP (with TLS or{" "}
            <Code>insecure-registries</Code>) — see{" "}
            <DocLink href="/en/docs/registry#lokal">Registry</DocLink>.
          </P>
        </Step>
      </Steps>

      <H2 id="node">Managing nodes</H2>
      <Table
        head={["Action", "Effect"]}
        rows={[
          ["Availability: active", "The node accepts new tasks."],
          ["Availability: pause", "Existing tasks keep running; no new tasks are accepted."],
          ["Availability: drain", "Tasks are moved to other nodes — use before maintenance."],
          ["Role: manager / worker", "Promote or demote a node. Keep the number of managers odd (1, 3, 5) for safe quorum."],
          ["Label", <>A <Code>key=value</Code> pair, e.g. <Code>zone=eu</Code> — used as a placement constraint.</>],
          ["Remove node", <>Rejected (409) if the node is still active; drain it first, then remove. On that node, run <Code>docker swarm leave</Code>.</>],
        ]}
      />

      <H2 id="service">Applications as a service</H2>
      <P>
        In the application&apos;s Settings, switch <strong>Deploy mode</strong>{" "}
        from <em>container</em> to <em>service</em>:
      </P>
      <Table
        head={["Field", "Notes"]}
        rows={[
          ["Replicas", "The number of tasks to run. Stop scales to 0; Start restores it."],
          [
            "Placement",
            <>
              A specific node, or a free-form constraint (<Code>node.labels.zone==eu</Code>,{" "}
              <Code>node.role==worker</Code>, <Code>node.hostname</Code>,{" "}
              <Code>node.platform.os</Code>).
            </>,
          ],
          [
            "Rolling update",
            <>
              Parallelism (how many tasks are replaced at once), the delay
              between batches, and the order (<Code>start-first</Code> /{" "}
              <Code>stop-first</Code>).
            </>,
          ],
        ]}
      />
      <Ul>
        <li>
          Changing the mode, replicas, placement, or limits runs as a{" "}
          <Code>config</Code> deployment — no build, and it doesn&apos;t block
          requests.
        </li>
        <li>
          The daemon handles the rolling update itself; if new tasks never
          come up within the time limit, the old spec is restored and the
          application keeps serving.
        </li>
        <li>
          An application with a <DocLink href="/en/docs/mount">mount</DocLink>{" "}
          is always placed on the host where its volume lives — Docker
          volumes don&apos;t move between nodes.
        </li>
        <li>
          Redeploying with an identical spec still triggers a rolling update
          (<Code>ForceUpdate</Code>), so the Deploy button always has an
          effect.
        </li>
      </Ul>

      <H3>What to know about tasks</H3>
      <Table
        head={["Aspect", "In service mode"]}
        rows={[
          ["Logs", "All tasks, from any node."],
          ["Metrics", <>Summed from tasks running <strong>on the host</strong> — the Engine API can&apos;t read tasks on other nodes.</>],
          ["Job & terminal exec", "Local tasks only."],
          ["Notifications", <>A watcher alerts when a service stays below its replica count (tasks that never start).</>],
          ["Domain", "Traefik's swarm provider routes to the service, not to a container."],
        ]}
      />

      <H2 id="keluar">Leaving swarm</H2>
      <Callout kind="warn">
        First switch every application back to <em>Deploy mode: container</em>{" "}
        — leaving swarm removes any running services. Then{" "}
        <strong>Settings → Docker Swarm → leave</strong> (owner). Other nodes
        need to run <Code>docker swarm leave</Code> themselves.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Task pending: no suitable node", <>The constraint doesn&apos;t match any node&apos;s labels, or the app has a mount that pins it to the host. Loosen the placement.</>],
          ["On another node: image pull failed / x509", <><Code>REGISTRY_PUBLIC_HOST</Code> is still localhost, the registry has no TLS, or the node lacks an <Code>insecure-registries</Code> entry.</>],
          ["Service never reaches its replica count", "A health check is failing or resources are short; the rolling update auto-rolls-back after a timeout. Check the task logs."],
          ["Metrics empty for an app on another node", "Expected — metrics only come from local tasks."],
          ["Node missing after reboot", <>The node&apos;s daemon hasn&apos;t started, or a firewall is blocking a swarm port (2377/7946/4789).</>],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Compose stacks as a swarm stack; Swarm secrets/configs; exec and
        metrics across nodes; automatic volume scheduling between nodes.
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
