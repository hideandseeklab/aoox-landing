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

export const metadata: Metadata = { title: "Webhook auto-deploy" }

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
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
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
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
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
              ["GitHub", "Fine-grained or classic PAT", <>Classic: <Code>repo</Code>. Fine-grained: Contents → Read.</>],
              ["GitLab", "Project/personal access token", <><Code>read_repository</Code></>],
              ["Generic", "Username + HTTP basic password/token", "Read access"],
            ]}
          />
        </Step>
        <Step title="Settings → Git credentials → New Git credential (owner/admin)">
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
              GitHub: the <strong>Secret</strong> field → header{" "}
              <Code>X-Hub-Signature-256</Code> = <Code>sha256=HMAC-SHA256(secret, raw body)</Code>.
            </li>
            <li>
              GitLab: the <strong>Secret token</strong> field → header{" "}
              <Code>X-Gitlab-Token</Code> = the secret as-is.
            </li>
          </Ul>
        </Step>
        <Step title="Redeliver the last delivery from the provider">
          <P>Should return 200. If it&apos;s 401, the secret at the provider doesn&apos;t match.</P>
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
      </Ul>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["Provider: connection refused / timeout", <><Code>PUBLIC_API_URL</Code> isn&apos;t reachable from the internet, or port 3001 is blocked by a firewall.</>],
          ["200 ignored even though the push is to the right branch", <>The branch in the application form differs (e.g. <Code>master</Code> vs <Code>main</Code>), or the event sent isn&apos;t a push.</>],
          ["Always 401 after enabling the secret", "GitHub's content type isn't application/json, or the secret hasn't been pasted/differs."],
          ["Deploy runs but the build fails: repository not found", "The repo is private with no Git credential set, or the token expired."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Provider IP verification; queuing deploys while <Code>busy</Code>;
        webhooks for compose stacks.
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
