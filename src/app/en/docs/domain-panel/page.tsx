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

export const metadata: Metadata = { title: "Domain for the panel" }

const SUMMARY = [
  { k: "Result", v: "https://panel.example.com + https://api.panel.example.com" },
  { k: "How", v: "Dashboard/CLI (automatic) or a manual compose override — built-in Traefik" },
  { k: "Needs", v: "2 DNS records, port 80/443, PROXY_ACME_EMAIL" },
]

const BEFORE_AFTER = [
  { k: "Access", before: "http://203.0.113.10:3000", after: "https://panel.example.com" },
  { k: "API", before: "http://203.0.113.10:3001", after: "https://api.panel.example.com" },
  { k: "Session cookie", before: "no Secure flag", after: "Secure (follows WEB_ORIGIN https)" },
  { k: "Git webhook", before: "IP:3001 must be public", after: "a clean API URL" },
  { k: "Port 3000/3001", before: "the only way in", after: "still open (IP access)" },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik routers, ACME, DNS checks for applications.", href: "/en/docs/domain" },
  { title: "Web terminal", description: "The right WEB_ORIGIN for the terminal.", href: "/en/docs/terminal" },
  { title: "Webhook auto-deploy", description: "The PUBLIC_API_URL a provider calls.", href: "/en/docs/webhook" },
  { title: "Installation", description: "The full .env.dist reference.", href: "/en/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/domain-panel"
      title="Domain for the panel"
      lang="en"
      description="Serve the aoox dashboard and API on your own domain with Let's Encrypt HTTPS, using the built-in reverse proxy."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kenapa">Before & after</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium"></th>
              <th className="px-3 py-2 text-left font-medium">Via IP (default)</th>
              <th className="px-3 py-2 text-left font-medium">Via domain</th>
            </tr>
          </thead>
          <tbody>
            {BEFORE_AFTER.map((row) => (
              <tr key={row.k} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{row.k}</td>
                <td className="px-3 py-2"><Code>{row.before}</Code></td>
                <td className="px-3 py-2"><Code>{row.after}</Code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Two hostnames are needed because the browser calls the API directly
        (Socket.IO for the terminal and logs) — not through the web app.
      </P>

      <H2 id="prasyarat">Prerequisites</H2>
      <Ul>
        <li>
          aoox is already running over IP (<DocLink href="/en/docs/instalasi">Installation</DocLink>)
          and you can log in.
        </li>
        <li>Ports <Code>80</Code> and <Code>443</Code> are free on the host.</li>
        <li>Two <Code>A</Code> DNS records pointing at the server&apos;s IP:</li>
      </Ul>
      <Pre title="DNS">{`panel.example.com.       A   203.0.113.10
api.panel.example.com.   A   203.0.113.10`}</Pre>
      <P>
        Wait until <Code>dig +short panel.example.com</Code> from outside
        answers with that IP — a certificate can only be issued once DNS is
        correct.
      </P>

      <H2 id="dashboard">From the dashboard or the CLI (no SSH)</H2>
      <P>
        The fastest path: set <Code>INSTALL_DIR</Code> once in{" "}
        <Code>.env.dist</Code> (the absolute path of the folder containing{" "}
        <Code>docker-compose.dist.yml</Code> on this host), and the domain can
        then be changed anytime without SSH. The proxy (Traefik) still needs
        to already be provisioned from Settings — see{" "}
        <DocLink href="/en/docs/domain">Proxy &amp; domain</DocLink>.
      </P>
      <Steps>
        <Step title="Set INSTALL_DIR, then restart the stack">
          <Pre title=".env.dist">{`INSTALL_DIR=/opt/aoox   # absolute path of the docker-compose.dist.yml folder on this host`}</Pre>
          <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
        </Step>
        <Step title="Settings → Domain panel (owner)">
          <P>
            Fill in the dashboard domain, the API domain, and an ACME email,
            then <strong>Save &amp; apply</strong>. The panel writes{" "}
            <Code>docker-compose.override.yml</Code> through a helper
            container and re-runs <Code>docker compose up -d</Code> — the
            connection to the dashboard drops for a few seconds while the{" "}
            <Code>web</Code>/<Code>api</Code> containers are recreated, which
            is expected.
          </P>
        </Step>
        <Step title="Or from the CLI">
          <Pre>{`aoox domain set --web panel.example.com --api api.panel.example.com \\
  --acme-email you@example.com`}</Pre>
          <P>Calls the same endpoint, for operators who prefer a terminal.</P>
        </Step>
      </Steps>
      <Callout>
        Because the file written is named <Code>docker-compose.override.yml</Code>{" "}
        (not <Code>docker-compose.domain.yml</Code>), Compose automatically
        includes it on every future <Code>up</Code> — unlike the manual method
        below, which requires the <Code>-f</Code> flag to be given every time.
      </Callout>

      <H2 id="langkah">Manual, over SSH</H2>
      <P>
        An alternative when <Code>INSTALL_DIR</Code> isn&apos;t set (or you&apos;d
        rather not), or when you want full control over the compose files.
      </P>
      <Steps>
        <Step title="Set the domain variables in .env.dist">
          <Pre title=".env.dist">{`WEB_DOMAIN=panel.example.com
API_DOMAIN=api.panel.example.com
PROXY_ACME_EMAIL=you@example.com
PROXY_ACME_STAGING=false          # true while testing

# switch both to https + the domains above
WEB_ORIGIN=https://panel.example.com
PUBLIC_API_URL=https://api.panel.example.com`}</Pre>
          <Table
            head={["Variable", "Why"]}
            rows={[
              [<><Code>WEB_DOMAIN</Code> / <Code>API_DOMAIN</Code></>, "The hosts used for the Traefik labels on the web and api services."],
              [<Code key="o">WEB_ORIGIN</Code>, "Must match the browser URL exactly: the session cookie's Secure flag follows it, and the terminal/log gateway rejects any other Origin."],
              [<Code key="p">PUBLIC_API_URL</Code>, "The API URL the browser and webhook providers call."],
              [<Code key="e">PROXY_ACME_EMAIL</Code>, "Turns on the Let's Encrypt resolver; without it there's no HTTPS and no redirect."],
            ]}
          />
        </Step>

        <Step title="Restart with the domain override">
          <Pre>{`docker compose -f docker-compose.dist.yml -f docker-compose.domain.yml --env-file .env.dist up -d`}</Pre>
          <P>
            <Code>docker-compose.domain.yml</Code> attaches Traefik labels to
            the <Code>web</Code> and <Code>api</Code> services (routers{" "}
            <Code>aoox-web</Code> / <Code>aoox-api</Code> plus a{" "}
            <Code>-secure</Code> variant — the same shape as application
            domains) and joins them to the <Code>aoox</Code> network. Compose
            refuses to start if <Code>WEB_DOMAIN</Code>/<Code>API_DOMAIN</Code>{" "}
            are empty.
          </P>
          <Callout>
            From now on, <strong>always include both</strong> <Code>-f</Code>{" "}
            files on every <Code>up</Code>/<Code>pull</Code>. Running without
            the override strips the labels and the domain stops being served.
          </Callout>
        </Step>

        <Step title="Provision the reverse proxy (if not already)">
          <P>
            Log in (still over IP:3000 if needed) →{" "}
            <strong>Settings → Reverse proxy (Traefik)</strong> → provision
            (owner). A proxy that&apos;s already provisioned <em>without</em>{" "}
            <Code>PROXY_ACME_EMAIL</Code> must be removed and provisioned
            again for the ACME resolver to activate.
          </P>
        </Step>

        <Step title="Open https://panel.example.com">
          <P>
            A certificate is requested the first time the host is reached
            (a few seconds). Log in again — the old session (a cookie without
            Secure on the IP origin) doesn&apos;t carry over to the new origin.
          </P>
        </Step>
      </Steps>

      <H2 id="verifikasi">Verification</H2>
      <Pre>{`curl -I https://panel.example.com          # 200, Let's Encrypt issuer
curl -I http://panel.example.com           # 301 → https
curl -s https://api.panel.example.com/auth/setup-status   # {"needsSetup":false}`}</Pre>
      <Ul>
        <li>The web terminal opens without an <em>origin not allowed</em> error.</li>
        <li>
          Realtime logs on the Deploy tab keep streaming (Socket.IO to{" "}
          <Code>PUBLIC_API_URL</Code>).
        </li>
        <li>
          The webhook URL on an application&apos;s Webhook tab now starts with{" "}
          <Code>https://api.panel.example.com/webhooks/…</Code>.
        </li>
      </Ul>

      <H2 id="variasi">Variations</H2>
      <H3>Try it with staging first</H3>
      <P>
        <Code>PROXY_ACME_STAGING=true</Code> uses Let&apos;s Encrypt&apos;s staging
        CA (no rate limit; the certificate isn&apos;t trusted by browsers). Once
        DNS and ports are confirmed correct, switch it to <Code>false</Code>,
        remove the proxy, and provision it again — the ACME volume will then
        request a production certificate.
      </P>
      <H3>Behind Cloudflare</H3>
      <Ul>
        <li>SSL mode <strong>Full (strict)</strong>; Flexible causes a redirect loop.</li>
        <li>When first issuing the certificate, set both records to <em>DNS only</em>.</li>
        <li>
          WebSockets (terminal, logs) are supported by Cloudflare; make sure
          no rule is blocking them.
        </li>
      </Ul>
      <H3>Your own reverse proxy (nginx/Caddy in front)</H3>
      <P>
        No need for <Code>docker-compose.domain.yml</Code>: point your proxy
        at <Code>:3000</Code> and <Code>:3001</Code>, enable WebSocket
        upgrades, and still set <Code>WEB_ORIGIN</Code>/<Code>PUBLIC_API_URL</Code>{" "}
        to the public https URLs. If TLS terminates at your proxy and reaches
        aoox over http, set <Code>COOKIE_SECURE=true</Code> so the cookie
        stays Secure.
      </P>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["set WEB_DOMAIN in .env.dist during up", "The variable is empty; compose refuses to start."],
          ["Domain works, then disappears after an update", "up -d without -f docker-compose.domain.yml. Always include both files."],
          ["Login succeeds but is immediately logged out / 401", "WEB_ORIGIN is still http or a different host — the Secure cookie/origin don't match. Fix it, up -d, log in again."],
          ["Terminal: origin not allowed", "Same as above: WEB_ORIGIN ≠ the browser's URL."],
          ["Traefik's default certificate", "PROXY_ACME_EMAIL was empty at provision time, DNS isn't correct yet, or port 80 is closed. Remove the proxy → provision again once fixed."],
          ["Logs/terminal don't stream, other pages are fine", "PUBLIC_API_URL isn't reachable from the browser (WebSockets blocked by a proxy in front)."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        A single hostname for web+API (path-based); wildcard certificates;
        DNS validation before applying (unlike application domains, which
        have their own DNS check); automatic rollback if{" "}
        <Code>docker compose up</Code> fails after the domain is changed.
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
