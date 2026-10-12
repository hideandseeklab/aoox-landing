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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/cloudflare-dns",
  lang: "en",
  title: "Cloudflare DNS",
  description:
    "Let aoox create the DNS record of an application domain in Cloudflare, and issue wildcard certificates through ACME DNS-01.",
})

const SUMMARY = [
  { k: "Connect", v: <>Settings<PathArrow />Integrations<PathArrow />DNS provider (owner/admin)</> },
  { k: "Per domain", v: <>Application<PathArrow />Domain tab: DNS record, certificate mode</> },
  { k: "Wildcards", v: <>Infrastructure<PathArrow />Reverse proxy<PathArrow />DNS-01 certificates (owner)</> },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik, application domains, DNS check, automatic HTTPS.", href: "/docs/domain" },
  { title: "Custom SSL certificates", description: "Upload your own certificate instead.", href: "/docs/ssl-certificates" },
  { title: "Preview deployments", description: "Pull request previews and their wildcard DNS record.", href: "/docs/preview" },
  { title: "Users & roles", description: "Who may connect Cloudflare and change domains.", href: "/docs/users-roles" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/cloudflare-dns"
      title="Cloudflare DNS"
      lang="en"
      description="Create DNS records for application domains automatically and get wildcard certificates through DNS-01, using a Cloudflare API token."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="what">What it does</H2>
      <P>
        Normally you create the DNS record of a domain yourself and aoox only{" "}
        <DocLink href="/docs/domain#domain">checks it</DocLink>. With a
        Cloudflare connection you get two optional extras:
      </P>
      <Ul>
        <li><strong>DNS records</strong>: when you add a domain to an application, aoox creates the A record (or AAAA, if the server&apos;s address is IPv6) in your Cloudflare zone, pointing at the same IP the DNS check expects.</li>
        <li><strong>DNS-01 certificates</strong>: the proxy proves domain ownership through the Cloudflare API instead of port 80, which makes <strong>wildcard</strong> certificates possible (for example one certificate for every pull request preview).</li>
      </Ul>
      <P>
        Both are opt-in. With no connection, nothing changes: you manage DNS and
        certificates as before. Only Cloudflare is supported for now.
      </P>

      <H2 id="token">Create an API token</H2>
      <Steps>
        <Step title="In Cloudflare: My Profile, API Tokens, Create Token">
          <P>
            Choose a custom token with two permissions, limited to the zones you
            use:
          </P>
          <Ul>
            <li><Code>Zone:Zone:Read</Code></li>
            <li><Code>Zone:DNS:Edit</Code></li>
          </Ul>
        </Step>
        <Step title="Copy the token">
          <P>
            Cloudflare shows it once. A token owned by an account (not a user)
            also needs the account ID, see below.
          </P>
        </Step>
      </Steps>

      <H2 id="connect">Add the connection</H2>
      <Steps>
        <Step title={<>Settings<PathArrow />Integrations<PathArrow />the DNS provider card</>}>
          <P>
            Owners and admins see it. Click add; the dialog is called{" "}
            <strong>New Cloudflare connection</strong>.
          </P>
        </Step>
        <Step title="Fill in the name and the token">
          <P>
            Name it (it must be unique), paste the <strong>API token</strong>,
            and fill in <strong>Account ID (optional)</strong> only for an
            account-owned token. The token is stored encrypted and{" "}
            <strong>can&apos;t be viewed again</strong>.
          </P>
        </Step>
        <Step title="Test it">
          <P>
            The test button verifies the token and lists the zones it can see,
            for example &ldquo;3 zones&rdquo;. A token scoped to one sub-zone
            works too: aoox looks for the longest matching zone of each host.
          </P>
        </Step>
      </Steps>
      <P>
        Deleting a connection is refused while a domain or a proxy still uses it
        (409), because aoox could no longer clean up the records it created.
        Every project member can see the connection names (to choose them on a
        domain); only owners and admins add, test or delete.
      </P>

      <H2 id="records">DNS records for a domain</H2>
      <P>
        On the application&apos;s <strong>Domain</strong> tab, the add form has a{" "}
        <strong>DNS record</strong> choice: <em>I manage DNS myself</em>{" "}
        (default) or <em>Cloudflare: &lt;connection name&gt;</em>. Each existing
        domain has the same choice on its row, with a status badge, a sync button
        and the last message. Developers and up can change it; viewers see it
        read-only.
      </P>
      <Table
        head={["Option", "Meaning"]}
        rows={[
          ["Proxied (orange cloud)", <>Off by default. The proxy needs to see the real host and answer certificate challenges itself. Turn it on only if you want Cloudflare in front; then its SSL mode must be <em>Full (strict)</em> (see <DocLink href="/docs/domain#https">How HTTPS works</DocLink>).</>],
          ["Replace an existing record with different content", "Off by default. See the rules below."],
        ]}
      />
      <H3>What aoox does with existing records</H3>
      <Table
        head={["Situation", "What aoox does"]}
        rows={[
          ["No record for the name", "Creates it (automatic TTL, comment “Managed by aoox”)."],
          ["A record aoox created earlier has drifted", "Updates it in place."],
          ["A record with other content exists", <>Leaves it alone and reports a warning. With <em>Replace an existing record…</em> on, it updates it and takes it over.</>],
          ["An identical record exists that aoox did not create", "Leaves it as it is and does not track it, so it is never deleted later."],
          ["A CNAME exists on that name", "Does not create anything and warns."],
          ["No zone matches the host, or Cloudflare is unreachable", "Warns; the domain itself is still added."],
        ]}
      />
      <Ul>
        <li><strong>DNS never makes the request fail.</strong> The domain is added and the problem comes back as a warning (&ldquo;Domain added, but DNS needs attention&rdquo;) plus a <strong>DNS warning</strong> or <strong>DNS error</strong> badge on the row. Fix the cause and press the sync button to retry; <strong>DNS ok</strong> means the record is in place.</li>
        <li><strong>aoox only deletes records it created</strong>, by their stored id, when you delete the domain, delete the application, or switch the domain back to <em>I manage DNS myself</em>. It never lists or deletes anything else in your zone.</li>
        <li>The record is written before the container is recreated, so the first certificate request already finds the name.</li>
        <li>Deleting a whole <em>project</em> removes the rows only: the records stay in Cloudflare.</li>
        <li>Project export keeps the connection <em>name</em> and the proxied flag, never the token or record ids. An import creates no record: use the sync button.</li>
      </Ul>

      <H2 id="dns01">DNS-01 on the proxy</H2>
      <P>
        Certificates are HTTP-01 unless you enable this. It adds a second ACME
        resolver to Traefik that answers challenges through Cloudflare.
      </P>
      <Steps>
        <Step title="Set an ACME email on the proxy first">
          <P>
            DNS-01 uses the same ACME account email, so the proxy must already
            have one (<DocLink href="/docs/domain#proxy">Provisioning the reverse proxy</DocLink>).
          </P>
        </Step>
        <Step title={<>Infrastructure<PathArrow />Reverse proxy<PathArrow />the DNS-01 certificates card</>}>
          <P>
            Choose the proxy (<strong>aoox host</strong> or a{" "}
            <DocLink href="/docs/remote-servers">remote server</DocLink>), pick the{" "}
            <strong>DNS connection</strong> and click <strong>Enable DNS-01</strong>.
            Owners change it; admins can read it.
          </P>
        </Step>
        <Step title="Confirm the recreation">
          <P>
            On a running proxy a dialog <strong>Recreate the proxy?</strong>{" "}
            appears: the proxy is recreated, a few seconds without service for
            every domain on it. Certificates and other routes stay. Continue with{" "}
            <strong>Recreate and continue</strong>.
          </P>
        </Step>
      </Steps>
      <P>
        The card shows the state: <strong>Active</strong>, <strong>Off</strong>,{" "}
        <strong>Not applied yet</strong> (saved, proxy not recreated) or{" "}
        <strong>Proxy not running</strong>, and what depends on it. The{" "}
        <strong>Disable</strong> button is refused (409) while a domain or
        preview still uses DNS-01; move them back to automatic first.
      </P>
      <Callout kind="warn" title="The token is visible on that machine">
        The token is handed to the proxy container as an environment variable, so
        anyone who can run <Code>docker inspect</Code> on that machine can read
        it, like other secrets aoox passes to containers. Use a token limited to
        the zones you need.
      </Callout>

      <H2 id="modes">Certificate modes</H2>
      <P>
        Once the proxy has DNS-01, an HTTPS domain gets a <strong>Certificate mode</strong>{" "}
        choice on the Domain tab (without DNS-01 it only says DNS-01 is not
        enabled on this proxy yet):
      </P>
      <Table
        head={["Mode", "Certificate"]}
        rows={[
          ["Automatic (HTTP-01)", "The default: requested when the host is first reached, needs port 80."],
          ["DNS-01 for this host", "One certificate for that host, proved through DNS."],
          [<>DNS-01 wildcard (<Code key="1">*.example.com</Code>)</>, <>One certificate for the parent domain of the host (<Code key="2">app.example.com</Code> becomes <Code key="3">*.example.com</Code>), shared by every host under it.</>],
        ]}
      />
      <Ul>
        <li>Only for HTTPS domains, and not together with an <DocLink href="/docs/ssl-certificates">uploaded certificate</DocLink> (the API answers 400).</li>
        <li>If a domain asks for DNS-01 but its proxy no longer has the resolver, it falls back to HTTP-01 with a warning instead of failing.</li>
        <li>Importing a project keeps a DNS-01 mode only when the destination proxy has DNS-01; otherwise the domain uses HTTP-01 and the report says so.</li>
      </Ul>

      <H2 id="previews">Wildcard certificate for previews</H2>
      <P>
        <DocLink href="/docs/preview">Pull request previews</DocLink> normally get
        a certificate per preview host. On the application&apos;s{" "}
        <strong>Webhook</strong> tab, the previews card has{" "}
        <strong>Wildcard certificate for previews</strong>: one DNS-01 certificate
        for <Code>*.&lt;preview domain&gt;</Code> instead of one per pull request.
        It needs DNS-01 on the proxy and a preview domain; the switch is disabled
        with an explanation until both exist.
      </P>
      <Callout title="You still create the wildcard DNS record">
        aoox does not create a record for the preview wildcard. Add{" "}
        <Code>*.preview.example.com</Code> yourself, as described in the preview
        prerequisites.
      </Callout>

      <H2 id="limits">Limits</H2>
      <Ul>
        <li>Cloudflare only. Other DNS providers are not supported yet.</li>
        <li>Records are created for <strong>application domains</strong> only. Domains of compose stacks and the hosts of database admin UIs keep manual DNS.</li>
        <li>There is no DNS check against Cloudflare itself; the usual <DocLink href="/docs/domain#domain">DNS check</DocLink> still compares public DNS with the expected IP.</li>
        <li>The actual issuance of DNS-01 certificates and proxies on remote servers have not been tried against a real Cloudflare account yet; test with a staging ACME setup first.</li>
      </Ul>

      <H2 id="pitfalls">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Test says 403 or lists no zones", <>The token lacks <Code key="1">Zone:Zone:Read</Code> or <Code key="2">Zone:DNS:Edit</Code>, or is limited to other zones. Create a new token.</>],
          ["Warning: no zone for the host", "The token cannot see the zone that holds the host. Add that zone to the token."],
          ["Warning: a record already exists", <>Another record with different content is on the name. Change it yourself, or use <em>Replace an existing record…</em>.</>],
          ["Browser rejects the certificate with Proxied on", <>Cloudflare&apos;s SSL mode must be <em>Full (strict)</em>; or turn Proxied off.</>],
          ["Enable DNS-01 asks for an ACME email", "The proxy has no ACME email yet; set it first."],
          ["Cannot delete the connection or disable DNS-01 (409)", "A domain, preview or proxy still uses it. Detach those first."],
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
