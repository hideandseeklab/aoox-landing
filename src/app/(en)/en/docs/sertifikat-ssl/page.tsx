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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/en/docs/sertifikat-ssl",
  lang: "en",
  title: "Custom SSL certificates",
  description:
    "Upload your own certificate (corporate CA, wildcard, Cloudflare Origin CA) and attach it to application domains instead of Let's Encrypt.",
})

const SUMMARY = [
  { k: "Upload", v: <>Settings<PathArrow />Integrations<PathArrow />SSL certificates (owner/admin)</> },
  { k: "Attach", v: <>Application<PathArrow />Domain tab, per HTTPS domain</> },
  { k: "Applies to", v: "Application domains only" },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik, application domains, and automatic Let's Encrypt.", href: "/en/docs/domain" },
  { title: "Notifications", description: "Warnings for certificates close to expiry.", href: "/en/docs/notifikasi" },
  { title: "Users & roles", description: "Who may upload and attach.", href: "/en/docs/pengguna-peran" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/sertifikat-ssl"
      title="Custom SSL certificates"
      description="Use your own certificate for application domains instead of automatic Let's Encrypt: upload once, pick per domain."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">When to use it</H2>
      <P>
        By default an HTTPS domain uses automatic{" "}
        <DocLink href="/en/docs/domain#https">Let&apos;s Encrypt</DocLink>. A
        custom certificate helps when:
      </P>
      <Ul>
        <li>your company requires a certificate from an <strong>internal CA</strong> or a specific CA;</li>
        <li>you already own a paid <strong>wildcard</strong> certificate to use for many subdomains;</li>
        <li>you use <strong>Cloudflare Origin CA</strong> behind the Cloudflare proxy;</li>
        <li>the server&apos;s network can&apos;t be reached by Let&apos;s Encrypt (e.g. no inbound port 80).</li>
      </Ul>

      <H2 id="unggah">Uploading a certificate</H2>
      <Steps>
        <Step title={<>Settings<PathArrow />Integrations<PathArrow />the SSL certificates card</>}>
          <P>Only owners/admins see this card. Click <strong>Upload</strong>.</P>
        </Step>
        <Step title="Fill in the name, certificate, and private key">
          <P>
            Paste the PEM content or click <strong>Choose file</strong> to read
            a <Code>.pem</Code>/<Code>.crt</Code> file and the key from your
            computer (read in the browser). Requirements:
          </P>
          <Ul>
            <li><strong>PEM</strong> format: a <Code>-----BEGIN CERTIFICATE-----</Code> block for the certificate and <Code>-----BEGIN PRIVATE KEY-----</Code> (or RSA/EC) for the key.</li>
            <li>The certificate may be a <strong>bundle</strong>: the server certificate first, then the intermediates (the chain). A wrong order is rejected.</li>
            <li>The private key must <strong>not be protected by a passphrase</strong>. Remove it first, e.g. <Code>openssl pkey -in key.pem -out key-nopass.pem</Code>.</li>
            <li>The key must match the certificate, and the certificate must not be expired.</li>
            <li>The name must be unique.</li>
          </Ul>
        </Step>
        <Step title="Click Upload">
          <P>
            aoox reads the names the certificate covers (including wildcards),
            its issuer, and its expiry date. The private key{" "}
            <strong>can&apos;t be viewed again</strong> once saved.
          </P>
        </Step>
      </Steps>
      <P>The card lists each certificate&apos;s name, the domains it covers, the issuer, the expiry date, and how many domains use it.</P>

      <H2 id="pasang">Attaching it to a domain</H2>
      <P>
        On the application&apos;s <strong>Domain</strong> tab, every{" "}
        <strong>HTTPS</strong> domain has a <strong>Certificate</strong> choice:
      </P>
      <Ul>
        <li><strong>Automatic (Let&apos;s Encrypt)</strong> — the default; the proxy requests its own certificate.</li>
        <li>One of the certificates you uploaded. Only those that <strong>cover the host</strong> can be picked; the others show as disabled with &ldquo;does not cover host&rdquo;.</li>
      </Ul>
      <P>
        The same choice is available when adding a new domain (once HTTPS is
        on). Changing it needs the developer role or higher; viewers only see
        which certificate is in use. A domain without HTTPS has no such
        choice. Picking <em>Automatic</em> again returns the domain to
        Let&apos;s Encrypt.
      </P>

      <H2 id="wildcard">Wildcards</H2>
      <P>
        A <Code>*.example.com</Code> certificate covers <strong>one level</strong>:{" "}
        <Code>app.example.com</Code> yes, but <Code>a.b.example.com</Code> and{" "}
        <Code>example.com</Code> itself no. This is the same rule browsers use;
        a certificate that lists both <Code>example.com</Code> and{" "}
        <Code>*.example.com</Code> serves both.
      </P>

      <H2 id="kedaluwarsa">Expiry and renewal</H2>
      <Ul>
        <li>The card shows a badge: green (normal), amber (under <strong>14 days</strong>), red (already expired). The Domain tab flags domains whose certificate is close to or past its expiry.</li>
        <li>aoox sends a <DocLink href="/en/docs/notifikasi">notification</DocLink> (the <em>certificate failure</em> kind) when 14 days or less remain, and again once it has expired; at most once per 24 hours per certificate. Only certificates that a domain <strong>uses</strong> are warned about.</li>
        <li>An expired custom certificate <strong>does not fall back to Let&apos;s Encrypt</strong>: browsers will reject that domain until you renew it or pick <em>Automatic</em>.</li>
      </Ul>
      <P>
        To renew, click <strong>Update</strong> on the certificate and paste
        the new certificate and key. The name stays, and every domain using it
        follows automatically. The new content must still cover the domains
        already using it; otherwise the update is rejected (400).
      </P>

      <H2 id="menghapus">Deleting</H2>
      <P>
        The delete button opens a confirmation dialog. A certificate that a
        domain still uses <strong>can&apos;t be deleted</strong> (409): move
        the domain to another certificate or to Let&apos;s Encrypt first.
      </P>

      <H2 id="batas">Limits</H2>
      <Ul>
        <li>For <strong>application domains</strong> only. The domains for the <DocLink href="/en/docs/domain-panel">panel</DocLink> and the local registry keep using ACME.</li>
        <li>On an older proxy install that cannot read custom certificates yet, the proxy container is recreated <strong>once</strong> (a few seconds) when the first custom certificate is used; its ports and ACME settings are kept. A newer proxy needs no recreate, and replacing a certificate&apos;s content restarts nothing.</li>
        <li>Certificates and their assignments are <strong>not included</strong> in a project export/import (imported domains use Let&apos;s Encrypt) and are not restored by an instance restore; upload them again if needed.</li>
      </Ul>

      <H2 id="keamanan">Security</H2>
      <Callout kind="warn">
        The private key is stored <strong>encrypted</strong> in the aoox
        database and as a file with <Code>0600</Code> permissions in the proxy
        volume. The API never returns it, and it never appears in logs or
        notifications. Still limit who is an owner/admin, and remove a
        certificate whose key has leaked.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["400: key does not match", "The key is not the pair of the first certificate in the bundle. Put the server certificate first, the chain after it."],
          ["400: key is encrypted", <>Remove the passphrase first (<Code>openssl pkey</Code>), then upload again.</>],
          ["400: already expired", "Upload a certificate that is still valid."],
          ["409: name already used", "Pick another name, or update the existing certificate."],
          ["A certificate can't be picked for a domain", "It does not cover that host (remember a wildcard is one level only)."],
          ["The browser still rejects it", "Incomplete chain: include the intermediates in the bundle. Or the domain isn't pointed at this server yet."],
        ]}
      />

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
