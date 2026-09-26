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

export const metadata: Metadata = { title: "Compose stacks" }

const SUMMARY = [
  { k: "Source", v: "A Git repo (compose file) or a template" },
  { k: "Runs as", v: "docker compose project aoox-<slug>" },
  { k: "Status", v: "idle → deploying → running | stopped | error" },
]

const DECISION = [
  { q: "One repo, one process, one port?", a: "Application", href: "/en/docs/aplikasi" },
  { q: "Several services talking to each other (web + worker + queue) with a docker-compose.yml?", a: "Compose stack", href: null },
  { q: "Want a ready-made app (WordPress, n8n, …) without a repo?", a: "Template", href: "/en/docs/template" },
]

const FLOW = [
  { s: "helper", d: "a one-off docker:29-cli container (compose + git)" },
  { s: "clone", d: "git clone --depth 1 into a checkout volume" },
  { s: "env", d: ".aoox.env written from the resolved env" },
  { s: "up", d: "docker compose config → up -d --build --remove-orphans" },
]

const NEXT = [
  { title: "One-click templates", description: "A stack from the catalog, no repo needed.", href: "/en/docs/template" },
  { title: "Environment variables", description: "The ${{…}} references, which also apply to stacks.", href: "/en/docs/environment" },
  { title: "Proxy & domain", description: "The Traefik setup that routes per-service domains.", href: "/en/docs/domain" },
  { title: "Managed database", description: "An alternative to running the DB inside the stack, so it can be backed up.", href: "/en/docs/database" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/compose"
      title="Compose stacks"
      lang="en"
      description="Deploy a docker-compose file from a repo as one multi-service stack, complete with a domain per service."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Application, compose stack, or template?</H2>
      <div className="border border-border text-xs">
        {DECISION.map((row, i) => (
          <div
            key={row.q}
            className={`grid gap-1 px-4 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 ${i > 0 ? "border-t border-border" : ""}`}
          >
            <span className="text-foreground">{row.q}</span>
            <span className="text-muted-foreground">
              →{" "}
              {row.href ? (
                <Link href={row.href} className="text-foreground underline underline-offset-4">
                  {row.a}
                </Link>
              ) : (
                <span className="text-primary-foreground dark:text-primary">{row.a}</span>
              )}
            </span>
          </div>
        ))}
      </div>
      <P>
        A compose stack trades some application features (health checks,
        blue/green, rollback, metrics) for the flexibility of running a
        compose file as-is — including any <Code>build:</Code>, networks, and
        volumes defined inside it.
      </P>

      <H2 id="langkah">Creating a stack</H2>
      <Steps>
        <Step title="Project page → New compose stack">
          <Table
            head={["Field", "Notes"]}
            rows={[
              ["Name", "A unique slug; the compose project name = aoox-<slug> (its own group in Docker Desktop)."],
              ["Git repository / Branch / Git credential", "Same as an application."],
              [
                "Compose file",
                <>
                  Path relative to the repo root, defaulting to{" "}
                  <Code>docker-compose.yml</Code>. Relative paths <em>inside</em>{" "}
                  the file are resolved from that file&apos;s folder.
                </>,
              ],
              [
                "Environment variables",
                <>
                  Supports <Code>{"${{project.KEY}}"}</Code> and{" "}
                  <Code>{"${{database.<slug>.url}}"}</Code>.
                </>,
              ],
            ]}
          />
        </Step>
        <Step title="Click Deploy">
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
            The helper&apos;s output streams into the <strong>Last action log</strong>{" "}
            panel (refreshing every 3 seconds while <Code>deploying</Code>).
            Git tokens and database passwords are redacted.
          </P>
        </Step>
        <Step title="Verify">
          <P>
            The stack page shows the containers compose created and their
            status. A stack status of <Code>running</Code> means{" "}
            <Code>up -d</Code> finished without error — it doesn&apos;t mean every
            service is healthy; check a service&apos;s logs with{" "}
            <Code>docker compose logs</Code> in the{" "}
            <DocLink href="/en/docs/terminal">terminal</DocLink>.
          </P>
        </Step>
      </Steps>

      <H2 id="env">Env & interpolation</H2>
      <Callout kind="warn" title="Stack env ≠ container env">
        <Code>.aoox.env</Code> is used as the <Code>--env-file</Code>: its
        values become the source for <Code>{"${VAR}"}</Code> interpolation in
        the compose file, they are <strong>not</strong> automatically injected
        into containers. Pass them through explicitly via{" "}
        <Code>environment:</Code> on the service.
      </Callout>
      <Pre title="Stack env in aoox">{`DATABASE_URL=\${{database.app-db.url}}
APP_SECRET=secret`}</Pre>
      <Pre title="docker-compose.yml">{`services:
  web:
    build: .
    environment:
      DATABASE_URL: \${DATABASE_URL}   # from the stack env
      APP_SECRET: \${APP_SECRET}
  worker:
    build: .
    command: node worker.js
    environment:
      DATABASE_URL: \${DATABASE_URL}`}</Pre>
      <Ul>
        <li>
          An aoox managed database is reachable from the stack because the
          service joins the <Code>aoox</Code> network whenever there&apos;s a
          domain (see below); without a domain, add{" "}
          <Code>networks: [default, aoox]</Code> yourself plus an external
          network declaration.
        </li>
      </Ul>
      <Pre title="Joining the aoox network manually">{`services:
  web:
    networks: [default, aoox]
networks:
  aoox:
    external: true`}</Pre>

      <H2 id="akses">Access: domain or IP & port</H2>
      <P>
        The <strong>Access</strong> card on the stack page has two kinds of
        rows for each service you want reachable from outside:
      </P>
      <Table
        head={["Type", "What you fill in", "Result"]}
        rows={[
          [
            <strong key="d">Domain</strong>,
            "Service, container port, host, HTTPS toggle",
            "A Traefik label in the override file; requires a reverse proxy.",
          ],
          [
            <strong key="p">IP &amp; port</strong>,
            "Service, container port, host port",
            <>
              A <Code>ports:</Code> line in the override file — the stack can
              then be opened at <Code>{"http://<server-ip>:<host port>"}</Code>{" "}
              without a domain.
            </>,
          ],
        ]}
      />
      <Ul>
        <li>
          A port clash with an application, database, another stack, or any
          container that&apos;s currently running is{" "}
          <strong>rejected when you save</strong> — not at{" "}
          <Code>up</Code> time, so an existing stack is never torn down for
          nothing.
        </li>
        <li>
          Access changes only take effect after a <strong>redeploy</strong>;
          the panel shows a reminder.
        </li>
        <li>Deploying from a template also accepts host ports directly in the dialog.</li>
      </Ul>

      <H2 id="domain">Domain per service</H2>
      <Steps>
        <Step title="Domain card on the stack page">
          <P>
            Pick a <strong>Service</strong>, the <strong>Port</strong> inside
            the container, a <strong>Hostname</strong>, and toggle{" "}
            <strong>HTTPS</strong>.
          </P>
        </Step>
        <Step title="Redeploy">
          <P>
            On deploy, aoox writes an override file{" "}
            <Code>docker-compose.aoox.yml</Code> next to the compose file,
            containing the Traefik label (router{" "}
            <Code>{"<slug>-<service>-<port>"}</Code>) and the{" "}
            <Code>aoox</Code> + <Code>default</Code> networks, then runs{" "}
            <Code>-f compose -f override</Code>.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          New domain changes only take effect after a <strong>redeploy</strong>.
        </li>
        <li>
          Stop/start use the override already sitting in the volume, so
          they stay consistent with the running stack.
        </li>
        <li>
          With no domain, there&apos;s no override — the compose file runs as-is.
        </li>
      </Ul>

      <H2 id="operasi">Operations</H2>
      <Table
        head={["Action", "What runs", "Notes"]}
        rows={[
          ["Deploy", <><Code>up -d --build --remove-orphans</Code></>, "Re-clones the branch, builds the image if there's a build:."],
          ["Stop", <><Code>stop</Code></>, "Containers stop, volumes are kept."],
          ["Start", <><Code>start</Code></>, "No clone/build."],
          ["Delete", <><Code>down --volumes --remove-orphans</Code> + delete the checkout volume</>, <><strong>The stack&apos;s volume data is deleted too.</strong></>],
        ]}
      />

      <H2 id="riwayat">History, webhooks & metrics</H2>
      <P>
        Every time the compose runner runs — Deploy, Stop, Start, Delete, or
        via a webhook — it&apos;s recorded as one history row (action, trigger,
        logs, commit). A stack is N containers, so this is a history of{" "}
        <strong>actions</strong>, not an image/rollback history like an
        application&apos;s Deployment.
      </P>
      <Ul>
        <li>
          <strong>Auto-deploy on push</strong>: enable the Webhook on the
          Deploy tab to get a URL containing a token. The contract is the same
          as an application&apos;s webhook — an optional GitHub/GitLab signature,
          and irrelevant pushes still get a 200 so the provider doesn&apos;t
          disable the hook. Stacks from a <strong>template</strong> have no
          repo, so pushes are accepted but ignored.
        </li>
        <li>
          <strong>Metrics & container-down notifications</strong> now work —
          stack containers are recognized by the compose project name
          (<Code>aoox-&lt;slug&gt;</Code>), not an aoox component label.
          Notifications stay quiet while a run is in progress, since{" "}
          <Code>up -d --build</Code> stops and restarts every container.
        </li>
        <li>
          Resource limits still can&apos;t be set from the UI — use{" "}
          <Code>deploy.resources</Code> in the compose file.
        </li>
      </Ul>

      <H2 id="perilaku">Behavior & limitations</H2>
      <Ul>
        <li>
          <Code>build:</Code> is fully supported — the compose CLI uses
          BuildKit (unlike Nixpacks applications).
        </li>
        <li>
          No rollback or health check/blue-green per stack — Deploy always
          runs <Code>up -d --build</Code> again, rather than swapping images
          like an application does.
        </li>
        <li>
          No mounts from the UI for stacks — configure volumes in the compose
          file.
        </li>
        <li>
          <strong>Jobs</strong> are available under the stack&apos;s Jobs tab: pick
          a <strong>Service</strong>, then exec inside that service&apos;s
          container or a separate container from its image — see{" "}
          <DocLink href="/en/docs/jobs#pemilik">Scheduled jobs</DocLink>.
        </li>
        <li>
          Databases inside a stack don&apos;t get aoox&apos;s backup features — for
          important data, use a{" "}
          <DocLink href="/en/docs/database">managed database</DocLink>.
        </li>
        <li>
          A compose file from a repo may request <Code>privileged</Code> /
          host mounts — treat the repo like code running on the host.
        </li>
        <li>A failed deploy sends a deployment-failure notification.</li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["A service doesn't see the env", "The stack env is only for interpolation. Add environment: on the service."],
          ["Bind mount ./file fails: not a directory", "Already handled (checkout happens at the volume's mountpoint). If it still fails, relative paths are resolved from the compose file's folder, not the repo root."],
          ["Services can't find each other after adding a domain", "The override already includes the default network. If your compose file declares its own networks: on a service, include default."],
          ["Can't connect to the managed database", "The service isn't on the aoox network. Add a domain (automatic) or an external network manually."],
          ["Domain returns 404", "Not redeployed yet after adding the domain, or the service port is wrong."],
          ["Host port rejected when saving", "The port is already used by an application, database, another stack, or a running container. Pick another port."],
          ["Push doesn't trigger a deploy", "A stack from a template has no repo — pushes are always ignored. For a stack from a repo, check the webhook URL and the provider's signature."],
        ]}
      />

      <H3>Template</H3>
      <P>
        A stack from the catalog (<Code>source: template</Code>) uses the same
        runner, but its compose content is stored in aoox and can be edited
        from the UI without a repo — see{" "}
        <DocLink href="/en/docs/template">One-click templates</DocLink>.
      </P>

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
