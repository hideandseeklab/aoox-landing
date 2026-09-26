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

export const metadata: Metadata = { title: "Proxy & domain" }

const SUMMARY = [
  { k: "Proxy", v: "Traefik v3, the aoox-proxy container" },
  { k: "HTTPS", v: "Let's Encrypt HTTP-01, automatic per host" },
  { k: "Scope", v: "The aoox host and each remote server" },
]

const REQUEST_FLOW = [
  { s: "browser", d: "https://app.example.com" },
  { s: "DNS", d: "A record → server IP" },
  { s: "Traefik :443", d: "the <app>-secure router, ACME certificate" },
  { s: "container", d: "the aoox network → :<container port>" },
]

const ROUTERS = [
  { name: "<app>", entry: "web (:80)", when: "Always", does: "Serves http for hosts without HTTPS" },
  { name: "<app>-secure", entry: "websecure (:443)", when: "When HTTPS is on", does: "TLS via the le certresolver" },
  { name: "<app>-redirect", entry: "web (:80)", when: "HTTPS on + ACME set up", does: "301 http → https" },
]

const NEXT = [
  { title: "Domain for the panel", description: "The dashboard & API on your own domain.", href: "/en/docs/domain-panel" },
  { title: "Deploy & rollback", description: "Blue/green needs a domain without a host port.", href: "/en/docs/deploy#blue-green" },
  { title: "Pull request previews", description: "A wildcard subdomain per PR.", href: "/en/docs/preview" },
  { title: "Compose stacks", description: "A domain per service.", href: "/en/docs/compose#domain" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/domain"
      title="Proxy & domain"
      lang="en"
      description="Turning on the Traefik reverse proxy, pointing domains at applications, automatic HTTPS from Let's Encrypt, and checking DNS."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">One request&apos;s flow</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {REQUEST_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Traefik uses the <em>docker provider</em>: it reads labels on
        application containers and only exposes the ones with a label
        (<Code>exposedbydefault=false</Code>). There&apos;s no configuration file
        to edit — aoox writes the labels when a container is created.
      </P>

      <H2 id="proxy">Provisioning the reverse proxy</H2>
      <P>
        Traefik runs per <em>daemon</em>: one on the aoox host, and
        optionally one on each{" "}
        <DocLink href="/en/docs/server-remote#proxy">remote server</DocLink>{" "}
        with its own port and ACME email. The steps below are for the host.
      </P>
      <Steps>
        <Step title="Make sure ports 80/443 are free on the host">
          <Pre>{`ss -ltnp | grep -E ':80 |:443 '   # should be empty`}</Pre>
          <P>
            The ports can be changed via <Code>PROXY_HTTP_PORT</Code> /{" "}
            <Code>PROXY_HTTPS_PORT</Code> in <Code>.env.dist</Code>, but
            Let&apos;s Encrypt HTTP-01 <strong>needs port 80</strong> and
            browsers expect 443.
          </P>
        </Step>
        <Step title="Set PROXY_ACME_EMAIL (for HTTPS)">
          <Pre title=".env.dist">{`PROXY_ACME_EMAIL=you@example.com
PROXY_ACME_STAGING=false     # true while testing, to avoid the rate limit`}</Pre>
          <P>
            Without an email, Traefik runs without an ACME resolver: domains
            are served over http only and the HTTPS toggle in the UI is
            disabled. Changing this value after provisioning → remove the
            proxy then provision it again.
          </P>
        </Step>
        <Step title="Settings → Reverse proxy (Traefik) → provision (owner)">
          <P>
            The <Code>aoox-proxy</Code> container is created on the{" "}
            <Code>aoox</Code> network with the <Code>aoox_proxy_acme</Code>{" "}
            volume for certificates. The card shows a <em>Running</em> status
            and whether ACME is active.
          </P>
        </Step>
      </Steps>

      <H2 id="domain">Adding a domain to an application</H2>
      <Steps>
        <Step title="Point DNS">
          <Pre title="DNS">{`app.example.com.   A      203.0.113.10
# or
app.example.com.   CNAME  server.example.com.`}</Pre>
          <P>
            DNS can be set up later — aoox doesn&apos;t block on it. But a
            certificate can only be issued once DNS is correct.
          </P>
        </Step>
        <Step title="Application page → Domain tab → add">
          <P>
            Fill in the <strong>Hostname</strong> (<Code>app.example.com</Code>,
            no scheme/path) and turn on <strong>HTTPS</strong> if the proxy
            has ACME. The container is recreated with the new Traefik label —
            no build. One application can have several hostnames.
          </P>
        </Step>
        <Step title="Clear the Host port (recommended)">
          <P>
            With a domain, a host port isn&apos;t needed; clearing it enables{" "}
            <DocLink href="/en/docs/deploy#blue-green">blue/green</DocLink>{" "}
            deploys and closes off direct IP:port access.
          </P>
        </Step>
        <Step title="Check DNS">
          <P>
            The DNS check button on the domain row compares the resolved
            result with the expected IP — <Code>PUBLIC_IP</Code> if set,
            auto-detected via ipify (cached 10 minutes), or the remote
            server&apos;s host:
          </P>
          <Table
            head={["Badge", "Meaning", "Action"]}
            rows={[
              [<Code key="1">ok</Code>, "Points at this server.", "—"],
              [<Code key="2">mismatch</Code>, "Resolves to a different IP.", "Fix the A/CNAME record; wait out the TTL."],
              [<Code key="3">unresolved</Code>, "No record yet.", "Create the record with your DNS provider."],
              [<Code key="4">?</Code>, "The server's public IP is unknown.", <>Set <Code>PUBLIC_IP</Code> in <Code>.env.dist</Code> (server behind NAT/Cloudflare).</>],
            ]}
          />
        </Step>
      </Steps>

      <H2 id="https">How HTTPS works</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Router</th>
              <th className="px-3 py-2 text-left font-medium">Entrypoint</th>
              <th className="px-3 py-2 text-left font-medium">Created when</th>
              <th className="px-3 py-2 text-left font-medium">Does</th>
            </tr>
          </thead>
          <tbody>
            {ROUTERS.map((r) => (
              <tr key={r.name} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{r.name}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{r.entry}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.when}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Ul>
        <li>
          A certificate is requested via <strong>HTTP-01</strong> the first
          time the host is reached; Let&apos;s Encrypt must be able to reach
          port 80 on the server from the internet. Traefik renews it
          automatically.
        </li>
        <li>
          The http → https redirect is only created when ACME is active, so
          that without <Code>PROXY_ACME_EMAIL</Code> (dev) a host is still
          reachable over http, rather than redirected to Traefik&apos;s
          self-signed certificate.
        </li>
        <li>
          A container that becomes <Code>unhealthy</Code> is automatically
          dropped from the router (404) — that&apos;s what the health check is
          for.
        </li>
      </Ul>

      <H3>Behind Cloudflare</H3>
      <Ul>
        <li>
          The DNS check shows <em>mismatch</em> because the hostname resolves
          to a Cloudflare IP — ignore it if it&apos;s proxied on purpose. When
          issuing a certificate for the first time, set the record to{" "}
          <em>DNS only</em> first so HTTP-01 can reach the server, then
          switch proxying back on.
        </li>
        <li>
          Cloudflare&apos;s SSL mode must be <strong>Full (strict)</strong> so the
          origin is served over Traefik&apos;s HTTPS; Flexible mode causes a
          redirect loop with the <Code>-redirect</Code> router.
        </li>
      </Ul>

      <H2 id="operasi">Operations</H2>
      <Table
        head={["Action", "Effect"]}
        rows={[
          ["Remove a domain", "The container is recreated without that host's label; the certificate stays on the ACME volume."],
          ["Toggle HTTPS", "The container is recreated; the -secure/-redirect routers are added/removed."],
          ["Remove the proxy (owner)", "All domains stop being served; application containers aren't touched. You'll be asked about the ACME volume."],
          ["Change PROXY_ACME_EMAIL / port", "Change .env.dist → remove the proxy → provision it again."],
        ]}
      />

      <H2 id="catatan">Notes</H2>
      <Ul>
        <li>
          Applications on a <strong>remote server</strong> use that server&apos;s
          own proxy: provision it from the server card (port + ACME email),
          then point DNS at that server&apos;s IP — see{" "}
          <DocLink href="/en/docs/server-remote#proxy">Remote servers</DocLink>.
          Without a proxy there, use a host port instead.
        </li>
        <li>
          Compose stacks use a domain per service — see{" "}
          <DocLink href="/en/docs/compose#domain">Compose stacks</DocLink>. A
          compose file can also carry its own <Code>traefik.*</Code> labels,
          as long as it joins the <Code>aoox</Code> network.
        </li>
        <li>
          The domain for the aoox panel itself is set via env, not the
          Domain tab — see{" "}
          <DocLink href="/en/docs/domain-panel">Domain for the panel</DocLink>.
        </li>
        <li>
          Local dev uses ports 8088/8443 (80 is often taken); production uses
          80/443. Don&apos;t mix values between environments.
        </li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Domain tab: Proxy not running", "Provision it in Settings first."],
          ["HTTPS toggle disabled", <><Code>PROXY_ACME_EMAIL</Code> was empty at provision time. Fill it in, remove the proxy, provision again.</>],
          ["404 page not found from Traefik", "The container isn't healthy yet, or the domain was added but the container hasn't been recreated (check the deploy log)."],
          ["Self-signed certificate / TRAEFIK DEFAULT CERT", "ACME failed: DNS isn't correct yet, port 80 is closed, or a rate limit was hit. Check the aoox-proxy container's log in the terminal; test with PROXY_ACME_STAGING=true."],
          ["Redirect loop", "Cloudflare in Flexible mode, or another reverse proxy in front terminating TLS. Use Full (strict), or turn off HTTPS in aoox."],
          ["Works via IP:port but not via the domain", "A host port still being set isn't a problem — check DNS and that the proxy is Running."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Periodic/automatic DNS checks; wildcard certificates (DNS-01);
        www ↔ apex redirects; path/prefix routing; basic auth per domain. A
        certificate that fails to issue is now reported via{" "}
        <DocLink href="/en/docs/notifikasi">notifications</DocLink>.
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
