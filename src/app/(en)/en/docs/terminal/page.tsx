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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en/docs/terminal",
  lang: "en",
  title: "Web terminal",
  description:
    "A shell into the host or a remote server, from the browser.",
})

const SUMMARY = [
  { k: "Who", v: "Owner & admin only" },
  { k: "To where", v: "The aoox host (SSH) or a remote server" },
  { k: "Client", v: <>xterm.js in the browser<PathArrow />Socket.IO<PathArrow />SSH</> },
]

const FLOW = [
  { s: "ticket", d: "the browser requests a 60-second, single-use JWT ticket scoped to terminal" },
  { s: "socket", d: "Socket.IO /terminal with the ticket + column/row size" },
  { s: "ssh", d: "the API opens an SSH session to the target using the platform key" },
  { s: "shell", d: "input/output is forwarded; resize follows the window" },
]

const NEXT = [
  { title: "Remote servers", description: "Terminal targets besides the host.", href: "/en/docs/remote-servers" },
  { title: "Users & roles", description: "Why members don't get a terminal.", href: "/en/docs/users-roles" },
  { title: "Domain for the panel", description: "The right WEB_ORIGIN for the terminal.", href: "/en/docs/panel-domain" },
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
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="how-it-works">How it works</H2>
      <P>
        A container can&apos;t open a shell on its own host, so the API connects
        to the host over <strong>SSH</strong>. The browser never holds SSH
        credentials:
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4 rounded-lg overflow-hidden">
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
            Run <Code>up -d</Code> again after changing the env. When{" "}
            <Code>TERMINAL_SSH_USER</Code> is empty, the terminal logs in as{" "}
            <Code>root</Code> (the default of older installs) — the Terminal
            card marks it as the default user. A new install through{" "}
            <Code>sudo aoox install</Code> or the one-line script (
            <Code>curl … | sudo sh</Code>) fills it with the name of the user
            who ran <Code>sudo</Code> (when it is a plain login name and not{" "}
            <Code>root</Code>; otherwise <Code>root</Code>; an explicit{" "}
            <Code>--terminal-ssh-user</Code> flag or <Code>TERMINAL_SSH_USER</Code>{" "}
            env always wins); existing installs don&apos;t change
            (change it in Environment, see{" "}
            <DocLink href="#ssh-user">SSH user on a cloud VPS</DocLink>). If the
            connection fails, the terminal shows
            a link to <strong>Infrastructure<PathArrow />Environment</strong> to fix the
            settings.
          </P>
        </Step>
        <Step title="Authorize the platform key">
          <P>
            A <strong>new install</strong> does this itself:{" "}
            <Code>sudo aoox install</Code> and the one-line script create the
            key in <Code>secrets/</Code> and add it to the terminal user&apos;s{" "}
            <Code>~/.ssh/authorized_keys</Code>. On an <strong>existing install</strong>,
            the owner just clicks <strong>Authorize automatically</strong>
            in Infrastructure<PathArrow />Terminal (or in the
            error notice on the Terminal page); aoox adds the public key to that
            user&apos;s <Code>authorized_keys</Code>, tests the login and
            reconnects. No password or private key is written. The manual
            command below stays visible as a fallback.
          </P>
          <P>
            The API generates an ed25519 keypair in <Code>./secrets</Code> the
            first time it&apos;s needed. <strong>Settings<PathArrow />Terminal</strong> shows
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

      <H2 id="ssh-user">SSH user on a cloud VPS</H2>
      <P>
        The terminal logs in to the host as the user in the <strong>User</strong>{" "}
        field (<Code>TERMINAL_SSH_USER</Code>), and the key authorization command
        has to be run on the host <strong>as that same user</strong>. On a cloud
        VPS (Ubuntu, Tencent and the like) <Code>root</Code> login is usually
        turned off in sshd (<Code>PermitRootLogin no</Code>, or only through the
        provider&apos;s key), so the <Code>root</Code> default is often refused.
      </P>
      <Steps>
        <Step title="Set User to the VPS login user">
          <P>
            Open <strong>Infrastructure<PathArrow />Environment</strong> (owner),
            set <strong>User</strong> to the user you SSH into the VPS with — on
            Ubuntu usually <Code>ubuntu</Code> — and save. The panel restarts
            the API container for a few seconds.
          </P>
        </Step>
        <Step title="Authorize the key as that user">
          <P>
            On the VPS, log in as the same user and run the authorization
            command from <strong>Infrastructure<PathArrow />Terminal</strong>{" "}
            (the three lines above). It writes to the{" "}
            <Code>~/.ssh/authorized_keys</Code> of the user running it, so
            don&apos;t run it with <Code>sudo</Code>.
          </P>
        </Step>
        <Step title="Reconnect">
          <P>Click <strong>Reconnect</strong> in the Terminal menu.</P>
        </Step>
      </Steps>

      <H3>Limits of automatic authorization</H3>
      <Ul>
        <li>Only for the <strong>aoox host</strong> with the platform key. <strong>Remote servers</strong> stay manual (the authorization command on the Remote servers page), and so does using your own key or password.</li>
        <li>Only the owner sees the button (an admin can still use the manual command).</li>
        <li>The key goes into the terminal user&apos;s <Code>~/.ssh/authorized_keys</Code>. If sshd uses an <Code>AuthorizedKeysFile</Code> elsewhere, the key won&apos;t be read: aoox reports that the connection test failed and you need to install the key in that location.</li>
        <li>SELinux (e.g. RHEL/Rocky) can stop sshd from reading a freshly written file; fix the context with <Code>restorecon -R ~/.ssh</Code> on the host.</li>
        <li>If <Code>~/.ssh</Code> or <Code>authorized_keys</Code> is a symlink, aoox refuses to follow it and asks for a manual authorization.</li>
        <li>If Docker uses a custom bridge/gateway (not a default address such as <Code>host.docker.internal</Code> or <Code>172.17.0.1</Code>), the button does not appear; use the manual command.</li>
        <li>A new install can skip the automatic step with <Code>--no-terminal-authorize</Code> (CLI) or <Code>AOOX_NO_TERMINAL_AUTHORIZE=1</Code> (one-line script).</li>
      </Ul>

      <H3>Alternative credentials</H3>
      <Table
        head={["Env", "When to use it", "Notes"]}
        rows={[
          [<Code key="1">TERMINAL_SSH_PRIVATE_KEY_FILE</Code>, "Bring your own key", <>A path inside the API container (mount it to <Code>/run/secrets/…</Code>); add <Code>TERMINAL_SSH_PASSPHRASE</Code> if it&apos;s encrypted.</>],
          [<Code key="2">TERMINAL_SSH_PRIVATE_KEY</Code>, "An inline key in env", "Less practical; avoid it in a committed file."],
          [<Code key="3">TERMINAL_SSH_PASSWORD</Code>, "An SSH password", "Less secure — for quick testing only."],
        ]}
      />
      <P>Priority: an explicit key<PathArrow />password<PathArrow />the platform key (default).</P>

      <H2 id="usage">Usage tips</H2>
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

      <H2 id="problems">If it fails</H2>
      <Table
        head={["Message", "Cause & fix"]}
        rows={[
          ["auth failed + an authorization command", "The key isn't in that user's authorized_keys yet. Run the command shown in the terminal/Settings."],
          [<>SSH authentication failed for root@host.docker.internal</>, <>The terminal tried to log in as <Code>root</Code> while your VPS login is another user and sshd usually refuses root. The owner can try the <strong>Authorize automatically</strong> button once User in Environment is right. Check: (1) the User field in Infrastructure<PathArrow />Environment equals the VPS login user (e.g. <Code>ubuntu</Code>); (2) the platform key is in <Code>~/.ssh/authorized_keys</Code> of <em>that user</em> (not root); (3) if you really want root, <Code>PermitRootLogin</Code> in <Code>/etc/ssh/sshd_config</Code> allows key login (<Code>prohibit-password</Code> or <Code>yes</Code>), then <Code>sudo systemctl reload ssh</Code>.</>],
          ["Automatic authorization: \"…but the connection test failed\"", <>The key was written, but the test login is still refused: sshd uses an <Code>AuthorizedKeysFile</Code> elsewhere, SELinux blocks it, or key login is off (<Code>PubkeyAuthentication no</Code>). Check <Code>/etc/ssh/sshd_config</Code>, then <Code>restorecon -R ~/.ssh</Code> if SELinux is on; the manual command is still available.</>],
          ["origin not allowed", <><Code>WEB_ORIGIN</Code> doesn&apos;t exactly match the browser&apos;s URL (scheme/host/port). Fix it, then <Code>up -d</Code> again.</>],
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
