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
  path: "/en/docs/proxy-configuration",
  lang: "en",
  title: "Proxy configuration (middlewares)",
  description:
    "Write Traefik dynamic configuration from the dashboard (basic auth, security headers, rate limit, IP allowlist, www redirect) and attach it as per-domain middlewares.",
})

const SUMMARY = [
  { k: "Manage", v: <>Infrastructure<PathArrow />Reverse proxy<PathArrow />Dynamic configuration (owner; admins read only)</> },
  { k: "Attach", v: <>Application<PathArrow />Domain tab<PathArrow />Middleware<PathArrow />Configure</> },
  { k: "Scope", v: "Traefik dynamic configuration per proxy (host or remote server)" },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik, application domains, and automatic Let's Encrypt.", href: "/en/docs/domain" },
  { title: "Custom SSL certificates", description: "Your own certificates; managed separately from the files here.", href: "/en/docs/ssl-certificates" },
  { title: "Remote servers", description: "A proxy per server and deploys over SSH.", href: "/en/docs/remote-servers" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/proxy-configuration"
      title="Proxy configuration (middlewares)"
      description="Write your own Traefik middlewares (authentication, headers, rate limiting, IP allowlist, redirects) and attach them per domain without touching the server."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="concepts">How it works</H2>
      <P>
        Traefik reads dynamic configuration from a directory and reloads every
        file that changes, without a restart. aoox keeps the YAML files you
        write in its database (the source of truth) and writes them to the
        proxy as <Code>user-&lt;name&gt;.yml</Code>. They are separate from
        custom certificates: aoox never touches <Code>certs.yml</Code> or the
        certificate files, and certificate handling never touches{" "}
        <Code>user-</Code> files.
      </P>
      <Ul>
        <li>One list of files <strong>per proxy</strong>: pick <em>aoox host</em> or one of the remote servers at the top of the card.</li>
        <li>Only the <Code>http</Code> section is accepted: <Code>middlewares</Code>, <Code>routers</Code>, <Code>services</Code>, <Code>serversTransports</Code>. <Code>tls</Code> (certificates are managed under <DocLink href="/en/docs/ssl-certificates">SSL certificates</DocLink>), <Code>tcp</Code>, <Code>udp</Code> and other keys are rejected with a clear message.</li>
        <li>Middleware, router and service names use lowercase letters, digits and <Code>-</Code> only, and must be <strong>unique per proxy</strong> (across enabled files).</li>
        <li>At most 64 KB per file. A disabled file stays in aoox but is removed from the proxy.</li>
      </Ul>

      <H2 id="create">Creating a file</H2>
      <Steps>
        <Step title={<>Infrastructure<PathArrow />Reverse proxy<PathArrow />Dynamic configuration</>}>
          <P>Only the owner can change anything; admins can read the list and the file contents.</P>
        </Step>
        <Step title="From a preset, or write your own">
          <P>
            <strong>From preset</strong> opens a small form and produces
            ready-to-save YAML in the editor (you can still edit it):
          </P>
          <Table
            head={["Preset", "Contents"]}
            rows={[
              ["Basic auth", <>Username and password. Only a <strong>bcrypt hash</strong> is stored; the password never appears in the file or the audit log.</>],
              ["Security headers", "HSTS (over HTTPS only), nosniff, frame deny, referrer policy."],
              ["Rate limit", "Average, burst and period per source IP."],
              ["IP allowlist", "A validated list of addresses/CIDRs; everything else gets 403."],
              ["Redirect www", <>Permanent redirect from www to non-www or the reverse. Attach it to the domain being <strong>redirected</strong> (<Code>www.example.com</Code> for to-non-www, <Code>example.com</Code> for to-www).</>],
            ]}
          />
          <P>Or <strong>New file</strong> to write the YAML yourself, e.g.:</P>
          <Pre>{`http:
  middlewares:
    header-aoox:
      headers:
        customResponseHeaders:
          X-Powered-By: aoox`}</Pre>
        </Step>
        <Step title="Save">
          <P>
            aoox checks the YAML structure, writes the file to the proxy, waits
            a few seconds, then reads Traefik&apos;s log. If Traefik reports an
            error about the file, the change is <strong>rolled back
            automatically</strong> (the previous version is restored) and the
            error is shown verbatim.
          </P>
        </Step>
      </Steps>

      <H2 id="attach">Attaching to a domain</H2>
      <P>
        On the application&apos;s <strong>Domain</strong> tab every domain has a{" "}
        <strong>Middleware</strong> row with a <strong>Configure</strong>{" "}
        button. Pick middlewares from the enabled files on the proxy that
        serves that application (named like <Code>name@file</Code>). The order
        you switch them on is the order they run. It needs the developer role
        or above; viewers can only read. Saving recreates the application
        container with new labels (no build), like changing the certificate.
      </P>
      <Ul>
        <li>Middlewares go on the domain&apos;s HTTPS router, and on the HTTP router for domains served over HTTP. The automatic http→https redirect does not use them.</li>
        <li>Domains with the same middleware list share a router; different lists are split automatically, so one domain&apos;s middlewares never affect another.</li>
        <li>A middleware that <strong>a domain uses</strong> cannot be disabled, deleted or renamed (409, the domain is named). Remove it from the domain first.</li>
        <li>A name that is not in an enabled file on that application&apos;s proxy is rejected (400).</li>
      </Ul>

      <H2 id="legacy-proxy">Proxies created by an older aoox</H2>
      <Callout kind="warn">
        A proxy created by an older aoox does not read the dynamic
        configuration directory yet. When the first file is enabled the proxy
        container is recreated <strong>once</strong>: a few seconds without
        service for every domain on that proxy; certificates and other routes
        stay. aoox asks you to confirm first and never asks again afterwards.
        New proxies need no recreation.
      </Callout>

      <H2 id="reapply">Apply again</H2>
      <P>
        <strong>Apply again</strong> rewrites every enabled file to the proxy
        and removes <Code>user-*</Code> files that no longer exist in aoox. Use
        it after an <DocLink href="/en/docs/backup">instance restore</DocLink>{" "}
        (a restore brings back the file contents in the database but does not
        write the proxy volume), after a proxy or server was set up again, or
        if the files on the volume were changed outside aoox.
      </P>

      <H2 id="limits">Limits</H2>
      <Ul>
        <li><strong>Dynamic</strong> configuration only. Static Traefik options (entrypoints, log level, trusted IPs) cannot be changed here.</li>
        <li>aoox only catches errors Traefik logs. A wrong value that is not reported (for example an invalid service URL) gets through, so test the result after saving.</li>
        <li>A valid configuration can still change routing for every domain on that proxy (your routers can collide with application routes). That is why only the owner can write.</li>
        <li>Remote servers: written the same way, but not tested on a real server yet; make sure the files you need exist on the destination server&apos;s proxy before moving an application.</li>
        <li>Files are <strong>per proxy</strong> and are not part of project export/import; domains created by an import have no middlewares (the import still succeeds when the source used them).</li>
        <li>Moving an application to another server cleans its domains&apos; middlewares: only names defined by an <strong>enabled</strong> file on the destination proxy are kept, the rest are dropped (logged by the API; the application PATCH answer carries <Code>droppedMiddlewares</Code> when something was dropped). The files themselves do not move.</li>
      </Ul>

      <H2 id="pitfalls">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["400: Traefik rejected the file", "Traefik refused the contents (unknown option, wrong type, a router naming a missing middleware, a broken rule). The previous version is already restored; fix it according to the quoted error."],
          ["400: already declared in another file", "Middleware/router/service names must be unique per proxy. Rename it or remove the other one."],
          ["409: still used by a domain", "Remove the middleware from the domain (Domain tab) before disabling, deleting or renaming it."],
          ["409: the proxy will be recreated", "An older proxy; confirm the one-time recreation (a few seconds without service)."],
          ["Middleware attached but has no effect", "The domain change was not saved yet (the container is recreated on save), or the proxy is not running; check the warning after saving."],
          ["Basic auth always 401", "Wrong password, or another proxy (for example Cloudflare) in front adds an Authorization header."],
        ]}
      />

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
