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

export const metadata: Metadata = { title: "Getting started with the CLI" }

const SUMMARY = [
  { k: "Command", v: "aoox" },
  { k: "Auth", v: "An aoox_… API token from the panel" },
  { k: "Needs", v: "Node.js 20+ (aoox install: a Linux VPS + root)" },
]

const COMMANDS = [
  {
    cmd: "aoox install",
    what: "Installs aoox (postgres + api + web) on a fresh VPS via Docker Compose.",
    flags: "--web-domain, --api-domain, --acme-email, --admin-email/-name/-password, --dir, --force, --yes/-y",
  },
  {
    cmd: "aoox login",
    what: "Stores the panel URL and API token for other commands.",
    flags: "--url/-u, --token/-t",
  },
  {
    cmd: "aoox whoami",
    what: "Shows the account and panel currently in use.",
    flags: "--url/-u, --token/-t, --json",
  },
  {
    cmd: "aoox link",
    what: "Links a repo folder to an application in the panel (used by aoox deploy).",
    flags: "--project, --app",
  },
  {
    cmd: "aoox deploy",
    what: "Builds the image locally, pushes it to a registry, then triggers a deploy — following the log until it finishes.",
    flags: "--tag, --dockerfile/-f, --context, --registry",
  },
  {
    cmd: "aoox domain set",
    what: "Sets a custom domain for the panel itself (dashboard + API) without SSH.",
    flags: "--web, --api, --acme-email",
  },
  {
    cmd: "aoox registry domain",
    what: "Sets or clears a custom domain for the self-hosted registry.",
    flags: "--set, --clear",
  },
  {
    cmd: "aoox update",
    what: "Checks or applies an update for the aoox panel itself.",
    flags: "--apply",
  },
  {
    cmd: "aoox help [COMMAND]",
    what: "Lists commands, or shows help for one.",
    flags: "—",
  },
]

const NEXT = [
  { title: "Users & roles", description: "Creating an API token and its scope.", href: "/en/docs/pengguna-peran#akun" },
  { title: "Installation", description: "The manual steps aoox install automates.", href: "/en/docs/instalasi" },
  { title: "Registry", description: "Where images from aoox deploy are stored.", href: "/en/docs/registry" },
  { title: "Deploy & rollback", description: "What happens behind the scenes during a deploy.", href: "/en/docs/deploy" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/cli"
      title="Getting started with the CLI"
      lang="en"
      description="aoox is the official aoox CLI: it stores panel credentials on your machine and talks to the same API as the dashboard."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <Callout kind="warn" title="Early stage">
        The CLI can already install aoox (<Code>install</Code>), sign in (
        <Code>login</Code>/<Code>whoami</Code>), and build + deploy a local
        repo (<Code>link</Code>/<Code>deploy</Code>). Commands for projects,
        databases, log tailing, and more don&apos;t exist yet — use the
        dashboard, a{" "}
        <DocLink href="/en/docs/webhook">webhook</DocLink>, or call the API
        directly with the same token.
      </Callout>

      <H2 id="instalasi-cli">Installing the CLI</H2>
      <P>
        Requires <strong>Node.js 20+</strong>. Still an <Code>alpha</Code>{" "}
        release — install with that tag explicitly.
      </P>
      <Pre title="From npm">{`npm install -g @hideandseeklab/aoox@alpha

aoox --version`}</Pre>
      <P>
        The command is installed as <Code>aoox</Code> even though the
        package is named <Code>@hideandseeklab/aoox</Code>. To track{" "}
        <Code>main</Code> before it&apos;s released, install from source:
      </P>
      <Pre title="From source">{`git clone https://github.com/hideandseeklab/aoox-cli.git
cd aoox-cli
npm install
npm run build
npm link          # makes the aoox command available globally

aoox --version`}</Pre>

      <H2 id="install">Installing aoox via aoox install</H2>
      <P>
        This command is different from the section above: <Code>aoox install</Code>{" "}
        doesn&apos;t connect to an existing panel — it{" "}
        <strong>installs its own panel</strong> (postgres + api + web) on a
        fresh Linux VPS, as an alternative to the manual steps in{" "}
        <DocLink href="/en/docs/instalasi">Installation</DocLink>. Run it as
        root, directly on the target server.
      </P>
      <Pre title="Simplest form (no domain, accessed by IP)">{`$ sudo aoox install
==> Detecting the server's public IP
Install aoox into /opt/aoox and run docker compose up -d? (Y/n)
==> Running docker compose up -d
==> Waiting for the API to be ready

aoox installed into /opt/aoox.
Open: http://203.0.113.10:3000
Create the first owner account at /setup.`}</Pre>
      <Pre title="With a domain + automatic HTTPS, and creating the owner right away">{`sudo aoox install \\
  --web-domain panel.example.com \\
  --api-domain api.panel.example.com \\
  --acme-email me@example.com \\
  --admin-email me@example.com \\
  --admin-name "Admin" \\
  --admin-password "a-strong-password" \\
  --yes`}</Pre>
      <Ul>
        <li>
          Docker is installed automatically via <Code>get.docker.com</Code>{" "}
          if it isn&apos;t already present — asks for confirmation unless{" "}
          <Code>--yes</Code> is given.
        </li>
        <li>
          <Code>--web-domain</Code> and <Code>--api-domain</Code> require
          each other, and both need <Code>--acme-email</Code> for a
          Let&apos;s Encrypt certificate via the built-in proxy.
        </li>
        <li>
          Without <Code>--admin-email</Code>, create the owner account via{" "}
          <Code>/setup</Code> in the browser, same as a manual install.
        </li>
        <li>
          The default install folder is <Code>/opt/aoox</Code> (change it
          with <Code>--dir</Code>); an existing install in that folder is
          rejected unless <Code>--force</Code> is given.
        </li>
        <li>
          Secrets (<Code>JWT_SECRET</Code>, <Code>ENCRYPTION_KEY</Code>,
          the Postgres password) are generated at random and written to{" "}
          <Code>.env.dist</Code> with mode <Code>0600</Code> — no need for
          manual <Code>openssl rand</Code>.
        </li>
      </Ul>
      <Callout>
        This command replays the steps in{" "}
        <DocLink href="/en/docs/instalasi">Installation</DocLink>{" "}
        automatically: cloning the distribution compose files, filling in
        the env, <Code>docker compose up -d</Code>, then waiting for{" "}
        <Code>/auth/setup-status</Code> to respond. It&apos;s not a replacement for{" "}
        <Code>aoox login</Code> — once the panel is installed, log in as
        usual to use <Code>aoox link</Code>/<Code>aoox deploy</Code>.
      </Callout>

      <H2 id="login">Signing in to the panel</H2>
      <Steps>
        <Step title="Create an API token in the panel">
          <P>
            <strong>Settings → API token</strong>: give it a name (e.g.{" "}
            <Code>my-laptop</Code>), pick an expiry, then copy the{" "}
            <Code>aoox_…</Code> token — it&apos;s only shown once. A token acts{" "}
            <strong>as its owner</strong>, with the same role — see{" "}
            <DocLink href="/en/docs/pengguna-peran#akun">Account security</DocLink>.
          </P>
        </Step>
        <Step title="Run aoox login">
          <Pre>{`$ aoox login
Panel URL  https://panel.example.com
API token (aoox_…) ********
Verifying token... ok
Signed in as you@example.com (owner) at https://panel.example.com
Token saved to /home/you/.config/aoox/config.json`}</Pre>
          <P>
            The token is asked for via a hidden prompt, not an argument, so
            it doesn&apos;t end up in shell history or the process list. Before
            saving, the CLI calls <Code>GET /auth/me</Code> — rejected
            credentials are never written to disk.
          </P>
        </Step>
        <Step title="Confirm you're connected">
          <Pre>{`$ aoox whoami
you@example.com · owner · Admin
Panel: https://panel.example.com`}</Pre>
          <P>
            Add <Code>--json</Code> for script-friendly output; the plain
            text lines above are hidden automatically.
          </P>
        </Step>
      </Steps>

      <H2 id="link-deploy">Build & deploy from a local repo</H2>
      <P>
        <Code>aoox link</Code> connects a repo folder to a single application
        in the panel, then <Code>aoox deploy</Code> builds the image on your
        machine, pushes it to a registry, and triggers a deploy — following
        the log until it&apos;s done, just like the Deploy tab in the dashboard.
      </P>
      <Steps>
        <Step title="Link the folder to an application">
          <Pre>{`$ cd my-app-repo
$ aoox link
? Select a project › shop
? Select an application › shop (shop)
Linked: shop / shop (shop)
Written to .aoox.json — safe to commit, holds no secrets.`}</Pre>
          <P>
            <Code>--project</Code>/<Code>--app</Code> skip the interactive
            picker — used in CI. The generated <Code>.aoox.json</Code> file
            contains no token, so it&apos;s safe to check in.
          </P>
        </Step>
        <Step title="Deploy">
          <Pre>{`$ aoox deploy
==> Build localhost:5000/shop/shop:a1b2c3d
==> docker login localhost:5000
==> Push localhost:5000/shop/shop:a1b2c3d
==> Updating the application & triggering a deploy
[building] Building localhost:5000/shop/shop:a1b2c3d from https://…
...
Deployed: localhost:5000/shop/shop:a1b2c3d`}</Pre>
          <P>
            The build runs on your local Docker (<Code>docker build</Code>{" "}
            with <Code>--dockerfile</Code>/<Code>--context</Code>), then
            gets pushed to that application&apos;s registry — the self-hosted
            registry by default if there&apos;s more than one, or pick manually
            with <Code>--registry</Code>. The default tag is the git short
            SHA (<Code>+ -dirty</Code> if there are uncommitted changes);
            override it with <Code>--tag</Code>.
          </P>
        </Step>
      </Steps>
      <Callout>
        The application is automatically switched to{" "}
        <Code>sourceType: image</Code>, using the registry and tag just
        pushed — not rebuilt on the server the way a Git build is.{" "}
        <DocLink href="/en/docs/aplikasi#sumber">The two application sources</DocLink>.
        A deployment already in progress for the same application is rejected
        (409) — wait for it to finish first.
      </Callout>

      <H2 id="domain">Changing the panel&apos;s domain</H2>
      <P>
        An alternative to Settings → Domain panel in the dashboard — good for
        provisioning scripts. See{" "}
        <DocLink href="/en/docs/domain-panel">Domain for the panel</DocLink> for
        the details of what happens behind it.
      </P>
      <Pre>{`$ aoox domain set --web panel.example.com --api api.panel.example.com \\
  --acme-email you@example.com
Domain saved: panel.example.com (dashboard), api.panel.example.com (API).
The panel will restart for a few seconds to apply it — the connection to this API will drop briefly.`}</Pre>
      <Callout>
        Needs <Code>INSTALL_DIR</Code> already set in the panel&apos;s{" "}
        <Code>.env.dist</Code> (the absolute path of the folder containing{" "}
        <Code>docker-compose.dist.yml</Code> on that host) — without it the
        command fails with a 400.
      </Callout>

      <H2 id="update">Updating aoox</H2>
      <P>
        Checks and applies an update for the panel itself (not the
        applications it deploys) — compares the <Code>aoox-api</Code>/
        <Code>aoox-web</Code> image digests on the registry, not just a
        version number.
      </P>
      <Pre>{`$ aoox update
Running version: 0.1.0-alpha.1
  api: hideandseeklab/aoox-api:latest (update available)
  web: hideandseeklab/aoox-web:latest (up to date)
Update available. Run with --apply to apply it.

$ aoox update --apply
Update applied — the panel will restart in a few seconds to apply it.`}</Pre>
      <P>
        Same as <Code>aoox domain set</Code>, needs <Code>INSTALL_DIR</Code>{" "}
        set. See <DocLink href="/en/docs/instalasi#update">Upgrading</DocLink>{" "}
        for the manual, over-SSH alternative.
      </P>

      <H2 id="perintah">Command reference</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Command</th>
              <th className="px-3 py-2 text-left font-medium">Does</th>
              <th className="px-3 py-2 text-left font-medium">Flags</th>
            </tr>
          </thead>
          <tbody>
            {COMMANDS.map((row) => (
              <tr key={row.cmd} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{row.cmd}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{row.what}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.flags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="konfigurasi">Configuration & environment variables</H2>
      <Table
        head={["Source", "Contents", "Notes"]}
        rows={[
          [
            <Code key="1">config.json</Code>,
            <>
              <Code>{'{ "url": "…", "token": "aoox_…" }'}</Code> in oclif&apos;s
              config directory (<Code>~/.config/aoox/</Code> on Linux).
            </>,
            <>Written with mode <Code>0600</Code>; the full path is printed at login.</>,
          ],
          [
            <><Code>--url</Code> / <Code>--token</Code></>,
            "Override the file's contents for a single command.",
            "Useful when switching between panels (production vs. staging).",
          ],
          [
            <><Code>AOOX_URL</Code> / <Code>AOOX_TOKEN</Code></>,
            "The same values, via the environment.",
            "Used in CI; also shown in --help.",
          ],
        ]}
      />
      <Ul>
        <li>
          Precedence: flag → environment → <Code>config.json</Code> contents.
          If none is complete, the CLI tells you to run{" "}
          <Code>aoox login</Code>.
        </li>
        <li>
          Working with several panels? Don&apos;t keep logging in and out — save
          one as the default and override it with{" "}
          <Code>--url</Code>/<Code>--token</Code> as needed.
        </li>
      </Ul>

      <H3>In CI (no terminal)</H3>
      <P>
        <Code>aoox login</Code> needs an interactive terminal. In a pipeline,
        skip login and supply credentials via the environment:
      </P>
      <Pre title=".gitlab-ci.yml">{`deploy:
  image: node:20
  variables:
    AOOX_URL: https://panel.example.com
  script:
    - npx -p @hideandseeklab/aoox aoox whoami   # AOOX_TOKEN from a CI variable (masked)`}</Pre>
      <Callout>
        Store the token as a <em>masked</em> CI variable, and create a
        separate token per pipeline so it can be revoked without affecting
        the others.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Message", "Cause & fix"]}
        rows={[
          [
            <>Token rejected by the panel (401)</>,
            <>The token expired, was revoked, or was copied wrong. Create a new one in Settings → API token.</>,
          ],
          [
            <>No interactive terminal</>,
            <>Running in CI/a script. Pass <Code>--url</Code> and <Code>--token</Code>, or set <Code>AOOX_URL</Code> and <Code>AOOX_TOKEN</Code>.</>,
          ],
          [
            <>Can&apos;t reach the panel</>,
            <>Wrong URL, or the API isn&apos;t reachable from this machine. Use the panel&apos;s <Code>PUBLIC_API_URL</Code> (not the dashboard URL) and test with <Code>curl &lt;url&gt;/auth/setup-status</Code>.</>,
          ],
          [
            <>Config is corrupted (not valid JSON)</>,
            <>The config file was edited by hand. Delete it, then run <Code>aoox login</Code> again.</>,
          ],
          [
            <>403 on a specific command</>,
            <>The token owner&apos;s role isn&apos;t high enough — a token never grants more than its owner has. If the token has a scope, see <DocLink href="/en/docs/pengguna-peran#akun">read-only/project-limited tokens</DocLink>.</>,
          ],
          [
            <>This repo isn&apos;t linked yet</>,
            <><Code>aoox deploy</Code> was run before <Code>aoox link</Code>. Run <Code>aoox link</Code> first in the repo folder.</>,
          ],
          [
            <>A deployment is already running (409)</>,
            <>The same application is already being deployed — from the dashboard, a webhook, or another <Code>aoox deploy</Code>. Wait for it to finish, check the Deploy tab.</>,
          ],
          [
            <>aoox install: root required</>,
            <>Run it with <Code>sudo</Code> — installation writes to system paths and manages Docker.</>,
          ],
          [
            <>aoox install: an install already exists at …</>,
            <>The <Code>--dir</Code> folder (default <Code>/opt/aoox</Code>) is already populated. Pass <Code>--force</Code> to overwrite it, or use a different <Code>--dir</Code>.</>,
          ],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Commands for projects, standalone log tailing, and databases; an
        official npm package; shell autocomplete; <Code>--json</Code> output
        for every command (currently just <Code>whoami</Code>).
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
