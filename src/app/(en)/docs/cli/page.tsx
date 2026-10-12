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
    what: "Lists, downloads, uploads, compares or changes the variables of a project environment (see Environment variables).",
    flags: "--env/-e, --project, --reveal, --json (list); --file, --force, --format (pull); --file, --yes (push); --secret/--no-secret (set); --limit (history); --all, --yes (promote)",
  },
  {
    cmd: "aoox run -- <command>",
    what: "Runs a command with the variables of an environment, without writing them to disk.",
    flags: "--env/-e, --project",
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
    flags: "--push, --registry, --dockerfile/-f, --context, --force",
  },
  {
    cmd: "aoox registry push",
    what: "Pushes an existing local image to the registry; refuses a version that already exists there.",
    flags: "--registry, --force",
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
  { title: "Environment variables", description: "Project environments, protection and references.", href: "/docs/environment#environments" },
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

      <H2 id="env">Environment variables (aoox env, aoox run)</H2>
      <P>
        <Code>aoox env</Code> reads and changes the variables of a{" "}
        <DocLink href="/docs/environment#environments">project environment</DocLink>{" "}
        (the same ones as the project&apos;s Environments tab), and{" "}
        <Code>aoox run</Code> starts a command with them without writing a
        file. The project is the one of the application linked with{" "}
        <Code>aoox link</Code>, or <Code>--project &lt;id or name&gt;</Code>;
        the environment is <Code>--env</Code> (default{" "}
        <Code>development</Code>).
      </P>
      <Pre title="A typical session">{`$ aoox env list
Project: shop
NAME                    VARIABLES  USED BY
development             3          -
staging                 0          -
production (protected)  7          shop

$ aoox env set API_URL=https://api.example.com GREETING="hello world"
development: added API_URL, GREETING (5 variables now)

$ aoox env list --env development            # names only, values masked
API_URL=••••••••
$ aoox env list --env development --reveal   # values (audited)
$ aoox env pull                              # writes ./.env (mode 0600)
$ aoox env unset OLD_KEY
$ aoox run -- npm run dev                    # starts it with the variables`}</Pre>
      <Table
        head={["Command", "Does"]}
        rows={[
          [<Code key="l">aoox env list [--env name] [--reveal] [--json]</Code>, "Without --env: the project's environments (protection, variable count, what uses them). With --env: that environment's variable names; --reveal shows the values through the audited reveal action."],
          [<Code key="p">aoox env pull [--env name] [--file .env] [--format dotenv|json|shell] [--force]</Code>, <>Writes the variables to a file with mode <Code>0600</Code> (owner only, where the OS supports it). It never overwrites an existing file unless <Code>--force</Code>, and warns once when the file is not covered by <Code>.gitignore</Code> (it never edits <Code>.gitignore</Code> itself).</>],
          [<Code key="s">aoox env set KEY=VALUE [KEY2=VALUE2 …] [--env name] [--secret | --no-secret]</Code>, <>Adds or changes variables. Comments and the order of the existing lines are kept; a new variable goes at the end. <Code>--secret</Code> marks the variables as secret, <Code>--no-secret</Code> as explicitly not secret; without either, the flags stay as they are (see <DocLink href="/docs/environment#secret-flags">Secret variables</DocLink>).</>],
          [<Code key="u">aoox env unset KEY [KEY2 …] [--env name]</Code>, "Removes variables; comments and the other lines stay."],
          [<Code key="pu">aoox env push --file .env [--env name] [--yes]</Code>, "Replaces the whole environment with a local file, after showing which variables are added, changed and removed and asking for confirmation."],
          [<Code key="h">aoox env history [--env name] [--limit 20] [--json]</Code>, "The version history of an environment, newest first: when, who, and the variable names added (+), changed (~) or removed (-). Never values."],
          [<Code key="d">aoox env diff &lt;from&gt; &lt;to&gt;</Code>, "Compares two environments by variable name: only on one side, different values, same. Prints names only."],
          [<Code key="pr">aoox env promote &lt;from&gt; &lt;to&gt; [KEY …] [--all] [--yes]</Code>, "Copies the named variables (or all of them) and their secret flag from one environment into another, after showing what changes and asking for confirmation."],
          [<Code key="r">aoox run [--env name] [--file .env.local] -- command [args…]</Code>, "Fetches the variables and starts the command with them on top of your current environment (the panel's value wins on a clash; a local file, if given, wins over both). Nothing is written to disk. Output goes straight to your terminal, the command's exit code is the exit code of aoox run, and Ctrl+C or SIGTERM is passed to it."],
        ]}
      />
      <H3>Pull formats, push and run --file</H3>
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
      <Pre title="Upload a file and look at the result">{`$ aoox env push --file .env.staging --env staging
Project: shop · environment: staging
  + added (1): NEW_FLAG
  ~ changed (1): API_URL
  - removed (1): OLD_KEY
  = unchanged: 6
Variables that are not in the file are removed: this replaces the whole environment.
? Replace "staging" with the contents of .env.staging? (y/N)`}</Pre>
      <Ul>
        <li>
          The file is checked before anything is sent. Refused: invalid names,
          an <Code>export </Code> prefix, trailing whitespace and duplicate
          names. Quoted values (<Code>KEY=&quot;value&quot;</Code>) are
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
          <Code>aoox run --file .env.local -- npm run dev</Code>: the order,
          lowest to highest, is your current environment, then the aoox
          environment, then the local file. The most specific source wins, like
          a <Code>.env.local</Code> over shared config. The file is only read,
          and <Code>{"${{…}}"}</Code> references inside it are not resolved
          (only the panel does that).
        </li>
        <li>
          Every change is recorded as a version (see{" "}
          <DocLink href="/docs/environment#history">history and restore</DocLink>);
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
          <Code>{"${{project.KEY}}"}</Code> and{" "}
          <Code>{"${{database.<slug>.url}}"}</Code> references are stored and
          pulled as written. Only the panel resolves them, when the container
          is created, so <Code>aoox run</Code> passes them as text.
        </li>
        <li>
          Compose stacks read the resolved text through Docker Compose&apos;s own{" "}
          <Code>--env-file</Code> parser, which does strip quotes around a whole
          value. Avoid surrounding quotes in values used by stacks.
        </li>
      </Ul>
      <H3>Editing at the same time</H3>
      <P>
        <Code>set</Code> and <Code>unset</Code> read the environment, change
        the text and save it back together with the version they read. If
        someone else saved in between (the dashboard, another terminal), the
        panel answers <Code>409</Code> and the CLI says that nothing was
        written — run the command again to apply your change on top of the
        latest version. The dashboard&apos;s editor does the same.
      </P>
      <H3>Who can do what</H3>
      <Table
        head={["Role", "development / staging / custom", "production (protected)"]}
        rows={[
          [<strong key="a">Project admin</strong>, "list, pull, set, unset, run", "list, pull, set, unset, run"],
          [<strong key="d">Developer</strong>, "list, pull, set, unset, run", <>Only the variable names. Anything else prints <Code>❌ &quot;production&quot; is protected; only project admins can read it.</Code></>],
          [<strong key="v">Viewer</strong>, "Variable names only", "Variable names only"],
        ]}
      />
      <Ul>
        <li>
          <strong>In CI</strong> create an API token on a project admin (for{" "}
          <Code>production</Code>) or a developer (other environments) and
          export <Code>AOOX_TOKEN</Code>/<Code>AOOX_URL</Code>. The token can be
          limited to certain <strong>environments</strong> by name (Settings
          <PathArrow />API token<PathArrow />Limit to environments), e.g. only{" "}
          <Code>development</Code>: other environments then answer 403.
        </li>
        <li>
          A <strong>read-only</strong> token can still run{" "}
          <Code>aoox env pull</Code>, <Code>aoox env list --reveal</Code> and{" "}
          <Code>aoox run</Code> (reading changes nothing and is audited), but{" "}
          <Code>set</Code>, <Code>unset</Code>, <Code>push</Code> and{" "}
          <Code>promote</Code> are refused. Viewers can never
          read values, with or without a token.
        </li>
        <li>
          Every read of values is recorded in the audit log without the values.
          Reading is a request to the API, so an environment is never cached on
          disk by the CLI.
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
        <Code>aoox registry build myapp:1.0.0 --push</Code>. A version is
        required, in lowercase.
      </P>
      <Table
        head={["You see", "Meaning"]}
        rows={[
          [
            <Code key="1">❌ myapp:1.0.0 already exists in registry.example.com.</Code>,
            <>That version is already in the registry (checked before building, and before pushing). Pick a new version — the hint suggests the next one — or add <Code>--force</Code> to overwrite it. <Code>latest</Code> can always be overwritten.</>,
          ],
          [
            <Code key="2">❌ No local image myapp:1.0.0.</Code>,
            <><Code>push</Code> never builds. Run <Code>aoox registry build myapp:1.0.0</Code> first.</>,
          ],
          [
            <Code key="3">❌ A version is required: &quot;myapp&quot; has none.</Code>,
            <>Write <Code>name:version</Code>, e.g. <Code>aoox registry build myapp:1.0.0</Code>.</>,
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
        and no backup is made — the containers are still refreshed. Options:{" "}
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
