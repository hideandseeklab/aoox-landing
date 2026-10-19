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
    "The container for apps, databases, and compose stacks.",
})

const SUMMARY = [
  { k: "Contains", v: "Applications · Compose stacks · Managed databases" },
  { k: "Shares", v: "Database references + shared variable sets" },
  { k: "Access", v: "Member list + role per project" },
]

const TREE = `shop/                      ← project (uses the variable sets shared with it)
├── shop        application  Next.js, domain shop.example.com
├── worker      application  queue worker, no domain
├── app-db      database     PostgreSQL 16
├── cache       database     Redis 7
└── monitoring  stack        docker-compose (grafana + loki)`

const NEXT = [
  { title: "Creating an application", description: "The next step once a project exists.", href: "/docs/applications" },
  { title: "Variables", description: "Variable sets shared with projects.", href: "/docs/variables" },
  { title: "Managed databases", description: "A database per project.", href: "/docs/database" },
  { title: "One-click templates", description: "Ready-made stacks into a project.", href: "/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/project"
      title="Project"
      lang="en"
      description="A project is a container for related applications, compose stacks, and managed databases. Shared variables come from the variable sets shared with it."
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
              References to a database in the same project (<Code>{"${{database.<slug>…}}"}</Code>),
              the <DocLink href="/docs/variables">variable sets</DocLink> shared
              with the project (<Code>{"${{vars.KEY}}"}</Code>),
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
          <Code>shop-staging</Code> — databases and access stay cleanly
          separated. You don&apos;t need extra projects just for
          development/staging variables — use the environments of a variable
          set.
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
            <strong>Settings</strong> tab handles name, description, members,
            the variable sets shared with the project, and deleting the
            project.
          </P>
        </Step>
      </Steps>

      <H2 id="variables">Variables</H2>
      <P>
        Projects no longer have environments of their own. Shared variables
        live in <DocLink href="/docs/variables">variable sets</DocLink>: an
        instance owner or admin creates a set (with environments such as{" "}
        <Code>development</Code>, <Code>staging</Code> and{" "}
        <Code>production</Code>) and shares it with all projects or with
        selected ones. Applications and stacks of the project then link set
        environments, in order, on their <strong>Environment</strong> tab and
        reference values with <Code>{"${{vars.KEY}}"}</Code>.
      </P>
      <Ul>
        <li>
          The project&apos;s <strong>Settings</strong> tab lists the sets shared
          with it and which of its applications and stacks use them.
        </li>
        <li>
          Your project role decides what you may do with a set&apos;s values:
          developers and project admins reveal and edit unprotected
          environments, viewers see names only, and protected environments are
          for instance owners and admins. Linking or unlinking a protected
          environment needs the project admin role.
        </li>
        <li>
          Upgrading from 0.1.0-alpha.9: a project whose environments had
          content became one set named after the project, shared with it only;
          see <DocLink href="/docs/variables#upgrade">the upgrade note</DocLink>.
        </li>
      </Ul>

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
          [<strong key="v">viewer</strong>, "Read only — status, logs, metrics, backup list (no export or backup download)."],
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
        and stacks keep their variable set links (set and environment names, in
        order); on import an existing set with that name is reused, never
        overwritten. Files from 0.1.0-alpha.9 and older become one variable set
        named after the new project. Details in{" "}
        <DocLink href="/docs/variables#export-import">Variables</DocLink>.
      </P>
      <Table
        head={["Option", "Contains"]}
        rows={[
          [<strong key="n">Without secrets</strong>, "Default. Variable set links are exported by name, but set values, database passwords, and secrets are not included."],
          [
            <strong key="s">With secrets</strong>,
            "Instance owner only. Includes the variable sets the project uses (with their values) and database passwords in the clear — treat the file like a secret file.",
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
      <P>
        Deleting a project removes everything in it: its applications, compose
        stacks, and databases are stopped and their containers removed (so
        their domains stop working), and then their records, backups history,
        and the project itself are deleted. The delete dialog has an{" "}
        <strong>Also delete data</strong> checkbox, unchecked by default.
      </P>
      <Table
        head={["Data", "Checkbox unchecked (default)", "Checkbox checked"]}
        rows={[
          ["Database volumes", "Kept. Listed as orphaned on the Docker page (Details), where the cleanup can remove them later.", "Deleted."],
          ["Application volume mounts", "Kept, listed as orphaned too.", "Deleted."],
          ["Volumes a compose file declares itself", "Kept, but not listed as orphaned. Remove them from the terminal with docker volume rm.", "Deleted."],
          ["Compose mounts you added in aoox", "Kept, listed as orphaned.", "Deleted."],
        ]}
      />
      <Callout kind="warn" title="This cannot be undone">
        Applications, databases, and stacks are removed for good. Download any
        backups you still need first: the backup records go with the project
        (backup files on S3 stay where they are).
      </Callout>
      <P>
        If aoox cannot reach the Docker daemon (or a remote server) while
        removing something, the delete stops with an error that names it. The
        project and whatever was not removed yet stay, so you can fix the
        connection and delete again. Only project admins can delete a project.
      </P>
      <P>
        Deleting a single application also removes its blue/green candidate
        container, and is refused (the application is kept) when its Docker
        daemon cannot be reached, instead of leaving the container running.
      </P>

      <H2 id="pitfalls">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["A ${{database.x.url}} reference 400s even though the database exists", "The database is in another project. References only work within the same project."],
          ["Variable set changed, application didn't change", "The container hasn't been recreated yet. Deploy/rollback the application that links it."],
          ["Can't delete an environment or set, or unshare a set", "An application or stack still links it (the message names them). Unlink those first."],
          ["Can't reveal production values", "Protected environments are for instance owners and admins only. Ask one, or use an unprotected environment."],
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
