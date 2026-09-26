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
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Users & roles" }

const SUMMARY = [
  { k: "Two layers", v: "Instance roles + per-project membership" },
  { k: "Invitations", v: "One-time link, 7 days, no email" },
  { k: "Security", v: "TOTP 2FA, API tokens, audit log" },
]

const ROLES = ["owner", "admin", "member"] as const
type Role = (typeof ROLES)[number]

const CAPABILITIES: { label: string; roles: Role[] }[] = [
  { label: "Projects they created or were assigned to", roles: ["owner", "admin", "member"] },
  { label: "View & manage all projects", roles: ["owner", "admin"] },
  { label: "Deploy, rollback, backups, jobs, volume/file mounts", roles: ["owner", "admin", "member"] },
  { label: "Data browser: read", roles: ["owner", "admin", "member"] },
  { label: "Own account: password, 2FA, API tokens", roles: ["owner", "admin", "member"] },
  { label: "Data browser: write, SQL import, create extra databases", roles: ["owner", "admin"] },
  { label: "Invite members (admin/member)", roles: ["owner", "admin"] },
  { label: "Registry, remote servers, Swarm, notifications, Git credentials, S3 destinations", roles: ["owner", "admin"] },
  { label: "Web terminal & bind mounts", roles: ["owner", "admin"] },
  { label: "Audit log", roles: ["owner", "admin"] },
  { label: "Invite owners, change roles, delete users", roles: ["owner"] },
  { label: "Reset password & disable 2FA for members", roles: ["owner"] },
  { label: "Provision/remove registry & proxy, GC, disk cleanup", roles: ["owner"] },
  { label: "Init/leave Swarm & manage nodes, instance backup", roles: ["owner"] },
]

const INVITE_FLOW = [
  { s: "Invite", d: "email + role → link shown once" },
  { s: "Send", d: "copy the link, send it via chat" },
  { s: "Join", d: "recipient fills in name + password" },
  { s: "Sign in", d: "logged in right away, invitation closed" },
]

const NEXT = [
  { title: "Installation", description: "First owner account via /setup or ADMIN_*.", href: "/en/docs/instalasi" },
  { title: "Web terminal", description: "Why it's owner/admin only.", href: "/en/docs/terminal" },
  { title: "Data browser", description: "Read vs. write access per role.", href: "/en/docs/data-browser#hak-tulis" },
  { title: "Webhook auto-deploy", description: "Triggering a deploy from CI with an API token.", href: "/en/docs/webhook" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/pengguna-peran"
      title="Users & roles"
      lang="en"
      description="Instance roles decide who can touch the infrastructure; per-project membership decides who can see and change which project."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="peran">Instance roles</H2>
      <P>
        As in the role select in the UI: <strong>Member</strong> — projects
        &amp; deploys; <strong>Admin</strong> — + registry, servers,
        notifications, terminal; <strong>Owner</strong> — everything.
      </P>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="min-w-[14rem] px-4 py-2.5 text-left font-normal text-muted-foreground">
                Allowed to
              </th>
              {ROLES.map((role) => (
                <th key={role} className="w-20 px-2 py-2.5 text-center font-semibold">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAPABILITIES.map((cap) => (
              <tr key={cap.label} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2 text-muted-foreground">{cap.label}</td>
                {ROLES.map((role) => {
                  const ok = cap.roles.includes(role)
                  return (
                    <td
                      key={role}
                      className={cn(
                        "px-2 py-2 text-center",
                        ok ? "text-primary-foreground dark:text-primary" : "text-muted-foreground/40"
                      )}
                    >
                      {ok ? "✓" : "–"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Ul>
        <li>
          Roles are read from the database on <strong>every request</strong>:
          a role change or a deleted user takes effect immediately, without
          waiting for a session (7 days) to expire.
        </li>
        <li>
          An owner can&apos;t delete or demote themselves if they&apos;re the last
          owner, and a user who still owns projects can&apos;t be deleted.
        </li>
      </Ul>

      <H2 id="project">Per-project membership</H2>
      <P>
        Besides the instance role, every project has its own member list (the{" "}
        <strong>Members</strong> tab on the project page). This is what
        decides who can see that project:
      </P>
      <Table
        head={["Who", "Which projects they see"]}
        rows={[
          [<strong key="oa">Instance owner &amp; admin</strong>, "All projects, without needing to be added."],
          [<strong key="c">The project&apos;s creator</strong>, "The project they created — always as a project admin."],
          [<strong key="m">Other instance members</strong>, "Only projects they've been added to; others return 404, not 403."],
        ]}
      />
      <Table
        head={["Project role", "Allowed to"]}
        rows={[
          [
            <strong key="pa">admin</strong>,
            "Everything a developer can, plus manage project members and delete the project.",
          ],
          [
            <strong key="pd">developer</strong>,
            "Create & change applications, databases, stacks, domains, mounts, jobs, backups — day-to-day work.",
          ],
          [
            <strong key="pv">viewer</strong>,
            "Read only: status, logs, metrics, backup list. Every state-changing request is rejected, including via API token.",
          ],
        ]}
      />
      <Ul>
        <li>
          Adding a project member uses the email of an account that{" "}
          <strong>already exists</strong> on the instance — invite them to the
          instance first if they don&apos;t have an account.
        </li>
        <li>
          The viewer restriction is enforced centrally in the API for all
          project endpoints, not just hidden in the UI. Log/terminal tickets
          can still be read.
        </li>
        <li>
          When this feature was rolled out, every existing member was
          backfilled onto every project so the upgrade didn&apos;t change anyone&apos;s
          access — adjust it afterward if you want to restrict things.
        </li>
      </Ul>

      <H2 id="owner-pertama">The first owner</H2>
      <Table
        head={["Method", "When", "Notes"]}
        rows={[
          [<Code key="1">/setup</Code>, "The users table is still empty", "A form for name, email, password. A serializable transaction — two people can't both become the first owner."],
          [<><Code>ADMIN_EMAIL</Code> + <Code>ADMIN_PASSWORD</Code></>, "At boot, if there are no users yet", "For automated installs. Idempotent: never overwrites an existing account; safe to leave in the env."],
        ]}
      />

      <H2 id="undang">Inviting members</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {INVITE_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Steps>
        <Step title="Settings → Members → Invite member">
          <P>
            Fill in <strong>Email</strong> and <strong>Role</strong>. Admins
            can only invite admins/members; owners can invite owners.
          </P>
        </Step>
        <Step title="Copy the link — it's shown only once">
          <Pre>{`https://panel.example.com/invite/9f3a1c…e21d`}</Pre>
          <P>
            Starts with <Code>WEB_ORIGIN</Code>; if that&apos;s still an IP, the
            link contains that IP. aoox <strong>doesn&apos;t send email</strong> —
            send it yourself via chat.
          </P>
        </Step>
        <Step title="The recipient opens the link">
          <P>
            The invitation page shows the email and role that were already
            set; the recipient only fills in a name and password (min. 8),
            then is signed in right away. The link becomes invalid once used.
          </P>
        </Step>
      </Steps>
      <H3>Invitation rules</H3>
      <Ul>
        <li>Valid for <strong>7 days</strong>; one link = one account.</li>
        <li>
          Inviting an email that already has a pending invitation{" "}
          <strong>replaces</strong> the old one (the old link stops working).
        </li>
        <li>
          The <strong>Pending invitations</strong> list on the Members card
          shows the ones not yet accepted; they can be revoked.
        </li>
        <li>The invitation-accept page is rate-limited to 10 attempts/minute per IP.</li>
      </Ul>

      <H2 id="kelola">Managing members (owner)</H2>
      <Table
        head={["Action", "Where", "Notes"]}
        rows={[
          ["Change role", "Role select on the member's row", "Takes effect on the next request."],
          ["Reset password", <>The <em>Set new password (reset)</em> icon on the member&apos;s row</>, "For a member who forgot their password; deliver the temporary password through a secure channel and ask them to change it."],
          ["Disable a member's 2FA", "Member's row (non-owner)", "For someone who lost their authenticator and backup codes. An owner must use a backup code themselves."],
          ["Delete a user", "Member's row", "Rejected if they're the last owner or still own a project (move/delete the project first). Their invitations and API tokens go with them."],
          ["Remove from a single project", "Members tab on the project page", "Can be done by a project admin alone; their user account stays."],
        ]}
      />

      <H2 id="akun">Account security</H2>
      <P>The <strong>Account</strong> card in Settings, for every role:</P>
      <H3>Change password</H3>
      <P>
        Fill in <strong>Current password</strong> + <strong>New password (min. 8)</strong>.
        Other sessions aren&apos;t forced to log out.
      </P>
      <H3>Two-factor verification (2FA)</H3>
      <Steps>
        <Step title="Enable 2FA → scan the QR code">
          <P>Any TOTP app (Google Authenticator, Aegis, 1Password, Bitwarden).</P>
        </Step>
        <Step title="Enter the 6-digit code to confirm">
          <P>
            Once it&apos;s correct, <strong>10 backup codes</strong> are shown{" "}
            <strong>once</strong> — save them in a password manager. Each code
            is single-use.
          </P>
        </Step>
        <Step title="The next sign-in becomes two steps">
          <P>
            Password → a code page (TOTP or a backup code). The second step
            must be completed within <strong>5 minutes</strong>.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          <strong>Disabling 2FA</strong> from the Account card requires the
          current password <em>and</em> a valid code — it can&apos;t be done from a
          stolen session alone.
        </li>
        <li>
          Lost your authenticator: use a backup code; once they&apos;re all used up,
          ask an owner to disable your 2FA. A last owner without a backup code
          can&apos;t be recovered from the UI — don&apos;t let that happen.
        </li>
        <li>API tokens aren&apos;t affected by 2FA (used without a second step).</li>
      </Ul>
      <H3>API tokens</H3>
      <Steps>
        <Step title="API token card → give it a Name and an Expiry">
          <P>
            E.g. name it <Code>GitLab CI</Code>; expiry of 30 days, 90 days,
            1 year, or never.
          </P>
        </Step>
        <Step title="Set permissions (optional): Read-only and Restrict to projects">
          <P>
            <strong>Read-only</strong> rejects every state-changing request —
            same as the viewer role, including websocket log tickets.{" "}
            <strong>Restrict to projects</strong> picks one or more projects;
            the token then gets 404 outside them and is rejected on every
            instance Settings route (server, registry, proxy).
          </P>
        </Step>
        <Step title="Copy the aoox_… token — shown only once">
          <Pre title="Using the token">{`curl -H "Authorization: Bearer aoox_…" \\
  https://api.panel.example.com/applications/<id>/deploy -X POST`}</Pre>
        </Step>
      </Steps>
      <Ul>
        <li>
          A token acts <strong>as its owner</strong> with the same role —
          permissions can only <strong>narrow</strong> access, never extend it
          beyond the owner&apos;s, even for an owner.
        </li>
        <li>
          Scope is checked in one place before any route runs, so it also
          applies to the{" "}
          <DocLink href="/en/docs/cli">aoox CLI</DocLink>, which uses the same
          token.
        </li>
        <li>Tokens are stored hashed; lost means create a new one. Revoke anytime from the list.</li>
        <li>
          Endpoint docs (OpenAPI/Swagger) live at{" "}
          <Code>{"<PUBLIC_API_URL>/docs"}</Code>.
        </li>
      </Ul>
      <H3>Audit log</H3>
      <P>
        <strong>Settings → Audit log</strong> (owner/admin): who did what,
        when, and from which IP — including sign-ins, deploys, env changes,
        invitations. Filter by action, e.g. <Code>deploy</Code>,{" "}
        <Code>/databases/</Code>, <Code>sign-in</Code>. Request bodies are
        stored with secrets redacted; entries older than{" "}
        <strong>90 days</strong> are deleted automatically.
      </P>

      <H2 id="praktik">Recommended practices</H2>
      <Ul>
        <li>At least <strong>two owners</strong>, both with 2FA and saved backup codes.</li>
        <li>Default new members to <strong>member</strong>; only raise them to admin when they need to manage infrastructure.</li>
        <li>One API token per integration, with an expiry — revoke it when the integration is retired.</li>
        <li>Check the audit log after an incident or when an unfamiliar deploy shows up.</li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Invitation link contains an IP / http", "WEB_ORIGIN is still an IP. It still works; set up a panel domain first for a cleaner link."],
          ["Invitation isn't valid", "Already used, expired (7 days), revoked, or replaced by a new invitation for the same email."],
          ["Can't delete a user", "They're the last owner, or still own a project — move/delete the project first."],
          ["Sign-in asks for a code but there's no authenticator", "Use a backup code; once they're used up, ask an owner to disable 2FA."],
          ["API token gets 401", "Expired/revoked, or the header isn't Bearer aoox_…. Create a new token."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        SSO/OAuth; sending invitations by email; transferring project
        ownership.
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
