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
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en/docs/aplikasi",
  lang: "en",
  title: "Creating an application",
  description:
    "From a Git repo or a ready-made image, plus deploy modes.",
})

const SUMMARY = [
  { k: "Time", v: "± 3 minutes + build duration" },
  { k: "Needs", v: "A local registry (Git source) or an image" },
  { k: "Result", v: "A running container from the branch you chose" },
]

const EXAMPLE = [
  { k: "Name", v: "shop" },
  { k: "Git repository", v: "https://github.com/acme/shop" },
  { k: "Branch", v: "main" },
  { k: "Git credential", v: "None (public repo)" },
  { k: "Build method", v: "Nixpacks" },
  { k: "Container port", v: "3000" },
  { k: "Host port", v: "(empty — using a domain)" },
  { k: "Health check path", v: "/health" },
]

const NEXT = [
  { title: "Add a domain", description: "Hostname + automatic HTTPS via Traefik.", href: "/en/docs/domain" },
  { title: "Auto-deploy on push", description: "GitHub/GitLab webhook with a secret.", href: "/en/docs/webhook" },
  { title: "Connect a database", description: "A ${{database.<slug>.url}} reference in your env.", href: "/en/docs/database" },
  { title: "Store data on a volume", description: "Mount a volume/bind/file into the container.", href: "/en/docs/mount" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/aplikasi"
      title="Creating an application"
      lang="en"
      description="Connect a Git repo or a ready-made image to a project and control how its container is run."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="prasyarat">Prerequisites</H2>
      <Ul>
        <li>
          For applications from a Git repo: the{" "}
          <DocLink href="/en/docs/registry">local registry</DocLink> is
          already provisioned — built images get pushed there. Without it,
          the first deploy fails.
        </li>
        <li>
          You already have a <DocLink href="/en/docs/project">project</DocLink>{" "}
          for this application to live in.
        </li>
        <li>
          For private repos: a{" "}
          <DocLink href="/en/docs/webhook#kredensial">Git credential</DocLink>{" "}
          has already been added in Settings.
        </li>
        <li>
          The application <strong>listens on a fixed port</strong> and
          accepts connections from <Code>0.0.0.0</Code>, not just{" "}
          <Code>localhost</Code>.
        </li>
      </Ul>

      <H2 id="sumber">Two application sources</H2>
      <Table
        head={["Source", "What you fill in", "Deploy flow"]}
        rows={[
          [
            <strong key="g">Git repository</strong>,
            "Repo URL, branch, credential (if private), build method",
            <>Clone<PathArrow />build (<DocLink href="/en/docs/build">Dockerfile / Nixpacks / static</DocLink>)<PathArrow />push to registry<PathArrow />run.</>,
          ],
          [
            <strong key="i">Ready-made image (pulled)</strong>,
            <>An image reference (<Code>ghcr.io/acme/api:1.4</Code>) and, if private, the external registry holding its credentials</>,
            <>No build: the image is pulled then run. Supports{" "}<DocLink href="/en/docs/deploy#auto-update">automatic updates</DocLink> when the tag&apos;s digest changes.</>,
          ],
        ]}
      />
      <P>
        The local registry is only required for a Git source (where built
        images are stored). Applications from an image don&apos;t need it.
      </P>

      <H2 id="langkah">Steps</H2>
      <Steps>
        <Step title="On the project page, click New application">
          <P>Fill in the form. Most of it can be changed later in the Settings tab.</P>
          <Table
            head={["Field", "Description"]}
            rows={[
              ["Name", "Becomes a unique slug (app_name); container name = aoox-app-<slug>."],
              [
                "Git repository",
                <>
                  The repo&apos;s https URL. <strong>Without</strong> a user:token
                  in the URL — use the Git credential select for private
                  repos.
                </>,
              ],
              ["Branch", "The branch that gets built. The webhook only reacts to pushes on this branch."],
              ["Git credential", "None (public repo) or one of your stored credentials."],
              [
                "Build method",
                <>
                  Dockerfile or Nixpacks — see{" "}
                  <DocLink href="/en/docs/build">How builds work</DocLink>.
                </>,
              ],
              ["Container port", "The port the application listens on inside the container (e.g. 3000)."],
              [
                "Host port",
                "Optional. Fill it in for IP:port access without a domain. Leave it empty when using a domain — blue/green requires an empty host port.",
              ],
              [
                "Health check path",
                <>
                  Optional but recommended, e.g. <Code>/health</Code>.
                  Determines deploy success/failure and enables blue/green.
                </>,
              ],
              [
                "Server",
                "The aoox host (default) or a remote server. Only shown if a server is registered.",
              ],
              [
                "Deploy mode",
                <>
                  <em>container</em> (default) or <em>service</em> with
                  replicas when <DocLink href="/en/docs/swarm">Swarm</DocLink>{" "}
                  is active — plus node placement and rolling-update settings.
                </>,
              ],
              [
                "Auto update",
                <>
                  Image sources only: periodically checks the tag&apos;s digest and
                  deploys when it changes.
                </>,
              ],
              [
                "CPU / memory limits",
                <>
                  Optional. See <DocLink href="/en/docs/monitoring#limit">Monitoring</DocLink>.
                </>,
              ],
            ]}
          />
          <div className="border border-border bg-card text-xs rounded-lg overflow-hidden">
            <div className="border-b border-border px-3 py-1.5 text-[0.7rem] text-muted-foreground">
              Example — a Next.js application in a public repo
            </div>
            <dl className="grid grid-cols-[minmax(8rem,auto)_1fr] gap-x-4 gap-y-1.5 p-3">
              {EXAMPLE.map((row) => (
                <div key={row.k} className="contents">
                  <dt className="text-muted-foreground">{row.k}</dt>
                  <dd className="text-card-foreground">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Step>

        <Step title="Choose Access">
          <P>
            Before saving, the form asks how this application will be
            reachable — so a freshly created application doesn&apos;t
            silently end up unreachable once the deploy finishes.
          </P>
          <Table
            head={["Option", "What happens"]}
            rows={[
              [
                <strong key="ip">IP + port</strong>,
                <>
                  A host port is assigned automatically (checked for
                  conflicts against other applications/databases/compose
                  stacks/containers before saving) — immediately reachable at{" "}
                  <Code>{"http://<server-ip>:<port>"}</Code>.
                </>,
              ],
              [
                <strong key="d">Domain</strong>,
                <>
                  A host + HTTPS toggle is added right now, instead of later
                  from the Domain tab. If the reverse proxy hasn&apos;t been
                  provisioned yet, it&apos;s started automatically — the same
                  behavior as setting the panel domain, see{" "}
                  <DocLink href="/en/docs/domain-panel#dashboard">
                    Domain for the panel<PathArrow />Via the dashboard
                  </DocLink>
                  .
                </>,
              ],
              [
                <strong key="n">Set up later</strong>,
                "No port or domain yet. The application still gets deployed, but isn't reachable until one is added later from the Settings or Domain tab.",
              ],
            ]}
          />
        </Step>

        <Step title="Save, then fill in environment variables (if needed)">
          <P>
            The <strong>Environment</strong> tab<PathArrow />env editor, one{" "}
            <Code>KEY=VALUE</Code> per line. Values are applied when the
            container is created, not at build time — see{" "}
            <DocLink href="/en/docs/environment">Environment variables</DocLink>.
          </P>
        </Step>

        <Step title="Open the Deploy tab and click Deploy">
          <P>What happens, visible in the realtime log:</P>
          <Pre>{`queued    deployment created
building  Docker daemon clones the repo → builds the image
pushing   image → local registry   (skipped on a remote server)
starting  new container created, waiting for healthy
success   old container replaced · application status Running`}</Pre>
          <P>
            The next deploy is rejected (409) while a deployment is still
            active. A failed build/push doesn&apos;t touch the running container.
            Details in <DocLink href="/en/docs/deploy">Deploy &amp; rollback</DocLink>.
          </P>
        </Step>
      </Steps>

      <H2 id="verifikasi">Verification</H2>
      <Ul>
        <li>
          The first deployment ends in <Code>success</Code> and the
          application&apos;s status badge reads <strong>Running</strong>.
        </li>
        <li>
          The container log (Deploy tab) shows the application&apos;s output, e.g.{" "}
          <Code>Listening on :3000</Code>.
        </li>
        <li>
          If using a host port: <Code>{"curl http://<server-ip>:<host-port>/"}</Code>{" "}
          responds. If using a domain: continue to{" "}
          <DocLink href="/en/docs/domain">Proxy &amp; domain</DocLink>.
        </li>
      </Ul>

      <H2 id="tab">Tabs on the application page</H2>
      <Table
        head={["Tab", "Contains"]}
        rows={[
          ["Deploy", "Deploy/Stop/Start buttons, deployment list, deployment & streaming container logs, metrics, Rollback."],
          ["Settings", <>The same form as creation, plus build args (environment has its own tab). <strong>Host port, domains, and resource limits apply immediately</strong> to a running application — the container is recreated from the same image without a build (with a host port there is a brief downtime, since two containers cannot bind the same port). A stopped application picks up its new port when started again, and a host port change is rejected (409) while a deployment is active. Other settings take effect on the next deploy.</>],
          ["Domain", "Hostname for the application + HTTPS toggle + DNS check."],
          ["Mount", "Volumes, binds, files — and volume backups."],
          ["Environment", "The application's env variables, saved on their own, plus the secret source (Infisical). Applies on the next deploy."],
          ["Jobs", "Scheduled commands."],
          ["Webhook", "Webhook URL, secret, and pull request previews."],
          ["Console", "Interactive shell straight into the running container."],
        ]}
      />

      <H2 id="console">Console</H2>
      <P>
        The <strong>Console</strong> tab opens a <Code>docker exec -it</Code>{" "}
        into the application&apos;s running container, right from the dashboard —
        different from the <DocLink href="/en/docs/terminal">Terminal</DocLink>{" "}
        page, which opens a shell on the <em>host</em> over SSH. Handy for
        inspecting files, running a debug command, or checking the
        environment without needing SSH access to the server.
      </P>
      <Ul>
        <li>
          <strong>Access</strong>: project role <strong>developer</strong> and
          up (including platform admin/owner) — a viewer never sees this tab,
          and the API rejects it too if tried directly. A read-only API token
          is rejected as well.
        </li>
        <li>
          <strong>Logged in the audit log</strong> — every console session
          opened is its own row in Settings<PathArrow />Audit log, with who and when.
        </li>
        <li>
          <strong>service</strong> mode (Swarm) with more than one replica:
          pick a task from the dropdown above the terminal; only tasks
          running on this node are reachable.
        </li>
        <li>
          Shell used: <Code>bash</Code> if the image has it, otherwise{" "}
          <Code>sh</Code>. A <strong>distroless</strong>/shell-less image
          shows Docker&apos;s own error message and the session ends right
          away — not a bug, there simply is no shell to open.
        </li>
        <li>
          <strong>Changes made in this shell are temporary</strong>: files
          edited through Console are lost on the next redeploy, unless
          they live on a{" "}
          <DocLink href="/en/docs/mount">mounted volume</DocLink>.
        </li>
      </Ul>

      <H2 id="error-log">Log error detection</H2>
      <P>
        Every minute, the API scans the container log of every{" "}
        <strong>Running</strong> application for common error patterns
        (traceback, panic, exception, <Code>level=error</Code>, and similar)
        and sends an <strong>Application error</strong> notification when it
        finds one — see <DocLink href="/en/docs/notifikasi#event">Notifications</DocLink>{" "}
        for the pattern list, cooldown, and how to turn it on (off by default,
        per channel).
      </P>
      <P>
        For an application whose normal output just happens to look like
        errors (e.g. a verbose framework), turn on{" "}
        <strong>Ignore error logs</strong> on the Settings tab — that
        application is skipped from the scan entirely, not just muted.
      </P>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Monorepo: build cannot find package.json / Dockerfile", <>Set <strong>Root directory</strong> (for example <Code>apps/web</Code>) in the Git part. See <DocLink href="/docs/build#root-directory">Build types</DocLink>.</>],
          [
            "Deploy fails at the pushing stage",
            <>The local registry isn&apos;t provisioned yet, or <Code>REGISTRY_PUBLIC_HOST</Code> isn&apos;t localhost without TLS.</>,
          ],
          [
            "Build fails: repository not found",
            "A private repo without a Git credential, or the token lacks read access.",
          ],
          [
            "Pull fails: unauthorized (image source)",
            "A private image with no external registry selected, or an expired registry token.",
          ],
          [
            "Health check never turns healthy",
            <>
              The container port doesn&apos;t match the port the app listens on,
              the app only listens on <Code>127.0.0.1</Code>, the path
              doesn&apos;t return 2xx, or the image lacks{" "}
              <Code>wget</Code>/<Code>curl</Code>/<Code>node</Code>/<Code>python3</Code>.
            </>,
          ],
          [
            "Running but the domain 404s",
            "The container isn't healthy yet, or DNS isn't pointed at it yet — use the DNS check button on the Domain tab.",
          ],
          [
            "New env doesn't take effect",
            "Env is applied when the container is created — deploy (or rollback) once more.",
          ],
        ]}
      />

      <Callout title="Remote servers have limitations">
        Applications on a remote server are built on that server&apos;s daemon,
        without pushing to the registry and without a domain/Traefik — access
        is via host port. Details in{" "}
        <DocLink href="/en/docs/server-remote">Remote servers</DocLink>.
      </Callout>

      <H2 id="berikutnya">Next steps</H2>
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
