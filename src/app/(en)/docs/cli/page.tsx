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
  path: "/docs/cli",
  lang: "en",
  title: "Getting started with the CLI",
  description:
    "Install aoox, store a panel token, and use it in CI.",
})

const SUMMARY = [
  { k: "Command", v: "aoox" },
  { k: "Auth", v: "An aoox_… API token from the panel" },
  { k: "Needs", v: "Install script (no Node.js), or Node.js 22+ (npm)" },
]

const COMMANDS = [
  {
    cmd: "aoox install",
    what: "Installs aoox (postgres + api + web) on a fresh VPS via Docker Compose.",
    flags: "--web-domain, --api-domain, --acme-email, --admin-email/-name/-password, --dir, --force, --yes/-y",
  },
  {
    cmd: "aoox login",
    what: "Stores the dashboard address and API token for other commands (the API address is discovered automatically).",
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
    cmd: "aoox env list | pull | push | set | unset | history | diff | promote",
    what: "Lists, downloads, uploads, compares or changes the environments of variable sets (see Variables).",
    flags: "--set/-s, --env/-e, --app, --stack, --url/-u, --token/-t; --reveal, --json (list); --file, --force, --format (pull); --file, --yes (push); --secret/--no-secret (set); --limit, --json (history); --from, --to (diff, promote); --all, --yes (promote)",
  },
  {
    cmd: "aoox env links | link | unlink",
    what: "Shows or changes the ordered set environments an application (or --stack) uses.",
    flags: "--app, --stack; --set/-s, --env/-e, --position (link, unlink)",
  },
  {
    cmd: "aoox run -- <command>",
    what: "Runs a command with the variables the linked application gets at deploy time (or one set environment), without writing them to disk.",
    flags: "--set/-s, --env/-e, --app, --stack, --file, --quiet/-q, --url/-u, --token/-t",
  },
  {
    cmd: "aoox domain set",
    what: "Sets a custom domain for the panel itself (dashboard + API) without SSH.",
    flags: "--web, --api, --acme-email, --[no-]domain-only",
  },
  {
    cmd: "aoox domain clear",
    what: "Removes the panel's custom domain and goes back to IP access (IP:3000), after a confirmation.",
    flags: "--yes/-y",
  },
  {
    cmd: "aoox registry domain",
    what: "Sets or clears a custom domain for the self-hosted registry.",
    flags: "--set, --clear",
  },
  {
    cmd: "aoox update",
    what: "Updates the aoox CLI itself from npm (replaces the old panel update — see aoox update panel).",
    flags: "--check",
  },
  {
    cmd: "aoox update panel",
    what: "Checks or applies an update for the aoox panel itself (the old aoox update).",
    flags: "--apply",
  },
  {
    cmd: "aoox registry build",
    what: "Builds ./Dockerfile into a local image named for the registry; refuses a version that already exists there. With --push it also pushes it.",
    flags: "--push, --yes/-y, --registry, --dockerfile/-f, --context, --force",
  },
  {
    cmd: "aoox registry push",
    what: "Pushes an existing local image to the registry; refuses a version that already exists there.",
    flags: "--yes/-y, --registry, --force",
  },
  {
    cmd: "aoox reinstall",
    what: "Repairs/refreshes an existing panel install without losing data (rewrites compose, merges .env.dist, pull + recreate).",
    flags: "--dir, --dry-run, --yes, --no-pull, --terminal-ssh-user",
  },
  {
    cmd: "aoox help [COMMAND]",
    what: "Lists commands, or shows help for one.",
    flags: "—",
  },
]

const NEXT = [
  { title: "Variables", description: "Variable sets, protection, linking and references.", href: "/docs/variables" },
  { title: "Users & roles", description: "Creating an API token and its scope.", href: "/docs/users-roles#account" },
  { title: "Installation", description: "The manual steps aoox install automates.", href: "/docs/installation" },
  { title: "Registry", description: "Where images from aoox deploy are stored.", href: "/docs/registry" },
  { title: "Deploy & rollback", description: "What happens behind the scenes during a deploy.", href: "/docs/deploy" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/cli"
      title="Getting started with the CLI"
      lang="en"
      description="aoox is the official aoox CLI: it stores panel credentials on your machine and talks to the same API as the dashboard."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
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
        <DocLink href="/docs/webhook">webhook</DocLink>, or call the API
        directly with the same token.
      </Callout>

      <H2 id="cli-installation">Installing the CLI</H2>
      <P>
        On Linux or macOS, the install script sets up <Code>aoox</Code> with
        no Node.js required at all — the tarball bundles its own Node.js
        runtime:
      </P>
      <Pre title="Linux / macOS, no Node.js">{`curl -fsSL https://aoox.dev/install-cli.sh | sh

aoox --version`}</Pre>
      <P>
        Installs to <Code>/usr/local/lib/aoox</Code> +{" "}
        <Code>/usr/local/bin/aoox</Code> (root/sudo), or{" "}
        <Code>~/.local/lib/aoox</Code> without that access. Running the same
        command again upgrades in place. Supports Linux (glibc —{" "}
        <strong>not</strong> Alpine/musl) and macOS, x64 and arm64.
      </P>
      <Callout kind="note" title="Windows, Alpine, or already have Node.js?">
        Use npm instead — requires <strong>Node.js 22+</strong> first.
        Later, update with <Code>aoox update</Code>.
      </Callout>
      <Pre title="From npm">{`npm install -g @hideandseeklab/aoox

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
        <DocLink href="/docs/installation">Installation</DocLink>. Run it as
        root, directly on the target server.
      </P>
      <Pre title="Simplest form (no domain, accessed by IP)">{`$ sudo aoox install
==> Detecting the server public IP
Install aoox in /opt/aoox and run docker compose up -d? (Y/n)
==> Running docker compose up -d
==> Waiting for the API to be ready

aoox is installed in /opt/aoox.
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
        <DocLink href="/docs/installation">Installation</DocLink>{" "}
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
            <strong>Settings<PathArrow />API token</strong>: give it a name (e.g.{" "}
            <Code>my-laptop</Code>), pick an expiry, then copy the{" "}
            <Code>aoox_…</Code> token — it&apos;s only shown once. A token acts{" "}
            <strong>as its owner</strong>, with the same role — see{" "}
            <DocLink href="/docs/users-roles#account">Account security</DocLink>.
            The dialog that shows the token also has a copy-ready{" "}
            <Code>aoox login --url … --token …</Code> line.
          </P>
        </Step>
        <Step title="Run aoox login">
          <Pre>{`$ aoox login
Use the address you open the dashboard with: your panel domain (e.g. https://dashboard.example.com),
or http://<server-IP>:3000 if no panel domain is set yet.
? Dashboard URL https://panel.example.com
Looking for the panel... ok
API token (aoox_…) ********
Verifying token... ok
Logged in as you@example.com (owner) at https://panel.example.com
Token saved to /home/you/.config/aoox/config.json`}</Pre>
          <P>
            You only ever enter the <strong>dashboard</strong> address — the
            one you open in your browser, never the API address. The CLI reads
            the API address from the dashboard (
            <Code>/.well-known/aoox.json</Code>). You can leave out the scheme:
            a bare host is tried over https, then http, and a bare IP also on
            port <Code>3000</Code>, so <Code>203.0.113.10</Code> works on a
            fresh install with no panel domain. If the dashboard does not
            advertise a public API address, the CLI assumes{" "}
            <Code>&lt;same host&gt;:3001</Code> and says so. An API address given
            by an older script still works (with a one-line note).
          </P>
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

      <H2 id="connection">Which panel am I connected to?</H2>
      <P>
        Running <Code>aoox</Code> with no arguments lists the commands and,
        below them, where the CLI is connected. The dashboard and API
        addresses come from the saved login (no network); the registry line
        asks the panel for its default registry with a short timeout and
        never fails the command. <Code>aoox --help</Code> and{" "}
        <Code>aoox &lt;command&gt; --help</Code> are unchanged.
      </P>
      <Pre>{`$ aoox
...
Connected to
  Dashboard  https://dashboard.example.com
  API        https://api.example.com
  Registry   registry.example.com (self-hosted)

$ aoox            # not logged in
Not connected — run: aoox login`}</Pre>
      <P>
        If the registry cannot be checked you see{" "}
        <Code>Registry   (could not check: panel unreachable)</Code>; a{" "}
        <Code>localhost:…</Code> registry address gets a short warning to set
        a domain with <Code>aoox registry domain --set &lt;host&gt;</Code>.
      </P>

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
Written to .aoox.json — safe to commit, contains no secrets.`}</Pre>
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
        <DocLink href="/docs/applications#source">The two application sources</DocLink>.
        A deployment already in progress for the same application is rejected
        (409) — wait for it to finish first.
      </Callout>

      <H2 id="env">Variables (aoox env, aoox run)</H2>
      <P>
        <Code>aoox env</Code> reads and changes the environments of{" "}
        <DocLink href="/docs/variables">variable sets</DocLink> (the same ones
        as <strong>Variables</strong> in the dashboard) and manages which of
        them the linked application uses. <Code>aoox run</Code> starts a
        command with the variables the application gets at deploy time,
        without writing a file.
      </P>
      <Ul>
        <li>
          A set environment is chosen with <Code>--set &lt;slug&gt;</Code> (short{" "}
          <Code>-s</Code>) and <Code>--env &lt;name&gt;</Code> (<Code>-e</Code>).
        </li>
        <li>
          <strong>Defaults</strong>: <Code>--set</Code> is the only set the
          application linked with <Code>aoox link</Code> uses (or the only set
          you can see); <Code>--env</Code> is the only environment of that set
          it links. With several candidates the command stops and lists them —
          it never guesses. There is no default environment name.
        </li>
        <li>
          <Code>--app &lt;id&gt;</Code> uses another application, and{" "}
          <Code>--stack &lt;id&gt;</Code> a compose stack, instead of the linked
          application.
        </li>
      </Ul>
      <Pre title="A typical session">{`$ aoox env list
backend  (Backend) · shared with shop, blog · your role: developer
  development             3 variables
  staging                 0 variables
  production (protected)  7 variables  used by 2

$ aoox env set API_URL=https://api.example.com GREETING="hello world" -s backend -e development
backend/development: added API_URL, GREETING (5 variables now)

$ aoox env list --set backend --env development            # names only, values masked
API_URL=••••••••
$ aoox env list --set backend --env development --reveal   # values (audited)
$ aoox env pull --set backend --env development            # writes ./.env (mode 0600)
$ aoox env unset OLD_KEY --set backend --env development
$ aoox run -- npm run dev                                  # the deployed app's variables (likely production)`}</Pre>
      <Callout kind="warn" title="For local work, pass --set and --env">
        Without them <Code>aoox run</Code> reproduces the linked application as
        deployed, usually production. See{" "}
        <DocLink href="/docs/cli#local-development">Local development</DocLink>.
      </Callout>
      <Table
        head={["Command", "Does"]}
        rows={[
          [<Code key="l">aoox env list [--set slug] [--env name] [--reveal] [--json]</Code>, "Without flags: every set you can see, your role, its sharing and each environment's variable count (also as aoox env sets). With --set: one set. With --env: that environment's variable names; --reveal shows the values through the audited reveal action."],
          [<Code key="p">aoox env pull [--set slug] [--env name] [--file .env] [--format dotenv|json|shell] [--force]</Code>, <>Writes the variables to a file with mode <Code>0600</Code> (owner only, where the OS supports it). It never overwrites an existing file unless <Code>--force</Code>, and warns once when the file is not covered by <Code>.gitignore</Code> (it never edits <Code>.gitignore</Code> itself).</>],
          [<Code key="s">aoox env set KEY=VALUE [KEY2=VALUE2 …] [--set slug] [--env name] [--secret | --no-secret]</Code>, <>Adds or changes variables. Comments (including <DocLink href="/docs/variables#notes">notes</DocLink>) and the order of the existing lines are kept; a new variable goes at the end. <Code>--secret</Code> marks the variables as secret, <Code>--no-secret</Code> as explicitly not secret; without either, the flags stay as they are (see <DocLink href="/docs/variables#secret-flags">Secret variables</DocLink>). A value with <Code>{"${{project.KEY}}"}</Code> is refused: write <Code>{"${{vars.KEY}}"}</Code>.</>],
          [<Code key="u">aoox env unset KEY [KEY2 …] [--set slug] [--env name]</Code>, "Removes variables; comments and the other lines stay."],
          [<Code key="pu">aoox env push --file .env [--set slug] [--env name] [--yes]</Code>, "Replaces the whole environment with a local file, after showing which variables are added, changed and removed and asking for confirmation."],
          [<Code key="h">aoox env history [--set slug] [--env name] [--limit 20] [--json]</Code>, "The version history of an environment, newest first: when, who, and the variable names added (+), changed (~) or removed (-). Never values."],
          [<Code key="d">aoox env diff --from name --to name [--set slug] [--json]</Code>, "Compares two environments of one set by variable name: only on one side, different values, same. Prints names only."],
          [<Code key="pr">aoox env promote --from name --to name [KEY …] [--all] [--yes] [--set slug]</Code>, "Copies the named variables (or all of them) and their secret flag from one environment of the set into another, after showing what changes and asking for confirmation."],
          [<Code key="ls">aoox env links [--app id | --stack id] [--json]</Code>, "The set environments the application (or stack) uses, in merge order (1 = first, overridden by later ones), with the variables a later link or the own env overrides."],
          [<Code key="ln">aoox env link --set slug --env name [--position n] [--app id | --stack id]</Code>, "Links a set environment. It goes at the end (so it wins over the others) unless --position (1-based) is given; an environment that is already linked is moved there. Takes effect on the next deploy."],
          [<Code key="ul">aoox env unlink (--set slug --env name | --position n) [--app id | --stack id]</Code>, "Removes a link. Takes effect on the next deploy."],
          [<Code key="r">aoox run [--set slug --env name] [--file .env.local] [--quiet] [--app id | --stack id] -- command [args…]</Code>, "Starts the command with the variables on top of your current environment (see below). Nothing is written to disk. Output goes straight to your terminal, the command's exit code is the exit code of aoox run, and Ctrl+C or SIGTERM is passed to it."],
        ]}
      />
      <H3>What aoox run passes to the command</H3>
      <Ul>
        <li>
          <strong>By default</strong> it does what the panel does when it
          creates the container, as far as a terminal can: it reads every set
          environment the application links, in order (a later one wins on the
          same key), then puts the application&apos;s own env on top. Every read
          is audited. If any of them cannot be read (a protected environment, a
          viewer, a token scope), nothing is started.
        </li>
        <li>
          <Code>{"${{vars.KEY}}"}</Code> is replaced by the merged set value of{" "}
          <Code>KEY</Code>, one level deep like the panel.
        </li>
        <li>
          <Code>{"${{database.…}}"}</Code> and <Code>{"${{secret.…}}"}</Code>{" "}
          references, and a <Code>{"${{vars.KEY}}"}</Code> that no linked set
          defines, are <strong>left as written</strong>, with one warning naming
          those variables: only the panel resolves them at deploy time. Secrets
          synced from Infisical are not included (a warning says so).
        </li>
        <li>
          <Code>--set</Code>/<Code>--env</Code> instead use exactly one set
          environment: no links and no own env.
        </li>
        <li>
          <Code>--file .env.local</Code> goes on top of all of that: the order,
          lowest to highest, is your current environment, then aoox, then the
          file. The file is only read, and its references are not resolved.
        </li>
      </Ul>
      <Pre title="What was injected and from which layers (printed to standard error)">{`$ aoox run -- node server.js
aoox  Injecting 9 variables into your process · Application "shop-web": shared/production < backend/production < own env`}</Pre>
      <P>
        The count is what aoox adds or overrides, including <Code>--file</Code>;
        variables inherited from your shell are not counted. The line is
        coloured only on a terminal: <Code>NO_COLOR</Code> turns colour off,{" "}
        <Code>FORCE_COLOR</Code> forces it, and pipes and CI logs stay plain.{" "}
        <Code>--quiet</Code> (<Code>-q</Code>) hides the line, but warnings about
        references aoox cannot resolve are always printed.
      </P>
      <H3>Pull formats and push</H3>
      <Pre title="Formats and standard output">{`$ aoox env pull --env staging                        # ./.env, the stored text with its comments
$ aoox env pull --format json                        # ./.env.json  {"KEY":"value"}
$ aoox env pull --format shell                       # ./.env.sh    export KEY='value'
$ aoox env pull --format json --file - | jq .PORT    # standard output only
$ eval "$(aoox env pull --format shell --file -)"    # load into the current shell`}</Pre>
      <Ul>
        <li>
          <Code>--file -</Code> writes the data to standard output and nothing
          else there, so it can be piped or passed to <Code>eval</Code>. Notes
          (such as the one about <Code>{"${{…}}"}</Code> references) go to
          standard error. In this mode there is no &quot;file exists&quot; check
          and no <Code>.gitignore</Code> warning, because no file is written.
        </li>
        <li>
          The <Code>shell</Code> format wraps each value in single quotes and
          writes a single quote inside a value as <Code>{"'\\''"}</Code>, so
          spaces, <Code>$</Code> and quotes survive <Code>eval</Code>. Without{" "}
          <Code>--file</Code> the file is <Code>.env</Code>,{" "}
          <Code>.env.json</Code> or <Code>.env.sh</Code> by format, always with
          mode <Code>0600</Code> where the OS supports it.
        </li>
      </Ul>
      <Pre title="Upload a file and look at the result">{`$ aoox env push --file .env.staging --set backend --env staging
Environment: backend/staging
  + added (1): NEW_FLAG
  ~ changed (1): API_URL
  - removed (1): OLD_KEY
  = unchanged: 6
Variables that are not in the file are removed: this replaces the whole environment.
? Replace "backend/staging" with the contents of .env.staging? (y/N)`}</Pre>
      <Ul>
        <li>
          The file is checked before anything is sent. Refused: invalid names,
          an <Code>export </Code> prefix, trailing whitespace, duplicate names
          and <Code>{"${{project.…}}"}</Code>. Quoted values (<Code>KEY=&quot;value&quot;</Code>) are
          accepted with a warning, because the panel stores the quotes as part
          of the value. Windows line endings and a leading BOM are normalised.
        </li>
        <li>
          <Code>push</Code>, <Code>promote</Code> and <Code>diff</Code> never
          print values. <Code>push</Code> and <Code>promote</Code> ask for
          confirmation; without a terminal (CI) they refuse unless you pass{" "}
          <Code>--yes</Code>. If someone else changed the environment in
          between, nothing is written (409), as with <Code>set</Code>.
        </li>
        <li>
          Every change is recorded as a version (see{" "}
          <DocLink href="/docs/variables#history">history and restore</DocLink>);
          restoring an old version is done in the dashboard.
        </li>
      </Ul>
      <H3>How values are stored (quoting)</H3>
      <P>
        The panel keeps one environment as plain <Code>KEY=VALUE</Code> text,
        one variable per line. The key is everything before the first{" "}
        <Code>=</Code>; the value is <strong>everything after it, exactly as
        given</strong>. There is no quote or escape processing — not in the
        CLI, not in the panel, not when the value is put into the container —
        so the quotes you type are removed by <em>your shell</em>, and quotes
        that are part of the value stay part of it.
      </P>
      <Table
        head={["You type", "Stored value"]}
        rows={[
          [<Code key="1">{`GREETING="hello world"`}</Code>, <Code key="1b">hello world</Code>],
          [<Code key="2">{`QUERY=a=b=c`}</Code>, <Code key="2b">a=b=c</Code>],
          [<Code key="3">{`MSG='say "hi" # not a comment'`}</Code>, <Code key="3b">{`say "hi" # not a comment`}</Code>],
          [<Code key="4">{`EMPTY=`}</Code>, "an empty value"],
        ]}
      />
      <Ul>
        <li>
          Rejected before anything is sent: an invalid name (letters, digits
          and <Code>_</Code>, not starting with a digit), a value with a
          newline (one variable per line), and a value that ends with
          whitespace (the panel trims the end of each line).
        </li>
        <li>
          <Code>{"${{vars.KEY}}"}</Code> and{" "}
          <Code>{"${{database.<slug>.url}}"}</Code> references are stored and
          pulled as written; the panel resolves them when the container is
          created.
        </li>
        <li>
          Compose stacks read the resolved text through Docker Compose&apos;s own{" "}
          <Code>--env-file</Code> parser, which does strip quotes around a whole
          value. Avoid surrounding quotes in values used by stacks.
        </li>
      </Ul>
      <H3>Editing at the same time</H3>
      <P>
        <Code>set</Code>, <Code>unset</Code> and <Code>push</Code> read the
        environment, change the text and save it back together with the version
        they read. If someone else saved in between (the dashboard, another
        terminal), the panel answers <Code>409</Code> and the CLI says that
        nothing was written — run the command again to apply your change on top
        of the latest version. The dashboard&apos;s editor does the same.
      </P>
      <H3>Who can do what</H3>
      <Table
        head={["Role", "Unprotected environments", "Protected environments (e.g. production)"]}
        rows={[
          [<strong key="i">Instance owner / admin</strong>, "Everything", "Everything"],
          [<strong key="d">Project admin, developer</strong>, "list, pull, set, unset, push, promote, run", <>Only the variable names. Anything else prints <Code>error  &quot;backend/production&quot; is protected; only instance owners and admins can read it.</Code></>],
          [<strong key="v">Viewer</strong>, "Variable names only", "Variable names only"],
        ]}
      />
      <Ul>
        <li>
          <strong>Links</strong>: <Code>env link</Code>/<Code>unlink</Code> need
          the developer role in the application&apos;s project; adding or removing
          a link to a protected environment needs the project admin role. The
          set must be shared with the project.
        </li>
        <li>
          <strong>In CI</strong> create an API token and export{" "}
          <Code>AOOX_TOKEN</Code>/<Code>AOOX_URL</Code>. The token can be
          limited to some set environments (Settings<PathArrow />API token
          <PathArrow />the variables limit), e.g.{" "}
          <Code>backend/staging</Code>, <Code>backend/*</Code> or{" "}
          <Code>*/development</Code>: other environments then answer 403. See{" "}
          <DocLink href="/docs/variables#tokens">API token scopes</DocLink>.
        </li>
        <li>
          A <strong>read-only</strong> token can still run{" "}
          <Code>aoox env pull</Code>, <Code>aoox env list --reveal</Code> and{" "}
          <Code>aoox run</Code> (reading changes nothing and is audited), but{" "}
          <Code>set</Code>, <Code>unset</Code>, <Code>push</Code>,{" "}
          <Code>promote</Code>, <Code>link</Code> and <Code>unlink</Code> are
          refused. Viewers can never read values, with or without a token.
        </li>
        <li>
          Every read of values is recorded in the audit log without the values.
          Reading is a request to the API, so an environment is never cached on
          disk by the CLI.
        </li>
        <li>
          Creating, sharing and deleting sets and environments is done in the
          dashboard by an instance owner or admin.
        </li>
      </Ul>

      <H2 id="local-development">Local development</H2>
      <P>
        Run your app on your laptop with the variables of one set environment,
        without a <Code>.env</Code> file and without linking the folder. You
        only need to be signed in.
      </P>
      <Steps>
        <Step title="Install the CLI, create a narrow token, sign in">
          <Pre>{`$ npm i -g @hideandseeklab/aoox
$ aoox login`}</Pre>
          <P>
            In the panel, <strong>Settings<PathArrow />API token<PathArrow />Create
            token</strong>: turn <strong>Read-only</strong> on and set{" "}
            <strong>Limit to variables</strong> to the environment you develop
            against, e.g. <Code>backend/development</Code>. A laptop token then
            cannot touch production. See{" "}
            <DocLink href="/docs/variables#tokens">API token scopes</DocLink>.
          </P>
        </Step>
        <Step title="Put the command in package.json">
          <Pre title="package.json">{`"scripts": {
  "start:dev": "aoox run --set backend --env development -- nest start --watch"
}`}</Pre>
          <P>
            Coming from Infisical? <Code>infisical run --env=dev -- …</Code>{" "}
            becomes <Code>aoox run --set &lt;slug&gt; --env development -- …</Code>.
          </P>
        </Step>
        <Step title="Always pass --set and --env locally">
          <Callout kind="warn" title="Without them you get the deployed app's variables">
            <Code>aoox run -- …</Code> with no <Code>--set</Code>/<Code>--env</Code>{" "}
            needs a linked application and injects what its container gets at
            deploy: the application&apos;s linked set environments plus its own
            env. That is usually <strong>production</strong>, and changing the
            application&apos;s links in the panel would silently change what your
            laptop gets. With <Code>--set</Code>/<Code>--env</Code> exactly one
            environment is injected: no links, no own env.
          </Callout>
        </Step>
        <Step title="What you see">
          <Pre>{`$ aoox run --set backend --env development -- nest start --watch
aoox  Injecting 5 variables from backend/development (no links, no own env)`}</Pre>
          <Ul>
            <li>
              The line goes to standard error and is coloured only on a
              terminal (plain when piped or with <Code>NO_COLOR</Code>).{" "}
              <Code>--quiet</Code> (<Code>-q</Code>) hides it, never the
              warnings.
            </li>
            <li>
              <strong>Fail closed</strong>: if the read is refused (bad token,
              no access, a protected environment, a token scope), the command is
              not started at all.
            </li>
            <li>
              Variables live in the child process only; nothing is written to
              disk.
            </li>
          </Ul>
        </Step>
        <Step title="Tools that only read a file">
          <Pre>{`$ aoox env pull --set backend --env development --file .env`}</Pre>
          <P>
            The file is written with mode <Code>0600</Code> and never
            overwritten without <Code>--force</Code>. Make sure{" "}
            <Code>.env</Code> is in <Code>.gitignore</Code>; aoox warns when it
            is not.
          </P>
        </Step>
        <Step title="Do you need aoox link?">
          <P>
            Not for local variables: <Code>--set</Code>/<Code>--env</Code> only
            need you to be signed in. You do need it for{" "}
            <Code>aoox deploy</Code>, for <Code>aoox run</Code> without flags,
            and for managing links with <Code>aoox env links/link/unlink</Code>.
            It writes <Code>.aoox.json</Code> (panel address, project and
            application ids and names, no secrets), which is safe to commit.
          </P>
        </Step>
        <Step title="CI">
          <P>
            Skip <Code>aoox login</Code> and set <Code>AOOX_URL</Code> and{" "}
            <Code>AOOX_TOKEN</Code> (a masked CI variable) from a read-only
            token limited to the environment the job needs.
          </P>
          <Pre>{`$ AOOX_URL=https://panel.example.com aoox run --set backend --env development -- npm test`}</Pre>
        </Step>
      </Steps>
      <H3>Limits</H3>
      <Ul>
        <li>
          <Code>{"${{database.…}}"}</Code> and <Code>{"${{secret.…}}"}</Code>{" "}
          references stay as written, with a warning: only the panel resolves
          them at deploy time. Point those variables at a local database in a
          local-only variable or <Code>--file</Code>.
        </li>
        <li>Secrets synced from Infisical are not included.</li>
        <li>
          If <Code>--set</Code>/<Code>--env</Code> are omitted and several
          candidates exist, the command stops and lists them; it never guesses.
        </li>
      </Ul>

      <H2 id="registry-images">Build &amp; push images (aoox registry)</H2>
      <P>
        Two commands for getting an image into the registry <em>without</em>{" "}
        deploying it — handy when you want to pick the image later in the
        dashboard (<Code>New application</Code><PathArrow />
        <Code>Ready-made image</Code>). Neither needs <Code>aoox link</Code>;
        they use your normal login (or <Code>--url</Code>/<Code>--token</Code>).
        The registry is the self-hosted one by default; pass{" "}
        <Code>--registry &lt;id&gt;</Code> to use another.
      </P>
      <Pre>{`$ aoox registry build myapp:1.0.0
==> Build registry.example.com/myapp:1.0.0
...
Built registry.example.com/myapp:1.0.0
Next: aoox registry push myapp:1.0.0 (or build with --push next time)

$ aoox registry push myapp:1.0.0
==> docker login registry.example.com
==> Push registry.example.com/myapp:1.0.0
Pushed registry.example.com/myapp:1.0.0
Use it in the dashboard: New application → Ready-made image`}</Pre>
      <P>
        <Code>build</Code> reads <Code>./Dockerfile</Code> (
        <Code>-f/--dockerfile</Code>, <Code>--context</Code>) and names the
        image <Code>&lt;registry host&gt;/&lt;name&gt;:&lt;version&gt;</Code>.{" "}
        <Code>push</Code> only pushes an image that already exists locally and
        accepts the short name or the full one. To do both in one step, use{" "}
        <Code>aoox registry build myapp:1.0.0 --push</Code>. Names are
        lowercase.
      </P>
      <P>
        You do not have to type everything. Leave out the version (
        <Code>aoox registry build myapp</Code>) or the whole argument (
        <Code>aoox registry build</Code>) and the CLI reads it from the
        project: the build context for <Code>build</Code>, the current folder
        for <Code>push</Code>. A typed <Code>name:version</Code> always wins.
        The first file found, in this order, supplies each value:
      </P>
      <Table
        head={["Order", "Source", "Name", "Version"]}
        rows={[
          ["1", <Code key="1">package.json</Code>, <>name (scope removed: <Code>@acme/web</Code> becomes <Code>web</Code>)</>, "version"],
          ["2", <Code key="2">pyproject.toml</Code>, <><Code>[project]</Code> or <Code>[tool.poetry]</Code> name</>, "version (skipped when dynamic)"],
          ["3", <Code key="3">Cargo.toml</Code>, <><Code>[package]</Code> name</>, <><Code>[package]</Code> version (not a workspace one)</>],
          ["4", <Code key="4">composer.json</Code>, <>name (<Code>vendor/pkg</Code> becomes <Code>pkg</Code>)</>, "version, if present"],
          ["5", <Code key="5">pubspec.yaml</Code>, "name", "version"],
          ["6", <Code key="6">*.csproj</Code>, <>AssemblyName, else the file name</>, <>Version, or VersionPrefix-VersionSuffix (one file only)</>],
          ["7", <Code key="7">pom.xml</Code>, "artifactId of the project", "version of the project (not the parent&apos;s)"],
          ["8", <Code key="8">VERSION</Code>, "—", "first non-empty line"],
          ["9", "git tag", "—", <>the tag HEAD is on, without a leading <Code>v</Code></>],
          ["10", "folder name", "the folder, lowercased", "—"],
        ]}
      />
      <P>
        Values from a file that are unusable (a <Code>$(…)</Code> or{" "}
        <Code>${"{…}"}</Code> variable, a dynamic version) are skipped and the
        next source is tried. Names are lowercased; a <Code>+</Code> in a
        version (build metadata, which tags cannot hold) becomes{" "}
        <Code>_</Code>. If HEAD is past the last git tag, nothing is guessed:
        tag the release, type <Code>name:version</Code>, or add{" "}
        <Code>--force</Code> to use the <Code>git describe</Code> form such as{" "}
        <Code>1.4.2-3-gabc1234</Code>.
      </P>
      <Pre>{`$ aoox registry build
==> Image web:1.4.2 (name and version from package.json)
? Build web:1.4.2? (Y/n/e)`}</Pre>
      <P>
        Because a derived name or version can be wrong, the CLI asks before it
        does anything: <Code>Y</Code> continues, <Code>n</Code> stops, and{" "}
        <Code>e</Code> lets you type another <Code>name:version</Code>.{" "}
        <Code>--yes</Code> (<Code>-y</Code>) skips the question. Without a
        terminal, or when <Code>CI</Code> is set, it refuses and asks for{" "}
        <Code>name:version</Code> or <Code>--yes</Code>. A fully typed{" "}
        <Code>name:version</Code> never asks. If you forget to bump the
        version, the &quot;already exists&quot; check below still protects the
        registry, and says where to change it.
      </P>
      <Table
        head={["You see", "Meaning"]}
        rows={[
          [
            <Code key="1">error  myapp:1.0.0 already exists in registry.example.com.</Code>,
            <>That version is already in the registry (checked before building, and before pushing). Pick a new version — the hint suggests the next one — or add <Code>--force</Code> to overwrite it. <Code>latest</Code> can always be overwritten.</>,
          ],
          [
            <Code key="2">error  No local image myapp:1.0.0.</Code>,
            <><Code>push</Code> never builds. Run <Code>aoox registry build myapp:1.0.0</Code> first.</>,
          ],
          [
            <Code key="3">error  A version is required: &quot;myapp&quot; has none.</Code>,
            <>No version was typed and none was found in the project. Write <Code>name:version</Code>, e.g. <Code>aoox registry build myapp:1.0.0</Code>, or add a version to a file from the list above.</>,
          ],
          [
            <>The registry is <Code>localhost:5000</Code></>,
            <>A warning: that address only works on the server itself. Give the registry a domain with <Code>aoox registry domain --set registry.example.com</Code>.</>,
          ],
        ]}
      />

      <H2 id="domain">Changing the panel&apos;s domain</H2>
      <P>
        An alternative to Settings<PathArrow />Domain panel in the dashboard — good for
        provisioning scripts. See{" "}
        <DocLink href="/docs/panel-domain">Domain for the panel</DocLink> for
        the details of what happens behind it.
      </P>
      <Pre>{`$ aoox domain set --web panel.example.com --api api.panel.example.com \\
  --acme-email you@example.com
Domain saved: panel.example.com (dashboard), api.panel.example.com (API).
The panel will restart for a few seconds to apply it — the connection to this API will drop briefly.`}</Pre>
      <P>
        To undo it, <Code>aoox domain clear</Code> removes the domain and goes
        back to <Code>http://&lt;server IP&gt;:3000</Code> (it asks first;{" "}
        <Code>--yes</Code> skips the prompt). The proxy and your applications&apos;
        domains are not touched. See{" "}
        <DocLink href="/docs/panel-domain#remove">Removing the domain</DocLink>.
      </P>
      <Callout>
        Needs <Code>INSTALL_DIR</Code> already set in the panel&apos;s{" "}
        <Code>.env.dist</Code> (the absolute path of the folder containing{" "}
        <Code>docker-compose.dist.yml</Code> on that host) — without it the
        command fails with a 400.
      </Callout>

      <H2 id="update">Updating aoox</H2>
      <P>
        Two different things get updated, with two commands.{" "}
        <Code>aoox update</Code> updates <strong>the CLI itself</strong> on
        your machine; <Code>aoox update panel</Code> updates{" "}
        <strong>the panel</strong> (the <Code>aoox-api</Code>/
        <Code>aoox-web</Code> images on the server).
      </P>
      <Callout kind="warn" title="aoox update changed meaning">
        Before this release <Code>aoox update</Code> checked the panel. The old
        behaviour is now <Code>aoox update panel</Code>; running{" "}
        <Code>aoox update --apply</Code> prints{" "}
        <Code>Panel updates moved to: aoox update panel --apply</Code> and exits
        with an error instead of touching anything.
      </Callout>
      <H3>The CLI: aoox update</H3>
      <P>
        Looks up the newest version on npm (no login, no panel needed). A
        pre-release install follows the newest of the <Code>latest</Code> and{" "}
        <Code>alpha</Code> tags; a stable install never moves to a
        pre-release. If the CLI was installed with npm it runs{" "}
        <Code>npm i -g @hideandseeklab/aoox@&lt;version&gt;</Code> for you;
        for the standalone tarball or a source checkout it prints the exact
        command to run instead of guessing.
      </P>
      <Pre>{`$ aoox update --check
Update available: aoox CLI 0.1.0-alpha.7 → 0.1.0-alpha.8
Run: aoox update

$ aoox update
==> npm i -g @hideandseeklab/aoox@0.1.0-alpha.8
Updated aoox CLI 0.1.0-alpha.7 → 0.1.0-alpha.8

$ aoox update
aoox CLI 0.1.0-alpha.8 is up to date`}</Pre>
      <P>
        If the npm registry cannot be reached the command fails with a clear
        message (non-zero exit status).
      </P>
      <H3>The panel: aoox update panel</H3>
      <P>
        Checks and applies an update for the panel itself (not the
        applications it deploys) — compares the <Code>aoox-api</Code>/
        <Code>aoox-web</Code> image digests on the registry, not just a
        version number.
      </P>
      <Pre>{`$ aoox update panel
Running version: 0.1.0-alpha.1
  api: hideandseeklab/aoox-api:latest (update available)
  web: hideandseeklab/aoox-web:latest (up to date)
Update available. Run with --apply to apply it.

$ aoox update panel --apply
Update applied — the panel will restart for a few seconds to apply it.`}</Pre>
      <P>
        Same as <Code>aoox domain set</Code>, needs <Code>INSTALL_DIR</Code>{" "}
        set. See <DocLink href="/docs/installation#update">Upgrading</DocLink>{" "}
        for the manual, over-SSH alternative.
      </P>

      <H2 id="reinstall">Repairing an install (aoox reinstall)</H2>
      <P>
        <Code>aoox update</Code> only runs <Code>pull</Code> + <Code>up -d</Code>:
        it doesn&apos;t rewrite <Code>docker-compose.dist.yml</Code> and doesn&apos;t
        add new variables to <Code>.env.dist</Code>. An existing install
        therefore misses fixes that need a compose or env change (a real
        example: Terminal failing with <Code>TERMINAL_SSH_USER is not set</Code>{" "}
        after an update, because older installs never wrote that variable).{" "}
        <Code>aoox reinstall</Code> repairs that <strong>without touching your
        data</strong>. Run it on the panel server, as root:
      </P>
      <Pre title="See what would change first, then apply">{`$ sudo aoox reinstall --dry-run
$ sudo aoox reinstall`}</Pre>
      <Table
        head={["Step", "What happens"]}
        rows={[
          [
            "Backup",
            <>Files that will change are copied to <Code>&lt;dir&gt;/backups/&lt;timestamp&gt;/</Code> (<Code>.env.dist</Code> stays mode 600).</>,
          ],
          [
            "Compose",
            <><Code>docker-compose.dist.yml</Code> (and <Code>docker-compose.domain.yml</Code> if present) is rewritten from the copy bundled in the CLI. <Code>docker-compose.override.yml</Code>, owned by the Domain panel/Environment features, is <strong>not touched</strong>.</>,
          ],
          [
            ".env.dist",
            <>Merged, never regenerated: every value, the order, comments and unknown keys are kept; only keys that are missing and have a safe default are added (e.g. <Code>TERMINAL_SSH_USER=root</Code>, <Code>INSTALL_DIR</Code>). <Code>POSTGRES_PASSWORD</Code>, <Code>JWT_SECRET</Code> and <Code>ENCRYPTION_KEY</Code> are never changed — if one is missing the command stops with a clear error.</>,
          ],
          [
            "Restart",
            <><Code>docker compose pull</Code> then <Code>up -d --force-recreate</Code>, using the same compose file list as the running stack. Volumes (the database) are not touched. It then waits for the API to be healthy and prints a summary.</>,
          ],
        ]}
      />
      <P>
        Safe to run repeatedly: when nothing needs changing, no file is written
        and no backup is made — the containers are still refreshed. If{" "}
        <Code>docker-compose.override.yml</Code> uses the <Code>!override</Code>{" "}
        tag (the option <em>Only allow access through the domain</em>) and the
        host&apos;s Docker Compose is older than 2.24.4, the command stops
        before changing anything: upgrade the Compose plugin or turn that
        option off in the dashboard first. Options:{" "}
        <Code>--dir</Code> (default <Code>/opt/aoox</Code>), <Code>--yes</Code>{" "}
        (no prompt), <Code>--no-pull</Code>,{" "}
        <Code>--terminal-ssh-user &lt;user&gt;</Code> (fills in or overrides that
        value), and <Code>--dry-run</Code> (print the plan only).
      </P>
      <Callout kind="warn" title="Don&apos;t use aoox install --force to repair">
        <Code>aoox install --force</Code> writes a fresh <Code>.env.dist</Code>{" "}
        with new random secrets: the old database becomes unreachable and every
        stored credential can no longer be decrypted. For an install that is
        already running, always use <Code>aoox reinstall</Code>.
      </Callout>
      <P>
        Without the CLI: edit <Code>.env.dist</Code> directly (e.g. add{" "}
        <Code>TERMINAL_SSH_USER=root</Code>) or use the{" "}
        <DocLink href="/docs/environment">Environment</DocLink> page in
        Settings, then <Code>docker compose … up -d</Code>.
      </P>

      <H2 id="commands">Command reference</H2>
      <div className="overflow-x-auto border border-border rounded-lg">
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

      <H2 id="configuration">Configuration & environment variables</H2>
      <Table
        head={["Source", "Contents", "Notes"]}
        rows={[
          [
            <Code key="1">config.json</Code>,
            <>
              <Code>{'{ "url": "<api>", "webUrl": "<dashboard>", "token": "aoox_…" }'}</Code> in oclif&apos;s
              config directory (<Code>~/.config/aoox/</Code> on Linux).
            </>,
            <>Written with mode <Code>0600</Code>; the full path is printed at login.</>,
          ],
          [
            <><Code>--url</Code> / <Code>--token</Code></>,
            "Override the file's contents for a single command. --url is the dashboard address (an API address is still accepted).",
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
          Precedence: flag<PathArrow />environment<PathArrow /><Code>config.json</Code> contents.
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

      <H2 id="antivirus">Behind an antivirus or corporate proxy</H2>
      <P>
        Antivirus HTTPS scanning (AVG, Avast, Kaspersky, ESET, Bitdefender) and
        corporate proxies (Zscaler, Netskope, Fortinet, Palo Alto) re-sign HTTPS
        traffic with their own root certificate. It is installed in your
        operating system&apos;s certificate store, but Node only knows its own
        bundled list, so the CLI used to fail with a certificate error even
        though the panel&apos;s certificate is fine.
      </P>
      <P>
        On <strong>Node 22.19+ or 24.5+</strong> the CLI now trusts the system
        store in addition to Node&apos;s list, so it works without any setup.
        Certificate verification is never turned off. On older Node versions
        nothing changes and the error names the issuer it saw (for example{" "}
        <Code>AVG Web/Mail Shield Root</Code>).
      </P>
      <Ul>
        <li>
          Opt out of the system store with <Code>AOOX_SYSTEM_CA=0</Code>.
        </li>
        <li>
          <Code>NODE_EXTRA_CA_CERTS=/path/to/root.pem</Code> still works if you
          would rather trust one specific root.
        </li>
        <li>
          Older Node: set <Code>NODE_OPTIONS=--use-system-ca</Code> (Node 22.15+
          / 23.10+), upgrade Node, or add the panel&apos;s domain to the
          antivirus HTTPS-scanning exclusions.
        </li>
      </Ul>

      <H2 id="pitfalls">Common pitfalls</H2>
      <Table
        head={["Message", "Cause & fix"]}
        rows={[
          [
            <>The panel rejected the token (401)</>,
            <>The token expired, was revoked, or was copied wrong. Create a new one in Settings<PathArrow />API token.</>,
          ],
          [
            <>No interactive terminal</>,
            <>Running in CI/a script. Pass <Code>--url</Code> and <Code>--token</Code>, or set <Code>AOOX_URL</Code> and <Code>AOOX_TOKEN</Code>.</>,
          ],
          [
            <>Cannot reach the panel</>,
            <>Wrong address, or the panel isn&apos;t reachable from this machine. Use the address you open the dashboard with, check the firewall / security group, or set a panel domain (Infrastructure<PathArrow />Panel domain). Test with <Code>curl &lt;dashboard-url&gt;/.well-known/aoox.json</Code>.</>,
          ],
          [
            <>… answers plain HTTP</>,
            <>You used <Code>https://</Code> on a port that speaks plain HTTP (e.g. <Code>:3000</Code>). Use the <Code>http://</Code> address, or set a panel domain to get HTTPS.</>,
          ],
          [
            <>Your aoox CLI is older than the panel</>,
            <>A warning, not an error. Update with <Code>aoox update</Code>.</>,
          ],
          [
            <>Config is corrupt (not valid JSON)</>,
            <>The config file was edited by hand. Delete it, then run <Code>aoox login</Code> again.</>,
          ],
          [
            <>403 on a specific command</>,
            <>The token owner&apos;s role isn&apos;t high enough — a token never grants more than its owner has. If the token has a scope, see <DocLink href="/docs/users-roles#account">read-only/project-limited tokens</DocLink>.</>,
          ],
          [
            <>This repo is not linked yet</>,
            <><Code>aoox deploy</Code> was run before <Code>aoox link</Code>. Run <Code>aoox link</Code> first in the repo folder.</>,
          ],
          [
            <>A deployment is already running for this application (409)</>,
            <>The same application is already being deployed — from the dashboard, a webhook, or another <Code>aoox deploy</Code>. Wait for it to finish, check the Deploy tab.</>,
          ],
          [
            <>aoox install: Root is required</>,
            <>Run it with <Code>sudo</Code> — installation writes to system paths and manages Docker.</>,
          ],
          [
            <>aoox install: An installation already exists in …</>,
            <>The <Code>--dir</Code> folder (default <Code>/opt/aoox</Code>) is already populated. To repair that install, use <Code>aoox reinstall</Code>. <Code>--force</Code> is only for a from-scratch reinstall (it generates new secrets — the old data becomes unreadable), or use a different <Code>--dir</Code>.</>,
          ],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Commands for projects, standalone log tailing, and databases; an
        official npm package; shell autocomplete; <Code>--json</Code> output
        for every command (currently just <Code>whoami</Code>).
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
