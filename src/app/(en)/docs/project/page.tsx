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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/project",
  lang: "en",
  title: "Project",
  description:
    "The container for apps, databases, and environments.",
})

const SUMMARY = [
  { k: "Contains", v: "Applications · Compose stacks · Managed databases" },
  { k: "Shares", v: "Environments + database references" },
  { k: "Access", v: "Member list + role per project" },
]

const TREE = `shop/                      ← project (environments: development, staging, production)
├── shop        application  Next.js, domain shop.example.com
├── worker      application  queue worker, no domain
├── app-db      database     PostgreSQL 16
├── cache       database     Redis 7
└── monitoring  stack        docker-compose (grafana + loki)`

const NEXT = [
  { title: "Creating an application", description: "The next step once a project exists.", href: "/docs/applications" },
  { title: "Environment variables", description: "Project vs. application env, database references.", href: "/docs/environment" },
  { title: "Managed databases", description: "A database per project.", href: "/docs/database" },
  { title: "One-click templates", description: "Ready-made stacks into a project.", href: "/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/project"
      title="Project"
      lang="en"
      description="A project is a container for related applications, compose stacks, and managed databases, complete with environments (development, staging, production) for its variables."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="concepts">What a project groups together</H2>
      <Pre title="Example: a shop project">{TREE}</Pre>
      <Table
        head={["Shared within one project", "Not shared"]}
        rows={[
          [
            <>
              Environments (<Code>{"${{project.KEY}}"}</Code>), references
              to a database in the same project (<Code>{"${{database.<slug>…}}"}</Code>),
              and the image repository name <Code>{"<project>/<app>"}</Code> in
              the registry.
            </>,
            <>
              The Docker network — every container lives on the same{" "}
              <Code>aoox</Code> network, across projects. Isolation happens at
              the access layer (member lists), not the network.
            </>,
          ],
        ]}
      />
      <H3>One project, or several?</H3>
      <Ul>
        <li>
          <strong>One project per product/environment</strong>: <Code>shop</Code>,{" "}
          <Code>shop-staging</Code> — environments and databases stay cleanly
          separated. You don&apos;t need extra projects just for
          development/staging variables — use the built-in environments.
        </li>
        <li>
          Applications that share a database <strong>must</strong> be in the
          same project so they can reference it.
        </li>
        <li>
          Database slugs are global (unique across projects) — give them
          specific names, e.g. <Code>shop-db</Code>, not <Code>db</Code>.
        </li>
      </Ul>

      <H2 id="create">Creating a project</H2>
      <Steps>
        <Step title={<>Projects menu<PathArrow />New project</>}>
          <Table
            head={["Field", "Description"]}
            rows={[
              [
                "Name",
                <>
                  E.g. <Code>my-app</Code>. Its slugified form becomes part of
                  the image name in the registry (<Code>{"<registry>/<project>/<app>:<tag>"}</Code>);
                  renaming a project after there&apos;s been a deployment makes the
                  next image use a new repository — the old one stays around.
                </>,
              ],
              ["Description", "Optional, shown in the project list."],
              ["Environments", "A new project starts with development, staging, and production. Fill in the variables later, in the Environments tab."],
            ]}
          />
        </Step>
        <Step title="The project detail page">
          <P>
            Three sections — <strong>Applications</strong>,{" "}
            <strong>Compose stacks</strong>, <strong>Databases</strong> — each
            with an add button
            (<em>New application</em>, <em>New compose stack</em> / <em>From template</em>,{" "}
            <em>New database</em>) and a brief status for each item. The{" "}
            <strong>Environments</strong> tab holds the variables per
            environment; the <strong>Settings</strong> tab handles name,
            description, and deleting the project.
          </P>
        </Step>
      </Steps>

      <H2 id="environments">Environments</H2>
      <P>
        A project has <strong>environments</strong>: <Code>development</Code>,{" "}
        <Code>staging</Code>, and <Code>production</Code> out of the box, and
        you can add more. Each environment stores its own{" "}
        <Code>KEY=VALUE</Code> variables (one per line, <Code>#</Code> comments
        are ignored), <strong>encrypted at rest</strong>. Values are{" "}
        <em>not</em> automatically injected into containers — applications and
        stacks reference them explicitly:
      </P>
      <Pre title="production environment">{`APP_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1
SMTP_HOST=smtp.example.com`}</Pre>
      <Pre title="shop application env">{`NODE_ENV=\${{project.APP_ENV}}
SENTRY_DSN=\${{project.SENTRY_DSN}}
DATABASE_URL=\${{database.app-db.url}}`}</Pre>
      <H3>Linking an application or stack</H3>
      <Ul>
        <li>
          Every application and compose stack is linked to{" "}
          <strong>one environment</strong> of its project, chosen in the{" "}
          <strong>Environment</strong> select in the application&apos;s Settings
          (or the compose stack&apos;s settings). The default is{" "}
          <Code>production</Code> for project admins and the first unprotected
          environment (<Code>development</Code>) for everyone else; if the
          project has only <Code>production</Code>, a non-admin gets 403.
        </li>
        <li>
          Linking to <Code>production</Code> (or any protected environment), or
          moving something away from it, needs a <strong>project admin</strong>:
          developers get 403 and the select shows protected environments as
          disabled. The same applies when creating an application or stack and
          when deploying a template. Existing links stay as they are.
        </li>
        <li>
          <Code>{"${{project.KEY}}"}</Code> resolves from the{" "}
          <strong>linked environment</strong>. Priority, lowest to highest:{" "}
          environment &lt; external secret source (Infisical, when sync is on)
          &lt; the application&apos;s own env.
        </li>
        <li>
          Switching an application to an environment that lacks a{" "}
          <Code>{"${{project.KEY}}"}</Code> it references is refused with a
          message naming the missing key.
        </li>
        <li>
          Changes only take effect in containers that are{" "}
          <strong>recreated</strong> afterward — they apply to an application on
          its <strong>next deploy</strong>, not live.
        </li>
        <li>
          Good for: Sentry DSN, SMTP host, per-environment feature flags. Not a
          great fit for: per-application secrets (put those in the
          application&apos;s env).
        </li>
        <li>
          Syntax details and merge order in{" "}
          <DocLink href="/docs/environment#flow">Environment variables</DocLink>.
        </li>
      </Ul>
      <H3>Viewing and protection</H3>
      <P>
        In the project&apos;s <strong>Environments</strong> tab the list shows
        variable names with <strong>masked values</strong>. <em>Reveal</em> shows
        the values; it is an audited action — the audit log records that it
        happened, without the values.
      </P>
      <Table
        head={["Who", "Development / staging / custom", "production (protected)"]}
        rows={[
          [<strong key="a">Project admin</strong>, "Reveal and edit.", "Reveal and edit."],
          [<strong key="d">Developer</strong>, "Reveal and edit.", "Variable names only — cannot reveal or edit."],
          [<strong key="v">Viewer</strong>, "Variable names only.", "Variable names only."],
        ]}
      />
      <Ul>
        <li>
          Project admins are the platform owner and admins, the project&apos;s
          creator, and members with the project role <Code>admin</Code>.
        </li>
        <li>
          Developers can <strong>add</strong> environments; only project admins
          can <strong>delete</strong> them. <Code>production</Code> can never be
          deleted, and an environment still used by an application or stack
          can&apos;t be deleted — the message names them.
        </li>
        <li>
          Values are masked in deployment logs by the variable&apos;s secret
          flag: <em>Secret</em> variables are always masked, whatever their
          length; variables marked <em>not secret</em> are never masked;
          unmarked variables are masked only when the value looks like a secret
          (8 or more characters, not a single plain word like{" "}
          <Code>production</Code>, not only digits), to avoid garbling ordinary
          log text. Names matching password, secret, token, key, private or
          credential are marked Secret automatically the first time they are
          added (the upgrade marked the existing ones). See{" "}
          <DocLink href="/docs/environment#secret-flags">Secret variables</DocLink>.
        </li>
      </Ul>
      <Callout kind="warn" title="What the protection covers">
        It covers <em>viewing and editing the stored values</em> and{" "}
        <em>linking</em> to or from a protected environment. Anyone who can
        open the container console of a resource already linked to{" "}
        <Code>production</Code> can still see the values at runtime — as with
        any environment variable.
      </Callout>
      <Callout>
        <strong>Upgrading:</strong> the single &ldquo;Shared environment&rdquo;
        text a project used to have was moved into <Code>production</Code>, and
        every application and stack was linked to it, so nothing changes at
        upgrade time.
      </Callout>

      <H2 id="members">Project members</H2>
      <P>
        The <strong>Members</strong> tab on the project page decides who can
        see and change this project. Add someone by the email of an existing
        account, then choose a role:
      </P>
      <Table
        head={["Project role", "Allowed to"]}
        rows={[
          [<strong key="a">admin</strong>, "Everything a developer can, plus manage members and delete the project."],
          [<strong key="d">developer</strong>, "Applications, databases, stacks, domains, mounts, jobs, backups."],
          [<strong key="v">viewer</strong>, "Read only — status, logs, metrics, backup list."],
        ]}
      />
      <Ul>
        <li>
          The project&apos;s creator automatically becomes a project admin; the
          instance owner and admins see every project without being added.
        </li>
        <li>
          Other instance members only see projects they&apos;ve been added to —
          other projects return 404. Details in{" "}
          <DocLink href="/docs/users-roles#project">Users &amp; roles</DocLink>.
        </li>
      </Ul>

      <H2 id="export">Export & import a project</H2>
      <P>
        The <strong>Export configuration (JSON)</strong> button on the project
        page downloads a portable definition: applications, databases, compose
        stacks along with their domains, mounts, jobs, and backup schedules.
        References to things outside the project (server, registry, Git
        credentials, S3 destination) are carried <em>by name</em>. Applications
        and stacks keep their environment link; on import they are matched by
        name. Old export files that carry a single project env import it into{" "}
        <Code>production</Code>.
      </P>
      <Table
        head={["Option", "Contains"]}
        rows={[
          [<strong key="n">Without secrets</strong>, "Default. Environments are exported (names and links), but variables, database passwords, and secrets are not included."],
          [
            <strong key="s">With secrets</strong>,
            "Instance owner only. Includes environment variables and database passwords in the clear — treat the file like a secret file.",
          ],
        ]}
      />
      <Steps>
        <Step title="Import on another instance">
          <P>
            <strong>Projects<PathArrow />Import project</strong>: choose the file, give
            it a new name or use the one from the file.
          </P>
        </Step>
        <Step title="Check the warnings">
          <P>
            A slug is reused if it&apos;s still free; conflicting host ports or
            domains, and references that can&apos;t be found, are reported as{" "}
            <em>Needs review</em> — not a failure. Databases are provisioned
            in the background; jobs and backup schedules are registered right
            away.
          </P>
        </Step>
      </Steps>
      <Callout>
        Export/import moves <strong>configuration</strong>, not data. For
        database and volume contents, use{" "}
        <DocLink href="/docs/backup">backup &amp; restore</DocLink>; to
        move the entire panel, use{" "}
        <DocLink href="/docs/backup#instance">instance backup</DocLink>.
      </Callout>

      <H2 id="dashboard">On the Dashboard</H2>
      <P>
        The Dashboard shows a summary: how many projects have something{" "}
        <em>running</em> (an application, database, or stack) and a list of
        recent projects with a <em>See all</em> link.
      </P>

      <H2 id="ownership">Ownership & access</H2>
      <Ul>
        <li>
          A project records its creator, who is always its project admin. Who
          else can see it is decided by the member list above — see{" "}
          <DocLink href="/docs/users-roles#project">Users &amp; roles</DocLink>.
        </li>
        <li>
          A user who still owns a project can&apos;t be removed from the team —
          delete their project first (ownership can&apos;t yet be transferred from
          the UI).
        </li>
        <li>Every project change is recorded in the audit log.</li>
      </Ul>

      <H2 id="delete">Deleting a project</H2>
      <Callout kind="warn" title="Read before deleting">
        Deleting a project removes the <strong>records</strong> of its
        applications, compose stacks, databases, and backups in aoox
        (cascade) — but their <strong>Docker containers and volumes are not
        stopped or removed</strong>. They become orphaned: still running,
        still using disk, with no way to manage them from the dashboard.
      </Callout>
      <Steps>
        <Step title="Remove its contents from the dashboard first">
          <P>
            Applications (delete), compose stacks (Delete = <Code>down --volumes</Code>),
            databases (delete + purge the volume if it&apos;s really not needed).
            Download any backups you still need.
          </P>
        </Step>
        <Step title="Then delete the project">
          <P>The project&apos;s Settings tab<PathArrow />delete. Already-downloaded backups are unaffected.</P>
        </Step>
      </Steps>
      <P>If it&apos;s already too late, clean up orphans from the terminal:</P>
      <Pre>{`docker ps -a --filter label=com.docker.compose.project=aoox
docker rm -f aoox-app-<slug> aoox-db-<slug>
docker volume rm aoox_app_<slug>_<name> aoox_db_<slug>`}</Pre>

      <H2 id="pitfalls">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["A ${{database.x.url}} reference 400s even though the database exists", "The database is in another project. References only work within the same project."],
          ["Environment changed, application didn't change", "The container hasn't been recreated yet. Deploy/rollback the application that references it."],
          ["Can't delete an environment", "It is the protected production environment, or an application/stack is still linked to it (the message names them). Switch those first."],
          ["Can't reveal production values", "Only project admins can reveal or edit production. Ask one, or use a non-production environment."],
          ["Can't remove a team member", "They still own a project. Delete that project, or leave their account as is."],
          ["A teammate can't see the project", "They haven't been added as a project member yet (instance members only see projects they're assigned to)."],
          ["Import: lots of reference warnings", "A server/registry/credential with that name doesn't exist yet on the target instance. Create it, then adjust the application."],
          ["Container still running after the project is deleted", "This is current behavior — remove it manually from the terminal (see above)."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Transferring project ownership; automatically stopping/removing
        containers when a project is deleted; import that brings data along (not just configuration).
      </Callout>

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
