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

export const metadata: Metadata = { title: "Registry" }

const SUMMARY = [
  { k: "Local registry", v: "Required — where built images live" },
  { k: "External registry", v: "Credentials for other registries" },
  { k: "Maintenance", v: "Per-application retention + nightly cleanup" },
]

const IMAGE_FLOW = [
  { s: "build", d: "the image is built by the Docker daemon" },
  { s: "push", d: "→ localhost:5000/<project>/<app>:<id>" },
  { s: "run", d: "a container is created from that image" },
  { s: "rollback", d: "the old image is pulled back from the registry" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Why old tags need to be kept.", href: "/en/docs/deploy#rollback" },
  { title: "How builds work", description: "How images get their name.", href: "/en/docs/build#image" },
  { title: "Monitoring", description: "Docker disk usage on the dashboard.", href: "/en/docs/monitoring#host" },
  { title: "Installation", description: "REGISTRY_PORT & REGISTRY_PUBLIC_HOST in .env.dist.", href: "/en/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/registry"
      title="Registry"
      lang="en"
      description="The local registry where built images are stored (a deploy prerequisite), external registries, and disk maintenance."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="peran">The registry&apos;s role in a deploy</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {IMAGE_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Every deploy pushes an image to the local registry, and a rollback
        pulls it back from there. That&apos;s why the registry must be
        provisioned <strong>before the first deploy</strong> — without it,
        deploys fail with <em>No self-hosted registry</em>. Applications on a{" "}
        <DocLink href="/en/docs/server-remote">remote server</DocLink> don&apos;t
        use the registry (the image stays on that server&apos;s daemon).
      </P>

      <H2 id="lokal">Local registry</H2>
      <Steps>
        <Step title="Registry menu → Local registry tab → Provision registry (owner)">
          <P>
            aoox runs <Code>registry:3</Code> as the <Code>aoox-registry</Code>{" "}
            container with htpasswd authentication, data on the{" "}
            <Code>aoox_registry_data</Code> volume, and tag deletion enabled.
            The card shows a <em>Registry ready</em> status, the container,
            and the URL.
          </P>
          <P>
            Before provisioning, pick where images are stored:{" "}
            <strong>Local</strong> (VPS disk, the default) or one of the S3
            destinations already added under{" "}
            <DocLink href="/en/docs/backup#s3">Instance backup</DocLink>. It
            can&apos;t be changed afterward without removing and
            re-provisioning.
          </P>
        </Step>
        <Step title="Save the credentials shown once">
          <P>
            The <Code>aoox</Code> username and a random password are shown
            only once — click <strong>I&apos;ve saved it</strong> after writing
            it down. Deploying from the dashboard does{" "}
            <strong>not</strong> need it; these credentials are for pushing
            manually from another machine.
          </P>
        </Step>
      </Steps>
      <Pre title="Manual push from the host">{`docker login localhost:5000 -u aoox
docker tag myimage:latest localhost:5000/tools/myimage:1.0
docker push localhost:5000/tools/myimage:1.0`}</Pre>
      <Table
        head={["Env (.env.dist)", "Default", "Notes"]}
        rows={[
          [<Code key="1">REGISTRY_PORT</Code>, "5000", "The registry's host port."],
          [
            <Code key="2">REGISTRY_PUBLIC_HOST</Code>,
            "localhost",
            <>
              The host used by <Code>docker push</Code> when there&apos;s{" "}
              <strong>no</strong> custom domain (see below). <Code>localhost</Code>{" "}
              is exempt from Docker&apos;s insecure-registry rule; any other host
              needs TLS (a reverse proxy) or an{" "}
              <Code>insecure-registries</Code> entry in{" "}
              <Code>daemon.json</Code> on every daemon that pushes to it.
            </>,
          ],
        ]}
      />

      <H3>Custom domain</H3>
      <P>
        An alternative to manually juggling <Code>REGISTRY_PUBLIC_HOST</Code> and{" "}
        <Code>insecure-registries</Code>: route the registry through the
        built-in reverse proxy (Traefik) with a real Let&apos;s Encrypt
        certificate — <Code>docker push</Code>/<Code>login</Code> trust it out
        of the box, no extra config needed on any daemon, including other
        Swarm nodes.
      </P>
      <Ul>
        <li>Needs the proxy already provisioned (see <DocLink href="/en/docs/domain">Proxy &amp; domain</DocLink>) with <Code>PROXY_ACME_EMAIL</Code> set.</li>
        <li>
          Fill in the <strong>Custom domain</strong> field on the Local
          registry card (owner/admin), then <strong>Apply</strong> — the
          container is recreated with Traefik labels (router{" "}
          <Code>aoox-registry</Code>), data and credentials are untouched. Or
          from the CLI:
        </li>
      </Ul>
      <Pre>{`aoox registry domain --set registry.example.com`}</Pre>
      <P>
        Once the domain is active, <Code>docker login registry.example.com</Code>{" "}
        (no port — standard HTTPS). The host port stays open for IP:port
        access as before. Remove it with{" "}
        <Code>aoox registry domain --clear</Code> or the{" "}
        <strong>Remove domain</strong> button in the dashboard.
      </P>

      <H3>Browsing & cleaning up contents</H3>
      <Ul>
        <li>
          The Local registry tab lists repository → tag along with{" "}
          <strong>digest</strong> and <strong>size</strong>. Repository name
          = <Code>{"<project-slug>/<app-slug>"}</Code>.
        </li>
        <li>
          <strong>Deleting</strong> a tag deletes the manifest. Other tags
          pointing at the same digest disappear too — the UI warns about it.
        </li>
        <li>
          <strong>Garbage collect</strong> (owner) reclaims disk space after
          tags are deleted — it runs inside the running registry container;
          there&apos;s a <em>dry run</em> mode to preview what would be removed.
        </li>
        <li>
          Deleting a tag still used by a running container doesn&apos;t stop it,
          but rolling back to that version is no longer possible.
        </li>
        <li>
          <strong>Deleting the registry</strong> (owner) stops the container;
          you&apos;ll be asked about the data volume. Deploys can&apos;t happen again
          until it&apos;s provisioned again.
        </li>
      </Ul>

      <H2 id="pemeliharaan">Disk maintenance</H2>
      <P>
        So old images don&apos;t fill up the disk, aoox has automatic cleanup
        that runs every night at <Code>04:30</Code> (UTC) and can also be
        triggered manually.
      </P>
      <Table
        head={["What's cleaned", "Rule"]}
        rows={[
          [
            "Old deployments per application",
            <>
              The <strong>Deployment history</strong> field in an
              application&apos;s Settings (default <strong>10</strong>):
              successful deployments beyond this count are pruned, and their
              image is deleted both locally <em>and</em> from the registry.
              The image currently in use is never touched.
            </>,
          ],
          ["Failed/queued deployments", "Rows (log only) older than 30 days are deleted."],
          ["Dangling images & build cache", "Cleaned on the local daemon — application images aren't touched."],
          ["Registry", "Garbage collect runs after pruning."],
        ]}
      />
      <Steps>
        <Step title="Settings → Docker disk">
          <P>
            The card shows image, container, volume, and build cache usage,
            how much can be reclaimed, how many deployments can be pruned,
            and the most recent cleanup report.
          </P>
        </Step>
        <Step title="Clean up now (owner)">
          <P>
            Runs the same cycle on demand. The report: deployments pruned,
            images deleted, bytes reclaimed, registry GC status, and any
            errors.
          </P>
        </Step>
      </Steps>
      <Callout>
        Lowering <strong>Deployment history</strong> reduces your rollback
        options. For important applications, keep it ≥ 5; pruning only
        happens on the next cleanup.
      </Callout>

      <H2 id="eksternal">External registry</H2>
      <P>
        <strong>External registry</strong> tab → <strong>Add registry</strong>{" "}
        (owner/admin): register credentials for Docker Hub, GHCR, GitLab,
        etc.
      </P>
      <Table
        head={["Field", "Example"]}
        rows={[
          ["Name", "Company GHCR"],
          ["URL", <Code key="1">ghcr.io</Code>],
          ["Username / Password / token", "A token with read access (and write if needed); stored encrypted"],
          ["Image prefix", <>Optional, e.g. <Code>myorg</Code> → the image is referenced as <Code>{"<url>/<prefix>/<app>"}</Code></>],
        ]}
      />
      <Callout kind="warn" title="Not used by the pipeline yet">
        Right now the deploy pipeline always pushes to the local registry;
        an external registry can only be registered and connection-tested
        so far. Support for deploying from an image in an external registry
        is in progress.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Deploy fails: No self-hosted registry", "Provision the local registry first."],
          ["Manual push: http: server gave HTTP response to HTTPS client", <><Code>REGISTRY_PUBLIC_HOST</Code> isn&apos;t localhost, without TLS. Add it to <Code>insecure-registries</Code>, or set up a TLS reverse proxy.</>],
          ["Disk still full after deleting tags", "Run Garbage collect, or Clean up now in Settings → Docker disk."],
          ["Rollback fails: image not found", "The tag was already pruned by retention or deleted manually. Redeploy that commit."],
          ["Registry card: Docker unreachable", <><Code>DOCKER_GID</Code> is wrong or the socket isn&apos;t mounted — see <DocLink href="/en/docs/troubleshooting">Troubleshooting</DocLink>.</>],
        ]}
      />

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
