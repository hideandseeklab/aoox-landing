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
    "Project environments, application env, and database references.",
})

const SUMMARY = [
  { k: "Layers", v: "Project environment + secret source + application env" },
  { k: "Applied", v: "When the container is created, not at build time" },
  { k: "References", v: "${{project.KEY}} · ${{database.<slug>.url}}" },
]

const RESOLVE = [
  { s: "environment", d: "the app's linked project environment (lowest)" },
  { s: "secret source", d: "Infisical, when sync is on, overrides it" },
  { s: "application env", d: "overrides the same key (highest)" },
  { s: "resolve ${{…}}", d: "project & database in the same project" },
  { s: "container", d: "the final result goes into the container" },
]

const NEXT = [
  { title: "Managed database", description: "The database slugs you can reference.", href: "/docs/database" },
  { title: "Project", description: "Environments, protection, and linking.", href: "/docs/project" },
  { title: "How builds work", description: "Build args for build-time values.", href: "/docs/build#build-args" },
  { title: "Compose stacks", description: "Env as a source of compose interpolation.", href: "/docs/compose#env" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/environment"
      title="Environment variables"
      lang="en"
      description="Application env, project environments, and references to managed database credentials — all resolved when the container is created."
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
          Priority, lowest to highest: the linked <strong>project
          environment</strong> &lt; the <strong>external secret source</strong>{" "}
          (Infisical, when sync is on) &lt; the <strong>application&apos;s own
          env</strong>. If the same key exists in several, the higher one wins.
        </li>
        <li>
          Merging and resolution happen <strong>every time the container is
          created</strong>: deploy, rollback, or a recreate triggered by a
          domain/mount change. Editing an environment does not change running
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
          [<Code key="1">{"${{project.KEY}}"}</Code>, "The value of KEY from the environment the application is linked to (production by default)."],
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
      <Pre title="production environment (linked to the app)">{`APP_ENV=production
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
          Switching an application to an environment that lacks a{" "}
          <Code>{"${{project.KEY}}"}</Code> it references is refused with a
          message naming the key.
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
          Other env values are <strong>not</strong> redacted — don&apos;t print env to
          stdout from your application.
        </li>
        <li>
          Application env is stored as plain text in aoox&apos;s own database;
          access to the Settings page means access to its values. Project
          environment variables are encrypted at rest and protected — see below.
        </li>
      </Ul>

      <H2 id="environments">Project environments</H2>
      <P>
        A project has environments (<Code>development</Code>,{" "}
        <Code>staging</Code>, <Code>production</Code>, plus any you add). Each
        holds its own <Code>KEY=VALUE</Code> variables, encrypted at rest, edited
        in the project&apos;s <strong>Environments</strong> tab. Every
        application and compose stack is linked to <strong>one</strong>{" "}
        environment through the <strong>Environment</strong> select in its
        Settings (default <Code>production</Code>);{" "}
        <Code>{"${{project.KEY}}"}</Code> resolves from that environment.
      </P>
      <Ul>
        <li>
          Values are masked in the list; <em>Reveal</em> is an audited action
          (the audit log records it without the values).
        </li>
        <li>
          <Code>production</Code> is <strong>protected</strong>: only project
          admins can reveal or edit its values. Developers can reveal and edit
          the other environments; viewers see variable names only.
        </li>
        <li>
          Values are masked in deployment logs (values under 8 characters and
          plain single words like <Code>production</Code> are not masked).
        </li>
        <li>
          <strong>Linking is protected too:</strong> linking an application or
          stack <em>to</em> a protected environment, or moving one <em>away</em>{" "}
          from it, needs a project admin (developers get 403; the Environment
          select shows protected environments as disabled). Without that, a
          developer could link an app to <Code>production</Code>, deploy it and
          read the values from its container console. A new application or stack
          created by a developer without choosing an environment starts in{" "}
          <Code>development</Code>. Resources linked before this rule keep
          their link, and anyone who can open the console of a resource linked
          to <Code>production</Code> still sees its values at runtime, as with
          any env var.
        </li>
        <li>
          <strong>From a terminal:</strong>{" "}
          <DocLink href="/docs/cli#env">aoox env and aoox run</DocLink> read
          and change environments with an API token. A token can be limited to
          environments by name (e.g. only <Code>development</Code>) and still
          never exceeds its owner&apos;s own access.
        </li>
      </Ul>
      <P>
        More in <DocLink href="/docs/project#environments">Project</DocLink>.
      </P>

      <H2 id="history">History and restore</H2>
      <P>
        Every change to an environment is kept as a version: an edit in the
        dashboard, <Code>aoox env set|unset|push</Code>, a restore, or a
        promotion from another environment. Open <strong>History</strong> on an
        environment to see the list, newest first.
      </P>
      <Ul>
        <li>
          Each row shows <strong>who</strong> (a user, or a token), <strong>when</strong>,
          and the variable names <strong>+added</strong>, <strong>~changed</strong>{" "}
          and <strong>-removed</strong>. Values are never shown in the list.
        </li>
        <li>
          <strong>Restore this version</strong> puts that text back after a
          confirmation. It does not delete anything: the restored text becomes a
          <em> new</em> version at the top, so the history is never rewritten and
          you can undo a restore the same way.
        </li>
        <li>
          Who can restore: the same people who can edit that environment. For
          the protected <Code>production</Code> that is a project admin;
          viewers see no values and cannot restore.
        </li>
        <li>
          If the old text no longer passes today&apos;s checks (for example a{" "}
          <Code>{"${{project.KEY}}"}</Code> that points to a variable you have
          since removed), the restore is refused with a message and nothing
          changes. Restoring the version that is already current is refused too.
        </li>
        <li>
          The first change you make to an environment that already had content
          also saves a <strong>baseline</strong> of what was there before, so
          even that first edit can be undone. Saving without a real change (only
          line endings or trailing blank space) creates no version.
        </li>
        <li>
          The <strong>newest 50 versions</strong> of each environment are kept;
          older ones are removed automatically. Old texts are stored encrypted
          like the live one. A version also remembers its secret flags.
        </li>
      </Ul>

      <H2 id="compare">Compare and promote</H2>
      <P>
        <strong>Compare</strong> lets you choose two environments and shows the
        result key by key: variables that exist only on one side, variables on
        both sides with <strong>different values</strong>, and how many are the
        same. The values themselves are compared on the server and are never
        sent to your browser.
      </P>
      <Ul>
        <li>
          To tell you whether a value is different, aoox must be allowed to read
          both sides. If you cannot read both (you are a developer and one side
          is <Code>production</Code>), you still see which names exist where,
          but not which values differ.
        </li>
        <li>
          Select the variables you want and press <strong>Promote</strong>. A
          confirmation names the variables and the target environment. Each
          variable is copied with its value and its secret flag; the target
          keeps its own comments and order, new variables are added at the end,
          and a version <em>From &lt;source&gt;</em> is recorded.
        </li>
        <li>
          Promotion needs the right to <strong>read the source</strong> and to{" "}
          <strong>change the target</strong>, with the same rules as the editor:
          <strong> developers cannot promote to or from production</strong>; a
          project admin is needed on a protected side. Viewers cannot promote.
        </li>
        <li>
          A promotion is refused when it would leave a{" "}
          <Code>{"${{project.KEY}}"}</Code> pointing to a variable that does not
          exist in the target, and when someone changed the target in between
          (nothing is written; try again).
        </li>
        <li>
          Running applications are not touched: like any environment edit, a
          promotion applies on the next deploy of the apps that use the target.
        </li>
        <li>
          From a terminal:{" "}
          <DocLink href="/docs/cli#env"><Code>aoox env diff</Code> and <Code>aoox env promote</Code></DocLink>.
        </li>
      </Ul>

      <H2 id="secret-flags">Secret variables</H2>
      <P>
        Each variable in the environment editor has a <strong>Secret</strong>{" "}
        switch (in the CLI: <Code>aoox env set KEY=VALUE --secret</Code> or{" "}
        <Code>--no-secret</Code>). It decides whether the value is hidden in
        deployment logs, job output and error notifications.
      </P>
      <Table
        head={["Flag", "What happens to the value in logs"]}
        rows={[
          [<strong key="s">Secret</strong>, "Always masked, however short it is."],
          [<strong key="n">Not secret</strong>, "Never masked."],
          [<strong key="u">Not set</strong>, <>The usual rule: masked when it is 8 characters or longer, not a single plain word and not just digits. So <Code>NODE_ENV=production</Code> stays readable and a long token is hidden.</>],
        ]}
      />
      <Ul>
        <li>
          <strong>Not secret really means never.</strong> A long value on a
          variable with <em>no</em> flag is still masked by the usual rule; only
          an explicit <Code>--no-secret</Code> turns masking off.
        </li>
        <li>
          Secret flags are stored next to the variable <em>names</em>, not in the
          text, so the <Code>KEY=VALUE</Code> text, <Code>aoox env pull</Code>,
          export and the compose <Code>.aoox.env</Code> stay exactly as they
          were. The editor and the CLI show which variables are secret; the
          values stay behind Reveal.
        </li>
        <li>
          <strong>Existing and new variables:</strong> when this was introduced,
          variables whose name contains <Code>password</Code>,{" "}
          <Code>secret</Code>, <Code>token</Code>, <Code>key</Code>,{" "}
          <Code>private</Code> or <Code>credential</Code> were marked secret
          automatically; all other variables were left unmarked, so masking
          behaves exactly as before. The same name rule marks a new variable
          that you add without choosing a flag. It is a name match, so an
          innocent name such as <Code>MONKEY</Code> or <Code>KEYBOARD</Code>{" "}
          is marked too: switch it off in the editor if you want.
        </li>
        <li>
          A promotion copies the flag with the value. Removing a variable also
          removes its flag. If a secret variable holds a reference such as{" "}
          <Code>{"${{database.app-db.password}}"}</Code>, the resolved value is
          masked as well.
        </li>
      </Ul>

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
