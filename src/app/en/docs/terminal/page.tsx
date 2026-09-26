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

export const metadata: Metadata = { title: "Web terminal" }

const SUMMARY = [
  { k: "Who", v: "Owner & admin only" },
  { k: "To where", v: "The aoox host (SSH) or a remote server" },
  { k: "Client", v: "xterm.js in the browser → Socket.IO → SSH" },
]

const FLOW = [
  { s: "ticket", d: "the browser requests a 60-second, single-use JWT ticket scoped to terminal" },
  { s: "socket", d: "Socket.IO /terminal with the ticket + column/row size" },
  { s: "ssh", d: "the API opens an SSH session to the target using the platform key" },
  { s: "shell", d: "input/output is forwarded; resize follows the window" },
]

const NEXT = [
  { title: "Remote servers", description: "Terminal targets besides the host.", href: "/en/docs/server-remote" },
  { title: "Users & roles", description: "Why members don't get a terminal.", href: "/en/docs/pengguna-peran" },
  { title: "Domain for the panel", description: "The right WEB_ORIGIN for the terminal.", href: "/en/docs/domain-panel" },
  { title: "Troubleshooting", description: "origin not allowed and friends.", href: "/en/docs/troubleshooting" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/terminal"
      title="Web terminal"
      lang="en"
      description="A shell into the aoox host (or a remote server) straight from the browser, for owners and admins."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="cara-kerja">How it works</H2>
      <P>
        A container can&apos;t open a shell on its own host, so the API connects
        to the host over <strong>SSH</strong>. The browser never holds SSH
        credentials:
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Table
        head={["Mode", "When", "Shell you get"]}
        rows={[
          [
            <strong key="s">SSH to the host</strong>,
            <><Code>TERMINAL_SSH_HOST</Code> is set (default <Code>host.docker.internal</Code>)</>,
            "The SSH user's shell on the host — usually what you want.",
          ],
          [
            <strong key="l">Local</strong>,
            <><Code>TERMINAL_SSH_HOST</Code> is empty</>,
            "A shell inside the API container itself (bash as the node user) — for debugging the API only.",
          ],
        ]}
      />

      <H2 id="setup">Setting up SSH to the host</H2>
      <Steps>
        <Step title="Enable an SSH server on the host">
          <Pre title="Linux">{`sudo apt install openssh-server && sudo systemctl enable --now ssh`}</Pre>
          <P>
            Windows (dev): the optional <em>OpenSSH Server</em> feature. The
            distribution compose file already maps{" "}
            <Code>host.docker.internal</Code> to the host gateway on Linux.
          </P>
        </Step>
        <Step title="Fill in the terminal env in .env.dist">
          <Pre title=".env.dist">{`TERMINAL_SSH_HOST=host.docker.internal
TERMINAL_SSH_PORT=22
TERMINAL_SSH_USER=deploy        # the host user the terminal will use`}</Pre>
          <P>
            Run <Code>up -d</Code> again after changing the env. Without{" "}
            <Code>TERMINAL_SSH_USER</Code> the Terminal card shows{" "}
            <em>Needs attention</em>.
          </P>
        </Step>
        <Step title="Authorize the platform key">
          <P>
            The API generates an ed25519 keypair in <Code>./secrets</Code> the
            first time it&apos;s needed. <strong>Settings → Terminal</strong> shows
            the public key and the command to run <strong>once</strong> on the
            host as <Code>TERMINAL_SSH_USER</Code>:
          </P>
          <Pre>{`mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
echo 'ssh-ed25519 AAAA… aoox' >> ~/.ssh/authorized_keys`}</Pre>
          <P>The same key is used for remote servers — one authorization per host.</P>
        </Step>
        <Step title="Open the Terminal menu">
          <P>
            Pick a target (<strong>aoox host</strong> / a remote server) and
            start typing. The terminal size follows the browser window; the
            session closes when the tab is closed or the connection drops.
          </P>
        </Step>
      </Steps>

      <H3>Alternative credentials</H3>
      <Table
        head={["Env", "When to use it", "Notes"]}
        rows={[
          [<Code key="1">TERMINAL_SSH_PRIVATE_KEY_FILE</Code>, "Bring your own key", <>A path inside the API container (mount it to <Code>/run/secrets/…</Code>); add <Code>TERMINAL_SSH_PASSPHRASE</Code> if it&apos;s encrypted.</>],
          [<Code key="2">TERMINAL_SSH_PRIVATE_KEY</Code>, "An inline key in env", "Less practical; avoid it in a committed file."],
          [<Code key="3">TERMINAL_SSH_PASSWORD</Code>, "An SSH password", "Less secure — for quick testing only."],
        ]}
      />
      <P>Priority: an explicit key → password → the platform key (default).</P>

      <H2 id="pakai">Usage tips</H2>
      <Ul>
        <li>
          Every aoox container is visible from the host:{" "}
          <Code>docker ps --filter label=com.docker.compose.project=aoox</Code>.
        </li>
        <li>
          To get into an application container: <Code>docker exec -it aoox-app-&lt;slug&gt; sh</Code>.
          For routine commands, a <DocLink href="/en/docs/jobs">job</DocLink> is cleaner.
        </li>
        <li>
          Proxy logs when a certificate misbehaves:{" "}
          <Code>docker logs -f aoox-proxy</Code>.
        </li>
        <li>
          Paste with <Code>Ctrl+Shift+V</Code> (Linux/Windows) or{" "}
          <Code>Cmd+V</Code> (macOS); <Code>Ctrl+C</Code> is forwarded to the
          shell, it doesn&apos;t copy.
        </li>
      </Ul>

      <H2 id="masalah">If it fails</H2>
      <Table
        head={["Message", "Cause & fix"]}
        rows={[
          ["auth failed + an authorization command", "The key isn't in that user's authorized_keys yet. Run the command shown in the terminal/Settings."],
          ["origin not allowed", <><Code>WEB_ORIGIN</Code> doesn&apos;t exactly match the browser&apos;s URL (scheme/host/port). Fix it, then <Code>up -d</Code> again.</>],
          ["TERMINAL_SSH_USER is not set", "Fill in the env, restart the stack."],
          ["connect ECONNREFUSED / timeout", "sshd isn't running, the port is wrong, or host.docker.internal doesn't resolve (Linux without extra_hosts — use the docker0 gateway IP, e.g. 172.17.0.1)."],
          ["Key directory not writable (uid 1000)", <>Fix ownership of the <Code>./secrets</Code> folder: <Code>sudo chown -R 1000:1000 ./secrets</Code>.</>],
          ["403 when opening the terminal", "A member role. Owner/admin only."],
        ]}
      />

      <Callout kind="warn" title="This is equivalent to a shell on the host">
        Only <strong>owner</strong> and <strong>admin</strong> can create a
        terminal ticket; it&apos;s checked again at the gateway. Tickets live for
        60 seconds and are single-use; the gateway rejects any{" "}
        <Code>Origin</Code> other than <Code>WEB_ORIGIN</Code>. This feature
        is meant for a trusted dev/self-hosted environment — the SSH host key
        isn&apos;t verified. Opening a session (creating a ticket) is recorded in
        the audit log; the commands typed are not.
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
