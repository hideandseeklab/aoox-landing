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
  path: "/en/docs/webhook",
  lang: "en",
  title: "Webhook auto-deploy",
  description:
    "Automatic deploy on push from GitHub/GitLab.",
})

const SUMMARY = [
  { k: "Trigger", v: "Push to the application's branch" },
  { k: "Endpoint", v: "POST <PUBLIC_API_URL>/webhooks/<token>" },
  { k: "Security", v: "URL token + optional HMAC secret" },
]

const FLOW = [
  { s: "push", d: "git push origin main" },
  { s: "provider", d: "GitHub/GitLab calls the Webhook URL" },
  { s: "verify", d: "URL token (+ signature if the secret is on)" },
  { s: "deploy", d: "queued just like the Deploy button" },
]

const NEXT = [
  { title: "Pull request previews", description: "Temporary containers per PR through the same webhook.", href: "/en/docs/preview" },
  { title: "Deploy & rollback", description: "What happens once a deploy is queued.", href: "/en/docs/deploy" },
  { title: "Notifications", description: "Alerts for successful/failed deploys.", href: "/en/docs/notifikasi" },
  { title: "Domain for the panel", description: "So PUBLIC_API_URL is reachable by a provider.", href: "/en/docs/domain-panel" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/webhook"
      title="Webhook auto-deploy"
      lang="en"
      description="Automatic deploy on every push to the application's branch, plus Git credentials for private repos."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="prasyarat">Prerequisites</H2>
      <Ul>
        <li>
          <Code>PUBLIC_API_URL</Code> is reachable <strong>from the internet</strong>{" "}
          — GitHub/GitLab call it from outside. A public IP + port 3001, or a
          domain via <DocLink href="/en/docs/domain-panel">Domain for the panel</DocLink>.
        </li>
        <li>The application has already been deployed manually at least once (registry, build, etc. already set up).</li>
      </Ul>

      <H2 id="alur">Flow</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4 rounded-lg overflow-hidden">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>

      <H2 id="kredensial">Git credentials (private repos)</H2>
      <P>
        Needed so the Docker daemon (and the Nixpacks helper) can clone a
        private repo. It&apos;s unrelated to incoming webhooks, but the two are
        usually set up together.
      </P>
      <Steps>
        <Step title="Create a token at the provider">
          <Table
            head={["Provider", "Token type", "Minimum scope"]}
            rows={[
              ["GitHub", "Fine-grained or classic PAT", <>Classic: <Code>repo</Code>. Fine-grained: Contents<PathArrow />Read.</>],
              ["GitLab", "Project/personal access token", <><Code>read_repository</Code></>],
              ["Generic", "Username + HTTP basic password/token", "Read access"],
            ]}
          />
        </Step>
        <Step title={<>Settings<PathArrow />Git credentials<PathArrow />New Git credential (owner/admin)</>}>
          <P>
            Choose a <strong>Provider</strong>, fill in a <strong>Username</strong>{" "}
            and <strong>Password / token</strong>. The token is stored encrypted
            (<Code>ENCRYPTION_KEY</Code>) and never shown again.
          </P>
        </Step>
        <Step title="Select it in the application form">
          <P>
            Select <strong>Git credential</strong> in the application&apos;s Settings.
            The repo URL is still written without <Code>user:token@</Code> —
            aoox assembles it at build time and redacts the token from logs.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          Deleting a credential detaches it from any application using it; the
          next build fails if the repo is private.
        </li>
        <li>
          For a GitHub fine-grained token, make sure the repo is included in
          the token&apos;s access list.
        </li>
      </Ul>

      <H2 id="webhook">Enabling the webhook</H2>
      <Steps>
        <Step title="Copy the Webhook URL from the Webhook tab">
          <Pre>{`https://api.panel.example.com/webhooks/9f3a1c…e21d`}</Pre>
          <P>
            A random 32-byte token, unique per application.{" "}
            <strong>Regenerate</strong> it anytime — the old URL stops working
            immediately.
          </P>
        </Step>
        <Step title="Register it with the provider">
          <H3>GitHub</H3>
          <Table
            head={["Field", "Value"]}
            rows={[
              ["Payload URL", "the Webhook URL"],
              ["Content type", <Code key="ct">application/json</Code>],
              ["Secret", "fill in if the secret is enabled (next step)"],
              ["Events", <><strong>Just the push event</strong>; add <strong>Pull requests</strong> for previews</>],
            ]}
          />
          <H3>GitLab</H3>
          <Table
            head={["Field", "Value"]}
            rows={[
              ["URL", "the Webhook URL"],
              ["Secret token", "fill in if the secret is enabled"],
              ["Trigger", <><strong>Push events</strong>; add <strong>Merge request events</strong> for previews</>],
            ]}
          />
        </Step>
        <Step title="Test: push to the application's branch">
          <P>
            A new deployment appears on the Deploy tab a few seconds after the
            push. On the provider&apos;s side, the <em>Recent Deliveries</em> page
            shows the API&apos;s response — see the table below to read it.
          </P>
          <P>
            Without waiting on the provider, test straight from the server
            first — a <Code>ping</Code> event is always <Code>ignored</Code>,
            safe to use just to confirm the URL and token before touching
            GitHub/GitLab:
          </P>
          <Pre>{`curl -i -X POST https://<API_DOMAIN>/webhooks/<token> \\
  -H "Content-Type: application/json" \\
  -H "X-GitHub-Event: ping" \\
  -d "{}"
# should be 200 with body {"result":"ignored","reason":"event ping"}`}</Pre>
        </Step>
      </Steps>

      <H2 id="respons">Reading the webhook response</H2>
      <Table
        head={["Situation", "Status", "Body"]}
        rows={[
          ["Push to the application's branch", "200", <><Code>{"{ result: \"queued\" }"}</Code> — deploy queued</>],
          ["Push to another branch / non-push event / branch deleted", "200", <><Code>ignored</Code> + an explanatory <Code>reason</Code></>],
          ["A deployment is already running", "200", <><Code>busy</Code> — not queued; push again once it&apos;s done</>],
          ["PR/MR opened, updated, closed (previews on)", "200", <><Code>preview</Code> / <Code>preview-closed</Code></>],
          ["Secret is on but the signature is wrong/missing", "401", "Rejected"],
          ["Unknown URL token", "404", "Rejected"],
          ["More than 30 requests/minute", "429", "Throttled"],
        ]}
      />
      <Callout>
        <Code>busy</Code> means a push that lands while a build is already
        running is <strong>not</strong> queued. If your team pushes in quick
        succession, get in the habit of waiting for the deployment to finish,
        or push once more afterward.
      </Callout>

      <H2 id="redeliver">Redeliver: retest without a new push</H2>
      <Callout title="This is what actually fixes it, most of the time">
        After fixing the Payload URL, the secret, or something on the
        API/proxy side, <strong>don&apos;t just wait</strong> — the provider
        doesn&apos;t resend on its own. Resend the same delivery with{" "}
        <strong>Redeliver</strong> (GitHub) / <strong>Resend request</strong>{" "}
        (GitLab) to find out right away whether the fix worked, with no need
        for a new commit.
      </Callout>
      <H3>GitHub</H3>
      <Steps>
        <Step title={<>Repo<PathArrow />Settings<PathArrow />Webhooks</>}>
          <P>Click the webhook aoox uses (Edit).</P>
        </Step>
        <Step title="Recent Deliveries tab">
          <P>Click the topmost (most recent) delivery.</P>
        </Step>
        <Step title="Redeliver button">
          <P>
            Then open the <strong>Response</strong> tab — it should say{" "}
            <Code>200</Code>. The <em>&quot;Last delivery was not
            successful&quot;</em> status on the webhook list only updates
            after a new delivery (a redeliver or a fresh push); fixing the
            underlying cause alone doesn&apos;t clear that red status until
            something new is attempted.
          </P>
        </Step>
      </Steps>
      <H3>GitLab</H3>
      <Steps>
        <Step title={<>Settings<PathArrow />Webhooks<PathArrow />Edit</>}>
          <P>Open the <strong>Recent events</strong> section below the form.</P>
        </Step>
        <Step title="Resend request">
          <P>
            On the failed event&apos;s row. To trigger a fresh delivery with no
            old event at all: the <strong>Test</strong> button<PathArrow />pick{" "}
            <strong>Push events</strong>, no real push needed.
          </P>
        </Step>
      </Steps>

      <H2 id="secret">Secret (signature)</H2>
      <P>
        Without a secret, anyone who knows the URL can trigger a deploy (not
        change the code — just rebuild the same branch). To close that off, in
        the <strong>Secret (signature)</strong> section:
      </P>
      <Steps>
        <Step title="Click enable, copy the secret value">
          <P>Shown on the Webhook tab for as long as it&apos;s enabled, so you can copy it again.</P>
        </Step>
        <Step title="Paste it into the provider">
          <Ul>
            <li>
              GitHub: the <strong>Secret</strong> field<PathArrow />header{" "}
              <Code>X-Hub-Signature-256</Code> = <Code>sha256=HMAC-SHA256(secret, raw body)</Code>.
            </li>
            <li>
              GitLab: the <strong>Secret token</strong> field<PathArrow />header{" "}
              <Code>X-Gitlab-Token</Code> = the secret as-is.
            </li>
          </Ul>
        </Step>
        <Step title="Redeliver the last delivery from the provider">
          <P>
            See <DocLink href="/en/docs/webhook#redeliver">Redeliver</DocLink>{" "}
            above. Should return 200. If it&apos;s 401, the secret at the
            provider doesn&apos;t match.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          <strong>Rotating</strong> generates a new value — update it at the
          provider before the next push.
        </li>
        <li>
          <strong>Disabling</strong> falls back to URL-token-only behavior.
        </li>
        <li>
          The comparison uses <Code>timingSafeEqual</Code>; the HMAC is
          computed over the exact request body bytes, not the parsed JSON.
        </li>
        <li>
          Optional extra layer for GitHub: put{" "}
          <Code>WEBHOOK_VERIFY_GITHUB_IP=true</Code> in <Code>.env.dist</Code> so a
          GitHub delivery for an app with a secret must also come from GitHub&apos;s
          published IP ranges (empty = off; don&apos;t enable it for GitHub Enterprise
          Server or GitLab). An install created before this variable was forwarded
          only gets it after <Code>aoox reinstall</Code>.
        </li>
      </Ul>

      <H2 id="monorepo">Monorepo: deploy only when the folder changed</H2>
      <P>
        An application with a <strong>Root directory</strong> (see{" "}
        <DocLink href="/docs/build#root-directory">Build types</DocLink>) has
        the switch <strong>Webhook: deploy only when files in this folder change</strong>.
        When it is on, a push that only touches other folders is answered{" "}
        <Code>ignored</Code> and no deployment starts. It is off by default, so
        the old behaviour (every push to the branch deploys) is unchanged.
      </P>
      <Ul>
        <li>
          aoox reads the per-commit file lists in GitHub and GitLab push
          payloads (<Code>added</Code>, <Code>modified</Code>, <Code>removed</Code>).
        </li>
        <li>
          <strong>When it cannot tell, aoox deploys anyway.</strong> That covers
          a payload without file lists, a commit without file lists (merge
          commits on GitHub), pushes of 20 or more commits (the payload cap of
          both providers), force pushes, and new branches.
        </li>
        <li>
          Changes outside the folder the build uses (for example{" "}
          <Code>packages/shared</Code>) do not trigger a deploy. Turn the switch
          off for applications that depend on files outside their folder.
        </li>
        <li>
          It applies to pushes to the application branch; pull request events
          for previews are not filtered.
        </li>
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Provider: connection refused / timeout", <><Code>PUBLIC_API_URL</Code> isn&apos;t reachable from the internet, or port 3001 is blocked by a firewall.</>],
          ["200 ignored even though the push is to the right branch", <>The branch in the application form differs (e.g. <Code>master</Code> vs <Code>main</Code>), or the event sent isn&apos;t a push.</>],
          ["Always 401 after enabling the secret", "GitHub's content type isn't application/json, or the secret hasn't been pasted/differs."],
          ["Deploy runs but the build fails: repository not found", "The repo is private with no Git credential set, or the token expired."],
          [
            "The Webhook tab still shows localhost:3001 even though the panel already has a domain",
            <>
              On older installs, <Code>PUBLIC_API_URL</Code> used to only be
              passed to the <Code>web</Code> container, not <Code>api</Code>.
              Add{" "}
              <Code>{"PUBLIC_API_URL: ${PUBLIC_API_URL:-http://localhost:3001}"}</Code>{" "}
              to the <Code>api</Code> service&apos;s <Code>environment:</Code>{" "}
              block in <Code>docker-compose.dist.yml</Code>, then{" "}
              <Code>docker compose -f docker-compose.dist.yml -f docker-compose.override.yml --env-file .env.dist up -d</Code>
              . <Code>aoox update</Code> never rewrites the compose file, so
              older installs need this manual step once.
            </>,
          ],
          [
            <>GitHub: <Code>Invalid HTTP Response: 404</Code></>,
            <>
              The Payload URL uses the <strong>dashboard/web</strong> domain
              (e.g. <Code>panel.example.com/webhooks/…</Code>) instead of the{" "}
              <strong>API</strong> domain — the webhook endpoint lives on the
              API; the web app (Next.js) is what answers with 404. Use{" "}
              <Code>https://&lt;API_DOMAIN&gt;/webhooks/&lt;token&gt;</Code>{" "}
              (copy it from the Webhook tab), not the panel&apos;s domain.
            </>,
          ],
          [
            "“Last delivery was not successful” stays red after a fix",
            <>
              That status only updates after a new delivery — see{" "}
              <DocLink href="/en/docs/webhook#redeliver">
                Redeliver: retest without a new push
              </DocLink>
              .
            </>,
          ],
          [
            "Telling the two kinds of 404 apart",
            <>
              A plain-text <Code>404 page not found</Code> body means Traefik
              rejected it (the API domain&apos;s router doesn&apos;t match, or
              that domain never reaches the API container); a JSON{" "}
              <Code>{'{"statusCode":404,...}'}</Code> body means it reached
              the API but the token in the URL isn&apos;t recognized (an old
              token after &quot;Generate new URL&quot;, or a copy-paste
              mistake).
            </>,
          ],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Provider IP verification; queuing deploys while <Code>busy</Code>;
        webhooks for compose stacks.
      </Callout>

      <H2 id="berikutnya">Next steps</H2>
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
