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

export const metadata: Metadata = { title: "Remote servers" }

const SUMMARY = [
  { k: "Transport", v: "SSH → docker system dial-stdio" },
  { k: "Needed on the server", v: "sshd + Docker CLI, no agent" },
  { k: "Who", v: "Owner/admin registers it; anyone can select it" },
]

const FLOW = [
  { s: "ssh", d: "one ssh2 session from the API to the server (lazy, reconnects)" },
  { s: "dial-stdio", d: "every Docker API request runs through docker system dial-stdio" },
  { s: "build", d: "the server's daemon clones and builds the image" },
  { s: "run", d: "the container runs on the server; logs stream through the same tunnel" },
]

const NEXT = [
  { title: "Web terminal", description: "A shell into a remote server from the browser.", href: "/en/docs/terminal" },
  { title: "Creating an application", description: "Select a Server in the application form.", href: "/en/docs/aplikasi" },
  { title: "Managed databases", description: "Connecting a remote app to a database on the host.", href: "/en/docs/database#koneksi" },
  { title: "Proxy & domain", description: "Why domains don't work the same on a remote server.", href: "/en/docs/domain#catatan" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/server-remote"
      title="Remote servers"
      lang="en"
      description="Connect another server over SSH as an additional deploy target — no agent, just the Docker CLI on the target server."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">When to use a remote server</H2>
      <Ul>
        <li>A heavy application that doesn&apos;t fit on the aoox host.</li>
        <li>Splitting the load: panel + database on one VPS, applications on another.</li>
        <li>A different region/location for latency.</li>
      </Ul>
      <P>
        One aoox instance is still one panel; a remote server just adds
        another <em>place</em> for containers to run.
      </P>

      <H2 id="prasyarat">Prerequisites on the target server</H2>
      <Ul>
        <li>An SSH server running and reachable from the aoox host (port 22 or another).</li>
        <li>
          <strong>Docker installed</strong>, with the SSH user allowed to use it:
        </li>
      </Ul>
      <Pre title="On the target server">{`curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy      # if not root
docker system dial-stdio --help     # must exist (Docker 20.10+)`}</Pre>
      <Ul>
        <li>
          Just the CLI and daemon — <strong>no SSH port forwarding needed</strong>.
          A hardened sshd with <Code>AllowTcpForwarding no</Code> still works
          fine.
        </li>
        <li>No need to expose the Docker port (2375/2376) to the network.</li>
        <li>
          For a domain served directly on that server: ports 80/443 must be
          free (see{" "}
          <DocLink href="/en/docs/server-remote#proxy">proxy per server</DocLink>).
        </li>
      </Ul>

      <H2 id="cara-kerja">How it works</H2>
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
        This is the same approach as <Code>docker -H ssh://user@host</Code>:
        the API talks to the remote daemon as if it were local, over the
        stdio of a <Code>docker</Code> process on the server. One SSH session
        per server is cached and reconnected if it drops.
      </P>

      <H2 id="langkah">Adding a server</H2>
      <Steps>
        <Step title="Settings → Remote servers → New remote server (owner/admin)">
          <Table
            head={["Field", "Notes"]}
            rows={[
              ["Name", "A label, e.g. app-sg-1."],
              ["Host / Port / Username", <>The SSH address, e.g. <Code>203.0.113.10</Code>, <Code>22</Code>, <Code>root</Code> or a user in the docker group.</>],
              [
                "Private key (optional)",
                "Leave blank to use the aoox platform key (recommended). Paste a PEM/OpenSSH key to bring your own — it's stored encrypted and never shown again.",
              ],
            ]}
          />
        </Step>
        <Step title="Authorize the platform key (if not using your own)">
          <P>
            The Remote servers card shows the platform&apos;s public key and the
            command to run <strong>once</strong> on the target server as that
            SSH user — aoox can&apos;t write to another host&apos;s{" "}
            <Code>authorized_keys</Code>:
          </P>
          <Pre>{`mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
echo 'ssh-ed25519 AAAA… aoox' >> ~/.ssh/authorized_keys`}</Pre>
          <P>
            The platform key is generated automatically (ed25519) the first
            time it&apos;s needed and stored in <Code>./secrets</Code> on the aoox
            host — one key for all servers and the terminal.
          </P>
        </Step>
        <Step title="Test the connection">
          <P>The test button opens a brief shell, then checks Docker over the tunnel. Results:</P>
          <Table
            head={["Result", "Meaning"]}
            rows={[
              ["OK + Docker version", "Ready to use."],
              ["Auth rejected + authorization command", "The key isn't in authorized_keys yet — run the command shown."],
              ["Connected, Docker error", "docker isn't on that user's PATH, the user isn't in the docker group, or the daemon is down."],
            ]}
          />
        </Step>
      </Steps>

      <H2 id="deploy">Deploying to a remote server</H2>
      <P>
        In the application form, pick <strong>Server</strong> → the target
        server (the select only appears if a server is registered; members
        see an empty list because the server endpoint is restricted to
        owner/admin). The application shows the server&apos;s name as a badge.
      </P>
      <Table
        head={["Aspect", "Remote server"]}
        rows={[
          ["Build", "On the target server's daemon — Dockerfile, Nixpacks, static sites (the helper image is built there too)."],
          ["Registry", <><strong>No push</strong>. The image stays on the server under the ref <Code>{"aoox/<project>/<app>:<tag>"}</Code>; rollback reuses whatever&apos;s still there.</>],
          ["Domain / Traefik", <><strong>Yes</strong> — provision a proxy on that server (the <em>Proxy (Traefik) on this server</em> card), then add domains as usual. A <strong>host port</strong> is still an option too.</>],
          ["Blue/green", "Yes, if the server has a proxy and the app has no host port; without a proxy it's a plain replace."],
          ["Container logs", "Available (realtime, over the tunnel)."],
          ["CPU/RAM metrics", <><strong>No</strong> — the sampler only reads the aoox host&apos;s daemon.</>],
          ["Env & database references", <>Env still applies; <Code>{"${{database…}}"}</Code> references resolve to an internal host that&apos;s <strong>unreachable</strong> from another server — use an external connection instead.</>],
          ["Mounts & volume backups", "Yes — volumes, files, and volume backups (including S3 upload/download) run on that server's daemon."],
          ["Jobs", "Yes, on that server's daemon."],
          ["Container-down notifications", "Local host only."],
          ["PR previews", "No (no host/domain)."],
          ["Disk maintenance", "Old deployment images are also pruned on the remote server; dangling images/build cache are local only."],
        ]}
      />

      <H3>Example: app on a remote server + database on the host</H3>
      <Pre title="Application env (remote server)">{`# not \${{database.app-db.url}} — the internal host is unreachable from another server
DATABASE_URL=postgresql://app:PASSWORD@203.0.113.5:15432/app_db`}</Pre>
      <Ul>
        <li>Set a <strong>host port</strong> on the database (e.g. 15432) and restrict that port on the host&apos;s firewall to the remote server&apos;s IP.</li>
        <li>Copy the password from the database&apos;s Overview tab (unmask → copy).</li>
      </Ul>

      <H2 id="proxy">Proxy & domain on a remote server</H2>
      <P>
        Each server can run its own Traefik. On the server&apos;s card, under{" "}
        <strong>Proxy (Traefik) on this server</strong>: set the{" "}
        <strong>HTTP</strong>/<strong>HTTPS</strong> ports (default 80/443) and
        an <strong>ACME email</strong> if you want a Let&apos;s Encrypt
        certificate, then provision.
      </P>
      <Ul>
        <li>
          Once the proxy exists, applications on that server get Traefik
          labels using that server&apos;s settings — the Domain tab works just
          like it does on the host.
        </li>
        <li>
          The domain&apos;s DNS must point to <strong>that server&apos;s IP</strong>,
          not the aoox host. The DNS check compares against the registered
          server&apos;s host.
        </li>
        <li>
          Ports 80/443 on that server must be free; ACME HTTP-01 needs port
          80 open to the internet.
        </li>
        <li>
          Without a server proxy, the application can still be reached via a{" "}
          <strong>host port</strong>, as before.
        </li>
      </Ul>

      <H2 id="terminal">Terminal to a remote server</H2>
      <P>
        The Terminal page has a target selector: <strong>aoox host</strong>{" "}
        or one of the servers. The target is bound to the ticket by the API,
        not sent from the browser. See{" "}
        <DocLink href="/en/docs/terminal">Web terminal</DocLink>.
      </P>

      <H2 id="hapus">Removing a server</H2>
      <Callout kind="warn">
        A server that still has applications on it can&apos;t be deleted (409).
        Delete or move its applications first (change <strong>Server</strong>{" "}
        in Settings → the next deploy builds on the new target; the container
        on the old server isn&apos;t removed automatically).
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Test: auth failed", "The key hasn't been authorized yet, or the username is wrong. Run the authorization command as that same user."],
          ["Test: docker: command not found", "Docker isn't installed, or the non-interactive shell's PATH doesn't include it (snap). Install via get.docker.com."],
          ["Test: permission denied while trying to connect to the Docker daemon", "The user isn't in the docker group. usermod -aG docker <user>, then log in again."],
          ["Deploy succeeds but isn't reachable", "The host port is empty and the server has no proxy yet, or the server's firewall is blocking that port."],
          ["The application can't reach the database", "It's using an internal reference/host. Use an external connection + the database's host port instead."],
          ["Nixpacks/static: the first build takes forever", "The helper image and base image are pulled on that server (once per server)."],
        ]}
      />

      <Callout kind="warn" title="Security">
        The target server&apos;s SSH host key is <strong>not verified</strong> —
        vulnerable to MITM on untrusted networks. Use a private
        network/VPN between servers when possible. SSH credentials give aoox
        Docker-root-equivalent access on that server.
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
