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
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Environment variables" }

const SUMMARY = [
  { k: "Two layers", v: "Project env (shared) + application env" },
  { k: "Applied", v: "When the container is created, not at build time" },
  { k: "References", v: "${{project.KEY}} · ${{database.<slug>.url}}" },
]

const RESOLVE = [
  { s: "project env", d: "KEY=VALUE shared across one project" },
  { s: "application env", d: "overrides the same key" },
  { s: "resolve ${{…}}", d: "project & database in the same project" },
  { s: "container", d: "the final result goes into the container" },
]

const NEXT = [
  { title: "Managed database", description: "The database slugs you can reference.", href: "/en/docs/database" },
  { title: "Project", description: "Filling in the shared environment.", href: "/en/docs/project" },
  { title: "How builds work", description: "Build args for build-time values.", href: "/en/docs/build#build-args" },
  { title: "Compose stacks", description: "Env as a source of compose interpolation.", href: "/en/docs/compose#env" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/environment"
      title="Environment variables"
      lang="en"
      description="Application env, shared project env, and references to managed database credentials — all resolved when the container is created."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="editor">The env editor</H2>
      <P>
        An application&apos;s <strong>Settings</strong> tab has an{" "}
        <strong>Environment variables</strong> editor with two modes:
      </P>
      <Table
        head={["Mode", "For what"]}
        rows={[
          ["Per line", "One key, one input; values are masked (password input) with a reveal toggle. Good for changing a single value."],
          ["Text", <>A free textarea — paste the contents of a <Code>.env</Code> file as-is. Good for an initial migration.</>],
        ]}
      />
      <P>
        Both are stored as <Code>KEY=VALUE</Code> text, one per line. The API
        always returns the raw values — masking only happens in the UI.
      </P>
      <Pre title="Accepted format">{`PORT=3000
NODE_ENV=production
# comment lines are ignored
MESSAGE=values may contain spaces and = in the middle
EMPTY=`}</Pre>

      <H2 id="alur">How env gets merged</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {RESOLVE.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Ul>
        <li>
          If the same key exists in both project env and application env,{" "}
          <strong>the application&apos;s value wins</strong>.
        </li>
        <li>
          Merging and resolution happen <strong>every time the container is
          created</strong>: deploy, rollback, or a recreate triggered by a
          domain/mount change.
        </li>
        <li>
          Env is <strong>not available at build time</strong>. For that, use{" "}
          <DocLink href="/en/docs/build#build-args">Build args</DocLink> (non-secret).
        </li>
      </Ul>

      <H2 id="referensi">References</H2>
      <Table
        head={["Syntax", "Resolves to"]}
        rows={[
          [<Code key="1">{"${{project.KEY}}"}</Code>, "The value of KEY from the project's shared environment."],
          [<Code key="2">{"${{database.<slug>.url}}"}</Code>, "The managed database's internal connection URL (host = container name)."],
          [<Code key="3">{"${{database.<slug>.host}}"}</Code>, "The database container's name, e.g. aoox-db-app-db."],
          [<Code key="4">{"${{database.<slug>.port}}"}</Code>, "The engine's port inside the network (5432, 3306, 6379)."],
          [<Code key="5">{"${{database.<slug>.username}}"}</Code>, "Username."],
          [<Code key="6">{"${{database.<slug>.password}}"}</Code>, "Password (redacted in logs)."],
          [<Code key="7">{"${{database.<slug>.database}}"}</Code>, "Database name."],
          [
            <Code key="8">{"${{database.<slug>.url:<name>}}"}</Code>,
            "Another database on the same server (e.g. one created via a CREATE DATABASE query): same host/user/password, only the database name differs.",
          ],
        ]}
      />
      <H3>A full example</H3>
      <Pre title="Project env (shared)">{`APP_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1`}</Pre>
      <Pre title="Web application env">{`NODE_ENV=\${{project.APP_ENV}}
SENTRY_DSN=\${{project.SENTRY_DSN}}
DATABASE_URL=\${{database.app-db.url}}
REDIS_URL=\${{database.cache.url}}
PORT=3000`}</Pre>
      <Pre title="Result in the container (illustration)">{`NODE_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1
DATABASE_URL=postgresql://app_db:s3cr3t@aoox-db-app-db:5432/app_db
REDIS_URL=redis://:s3cr3t@aoox-db-cache:6379
PORT=3000`}</Pre>
      <Ul>
        <li>
          Databases are only looked up in the <strong>same project</strong> —
          an application can&apos;t read another project&apos;s credentials. The slug is
          the name shown on the database page.
        </li>
        <li>
          An unknown reference → <strong>400</strong> when saving Settings; if
          it only breaks at deploy time (e.g. the database was deleted) → the
          deployment is <Code>failed</Code>.
        </li>
        <li>
          Rotating a database password → takes effect on the next
          deploy/rollback, no rebuild needed.
        </li>
      </Ul>

      <H2 id="rahasia">Secrets & logs</H2>
      <Ul>
        <li>
          Resolved database passwords and Git tokens are automatically redacted
          from deployment logs and error messages.
        </li>
        <li>
          Other env values are <strong>not</strong> redacted — don&apos;t print env to
          stdout from your application.
        </li>
        <li>
          Env is stored as plain text in aoox&apos;s own database; access to the
          Settings page means access to its values. Any member can open any
          project.
        </li>
      </Ul>

      <H2 id="compose">Compose stacks</H2>
      <Callout>
        Compose stacks use the same mechanism: resolved env is written to{" "}
        <Code>.aoox.env</Code> and used as <Code>--env-file</Code>{" "}
        — a source of <Code>{"${VAR}"}</Code> interpolation in the compose file,{" "}
        <strong>not</strong> automatically injected into containers. Pass it
        through <Code>environment:</Code> on each service — see{" "}
        <DocLink href="/en/docs/compose#env">Compose stacks</DocLink>.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["New env isn't picked up by the app", "No new container yet — deploy or roll back once more."],
          ["400 when saving: unknown reference", "Wrong database slug, or the database is in another project."],
          [<><Code>NEXT_PUBLIC_*</Code> / build-time values are empty</>, "Env isn't available at build time. Move it to Build args (if not secret) or read it at runtime."],
          ["Values carry quote marks along with them", <>Write it without quotes: <Code>KEY=value</Code>, not <Code>KEY=&quot;value&quot;</Code>.</>],
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
