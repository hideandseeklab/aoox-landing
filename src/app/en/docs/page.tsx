import Link from "next/link"
import { ArrowRight, Boxes, Globe, Rocket, type LucideIcon } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  P,
  Step,
  Steps,
  Table,
} from "@/components/docs/prose"
import { DOCS_NAV_EN } from "@/lib/docs-nav"

const START: { icon: LucideIcon; title: string; description: string; href: string }[] = [
  {
    icon: Rocket,
    title: "Install aoox",
    description: "Docker Compose on a VPS, then create an owner account at /setup.",
    href: "/en/docs/instalasi",
  },
  {
    icon: Boxes,
    title: "Deploy your first application",
    description: "Connect a repo, pick a build method, hit Deploy.",
    href: "/en/docs/aplikasi",
  },
  {
    icon: Globe,
    title: "Set up a domain & HTTPS",
    description: "Provision Traefik, point your DNS, automatic certificates.",
    href: "/en/docs/domain",
  },
]

const ARCH = [
  { name: "web", sub: "Next.js · dashboard" },
  { name: "api", sub: "NestJS · Docker Engine API" },
  { name: "postgres", sub: "aoox data" },
]

const MANAGED = ["app-*", "db-*", "registry", "proxy", "compose"]

export default function Page() {
  return (
    <DocPage
      href="/en/docs"
      title="aoox documentation"
      lang="en"
      description="A complete guide to installing and using aoox: from installing it on your own server to deploys, databases, backups, and notifications."
    >
      {/* start here */}
      <div className="grid gap-px border border-border bg-border sm:grid-cols-3">
        {START.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex flex-col gap-3 bg-background p-5 transition-colors hover:bg-muted/60"
          >
            <item.icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary-foreground dark:group-hover:text-primary" />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{item.title}</span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </span>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground transition-colors group-hover:text-foreground">
              Open
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <H2 id="apa-itu">What is aoox?</H2>
      <P>
        aoox is a <strong>self-hosted PaaS</strong> built on Docker. You run
        it on your own server, then from the web dashboard you can deploy
        applications from a Git repo, create databases, set up domains, view
        logs, schedule backups, and receive notifications — without touching{" "}
        <Code>docker</Code> by hand.
      </P>

      <H2 id="arsitektur">Architecture</H2>
      <div className="flex flex-col gap-px border border-border bg-border text-xs">
        <div className="flex items-center justify-between bg-muted/40 px-4 py-2 text-muted-foreground">
          <span>browser</span>
          <span>→ WEB_ORIGIN (:3000) · PUBLIC_API_URL (:3001)</span>
        </div>
        <div className="grid gap-px bg-border sm:grid-cols-3">
          {ARCH.map((svc) => (
            <div key={svc.name} className="flex flex-col gap-0.5 bg-background px-4 py-3">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-1.5 bg-primary" />
                {svc.name}
              </span>
              <span className="text-muted-foreground">{svc.sub}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-background px-4 py-3">
          <span className="text-muted-foreground">Docker Engine on the host →</span>
          {MANAGED.map((c) => (
            <span key={c} className="border border-border px-1.5 py-px text-muted-foreground">
              aoox-{c}
            </span>
          ))}
        </div>
      </div>
      <P>
        Three core containers run from a single compose file. Everything you
        create from the dashboard — applications, databases, registry, proxy,
        compose stacks — is just a regular Docker container on the same host,
        on the <Code>aoox</Code> network. There are two ways to add more
        machines: a{" "}
        <DocLink href="/en/docs/server-remote">remote server</DocLink> over
        SSH, or <DocLink href="/en/docs/swarm">Docker Swarm</DocLink> to
        spread replicas of one application.
      </P>

      <H2 id="konsep">Core concepts</H2>
      <Table
        head={["Term", "Meaning"]}
        rows={[
          [
            <strong key="p">Project</strong>,
            "A container for related applications, compose stacks, and databases. Has a shared environment.",
          ],
          [
            <strong key="a">Application</strong>,
            "A single Git repo that gets built, or a ready-made image, run as a container (or a Swarm service).",
          ],
          [
            <strong key="d">Deployment</strong>,
            "One build → push → start run for an application. Has its own log and status; can be rolled back.",
          ],
          [
            <strong key="c">Compose stack</strong>,
            "A docker-compose file from a repo (or a template) run as a set of containers.",
          ],
          [
            <strong key="m">Managed database</strong>,
            "A PostgreSQL/MySQL/MariaDB/Redis container created and backed up by aoox.",
          ],
          [
            <strong key="s">Server</strong>,
            "Another host connected over SSH as an additional deploy target, with its own proxy and volume backups.",
          ],
          [
            <strong key="n">Node (Swarm)</strong>,
            "A machine in a Docker Swarm cluster; applications in service mode are spread across these nodes.",
          ],
        ]}
      />

      <H2 id="alur-cepat">Quick path</H2>
      <Steps>
        <Step title="Install & create the owner account">
          <P>
            <Link href="/en/docs/instalasi" className="text-foreground underline underline-offset-4">
              Installation
            </Link>{" "}
            → open <Code>/setup</Code>.
          </P>
        </Step>
        <Step title="Provision the local registry (and the proxy if you'll use a domain)">
          <P>
            The <strong>Registry</strong> and <strong>Settings → Reverse
            proxy</strong> menus. The registry is required before the first
            deploy —{" "}
            <Link href="/en/docs/registry" className="text-foreground underline underline-offset-4">
              Registry
            </Link>
            .
          </P>
        </Step>
        <Step title="Create a project, then an application from a Git repo">
          <P>
            <strong>Projects → New project → New application</strong>, click{" "}
            <strong>Deploy</strong> —{" "}
            <Link href="/en/docs/aplikasi" className="text-foreground underline underline-offset-4">
              Creating an application
            </Link>
            .
          </P>
        </Step>
        <Step title="Add what you need">
          <P>
            Domain, database, backups, webhook, notifications — all per
            application/project, from the dashboard.
          </P>
        </Step>
      </Steps>

      <H2 id="peta">Documentation map</H2>
      <div className="grid gap-4 sm:grid-cols-2">
        {DOCS_NAV_EN.map((group) => (
          <div key={group.title} className="flex flex-col border border-border">
            <span className="border-b border-border bg-muted/40 px-4 py-2 text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {group.title}
            </span>
            <ul className="flex flex-col divide-y divide-border">
              {group.items
                .filter((item) => item.href !== "/en/docs")
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-muted/60"
                    >
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      <ArrowRight className="size-3 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <Callout title="A good fit for">
        aoox is designed for a server you trust (a private VPS, a small
        team). Instance roles restrict access to infrastructure (terminal,
        servers, registry, proxy), while{" "}
        <DocLink href="/en/docs/pengguna-peran#project">per-project membership</DocLink>{" "}
        decides who can see and change which project.
      </Callout>
    </DocPage>
  )
}
