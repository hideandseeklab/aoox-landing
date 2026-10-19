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
  path: "/docs/fresh-vps",
  lang: "en",
  title: "Start from a fresh VPS",
  description:
    "A complete walkthrough from a brand-new VPS to the aoox panel on your own domain: SSH, a sudo user, firewall, install, HTTPS.",
})

const SUMMARY = [
  { k: "Time", v: "± 30 minutes (DNS may take longer)" },
  { k: "Needs", v: "A fresh Linux VPS (amd64 or arm64) and, for HTTPS, a domain" },
  { k: "Result", v: "The panel on https://panel.example.com" },
]

const NEXT = [
  {
    title: "Domain for the panel",
    description: "Every option of the panel domain, including removing it.",
    href: "/docs/panel-domain",
  },
  {
    title: "Web terminal",
    description: "The SSH user and key behind the Terminal menu.",
    href: "/docs/terminal",
  },
  {
    title: "Backup & restore",
    description: "Instance backup, database and volume backups, S3.",
    href: "/docs/backup#instance",
  },
  {
    title: "Troubleshooting",
    description: "Common problems and how to fix them.",
    href: "/docs/troubleshooting",
  },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/fresh-vps"
      title="Start from a fresh VPS"
      lang="en"
      description="Every step from a brand-new VPS to the aoox panel reachable on your own domain, copy-pasteable and in order."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {item.k}
            </dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <P>
        Placeholders used below: <Code>SERVER_IP</Code> is your VPS&apos;s
        public IP, <Code>your-user</Code> is the login you create in step 4,
        and <Code>panel.example.com</Code> / <Code>api.panel.example.com</Code>{" "}
        are your own domain names. Already have a server with Docker and just
        want the install? See <DocLink href="/docs/installation">Installation</DocLink>.
      </P>

      <H2 id="choose">1. Choosing a VPS</H2>
      <Table
        head={["", "Minimum", "Recommended"]}
        rows={[
          ["CPU", "1 vCPU", "2 vCPU or more"],
          ["RAM", "2 GB (add swap, step 5)", "4 GB or more"],
          ["Disk", "25 GB SSD", "40 GB SSD or more"],
        ]}
      />
      <P>
        These are conservative guidelines, not measured limits. The panel
        itself is three containers (PostgreSQL, the API and the web app); the
        reverse proxy and the local registry are added when you provision them;
        and every build runs on the same machine. Builds and your own
        applications are what use the memory and disk: the Nixpacks helper
        image alone is roughly 350 MB, old images pile up, and a build that
        runs out of memory simply fails. The Installation page says 1 vCPU / 1
        GB is enough for aoox itself; budget more as soon as you build on the
        server.
      </P>
      <Ul>
        <li>
          <strong>Architecture: x86_64 (amd64) or arm64.</strong> The{" "}
          <Code>hideandseeklab/aoox-api</Code> and{" "}
          <Code>hideandseeklab/aoox-web</Code> images are published for both
          from the release after 0.1.0-alpha.12. The currently published{" "}
          <strong>0.1.0-alpha.12 images are amd64 only</strong>, so an ARM VPS
          (Ampere, Graviton) has to wait for the next release; the aoox CLI
          already has an arm64 build.
        </li>
        <li>
          <strong>Operating system: a mainstream Linux with systemd, such as
          Ubuntu 24.04 / 22.04 LTS or Debian 12.</strong> The installer only
          checks that it is running on Linux; the real requirement is that
          Docker&apos;s install script (<Code>get.docker.com</Code>) supports
          your distribution. The commands below are written for Ubuntu and
          Debian. Alpine (musl) is not supported by the prebuilt CLI.
        </li>
        <li>
          <strong>Provider firewall / security group.</strong> If your provider
          has one, allow inbound <Code>22</Code> (SSH), <Code>80</Code> and{" "}
          <Code>443</Code> (HTTPS and certificates), plus <Code>3000</Code> and{" "}
          <Code>3001</Code> until the domain works (80/443 only answer once the first panel domain is
          saved, step 10). Do <strong>not</strong>{" "}
          open <Code>5000</Code> (the local registry, step 11) unless you use
          Swarm nodes.
        </li>
      </Ul>

      <H2 id="ssh">2. First SSH login</H2>
      <P>
        Your provider shows the IP and a first user (<Code>root</Code> on
        most, <Code>ubuntu</Code> on some cloud images) and either a password
        or a key you chose when creating the server.
      </P>
      <Pre title="Windows (PowerShell), macOS, Linux">{`ssh root@SERVER_IP`}</Pre>
      <Callout title="Ubuntu cloud images: the user is ubuntu, not root">
        Many Ubuntu cloud images (AWS, Oracle, Tencent and others) disable root
        login and give you a sudo user called <Code>ubuntu</Code>. Then connect
        with <Code>ssh ubuntu@SERVER_IP</Code> and put <Code>sudo</Code> in
        front of the commands below that are written without it (steps 3 and 4).
        You can skip creating a new user in step 4 and use <Code>ubuntu</Code>{" "}
        as <Code>your-user</Code>.
      </Callout>
      <P>
        Windows 10/11 include the OpenSSH client, so the same command works in
        PowerShell. The first time, SSH shows the server&apos;s fingerprint and
        asks <Code>Are you sure you want to continue connecting</Code>. If your
        provider shows the fingerprint in its console, compare it; then type{" "}
        <Code>yes</Code>. If you rebuild the server later and SSH complains that
        the host identification changed, remove the old entry with{" "}
        <Code>ssh-keygen -R SERVER_IP</Code>.
      </P>

      <H2 id="update">3. Update the system</H2>
      <Pre>{`sudo apt update && sudo apt upgrade -y`}</Pre>
      <P>
        On Ubuntu, a file appears when a reboot is needed (for example after a
        kernel update). On Debian, reboot after a kernel upgrade.
      </P>
      <Pre>{`[ -f /var/run/reboot-required ] && sudo reboot`}</Pre>
      <P>Reconnect with the same <Code>ssh</Code> command after about a minute.</P>

      <H2 id="user">4. A sudo user and SSH key login</H2>
      <P>
        Do not run day-to-day work as <Code>root</Code>. This step also matters
        for aoox: when you install as a sudo user, aoox uses that user for the{" "}
        <DocLink href="/docs/terminal">web terminal</DocLink>. A new install
        writes <Code>TERMINAL_SSH_USER</Code> as the user who ran{" "}
        <Code>sudo</Code> and authorizes the terminal&apos;s key for it; if you
        install as <Code>root</Code> directly, the terminal user is{" "}
        <Code>root</Code>, which most cloud images refuse over SSH. (If your
        image already gave you a sudo user such as <Code>ubuntu</Code>, you can
        skip creating one and use it.)
      </P>
      <Steps>
        <Step title="Create the user (on the server)">
          <Pre>{`adduser your-user`}</Pre>
          <Pre>{`usermod -aG sudo your-user`}</Pre>
          <P>
            <Code>adduser</Code> asks for a password and a few optional details.
            Keep the password: <Code>sudo</Code> asks for it.
          </P>
        </Step>
        <Step title="Create a key on your laptop (skip if you already have one)">
          <Pre>{`ssh-keygen -t ed25519 -C "you@laptop"`}</Pre>
          <P>
            It saves <Code>~/.ssh/id_ed25519</Code> (private, never share) and{" "}
            <Code>~/.ssh/id_ed25519.pub</Code> (public). A passphrase is a good
            idea.
          </P>
        </Step>
        <Step title="Install the public key on the server">
          <P>macOS / Linux, from your laptop:</P>
          <Pre>{`ssh-copy-id your-user@SERVER_IP`}</Pre>
          <P>
            Windows PowerShell has no <Code>ssh-copy-id</Code>; this does the
            same (it asks for the password you just set):
          </P>
          <Pre>{`Get-Content $env:USERPROFILE\\.ssh\\id_ed25519.pub | ssh your-user@SERVER_IP "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"`}</Pre>
        </Step>
        <Step title="Test in a second terminal">
          <P>
            Keep the root session open and, in a <strong>new</strong> terminal
            window:
          </P>
          <Pre>{`ssh your-user@SERVER_IP`}</Pre>
          <Pre>{`sudo -v`}</Pre>
          <P>
            You should get in with the key (no server password; a key
            passphrase prompt is fine), and <Code>sudo -v</Code> should accept
            your password. Only continue when both work.
          </P>
        </Step>
      </Steps>
      <H3>Optional: turn off password and root login</H3>
      <Callout kind="warn" title="You can lock yourself out">
        Do this only after step 4 worked in a second terminal, and keep that
        working session open until you have tested a fresh login afterwards.
        If something is wrong you may be locked out and need your provider&apos;s
        web console to recover.
      </Callout>
      <P>
        Ubuntu and Debian read extra files from <Code>/etc/ssh/sshd_config.d/</Code>{" "}
        first, and for each setting the first value found wins, so a cloud
        image&apos;s own file (often <Code>50-cloud-init.conf</Code> with{" "}
        <Code>PasswordAuthentication yes</Code>) would override an edit to the
        main <Code>sshd_config</Code>. A file named <Code>10-…</Code> is read
        before it:
      </P>
      <Pre>{`sudo tee /etc/ssh/sshd_config.d/10-hardening.conf <<'EOF'
PasswordAuthentication no
PermitRootLogin no
EOF`}</Pre>
      <Pre>{`sudo sshd -t && sudo systemctl reload ssh`}</Pre>
      <P>
        <Code>sshd -t</Code> prints nothing when the configuration is valid.
        Then open a third terminal and confirm <Code>ssh your-user@SERVER_IP</Code>{" "}
        still works. Two aoox-related notes: the web terminal logs in over
        SSH with a key, so it works with <Code>PasswordAuthentication no</Code>;
        but it fails if <Code>TERMINAL_SSH_USER</Code> is <Code>root</Code>{" "}
        and root login is off, and if you restrict SSH with{" "}
        <Code>AllowUsers</Code> the terminal user must be listed. See{" "}
        <DocLink href="/docs/terminal#ssh-user">SSH user on a cloud VPS</DocLink>.
      </P>
      <P>From here on, log in as <Code>your-user</Code>.</P>

      <H2 id="basics">5. Basics: timezone, swap, firewall</H2>
      <H3>Timezone</H3>
      <Pre>{`timedatectl list-timezones | grep -i jakarta`}</Pre>
      <Pre>{`sudo timedatectl set-timezone Asia/Jakarta`}</Pre>
      <P>
        Pick your own zone from the list. This sets the host&apos;s clock for
        logs and host cron jobs only. aoox&apos;s own schedules (job, backup,
        the nightly cleanup) run inside the API container, which uses UTC
        unless you set <Code>TZ</Code>. To run them in your zone, add it to{" "}
        <Code>.env.dist</Code> and recreate the API container.{" "}
        <strong>Do this after step 8 (the install):</strong>{" "}
        <Code>/opt/aoox</Code> does not exist before it, so the command below
        fails if you run it now.
      </P>
      <Pre>{`echo 'TZ=Asia/Jakarta' | sudo tee -a /opt/aoox/.env.dist
cd /opt/aoox && sudo docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
      <P>
        The dashboard shows the zone in use next to every schedule field. An
        install made before this option existed needs{" "}
        <Code>aoox reinstall</Code> first so its compose file passes{" "}
        <Code>TZ</Code> to the API. Existing cron expressions keep their
        digits, so re-check them after changing the zone.
      </P>
      <H3>Swap (recommended below 4 GB RAM)</H3>
      <P>A swap file lets a build survive a short memory spike instead of being killed.</P>
      <P>
        Check first: many images already come with swap. If either command below
        shows a swap line with a size, <strong>skip this section</strong> (adding
        a second swap file would only waste disk).
      </P>
      <Pre>{`swapon --show
free -h`}</Pre>
      <Pre>{`sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile`}</Pre>
      <Pre>{`echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab`}</Pre>
      <Pre>{`free -h`}</Pre>
      <P>
        <Code>free -h</Code> should show 2.0Gi under Swap. Some providers
        already add swap or use a filesystem where <Code>fallocate</Code> files
        cannot be swap files; if <Code>swapon</Code> complains, check{" "}
        <Code>swapon --show</Code> first.
      </P>
      <H3>Firewall (ufw)</H3>
      <Callout kind="warn" title="Allow SSH first">
        Add the SSH rule <strong>before</strong> enabling ufw, otherwise you cut
        your own session. If SSH listens on a port other than 22, use that
        port.
      </Callout>
      <Pre>{`sudo apt install -y ufw`}</Pre>
      <Pre>{`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw --force enable
sudo ufw status verbose`}</Pre>
      <P>
        <Code>--force</Code> matters when you paste the whole block: a plain{" "}
        <Code>ufw enable</Code> stops and asks{" "}
        <Code>Command may disrupt existing ssh connections. Proceed with
        operation (y|n)?</Code>, and the rest of the pasted lines are then read
        as the answer, so ufw is left disabled. The SSH rule was added first,
        so enabling it will not cut your session.
      </P>
      <P>
        Ports 3000/3001 are only needed until the domain works (step 10).
        Keep the <Code>22</Code> rule open to any source: the web terminal
        connects from the API container to the host&apos;s SSH port, so a rule
        limited to your own IP would block it.
      </P>
      <Callout kind="warn" title="ufw does not protect Docker-published ports">
        Docker publishes container ports by routing them in its own firewall
        tables, and its documentation states that this traffic is diverted
        before it reaches the chains ufw uses, so ufw rules are effectively
        skipped for published ports. Consequences here: ports 3000 and 3001
        stay reachable from the internet even with{" "}
        <Code>ufw deny 3000</Code>, and the same applies to the registry on
        port 5000 once you provision it (it is password protected, but still
        exposed) and to any host port you give an application. To really
        close them use your <strong>provider&apos;s firewall</strong> (it filters
        before traffic reaches the VM), and for the panel the{" "}
        <DocLink href="/docs/panel-domain#domain-only">Only allow access through the domain</DocLink>{" "}
        switch, which makes ports 3000/3001 listen on <Code>127.0.0.1</Code>{" "}
        only. ufw is still worth having for everything that is not published
        by Docker (SSH and other host services). This was checked on a real
        Ubuntu 24.04 VPS: a port denied by ufw was still reachable from
        outside. aoox helps in two places: a database or database admin app you
        publish is bound to <Code>127.0.0.1</Code> by default, and every other
        host port (applications, stacks) has a <strong>Listens on</strong>{" "}
        choice, <em>Public</em> or <em>This server only (127.0.0.1)</em>. The{" "}
        <strong>Open ports</strong> tab on the Docker page (owner and admin)
        lists every published port with its owner and whether it is open to
        the internet.
      </Callout>

      <H2 id="cli">6. Install the aoox CLI (Node.js not required)</H2>
      <P>
        <Code>aoox install</Code> is a command of the aoox CLI. The standalone
        CLI tarball bundles its own Node.js, so you do not install Node.js on
        the server. Run it with <Code>sudo</Code> so it lands in{" "}
        <Code>/usr/local/bin</Code>:
      </P>
      <Pre>{`curl -fsSL https://aoox.dev/install-cli.sh | sudo sh`}</Pre>
      <Pre>{`aoox --version`}</Pre>
      <Callout title="Why sudo here">
        Without root or <em>passwordless</em> sudo the script falls back to{" "}
        <Code>~/.local/bin</Code>, and then <Code>sudo aoox install</Code> in
        the next step says <Code>command not found</Code> (sudo does not search
        that folder). Supported: Linux with glibc (x64 or arm64) and macOS.
      </Callout>
      <H3>Alternative: npm (needs Node.js 22 or newer)</H3>
      <P>
        The CLI declares <Code>node &gt;= 22</Code>. On Ubuntu/Debian, Node 22
        from NodeSource:
      </P>
      <Pre>{`curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -`}</Pre>
      <Pre>{`sudo apt-get install -y nodejs`}</Pre>
      <Pre>{`sudo npm install -g @hideandseeklab/aoox`}</Pre>

      <H2 id="docker">7. Docker</H2>
      <P>
        You do not have to install it yourself.{" "}
        <Code>aoox install</Code> checks for a working <Code>docker info</Code>;
        if Docker is missing or not running it offers to run Docker&apos;s
        official script (<Code>curl -fsSL https://get.docker.com | sh</Code>)
        and asks for confirmation (<Code>--yes</Code> skips the question).
        After that it checks Docker works and stops with a hint
        (<Code>systemctl status docker</Code>) if it does not.
      </P>
      <P>
        If you prefer to install Docker yourself from its apt repository first
        (Ubuntu; the install needs the Compose plugin, v2):
      </P>
      <Pre>{`sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc`}</Pre>
      <Pre>{`sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF`}</Pre>
      <Pre>{`sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`}</Pre>
      <P>
        On Debian, replace <Code>ubuntu</Code> with <Code>debian</Code> in both
        the key URL and the <Code>URIs:</Code> line. Check with{" "}
        <Code>sudo docker compose version</Code>.
      </P>
      <Callout title="The docker group is optional">
        <Code>aoox install</Code> runs as root and does not need your user in
        the <Code>docker</Code> group. Adding it
        (<Code>sudo usermod -aG docker your-user</Code>, then log in again)
        only saves typing <Code>sudo</Code> before <Code>docker</Code>, and it
        is effectively root access to the server: anyone who can run{" "}
        <Code>docker</Code> can mount the whole filesystem. Skip it unless you
        want that convenience.
      </Callout>

      <H2 id="install">8. Install aoox</H2>
      <P>Run as <Code>your-user</Code> (not logged in as root), so the sudo user becomes the terminal user:</P>
      <Pre>{`sudo aoox install`}</Pre>
      <P>It asks at most two questions, and none with <Code>--yes</Code>:</P>
      <Ul>
        <li>
          <Code>Install Docker now via curl -fsSL https://get.docker.com | sh?</Code>{" "}
          only if Docker is missing.
        </li>
        <li>
          <Code>Install aoox in /opt/aoox and run docker compose up -d? (Y/n)</Code>
        </li>
      </Ul>
      <P>What it then does, in order:</P>
      <Ul>
        <li>
          Creates <Code>/opt/aoox</Code> (change with <Code>--dir</Code>) with{" "}
          <Code>docker-compose.dist.yml</Code> and a <Code>secrets/</Code>{" "}
          folder owned by uid 1000 (the API container&apos;s user).
        </li>
        <li>
          Detects the public IP through <Code>api.ipify.org</Code> and writes{" "}
          <Code>/opt/aoox/.env.dist</Code> (mode 0600) with freshly generated{" "}
          <Code>POSTGRES_PASSWORD</Code>, <Code>JWT_SECRET</Code> and{" "}
          <Code>ENCRYPTION_KEY</Code>, <Code>INSTALL_DIR=/opt/aoox</Code> (so
          the dashboard can later change the panel domain without further
          setup), and <Code>TERMINAL_SSH_USER=your-user</Code>.
        </li>
        <li>
          Creates the terminal&apos;s SSH key in <Code>secrets/</Code> and adds
          it to the <Code>~/.ssh/authorized_keys</Code> of <Code>your-user</Code>.
          A problem here is only a warning (<Code>--no-terminal-authorize</Code>{" "}
          skips it).
        </li>
        <li>
          Runs <Code>docker compose up -d</Code>, which pulls PostgreSQL 16 and
          the two aoox images, then waits up to two minutes for the API (it runs
          database migrations on first start).
        </li>
      </Ul>
      <P>Expect a few minutes, mostly image downloads. It ends with:</P>
      <Pre>{`aoox is installed in /opt/aoox.
Open: http://SERVER_IP:3000
Create the first owner account at /setup.`}</Pre>
      <Callout title="Ports 80 and 443 are closed right after the install">
        This is expected, not a provider block: the reverse proxy that listens
        on 80/443 does not exist yet. It is started when you save the first
        panel domain (step 10) or provision it yourself. Until then only{" "}
        <Code>3000</Code> and <Code>3001</Code> answer.
      </Callout>
      <Callout kind="warn" title="Check the printed address">
        If the server could not detect its public IP, the line says{" "}
        <Code>http://localhost:3000</Code>, and <Code>WEB_ORIGIN</Code> in{" "}
        <Code>.env.dist</Code> says localhost too. Open the dashboard at the
        address printed (replace it with your real IP in <Code>WEB_ORIGIN</Code>{" "}
        and <Code>PUBLIC_API_URL</Code>, then{" "}
        <Code>sudo docker compose -f docker-compose.dist.yml --env-file .env.dist up -d</Code>{" "}
        in <Code>/opt/aoox</Code>): sign-in and the terminal check that the
        address in the browser matches <Code>WEB_ORIGIN</Code> exactly.
      </Callout>
      <P>Logs and status afterwards (the files are root-owned, so use sudo):</P>
      <Pre>{`cd /opt/aoox
sudo docker compose -f docker-compose.dist.yml --env-file .env.dist ps
sudo docker compose -f docker-compose.dist.yml --env-file .env.dist logs -f api`}</Pre>
      <Callout title="Running the install again">
        <Code>sudo aoox install</Code> refuses to run again in a folder that
        already has an install. <Code>--force</Code> reinstalls over it: it
        first copies <Code>.env.dist</Code> and the compose files to{" "}
        <Code>/opt/aoox/backups/&lt;timestamp&gt;/</Code> and then keeps your
        existing secrets, so the data stays readable. Only{" "}
        <Code>--force --new-secrets --wipe-data</Code> starts from scratch, and
        it deletes the panel database. To repair or refresh an install use{" "}
        <Code>sudo aoox reinstall</Code> (step 11).
      </Callout>
      <Callout title="One command instead of the CLI">
        Prefer a single line? <Code>curl -fsSL https://aoox.dev/install.sh | sudo sh</Code>{" "}
        does the same job with environment variables instead of prompts and
        flags, and needs nothing but <Code>curl</Code> and <Code>sh</Code>. See{" "}
        <DocLink href="/docs/installation#one-command">Installation</DocLink>.
        You can still install the CLI afterwards for <Code>aoox update</Code>{" "}
        and <Code>aoox domain</Code>.
      </Callout>

      <H2 id="signin">9. First sign-in</H2>
      <Steps>
        <Step title="Open the dashboard">
          <P>
            Go to <Code>http://SERVER_IP:3000</Code>. While there are no users
            you are redirected to <Code>/setup</Code>.
          </P>
        </Step>
        <Step title="Create the owner">
          <P>
            Enter a name, email and password (at least 8 characters). This
            first account is the <strong>owner</strong>; later users are
            invited from Settings (<DocLink href="/docs/users-roles">Users &amp; roles</DocLink>).
          </P>
        </Step>
        <Step title="Check from the server (optional)">
          <Pre>{`curl -s http://localhost:3001/auth/setup-status`}</Pre>
          <P>
            <Code>{`{"needsSetup":true}`}</Code> before the account exists,{" "}
            <Code>{`{"needsSetup":false}`}</Code> after.
          </P>
        </Step>
      </Steps>

      <H2 id="domain">10. A domain with HTTPS</H2>
      <Steps>
        <Step title="Create two DNS A records">
          <P>At your DNS provider, point two names at the server&apos;s IP:</P>
          <Pre title="DNS">{`panel.example.com.       A   SERVER_IP
api.panel.example.com.   A   SERVER_IP`}</Pre>
          <P>
            The dashboard and the API need separate names because the browser
            talks to the API directly. If you use Cloudflare, set both records
            to <em>DNS only</em> (grey cloud) while the certificate is issued.
          </P>
        </Step>
        <Step title="Wait until they resolve">
          <P>From your laptop:</P>
          <Pre>{`nslookup panel.example.com`}</Pre>
          <P>
            It must answer with <Code>SERVER_IP</Code>. A certificate can only
            be issued once DNS is right; failed attempts count against
            Let&apos;s Encrypt&apos;s rate limits.
          </P>
        </Step>
        <Step title={<>Set the panel domain (Settings<PathArrow />Domain panel)</>}>
          <P>
            Sign in as the owner, open Settings<PathArrow />Domain panel, enter
            the dashboard domain, the API domain and an email for Let&apos;s
            Encrypt, then <strong>Save &amp; apply</strong>. Ports 80/443 must be
            free on the server. The panel starts the reverse proxy itself if it
            is not running, rewrites the compose override and recreates the web
            and API containers, so the page disconnects for a few seconds. Or
            from the CLI:
          </P>
          <Pre>{`aoox login`}</Pre>
          <Pre>{`aoox domain set --web panel.example.com --api api.panel.example.com --acme-email you@example.com`}</Pre>
        </Step>
        <Step title="Open https://panel.example.com">
          <P>
            The certificate is requested the first time the host is reached, so
            allow a few seconds. Sign in again: the session from the IP address
            does not carry over to the new origin. Check:
          </P>
          <Pre>{`curl -I https://panel.example.com`}</Pre>
        </Step>
        <Step title="Optional: only allow access through the domain">
          <P>
            Once the HTTPS address opens, turn on{" "}
            <strong>Only allow access through the domain</strong> in Settings
            <PathArrow />Domain panel (or add <Code>--domain-only</Code> to the
            command above). Ports 3000/3001 then listen on{" "}
            <Code>127.0.0.1</Code> only. Remove the now useless ufw rules and,
            if you opened them, the provider firewall rules for 3000/3001:
          </P>
          <Pre>{`sudo ufw delete allow 3000/tcp
sudo ufw delete allow 3001/tcp`}</Pre>
        </Step>
      </Steps>
      <Callout kind="warn" title="Turn the switch on only after HTTPS works">
        If the domain breaks later (DNS, certificate, firewall), <Code>IP:3000</Code>{" "}
        no longer answers either. Recovery over SSH is in{" "}
        <DocLink href="/docs/panel-domain#domain-only">Domain for the panel</DocLink>.
        The domain can also be given at install time
        (<Code>--web-domain</Code>, <Code>--api-domain</Code>,{" "}
        <Code>--acme-email</Code>) when DNS already points at the server, which
        skips the dashboard step.
      </Callout>

      <H2 id="after">11. After the installation</H2>
      <Ul>
        <li>
          <strong>Terminal.</strong> A new install already authorized the
          terminal key for your user, so open the <strong>Terminal</strong>{" "}
          menu. Only if the install printed{" "}
          <Code>warning: terminal key not authorized automatically</Code>{" "}
          (or the Terminal shows an authentication error), use the owner&apos;s{" "}
          <strong>Authorize automatically</strong> button in
          Infrastructure<PathArrow />Terminal access, or run the command it
          shows as the same user. Details in{" "}
          <DocLink href="/docs/terminal#setup">Web terminal</DocLink>.
        </li>
        <li>
          <strong>Registry and proxy.</strong> Provision the{" "}
          <DocLink href="/docs/registry">local registry</DocLink> before your
          first deploy from a Git repo. The reverse proxy is started
          automatically when you save a panel domain.
        </li>
        <li>
          <strong>Back up the panel.</strong> Set up{" "}
          <DocLink href="/docs/backup#instance">Instance backup</DocLink>{" "}
          (Settings<PathArrow />Instance backup), with a schedule and ideally
          an S3 destination, and download a copy off the server. A restore needs
          the same <Code>ENCRYPTION_KEY</Code>, so also keep a private copy of{" "}
          <Code>/opt/aoox/.env.dist</Code> somewhere other than this server.
        </li>
        <li>
          <strong>Updating.</strong> <Code>aoox update panel --apply</Code> (or
          Settings<PathArrow />Update aoox) pulls newer images and restarts the
          stack; <Code>aoox update</Code> updates the CLI itself. They never
          rewrite the compose file or add new variables to{" "}
          <Code>.env.dist</Code>. When a release needs that, run{" "}
          <Code>sudo aoox reinstall</Code> (try <Code>--dry-run</Code> first): it
          rewrites the compose file, merges <Code>.env.dist</Code> without
          regenerating secrets, and recreates the containers without touching
          data. See <DocLink href="/docs/cli#update">Updating aoox</DocLink> and{" "}
          <DocLink href="/docs/cli#reinstall">aoox reinstall</DocLink>.
        </li>
      </Ul>

      <H3>If something goes wrong</H3>
      <Table
        head={["Symptom", "Check"]}
        rows={[
          [
            <>The browser cannot open <Code>IP:3000</Code></>,
            <>The provider firewall / security group (ufw does not matter for Docker-published ports). On the server: <Code>sudo docker compose … ps</Code>.</>,
          ],
          [
            <><Code>IP:80</Code> / <Code>IP:443</Code> do not answer after the install</>,
            <>Expected until the first panel domain is saved (step 10): the reverse proxy is not running yet.</>,
          ],
          [
            "The proxy cannot bind 80/443",
            <>Something else (a preinstalled Apache/nginx) uses them: <Code>sudo ss -ltnp | grep -E &quot;:(80|443) &quot;</Code>, stop and disable it.</>,
          ],
          [
            "The certificate never arrives (self-signed / default certificate)",
            <>DNS not propagated yet, port 80 blocked at the provider, or Let&apos;s Encrypt rate limits after repeated failures. Test with <Code>PROXY_ACME_STAGING=true</Code>. See <DocLink href="/docs/panel-domain#pitfalls">Common pitfalls</DocLink>.</>,
          ],
          [
            "Login loops or the terminal says origin not allowed",
            <><Code>WEB_ORIGIN</Code> differs from the address in the browser.</>,
          ],
          [
            "Terminal: SSH authentication failed",
            <>Wrong <Code>TERMINAL_SSH_USER</Code> or key not authorized. See <DocLink href="/docs/terminal#ssh-user">SSH user on a cloud VPS</DocLink>.</>,
          ],
        ]}
      />
      <P>
        More in <DocLink href="/docs/troubleshooting">Troubleshooting</DocLink>.
      </P>

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
