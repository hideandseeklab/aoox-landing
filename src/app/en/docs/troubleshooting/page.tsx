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
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Troubleshooting" }

const SUMMARY = [
  { k: "Start with", v: "API logs + docker ps" },
  { k: "Source of truth", v: "Deployment logs on the Deploy tab" },
  { k: "Still stuck?", v: "Open an issue with the info below" },
]

const AREAS = [
  { id: "instalasi", title: "Installation & access" },
  { id: "deploy", title: "Build & deploy" },
  { id: "domain", title: "Domain & HTTPS" },
  { id: "database", title: "Database & backup" },
  { id: "server", title: "Terminal & remote servers" },
  { id: "lainnya", title: "Notifications, jobs, disk" },
]

type Row = [symptom: React.ReactNode, cause: React.ReactNode, fix: React.ReactNode]

const INSTALASI: Row[] = [
  [
    <>The web app loads, but sign-in / the API fails (network error)</>,
    <><Code>PUBLIC_API_URL</Code> isn&apos;t reachable from the browser (wrong IP/port, firewall blocking 3001).</>,
    <>Match it to an address the browser can actually open; <Code>curl &lt;PUBLIC_API_URL&gt;/auth/setup-status</Code> from your laptop should respond.</>,
  ],
  [
    <>Terminal: <Code>origin not allowed</Code></>,
    <><Code>WEB_ORIGIN</Code> ≠ the browser&apos;s URL (scheme/host/port).</>,
    <>Match them exactly, then <Code>up -d</Code> again. See <DocLink href="/en/docs/domain-panel">Domain for the panel</DocLink>.</>,
  ],
  [
    <>Registry/Proxy card: <em>Docker unreachable</em> / permission denied on the socket</>,
    <><Code>DOCKER_GID</Code> is wrong or the socket isn&apos;t mounted.</>,
    <><Code>stat -c %g /var/run/docker.sock</Code> → set <Code>DOCKER_GID</Code> → recreate the API.</>,
  ],
  [
    <>Everyone gets logged out suddenly</>,
    <><Code>JWT_SECRET</Code> changed.</>,
    "Expected after a rotation; restore the old value if it wasn't intentional.",
  ],
  [
    <>Registry/Git/notification/S3 credentials can&apos;t be read</>,
    <><Code>ENCRYPTION_KEY</Code> changed.</>,
    "Restore the old value; if it's lost, re-enter all credentials.",
  ],
  [
    <><Code>/setup</Code> doesn&apos;t show up / 404</>,
    "A user already exists.",
    <>Sign in normally; the owner can reset a member&apos;s password. To start from scratch: <Code>down -v</Code>.</>,
  ],
]

const DEPLOY: Row[] = [
  [
    <>Deploy fails: <em>No self-hosted registry</em></>,
    "The local registry hasn't been provisioned yet.",
    <><DocLink href="/en/docs/registry">Provision the registry</DocLink> first.</>,
  ],
  [
    <>Build: <em>repository not found</em> / 128</>,
    "A private repo without a Git credential, an expired token, or the wrong branch.",
    <>Add a credential in Settings and select it on the application; double-check the branch name.</>,
  ],
  [
    <>Build: <em>unknown flag --mount</em> / heredoc error</>,
    "BuildKit syntax in the Dockerfile; a classic builder is used.",
    <>Replace it with a plain step — see <DocLink href="/en/docs/build#dockerfile">How builds work</DocLink>.</>,
  ],
  [
    <>Health check never turns healthy</>,
    <>The container port ≠ the port it&apos;s listening on, it only listens on <Code>127.0.0.1</Code>, the path doesn&apos;t return 2xx, or the image has no wget/curl/node/python3.</>,
    <>Listen on <Code>0.0.0.0</Code>, match the port, and provide a fast 200 endpoint.</>,
  ],
  [
    <>New env isn&apos;t picked up by the application</>,
    "Env is applied when the container is created.",
    "Deploy or Rollback once more.",
  ],
  [
    <>400: unknown reference <Code>{"${{database.x.url}}"}</Code></>,
    "The wrong slug, or the database is in another project.",
    "References only work within the same project.",
  ],
  [
    <>A webhook push doesn&apos;t trigger a deploy</>,
    <>A different branch, a non-push event, a deployment already running (<Code>busy</Code>), or a 401 secret mismatch.</>,
    <>Check <em>Recent Deliveries</em> on the provider — see the <DocLink href="/en/docs/webhook#respons">response table</DocLink>.</>,
  ],
  [
    <>Rollback fails: <em>image not found</em></>,
    "The tag was pruned by retention or deleted manually.",
    "Redeploy that commit; raise the deployment history limit.",
  ],
  [
    <>Nixpacks/static: the first build takes forever</>,
    "The base image (~350 MB) plus the helper is built once.",
    "Wait it out; use a Dockerfile for faster builds.",
  ],
]

const DOMAIN: Row[] = [
  [
    <>Domain tab: <em>Proxy isn&apos;t running</em></>,
    "Traefik hasn't been provisioned.",
    <>Settings → Reverse proxy → provision (owner).</>,
  ],
  [
    <>404 page not found from Traefik</>,
    "The container isn't healthy yet, or the domain was added before the container was recreated.",
    "Wait for it to become healthy; check the deploy log; make sure the health check passes.",
  ],
  [
    <>Self-signed certificate / <em>TRAEFIK DEFAULT CERT</em></>,
    "ACME failed: DNS isn't correct yet, port 80 is closed, a rate limit, or the email was empty at provision time.",
    <><Code>docker logs -f aoox-proxy</Code>; test with <Code>PROXY_ACME_STAGING=true</Code>.</>,
  ],
  [
    <>Redirect loop</>,
    "Cloudflare's Flexible mode, or another proxy terminating TLS in front.",
    "Switch to Full (strict), or disable HTTPS in aoox.",
  ],
  [
    <>DNS check: <Code>?</Code></>,
    "The server's public IP couldn't be detected (NAT/no outbound internet).",
    <>Set <Code>PUBLIC_IP</Code> in <Code>.env.dist</Code>.</>,
  ],
  [
    <>PR preview doesn&apos;t resolve</>,
    "No wildcard DNS, or the wrong preview domain.",
    <><Code>*.preview.example.com A &lt;ip&gt;</Code>.</>,
  ],
]

const DATABASE: Row[] = [
  [
    <>Application: <Code>ECONNREFUSED</Code> / <Code>ENOTFOUND</Code> to the database</>,
    "Using an external/localhost URL from inside the container, or an app on a remote server using an internal host.",
    "Use a reference (internal host) for a local app; use an external connection + host port for a remote server.",
  ],
  [
    <>Database status is <em>error</em> right after creation</>,
    "The image tag doesn't exist, or the host port is already in use.",
    "Delete it, recreate with a different tag/port.",
  ],
  [
    <>Backup is 20 bytes / fails</>,
    "Credentials/DB weren't ready yet, or the disk is full.",
    "Read the error message on the backup row; check Docker disk."],
  [
    <>Testing an S3 destination: <em>NoSuchBucket</em> / fails against local MinIO</>,
    "The bucket doesn't exist, the region is wrong, or the endpoint uses localhost from inside the container.",
    <>Create the bucket; use the MinIO container&apos;s name + :9000 as the endpoint.</>,
  ],
  [
    <>Data browser: 400, only one statement allowed</>,
    <>A trailing <Code>;</Code> or multiple statements.</>,
    "Run them one at a time, or use SQL import.",
  ],
  [
    <>Member: 403 while running a query</>,
    "A write statement.",
    "Owner/admin only; a member's session is read-only at the engine level.",
  ],
]

const SERVER: Row[] = [
  [
    <>Terminal: <em>auth failed</em> + an authorization command</>,
    "The platform key isn't in that user's authorized_keys yet.",
    "Run the command shown, on the host, as that same user.",
  ],
  [
    <>Terminal: <Code>TERMINAL_SSH_USER is not set</Code></>,
    "The env var is empty.",
    <>Fill it in in <Code>.env.dist</Code>, restart the stack.</>,
  ],
  [
    <>Terminal: <Code>ECONNREFUSED</Code> to host.docker.internal</>,
    "sshd is down/wrong port, or Linux without extra_hosts.",
    <>Use the docker0 gateway IP (e.g. <Code>172.17.0.1</Code>) as <Code>TERMINAL_SSH_HOST</Code>.</>,
  ],
  [
    <>Key directory not writable (uid 1000)</>,
    <><Code>./secrets</Code> is owned by root.</>,
    <><Code>sudo chown -R 1000:1000 ./secrets</Code>.</>,
  ],
  [
    <>Remote server: <em>docker: command not found</em> / permission denied</>,
    "Docker isn't on that user's PATH, or the user isn't in the docker group.",
    <><Code>curl -fsSL https://get.docker.com | sh</Code>, <Code>usermod -aG docker &lt;user&gt;</Code>.</>,
  ],
  [
    <>Remote deploy succeeds but isn&apos;t reachable</>,
    "The host port is empty, or the server's firewall is blocking the port.",
    "Fill in a host port; open the port in ufw/a security group. Domains don't work the same on a remote server.",
  ],
]

const LAINNYA: Row[] = [
  [
    <>The notification test succeeds, but the real event never arrives</>,
    "The event's toggle isn't enabled, or the event genuinely didn't happen (e.g. a dead container on a remote server isn't detected).",
    "Enable the toggle; trigger a real event.",
  ],
  [
    <>A teammate can&apos;t see a project</>,
    "They haven't been added as a project member yet; instance members only see projects they're assigned to.",
    <>Add them on the project&apos;s Members tab — see <DocLink href="/en/docs/project#anggota">Project</DocLink>.</>,
  ],
  [
    <>Viewer: the button is there but the action fails with 403</>,
    "The project's viewer role is read-only, and it's enforced by the API.",
    "Promote them to developer if they genuinely need to make changes.",
  ],
  [
    <>Swarm: task pending / image pull failed on another node</>,
    <>The constraint doesn&apos;t match, or <Code>REGISTRY_PUBLIC_HOST</Code> is still localhost so other nodes can&apos;t pull the image.</>,
    <>See <DocLink href="/en/docs/swarm#jebakan">Docker Swarm</DocLink>.</>,
  ],
  [
    <>A job runs at the wrong time</>,
    "The API's timezone is UTC.",
    "Adjust the cron's hour accordingly.",
  ],
  [
    <>Job: <em>container not running</em></>,
    "Target is In container but the application is stopped.",
    "Use Separate container, or start the application.",
  ],
  [
    <>Disk full (or a low-disk notification)</>,
    "Old deployment images, dangling images, build cache, local backups.",
    <>Settings → Docker disk → <strong>Clean up now</strong>; lower deployment history & backup retention counts; run registry GC.</>,
  ],
  [
    <>Compose stack: a service can&apos;t see the env</>,
    "Stack env is only used for interpolation.",
    <>Add an <Code>environment:</Code> block to the service.</>,
  ],
]

const NEXT = [
  { title: "Installation", description: "Required env vars and initial verification.", href: "/en/docs/instalasi" },
  { title: "Deploy & rollback", description: "Reading deployment logs.", href: "/en/docs/deploy#log" },
  { title: "Proxy & domain", description: "Traefik routers and ACME.", href: "/en/docs/domain#https" },
  { title: "Users & roles", description: "The audit log, to trace who changed what.", href: "/en/docs/pengguna-peran#akun" },
]

function Area({ id, title, rows }: { id: string; title: string; rows: Row[] }) {
  return (
    <>
      <H2 id={id}>{title}</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Symptom</th>
              <th className="px-3 py-2 text-left font-medium">Cause</th>
              <th className="px-3 py-2 text-left font-medium">Fix</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border align-top">
                <td className="min-w-[12rem] px-3 py-2 text-foreground">{row[0]}</td>
                <td className="min-w-[12rem] px-3 py-2 text-muted-foreground">{row[1]}</td>
                <td className="min-w-[12rem] px-3 py-2 text-muted-foreground">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <DocPage
      href="/en/docs/troubleshooting"
      title="Troubleshooting"
      lang="en"
      description="The most common problems, grouped by area, with a quick way to diagnose each one."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="diagnosis">Quick diagnosis</H2>
      <Pre title="On the server, from the aoox-api folder">{`# status of the three core containers
docker compose -f docker-compose.dist.yml --env-file .env.dist ps

# API logs (deploy, backup, notifications, SSH) and web
docker compose -f docker-compose.dist.yml --env-file .env.dist logs -f --tail 200 api
docker compose -f docker-compose.dist.yml --env-file .env.dist logs -f --tail 100 web

# every container managed by aoox
docker ps -a --filter label=com.docker.compose.project=aoox

# proxy & registry
docker logs -f --tail 100 aoox-proxy
docker logs -f --tail 100 aoox-registry

# is the API alive?
curl -s http://localhost:3001/auth/setup-status`}</Pre>
      <Ul>
        <li>
          <strong>Deploy</strong> problems: the deployment log on the Deploy
          tab is the most complete source — tokens and passwords are already
          redacted, so it&apos;s safe to share.
        </li>
        <li>
          <strong>Application runtime</strong> problems: the container log on
          the same tab, or <Code>docker logs aoox-app-&lt;slug&gt;</Code>.
        </li>
        <li>
          Who changed what: the{" "}
          <DocLink href="/en/docs/pengguna-peran#akun">audit log</DocLink>{" "}
          (owner/admin).
        </li>
      </Ul>

      <div className="flex flex-wrap gap-2 text-xs">
        {AREAS.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="border border-border px-2 py-1 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
          >
            {a.title}
          </a>
        ))}
      </div>

      <Area id="instalasi" title="Installation & access" rows={INSTALASI} />
      <Area id="deploy" title="Build & deploy" rows={DEPLOY} />
      <Area id="domain" title="Domain & HTTPS" rows={DOMAIN} />
      <Area id="database" title="Database & backup" rows={DATABASE} />
      <Area id="server" title="Terminal & remote servers" rows={SERVER} />
      <Area id="lainnya" title="Notifications, jobs, disk" rows={LAINNYA} />

      <H2 id="reset">Starting from scratch (testing)</H2>
      <P>This wipes all of aoox&apos;s own data — <strong>not</strong> the application/database containers already created from the dashboard:</P>
      <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist down -v
docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
      <Callout kind="warn">
        App/db/registry/proxy containers stay put and become orphaned after
        a reset. Delete them from the dashboard first, or:{" "}
        <Code>docker ps -aq --filter label=com.docker.compose.project=aoox | xargs docker rm -f</Code>{" "}
        (and their volumes too, if you really want a clean slate).
      </Callout>

      <H2 id="port">Port & env reference</H2>
      <Table
        head={["Port", "For", "Env"]}
        rows={[
          ["3000", "Web (dashboard)", <Code key="1">WEB_PORT</Code>],
          ["3001", "API", <Code key="2">API_PORT</Code>],
          ["5000", "Local registry", <Code key="3">REGISTRY_PORT</Code>],
          ["80 / 443", "Reverse proxy (ACME needs 80)", <><Code>PROXY_HTTP_PORT</Code> / <Code>PROXY_HTTPS_PORT</Code></>],
          ["22", "SSH to the host (terminal)", <Code key="5">TERMINAL_SSH_PORT</Code>],
          ["9000 / 9001", "MinIO from the template (API / Console)", "—"],
        ]}
      />

      <H2 id="melapor">Reporting an issue</H2>
      <P>
        If it&apos;s still not fixed, open an issue on{" "}
        <a
          href="https://github.com/hideandseeklab/aoox-api/issues"
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          GitLab aoox-api ↗
        </a>{" "}
        with:
      </P>
      <Ul>
        <li>The API/web image version (the Host card on the Dashboard, or the tag in <Code>.env.dist</Code>) and the Docker version.</li>
        <li>The steps taken and what you expected.</li>
        <li>A snippet of the API log around when it happened (secrets are already redacted, but double-check).</li>
        <li>For deploys: the deployment log from the Deploy tab and which build type was used.</li>
      </Ul>

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
