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
  path: "/docs/variables",
  lang: "en",
  title: "Variables (variable sets)",
  description:
    "Shared variable sets with environments: sharing, protected environments, linking order, ${{vars.KEY}}, token scopes, history, compare and promote.",
})

const SUMMARY = [
  { k: "Where", v: "Variables in the sidebar (instance-wide)" },
  { k: "Merge", v: "Linked environments in order < Infisical < own env" },
  { k: "Reference", v: "${{vars.KEY}}" },
]

const ORDER = [
  { s: "link 1", d: "the first linked set environment (lowest)" },
  { s: "link 2 … 10", d: "each later link overrides earlier ones on the same key" },
  { s: "secret source", d: "Infisical secrets, when sync is on" },
  { s: "own env", d: "the application's or stack's own env always wins" },
  { s: "container", d: "references resolved, the result goes into the container" },
]

const NEXT = [
  { title: "Environment variables", description: "The own env, Infisical and database references.", href: "/docs/environment" },
  { title: "CLI", description: "aoox env and aoox run from a terminal.", href: "/docs/cli#env" },
  { title: "Users & roles", description: "Roles, API tokens and their scopes.", href: "/docs/users-roles" },
  { title: "Project", description: "Where applications, databases and stacks live.", href: "/docs/project" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/variables"
      title="Variables"
      lang="en"
      description="Variable sets hold shared variables per environment. Share a set with projects, link its environments to applications and stacks in order, and reference values with ${{vars.KEY}}."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="concepts">Concepts</H2>
      <Table
        head={["Term", "Meaning"]}
        rows={[
          [<strong key="s">Variable set</strong>, <>A named group of variables, e.g. <em>Backend</em>. It belongs to the instance, not to one project, so several projects can use it.</>],
          [<strong key="g">Slug</strong>, <>A short lowercase name such as <Code>backend</Code>, derived from the name when you leave it empty. It <strong>cannot be changed</strong> later: API token scopes and the CLI (<Code>--set backend</Code>) refer to it.</>],
          [<strong key="e">Environment</strong>, <>One <Code>KEY=VALUE</Code> text inside a set. A new set gets <Code>development</Code>, <Code>staging</Code> and <Code>production</Code>; up to 20 per set (lowercase letters, digits and <Code>-</Code>, up to 32 characters). Values are encrypted at rest.</>],
          [<strong key="p">Protected</strong>, <>An environment whose values only instance owners and admins may reveal or edit. <Code>production</Code> starts protected.</>],
          [<strong key="l">Link</strong>, <>An application or compose stack uses one or more set environments, in an order you choose. No links means no set variables: only its own env.</>],
        ]}
      />
      <P>
        Open <strong>Variables</strong> in the sidebar to see the sets you can
        use. Each environment has a tab with the variable names and masked
        values. The <strong>eye</strong> button on a row shows that value, the{" "}
        <strong>copy</strong> button copies it without showing it,{" "}
        <strong>Reveal all</strong> shows every value (secret-flagged ones stay
        masked until you press their eye button) and <strong>Edit</strong> opens
        the editor. Shown values hide again after 60 seconds and are dropped
        from the page, also when you switch tabs or leave. Fetching the values
        is recorded in the audit log: one entry covers the whole environment for
        those 60 seconds, a later reveal is a new entry.
      </P>

      <H2 id="sharing">Sharing</H2>
      <P>
        A set is shared with <strong>all projects</strong> (current and
        future) or with <strong>selected projects</strong>. Only applications
        and stacks in those projects can link it, and only members of those
        projects see it. A set shared with nobody is visible to instance owners
        and admins only.
      </P>
      <Ul>
        <li>
          Creating, renaming, sharing and deleting sets, and adding or deleting
          environments, is for <strong>instance owners and admins</strong>.
        </li>
        <li>
          A project cannot lose access while something in it still links the
          set: the change is refused with the names of those applications and
          stacks. Unlink them first. Deleting a set or an environment is refused
          the same way while anything links it.
        </li>
      </Ul>

      <H2 id="access">Who can do what</H2>
      <P>
        Your role on a set comes from your role in the projects it is shared
        with (the best one counts). Instance owners and admins are{" "}
        <em>instance admins</em> on every set.
      </P>
      <Table
        head={["Role on the set", "Names and keys", "Values of unprotected environments", "Values of protected environments", "Manage the set"]}
        rows={[
          ["Instance owner / admin", "Yes", "Reveal, edit", "Reveal, edit", "Yes"],
          ["Project admin, developer", "Yes", "Reveal, edit", "No", "No"],
          ["Viewer", "Yes", "No", "No", "No"],
        ]}
      />
      <Ul>
        <li>
          Editing includes restoring a version and promoting; reading history
          lists and comparing names is open to every role.
        </li>
        <li>
          Protected environments are <strong>stricter than in 0.1.0-alpha.9</strong>:
          a project admin can no longer reveal or edit them.
        </li>
      </Ul>

      <H2 id="linking">Linking to applications and stacks</H2>
      <P>
        On an application&apos;s or stack&apos;s <strong>Environment</strong>{" "}
        tab, the <strong>Variable sets</strong> card lists the linked
        environments in merge order. Add one with <strong>Link</strong>, move it
        up or down, or unlink it. The create forms (application, stack,
        template) also accept an optional set environment.
      </P>
      <Ul>
        <li>At most <strong>10</strong> links; an environment can be linked once per application or stack.</li>
        <li>The set must be shared with the project (or with all projects).</li>
        <li>
          Changing links needs the <strong>developer</strong> role or higher.
          Adding or removing a link to a <strong>protected</strong> environment
          needs the <strong>project admin</strong> role; reordering links that
          stay is always allowed.
        </li>
        <li>
          Changes apply on the <strong>next deploy</strong>; running containers
          are not touched. The same holds for editing a linked environment.
        </li>
        <li>
          The card points out conflicts: keys <em>overridden by a later link</em>{" "}
          and keys <em>overridden by the own env</em>.
        </li>
      </Ul>

      <H2 id="merge">Merge order</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-5 rounded-lg overflow-hidden">
        {ORDER.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        The merge happens every time the container is created (deploy,
        rollback, a recreate after a domain or mount change), never at build
        time. Each key keeps the secret flag of the layer its value comes from.
      </P>
      <Pre title="Linked: 1. shared/production, 2. backend/production">{`# shared/production
LOG_LEVEL=info
SENTRY_DSN=https://abc@sentry.example.com/1

# backend/production
LOG_LEVEL=warn
API_HOST=api.example.com

# own env of the application
LOG_LEVEL=debug
API_URL=https://\${{vars.API_HOST}}/v1`}</Pre>
      <Pre title="Result in the container">{`LOG_LEVEL=debug          # own env wins
SENTRY_DSN=https://abc@sentry.example.com/1
API_HOST=api.example.com
API_URL=https://api.example.com/v1`}</Pre>

      <H2 id="references">References: {"${{vars.KEY}}"}</H2>
      <Ul>
        <li>
          <Code>{"${{vars.KEY}}"}</Code> is the merged value of <Code>KEY</Code>{" "}
          across the linked set environments (the same order as above). It can
          be used in the own env and in set values; a set value may refer to a
          key of another set linked to the same application.
        </li>
        <li>
          Expansion is <strong>one level</strong>: the referenced value is used as
          written. With <Code>{"URL=https://${{vars.HOST}}"}</Code> in a set,{" "}
          <Code>URL</Code> is expanded where it is used, but{" "}
          <Code>{"FULL=${{vars.URL}}"}</Code> receives the raw{" "}
          <Code>{"https://${{vars.HOST}}"}</Code>.
        </li>
        <li>
          An unknown key is refused with 400 when you save the links or the own
          env, and fails the deployment (naming the reference) if it only breaks
          later, for example after a set edit removed the key.
        </li>
        <li>
          <Code>{"${{project.KEY}}"}</Code> no longer exists: it is refused with
          &quot;was renamed to <Code>{"${{vars.KEY}}"}</Code>&quot;. The upgrade
          rewrites existing references for you.{" "}
          <Code>{"${{database.…}}"}</Code> and <Code>{"${{secret.…}}"}</Code> work
          as before (see <DocLink href="/docs/environment#references">Environment variables</DocLink>).
        </li>
      </Ul>

      <H2 id="history">History and restore</H2>
      <Ul>
        <li>
          Every change to an environment is kept as a version: an edit in the
          dashboard, <Code>aoox env set|unset|push</Code>, a restore or a
          promotion. <strong>History</strong> shows who (a user or a token),
          when, and the names added, changed and removed; values only when you
          reveal a version.
        </li>
        <li>
          <strong>Restore this version</strong> writes that text back as a{" "}
          <em>new</em> version, so nothing is lost and a restore can be undone.
          It is refused when it equals the current content or no longer passes
          today&apos;s checks.
        </li>
        <li>
          The first recorded change also saves a baseline of what was there
          before. The newest <strong>50</strong> versions are kept, encrypted
          like the live text.
        </li>
        <li>Who can restore: the same people who can edit that environment.</li>
      </Ul>

      <H2 id="compare">Compare and promote</H2>
      <Ul>
        <li>
          <strong>Compare</strong> two environments of one set: names only on
          one side, names with <strong>different values</strong>, and how many
          are the same. Values are compared on the server and never sent to the
          browser; if you cannot read both sides you only see which names exist
          where.
        </li>
        <li>
          Select variables and <strong>Promote</strong> them into the other
          environment: each is copied with its value and secret flag, the target
          keeps its comments and order, new ones go at the end, and a version{" "}
          <em>Promoted from &lt;source&gt;</em> is recorded.
        </li>
        <li>
          Promotion needs the right to read the source and to edit the target,
          so a protected side needs an instance owner or admin. A change made by
          someone else in between is refused; nothing is written.
        </li>
      </Ul>

      <H2 id="notes">Notes</H2>
      <P>
        A variable&apos;s note is the block of <Code>#</Code> lines directly
        above it. A blank line in between breaks the link, so a section header
        followed by a blank line stays an ordinary comment.
      </P>
      <Pre title="development">{`# Payments

# Base URL of the payments API, including the /v1 prefix.
PAYMENTS_URL=https://pay.example.com/v1
# Must equal WEBHOOK_SECRET in the payments service.
WEBHOOK_SECRET=…`}</Pre>
      <Ul>
        <li>
          Here <Code>PAYMENTS_URL</Code> and <Code>WEBHOOK_SECRET</Code> have a
          note; <Code># Payments</Code> is a standalone comment.
        </li>
        <li>
          On the set page a note icon appears next to each variable that has
          one; hover, click or tap it to read the note. In{" "}
          <strong>Edit</strong>, Rows view shows the note under the
          variable and lets you add or change it; Text view shows the{" "}
          <Code>#</Code> lines.
        </li>
        <li>
          <strong>Notes are visible without revealing values</strong>, to
          everyone who can see the set, viewers included. Do not put secrets in
          them.
        </li>
        <li>
          Notes are part of the text, so they travel with it: history and
          restore, <Code>aoox env pull</Code> / <Code>push</Code>, and export
          and import. <strong>Promote</strong> brings the note of a variable that
          is new to the target; a variable the target already has keeps its own
          note. A note is cut at 1000 characters.
        </li>
      </Ul>

      <H2 id="secret-flags">Secret variables</H2>
      <Table
        head={["Flag", "What happens to the value in logs"]}
        rows={[
          [<strong key="s">Secret</strong>, "Always masked, however short it is."],
          [<strong key="n">Not secret</strong>, "Never masked."],
          [<strong key="u">Not set</strong>, <>Masked when it looks like a secret: 8 characters or longer, not a single plain word, not only digits. <Code>NODE_ENV=production</Code> stays readable.</>],
        ]}
      />
      <Ul>
        <li>
          Set the flag with the <strong>Secret</strong> switch in the editor or{" "}
          <Code>aoox env set KEY=VALUE --secret</Code> / <Code>--no-secret</Code>.
          New variables whose name contains password, secret, token, key,
          private or credential are marked secret automatically.
        </li>
        <li>
          Flags are stored next to the names, not in the text, so pulled files
          and the compose <Code>.aoox.env</Code> are unchanged. Masking applies
          to deployment logs, job output and error notifications.
        </li>
        <li>
          <strong>What the flag does not do</strong>: every value is stored
          encrypted, secret or not. The flag does not decide who may see a
          value: in the dashboard it stays hidden until you reveal or copy it
          (audited), and access follows roles and protected environments. The container always receives the real
          value. The flag only controls masking with <Code>***</Code> in logs.
        </li>
        <li>
          <strong>Known false positive</strong>: the automatic name rule also
          matches names such as <Code>MONKEY</Code> or <Code>KEYBOARD</Code>,
          because they contain &quot;key&quot;. Turn the switch off for those.
        </li>
        <li>
          <strong>Tip</strong>: turn it on for passwords, tokens, API keys and
          connection strings; turn it off for plain values like{" "}
          <Code>NODE_ENV</Code>, <Code>PORT</Code> and <Code>LOG_LEVEL</Code>{" "}
          so they stay readable in logs.
        </li>
      </Ul>

      <H2 id="tokens">API token scopes</H2>
      <P>
        An API token can be limited to some set environments with{" "}
        the token&apos;s <strong>variables limit</strong> (Settings
        <PathArrow />Account<PathArrow />API tokens; <Code>variableScopes</Code>{" "}
        in the API, at most 20 entries):
      </P>
      <Table
        head={["Entry", "Allows"]}
        rows={[
          [<Code key="1">backend/staging</Code>, "One environment of one set."],
          [<Code key="2">backend/*</Code>, "Every environment of the set backend."],
          [<Code key="3">*/staging</Code>, "The environment staging in every set."],
        ]}
      />
      <Ul>
        <li>
          No entries: the token may use every set environment its owner can.
          Entries only narrow access; a token never gets more than its owner.
        </li>
        <li>
          The scope covers reveal, edit, restore, promote and creating or
          deleting environments. Comparing treats an out-of-scope side as not
          comparable. Linking is not narrowed by it.
        </li>
        <li>
          A <strong>read-only</strong> token may still reveal (reading is
          audited but changes nothing); every write is refused.
        </li>
      </Ul>

      <H2 id="cli">From a terminal</H2>
      <Pre title="aoox CLI">{`$ aoox env list                                   # sets, environments, variable counts
$ aoox env set API_URL=https://api.example.com --set backend --env staging
$ aoox env pull --set backend --env development  # ./.env (mode 0600)
$ aoox env links                                  # what the linked app uses, in order
$ aoox env link --set shared --env production --position 1
$ aoox run -- npm run dev                         # linked environments + own env`}</Pre>
      <P>
        Details in <DocLink href="/docs/cli#env">CLI: aoox env and aoox run</DocLink>. To run your app locally with one environment, see{" "}
        <DocLink href="/docs/cli#local-development">Local development</DocLink>.
      </P>

      <H2 id="export-import">Export and import</H2>
      <Ul>
        <li>
          A project export lists, for each application and stack, its links by
          set and environment <em>name</em> in merge order.
        </li>
        <li>
          The sets themselves (with values) are only included when the owner
          exports <strong>with secrets</strong>: the sets shared with the
          project explicitly or linked by one of its applications or stacks.
        </li>
        <li>
          On import, a set whose name already exists is <strong>reused and
          never overwritten</strong> (a warning says so); a new one is created
          and shared with the imported project only. A link to an existing set
          that is not shared with the new project is shared by an instance
          owner or admin, or skipped with a warning for anyone else.
        </li>
        <li>
          Older files (0.1.0-alpha.9 environments) become one set named after
          the new project, and <Code>{"${{project."}</Code> becomes{" "}
          <Code>{"${{vars."}</Code>.
        </li>
      </Ul>

      <H2 id="upgrade">Upgrading from 0.1.0-alpha.9</H2>
      <Callout title="What the upgrade does">
        The migration runs once, in one transaction, when the new API starts.
      </Callout>
      <Ul>
        <li>
          Each project whose environments have content becomes <strong>one
          set named after the project</strong>, shared with that project only,
          with the same environments, values, secret flags and history.
          Applications and stacks keep their environment as their first link.
        </li>
        <li>
          <strong>Empty environments are dropped</strong>; a project with only
          empty environments gets no set, and links to them are removed.
        </li>
        <li>
          <Code>{"${{project.KEY}}"}</Code> becomes <Code>{"${{vars.KEY}}"}</Code>{" "}
          in application and stack env and in every stored text and version.
        </li>
        <li>
          An API token&apos;s <Code>environments</Code> list becomes scopes of the
          form <Code>{"*/<name>"}</Code> (the same meaning: that name in every
          set). Re-issue tokens with set-specific scopes when you want them
          narrower.
        </li>
        <li>
          <strong>Protected environments are now instance owner/admin only.</strong>{" "}
          Project admins who revealed or edited <Code>production</Code> need an
          instance admin, or the environment unprotected.
        </li>
        <li>
          <Code>ENCRYPTION_KEY</Code> must be set (it already is on a normal
          install) because stored texts are re-encrypted. Update the CLI as well:
          the old <Code>aoox env</Code> commands called endpoints that are gone.
        </li>
      </Ul>

      <H3>Limits</H3>
      <Ul>
        <li>No per-set roles: access follows project roles.</li>
        <li>Slugs cannot be renamed, and environments cannot be moved between sets.</li>
        <li>References expand one level.</li>
      </Ul>

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
