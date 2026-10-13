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
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/environment",
  lang: "en",
  title: "Environment variables",
  description:
    "Application env, variable set links, the Infisical secret source, and database references.",
})

const SUMMARY = [
  { k: "Layers", v: "Linked variable sets + secret source + application env" },
  { k: "Applied", v: "When the container is created, not at build time" },
  { k: "References", v: "${{vars.KEY}} · ${{database.<slug>.url}}" },
]

const RESOLVE = [
  { s: "variable sets", d: "the linked set environments, in order (lowest)" },
  { s: "secret source", d: "Infisical, when sync is on, overrides it" },
  { s: "application env", d: "overrides the same key (highest)" },
  { s: "resolve ${{…}}", d: "vars, secrets & databases of the same project" },
  { s: "container", d: "the final result goes into the container" },
]

const NEXT = [
  { title: "Managed database", description: "The database slugs you can reference.", href: "/docs/database" },
  { title: "Variables", description: "Variable sets, protection, and linking.", href: "/docs/variables" },
  { title: "How builds work", description: "Build args for build-time values.", href: "/docs/build#build-args" },
  { title: "Compose stacks", description: "Env as a source of compose interpolation.", href: "/docs/compose#env" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/environment"
      title="Environment variables"
      lang="en"
      description="Application env, linked variable sets, and references to managed database credentials — all resolved when the container is created."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="editor">The env editor</H2>
      <P>
        An application&apos;s <strong>Environment</strong> tab (after Mount) has an{" "}
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

      <P>
        The tab has its own <strong>Save</strong> button that saves only the
        env, so saving other Settings never overwrites it. Viewers see the env
        without being able to change it.
      </P>

      <H2 id="secret">Secret source (Infisical)</H2>
      <P>
        Instead of copying secrets into the env, an application can pull them
        from Infisical when its container is created.
      </P>
      <Ul>
        <li>
          <strong>Connection</strong>: owner/admin add it under Integrations
          <PathArrow />Secret manager (name, optional URL for a self-hosted
          instance, the machine identity&apos;s Client ID and Client secret). The
          client secret is stored encrypted and can&apos;t be seen again; the test
          button checks the connection.
        </li>
        <li>
          <strong>Secret source</strong> on the Environment tab: pick the
          connection, then project ID, environment and path (default{" "}
          <Code>/</Code>). <strong>View keys</strong> lists key names only,
          never their values.
        </li>
        <li>
          Reference one secret with <Code>{"${{secret.KEY}}"}</Code> in the env,
          or turn on <strong>Sync all secrets to the container</strong> to pass
          them all as env.
        </li>
        <li>
          Values are read <em>when the container is created</em> (deploy, apply
          config, rollback), not at build time. On a key clash the{" "}
          <strong>application&apos;s env wins</strong> over the secret. Pull
          request previews don&apos;t inherit the secret source.
        </li>
        <li>
          If Infisical is unreachable during a deploy, the deployment{" "}
          <strong>fails</strong> and the old container keeps running.
        </li>
      </Ul>

      <H2 id="flow">How env gets merged</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-5 rounded-lg overflow-hidden">
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
          Priority, lowest to highest: the linked{" "}
          <DocLink href="/docs/variables">variable set environments</DocLink>{" "}
          in their order (a later link wins over an earlier one) &lt; the{" "}
          <strong>external secret source</strong> (Infisical, when sync is on)
          &lt; the <strong>application&apos;s own env</strong>. If the same key
          exists in several, the higher one wins.
        </li>
        <li>
          Merging and resolution happen <strong>every time the container is
          created</strong>: deploy, rollback, or a recreate triggered by a
          domain/mount change. Editing a variable set does not change running
          containers — it applies on the application&apos;s <strong>next
          deploy</strong>.
        </li>
        <li>
          Env is <strong>not available at build time</strong>. For that, use{" "}
          <DocLink href="/docs/build#build-args">Build args</DocLink> (non-secret).
        </li>
      </Ul>

      <H2 id="references">References</H2>
      <Table
        head={["Syntax", "Resolves to"]}
        rows={[
          [<Code key="1">{"${{vars.KEY}}"}</Code>, <>The merged value of KEY across the application&apos;s linked variable set environments (a later link wins), one level deep. See <DocLink href="/docs/variables#references">Variables</DocLink>.</>],
          [<Code key="1s">{"${{secret.KEY}}"}</Code>, "One secret from the Infisical source (see above)."],
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
      <Pre title="shared/production (a variable set environment linked to the app)">{`APP_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1`}</Pre>
      <Pre title="Web application env">{`NODE_ENV=\${{vars.APP_ENV}}
SENTRY_DSN=\${{vars.SENTRY_DSN}}
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
          Changing the links so that a <Code>{"${{vars.KEY}}"}</Code> the env
          references no longer exists is refused with a message naming the
          key. <Code>{"${{project.KEY}}"}</Code> was renamed to{" "}
          <Code>{"${{vars.KEY}}"}</Code> and is refused.
        </li>
        <li>
          An unknown reference<PathArrow /><strong>400</strong> when saving Settings; if
          it only breaks at deploy time (e.g. the database was deleted)<PathArrow />the
          deployment is <Code>failed</Code>.
        </li>
        <li>
          Rotating a database password<PathArrow />takes effect on the next
          deploy/rollback, no rebuild needed.
        </li>
      </Ul>

      <H2 id="secrets">Secrets & logs</H2>
      <Ul>
        <li>
          Resolved database passwords and Git tokens are automatically redacted
          from deployment logs and error messages.
        </li>
        <li>
          Other env values are redacted only by the rules in{" "}
          <DocLink href="/docs/variables#secret-flags">Secret variables</DocLink>{" "}
          (variable sets); don&apos;t rely on masking and don&apos;t print
          env to stdout from your application.
        </li>
        <li>
          Application env is stored as plain text in aoox&apos;s own database;
          access to the Settings page means access to its values. Variable set
          values are encrypted at rest and can be protected — see{" "}
          <DocLink href="/docs/variables">Variables</DocLink>.
        </li>
      </Ul>

      <H2 id="variable-sets">Variable sets</H2>
      <P>
        Variables shared by several applications (or kept per stage, such as
        staging and production) live in{" "}
        <DocLink href="/docs/variables">variable sets</DocLink>: instance-wide
        groups with their own environments, history, compare/promote and
        secret flags. On the <strong>Environment</strong> tab, the{" "}
        <strong>Variable sets</strong> card links set environments to the
        application in order; the own env above always wins over them.
      </P>

      <H2 id="compose">Compose stacks</H2>
      <Callout>
        Compose stacks use the same mechanism: resolved env is written to{" "}
        <Code>.aoox.env</Code> and used as <Code>--env-file</Code>{" "}
        — a source of <Code>{"${VAR}"}</Code> interpolation in the compose file,{" "}
        <strong>not</strong> automatically injected into containers. Pass it
        through <Code>environment:</Code> on each service — see{" "}
        <DocLink href="/docs/compose#env">Compose stacks</DocLink>.
      </Callout>

      <H2 id="pitfalls">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["New env isn't picked up by the app", "No new container yet — deploy or roll back once more."],
          ["400 when saving: unknown reference", "Wrong database slug, or the database is in another project."],
          [<><Code>NEXT_PUBLIC_*</Code> / build-time values are empty</>, "Env isn't available at build time. Move it to Build args (if not secret) or read it at runtime."],
          ["Values carry quote marks along with them", <>Write it without quotes: <Code>KEY=value</Code>, not <Code>KEY=&quot;value&quot;</Code>.</>],
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
