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

export const metadata: Metadata = { title: "Installation" }

const SUMMARY = [
  { k: "Time", v: "± 5 minutes" },
  { k: "Needs", v: "A Linux VPS + Docker" },
  { k: "Result", v: "Dashboard on :3000, an owner account" },
]

const NEXT = [
  {
    title: "Provision the local registry",
    description: "Required before your first application deploy.",
    href: "/en/docs/registry",
  },
  {
    title: "Provision the reverse proxy",
    description: "So applications can be reached over a domain + HTTPS.",
    href: "/en/docs/domain",
  },
  {
    title: "Domain for the panel",
    description: "Serve the dashboard at panel.example.com.",
    href: "/en/docs/domain-panel",
  },
  {
    title: "Invite your team",
    description: "Add members with the owner/admin/member roles.",
    href: "/en/docs/pengguna-peran",
  },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/instalasi"
      title="Installation"
      lang="en"
      description="Run aoox on your own server with Docker Compose, then create the first owner account."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {item.k}
            </dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="satu-perintah">Fastest path: one command</H2>
      <P>
        For a fresh Linux VPS with nothing installed yet — installs Docker
        (if it&apos;s missing), generates every secret, and starts the stack. No
        Node.js or <Code>git clone</Code> needed first.
      </P>
      <Pre>{`curl -fsSL https://aoox.dev/install.sh | sh`}</Pre>
      <P>With a domain + automatic HTTPS, and creating the owner right away:</P>
      <Pre>{`curl -fsSL https://aoox.dev/install.sh \\
  | WEB_DOMAIN=panel.example.com API_DOMAIN=api.panel.example.com \\
    ACME_EMAIL=you@example.com \\
    ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' \\
    sh`}</Pre>
      <Callout>
        This script is served from aoox&apos;s own domain (not a third party) and
        pulls the compose files straight from the <Code>aoox-cli</Code> repo —
        read the source first at{" "}
        <a
          href="https://github.com/hideandseeklab/aoox-landing/blob/main/public/install.sh"
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          public/install.sh
        </a>{" "}
        if you&apos;d like. Want confirmation prompts and flags instead of env
        vars? Use <DocLink href="/en/docs/cli#install">aoox install</DocLink>{" "}
        from the CLI — same logic, just a matter of preference.
      </Callout>

      <H2 id="prasyarat">Manual: prerequisites</H2>
      <P>The steps below are useful if you&apos;d rather see or control every part yourself.</P>
      <Ul>
        <li>
          A Linux server with <strong>Docker 24+</strong> and{" "}
          <strong>Compose v2</strong>. Check with:{" "}
          <Code>docker compose version</Code>.
        </li>
        <li>
          Ports <Code>3000</Code> (web) and <Code>3001</Code> (API) open in
          the firewall for your browser. Ports <Code>80</Code>/<Code>443</Code>{" "}
          must be free if you plan to use a domain later.
        </li>
        <li>
          Access to the Docker socket (<Code>/var/run/docker.sock</Code>) —
          the API uses it to build images and run containers.
        </li>
      </Ul>
      <Callout title="Minimum specs">
        1 vCPU / 1 GB RAM is enough for aoox itself. Actual requirements
        depend on the applications and databases you deploy; the first
        Nixpacks build needs ± 1 GB of extra disk space for the base image.
      </Callout>

      <H2 id="langkah">Manual: step by step</H2>
      <Steps>
        <Step title="Clone the API repo and copy the env file">
          <P>
            The distribution compose file and the example env live in the{" "}
            <Code>aoox-api</Code> repo.
          </P>
          <Pre>{`git clone https://github.com/hideandseeklab/aoox-api.git
cd aoox-api
cp .env.dist.example .env.dist`}</Pre>
        </Step>

        <Step title="Generate secrets and find the Docker GID">
          <P>Run these on the server, then copy the results into the next step:</P>
          <Pre title="Values you'll need">{`openssl rand -hex 32                  # JWT_SECRET
openssl rand -hex 32                  # ENCRYPTION_KEY
stat -c %g /var/run/docker.sock       # DOCKER_GID (usually 999 or 0)`}</Pre>
        </Step>

        <Step title="Fill in .env.dist">
          <Pre title=".env.dist (minimal)">{`POSTGRES_PASSWORD=replace-with-a-strong-password
JWT_SECRET=<result of openssl #1>
ENCRYPTION_KEY=<result of openssl #2>
DOCKER_GID=<result of stat>

# the URL typed in the browser — must match exactly
WEB_ORIGIN=http://192.168.1.10:3000
PUBLIC_API_URL=http://192.168.1.10:3001`}</Pre>
          <Table
            head={["Variable", "Description"]}
            rows={[
              [
                <Code key="1">POSTGRES_PASSWORD</Code>,
                "Password for aoox's internal database.",
              ],
              [
                <Code key="2">JWT_SECRET</Code>,
                "Secret used for session tokens. Changing it logs everyone out.",
              ],
              [
                <Code key="3">ENCRYPTION_KEY</Code>,
                <>
                  Encryption key for stored credentials (registry, Git,
                  notifications, S3). <strong>Never change it</strong> once
                  there&apos;s data — old credentials become unreadable.
                </>,
              ],
              [
                <Code key="4">DOCKER_GID</Code>,
                "The Docker socket's GID, so the API container can use the host's Docker.",
              ],
              [
                <>
                  <Code key="5a">WEB_ORIGIN</Code> /{" "}
                  <Code key="5b">PUBLIC_API_URL</Code>
                </>,
                "The web & API URLs as seen from the browser. The session cookie and terminal gateway check this origin — a different scheme/host/port is rejected.",
              ],
            ]}
          />
        </Step>

        <Step title="Start the stack">
          <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
          <P>
            Images are pulled from Docker Hub (
            <Code>hideandseeklab/aoox-api</Code> and{" "}
            <Code>hideandseeklab/aoox-web</Code>). Database migrations run
            automatically the first time the API container boots.
          </P>
        </Step>

        <Step title="Create the owner account">
          <P>
            Open <Code>WEB_ORIGIN</Code> in your browser. While the users
            table is still empty you&apos;re redirected to <Code>/setup</Code> —
            enter a name, email, and password for the first{" "}
            <strong>owner</strong> account.
          </P>
          <H3>Without interaction (optional)</H3>
          <P>
            Set <Code>ADMIN_EMAIL</Code>, <Code>ADMIN_PASSWORD</Code>, and{" "}
            <Code>ADMIN_NAME</Code> in <Code>.env.dist</Code> before running{" "}
            <Code>up -d</Code>. These values are only used while there are no
            users yet and never overwrite an existing account.
          </P>
        </Step>
      </Steps>

      <H2 id="verifikasi">Verification</H2>
      <Pre title="On the server">{`docker compose -f docker-compose.dist.yml --env-file .env.dist ps
# api, web, postgres → running

curl -s http://localhost:3001/auth/setup-status
# {"needsSetup":true}  before the owner account is created
# {"needsSetup":false} afterward`}</Pre>
      <Ul>
        <li>
          After logging in, the Dashboard shows up and the{" "}
          <strong>Settings</strong> menu opens without an error.
        </li>
        <li>
          The <strong>Terminal</strong> menu may show SSH instructions — that&apos;s
          normal before <DocLink href="/en/docs/terminal">the terminal</DocLink>{" "}
          is configured.
        </li>
      </Ul>

      <H2 id="setelah-instalasi">Next steps</H2>
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

      <H2 id="update">Upgrading</H2>
      <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist pull
docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
      <P>
        Database migrations run automatically when the API boots. To pin a
        version, set <Code>API_IMAGE</Code> and <Code>WEB_IMAGE</Code> in{" "}
        <Code>.env.dist</Code>, e.g. <Code>hideandseeklab/aoox-api:0.1.0-alpha.0</Code>{" "}
        (see the available tags on Docker Hub).
      </P>

      <H2 id="dari-source">Building from source</H2>
      <P>
        Check out <Code>aoox-api</Code> and <Code>aoox-web</Code> side by
        side, then add the build compose file:
      </P>
      <Pre>{`docker compose -f docker-compose.dist.yml -f docker-compose.build.yml --env-file .env.dist up -d --build`}</Pre>

      <H2 id="hapus">Uninstalling</H2>
      <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist down -v`}</Pre>
      <Callout kind="warn" title="Be careful">
        <Code>-v</Code> deletes aoox&apos;s own data volume (users, projects,
        deployment history). Application, database, registry, and proxy
        containers created from the dashboard are <strong>not</strong> removed
        along with it — remove them from the dashboard first, or via{" "}
        <Code>docker</Code> with the label filter{" "}
        <Code>com.docker.compose.project=aoox</Code>.
      </Callout>
    </DocPage>
  )
}
