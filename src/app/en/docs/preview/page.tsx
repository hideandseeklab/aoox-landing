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

export const metadata: Metadata = { title: "Pull request previews" }

const SUMMARY = [
  { k: "Per PR", v: "One container + one subdomain" },
  { k: "Lifetime", v: "From PR opened to closed/merged" },
  { k: "Default", v: "Off — opt-in per application" },
]

const LIFECYCLE = [
  { s: "PR opened", d: "a preview row is created, build from the PR branch" },
  { s: "running", d: "container <app>-pr<N> served at <app>-pr<N>.<domain>" },
  { s: "push to PR", d: "rebuilt, container replaced" },
  { s: "PR closed / merged", d: "container & row deleted" },
]

const NEXT = [
  { title: "Webhook auto-deploy", description: "Prerequisite: a webhook with PR/MR events.", href: "/en/docs/webhook" },
  { title: "Proxy & domain", description: "Traefik and certificates for preview hosts.", href: "/en/docs/domain" },
  { title: "Deploy & rollback", description: "The health check previews also rely on.", href: "/en/docs/deploy#health-check" },
  { title: "Monitoring", description: "The resource limits previews inherit.", href: "/en/docs/monitoring#limit" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/preview"
      title="Pull request previews"
      lang="en"
      description="Every pull request gets its own container and subdomain, created when the PR opens and removed when it closes."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
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
          The application&apos;s <DocLink href="/en/docs/webhook">webhook</DocLink> is
          registered with the <strong>Pull requests</strong> (GitHub) or{" "}
          <strong>Merge request events</strong> (GitLab) event, in addition to push.
        </li>
        <li>
          The <DocLink href="/en/docs/domain">reverse proxy</DocLink> is running
          with <Code>PROXY_ACME_EMAIL</Code> if you want HTTPS.
        </li>
        <li>
          A <strong>wildcard</strong> DNS record pointing to the server:
        </li>
      </Ul>
      <Pre title="DNS">{`*.preview.example.com.   A   203.0.113.10`}</Pre>
      <Ul>
        <li>The application runs on the aoox host (not a remote server).</li>
      </Ul>

      <H2 id="siklus">Lifecycle</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {LIFECYCLE.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Pre title="Example: application shop, PR #42, preview domain preview.example.com">{`container : aoox-app-shop-pr42
router    : shop-pr42
host      : https://shop-pr42.preview.example.com`}</Pre>

      <H2 id="langkah">Enabling it</H2>
      <Steps>
        <Step title="Application settings → Pull request previews">
          <P>
            Turn on the toggle and fill in the <strong>Preview domain</strong>,
            e.g. <Code>preview.example.com</Code>. Leaving it blank falls back
            to the API&apos;s <Code>PREVIEW_DOMAIN</Code> env var (if set).
          </P>
        </Step>
        <Step title="Open a pull request at the provider">
          <P>
            The webhook receives the event, and aoox builds the PR branch the
            same way as a normal build (Dockerfile/Nixpacks) with a
            preview-specific tag.
          </P>
        </Step>
        <Step title="Watch it under the Webhook tab → Pull request previews">
          <P>
            The list of previews shows: PR number, status (<Code>building</Code> →{" "}
            <Code>running</Code> | <Code>failed</Code>), host + an open link,
            build logs, and a manual delete button. The list refreshes every
            5 seconds while anything is <Code>building</Code>.
          </P>
        </Step>
      </Steps>

      <H2 id="event">Events handled</H2>
      <Table
        head={["Provider", "Creates / refreshes", "Deletes", "Ignored"]}
        rows={[
          ["GitHub (pull_request)", "opened, synchronize, reopened", "closed", "PRs from a fork (head repo ≠ base repo)"],
          ["GitLab (merge_request)", "open, update, reopen", "close, merge", "MRs from a fork (source project ≠ target project)"],
        ]}
      />
      <P>
        The webhook response for these events: <Code>preview</Code>,{" "}
        <Code>preview-closed</Code>, or <Code>ignored</Code> with a{" "}
        <Code>reason</Code> (<em>previews disabled</em>, <em>fork</em>,{" "}
        <em>preview limit</em>).
      </P>

      <H2 id="yang-diwarisi">What&apos;s inherited from the application</H2>
      <Table
        head={["Aspect", "Preview"]}
        rows={[
          ["Build method, Dockerfile path, build args", "Same"],
          ["Environment variables (+ project/database references)", "Same — including the production database if referenced"],
          ["Health check path", "Same; the preview deployment fails if it isn't healthy"],
          ["CPU / memory limits", "Same"],
          ["Mounts (volume/bind/file)", <><strong>No</strong> — previews get no mounts</>],
          ["Host port", <><strong>No</strong> — only reachable through Traefik</>],
          ["Application domain", <><strong>No</strong> — has its own preview host</>],
          ["Blue/green", "No — a plain replace"],
          ["Metrics & notifications", "Not shown in the UI"],
        ]}
      />
      <Callout kind="warn" title="Env is shared with production">
        Previews use the application&apos;s env as-is. If the env references{" "}
        <Code>{"${{database.<slug>.url}}"}</Code>, the PR branch{" "}
        <strong>writes to the same database</strong> as production. For
        isolation, create a separate database and use a different env, or
        don&apos;t enable previews on applications that modify data.
      </Callout>

      <H2 id="aturan">Security rules</H2>
      <Ul>
        <li>
          <strong>Opt-in per application</strong> (off by default) — a PR
          branch is arbitrary code that will run on your server.
        </li>
        <li>
          PRs from a <strong>fork are always ignored</strong>, even with
          previews enabled.
        </li>
        <li>
          A maximum of <strong>5</strong> open previews per application
          (<Code>PREVIEW_MAX</Code>); the sixth PR gets <Code>ignored</Code>{" "}
          until one is closed.
        </li>
        <li>
          A PR closed while its build is still running doesn&apos;t leave a
          container behind — it&apos;s re-checked after the build and after start.
        </li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Webhook 200 ignored: previews disabled", "The toggle hasn't been turned on in the application's settings."],
          ["Preview host doesn't resolve", "The wildcard DNS record is missing, or the preview domain is misspelled."],
          ["Certificate error / slow to issue", <>ACME per host is requested on first access. For many PRs, use <Code>PROXY_ACME_STAGING=true</Code> first to avoid hitting the rate limit.</>],
          ["Preview is running but Traefik returns 404", "The container isn't healthy yet, or the health check is failing — check the build/preview logs."],
          ["No preview appears for a given PR", "The PR is from a fork, or there are already 5 open previews."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Previews for applications on remote servers; automatic PR comments
        with the preview link; preview-specific env.
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
