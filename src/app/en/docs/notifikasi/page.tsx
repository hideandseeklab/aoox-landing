import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
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

export const metadata: Metadata = { title: "Notifications" }

const SUMMARY = [
  { k: "Channels", v: "Telegram · Slack · Discord · Webhook · Email" },
  { k: "Events", v: "7 toggles per channel" },
  { k: "Scope", v: "Platform-wide, owner/admin" },
]

const FLOW = [
  { s: "event", d: "deploy, backup, job, container down, disk, certificate" },
  { s: "filter", d: "channels with that event's toggle enabled" },
  { s: "format", d: "a per-platform payload: HTML, attachments, embeds, JSON, email" },
  { s: "send", d: "fetch with a 10-second timeout; failures are only logged" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Deploy success/failure events.", href: "/en/docs/deploy" },
  { title: "Backup & restore", description: "The backup-failure event.", href: "/en/docs/backup" },
  { title: "Scheduled jobs", description: "Job failure/timeout events.", href: "/en/docs/jobs" },
  { title: "Monitoring", description: "The container-down detection rules.", href: "/en/docs/monitoring#container-mati" },
]

export default function Page() {
  return (
    <DocPage
      href="/en/docs/notifikasi"
      title="Notifications"
      lang="en"
      description="Send word of deploys, backups, jobs, dead containers, low disk, and failed certificates to Telegram, Slack, Discord, a webhook, or email."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

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

      <H2 id="channel">Supported channels</H2>
      <Table
        head={["Type", "What to fill in", "How to get it"]}
        rows={[
          [
            <strong key="t">Telegram</strong>,
            <><strong>Bot token</strong> + <strong>Chat ID</strong></>,
            <>Create a bot via @BotFather (token like <Code>123456789:AAH…</Code>). Chat ID: message the bot, then open <Code>https://api.telegram.org/bot&lt;token&gt;/getUpdates</Code>; groups/channels usually start with <Code>-100…</Code>. The bot must already be in that group.</>,
          ],
          [
            <strong key="s">Slack</strong>,
            "Webhook URL",
            "Slack app → Incoming Webhooks → Add New Webhook to Workspace → pick a channel.",
          ],
          [
            <strong key="d">Discord</strong>,
            "Webhook URL",
            "Channel → Edit → Integrations → Webhooks → New Webhook → Copy URL.",
          ],
          [
            <strong key="w">Webhook</strong>,
            <>A webhook URL (https://…) + an optional <strong>Secret</strong></>,
            "Any endpoint that accepts a JSON POST — n8n, Zapier, your own app. The secret enables HMAC signing.",
          ],
          [
            <strong key="e">Email</strong>,
            "SMTP host, port, username, password, sender, recipients",
            <>Recipients are comma-separated. Port 465 = implicit TLS, 587 = STARTTLS. For Gmail, use an app password.</>,
          ],
        ]}
      />

      <H2 id="langkah">Adding a channel</H2>
      <Steps>
        <Step title="Settings → Notifications → New notification channel (owner/admin)">
          <P>
            Fill in a <strong>Name</strong>, pick a <strong>Type</strong>, fill
            in its fields, and enable the toggles for the events you want.
            The token/URL/password is stored encrypted and never shown
            again — the channel list only shows a hint of the target (e.g.
            chat id, domain).
          </P>
        </Step>
        <Step title="Send a test">
          <P>
            The test button sends a sample message to that channel. Provider
            errors are shown as-is — e.g. Telegram&apos;s <Code>chat not found</Code>{" "}
            (the bot isn&apos;t in the group / wrong chat id) or SMTP&apos;s{" "}
            <Code>535 Authentication failed</Code>.
          </P>
        </Step>
        <Step title="Trigger a real event">
          <P>
            Deploy once, or run a job that&apos;s meant to fail (<Code>exit 1</Code>)
            to make sure the toggle works.
          </P>
        </Step>
      </Steps>

      <H2 id="event">Events</H2>
      <Table
        head={["Toggle", "Fires when", "Message contents"]}
        rows={[
          ["Deploy success", "An application deployment ends in success (including rollback).", "Application, project, image, duration, a link to the application page."],
          ["Deploy failure", "An application or compose stack deployment fails.", "Same, plus a snippet of the error message (500 characters)."],
          ["Backup failure", "A database/volume backup (manual or scheduled) fails, including a failed S3 upload.", "Database/application, trigger (manual/scheduled), error."],
          ["Job failure", "A scheduled job ends up failed or timeout.", "Job name, command (200 characters), the last 500 characters of output."],
          ["Container down", "An application/database container stops unexpectedly — see the rules under Monitoring.", "Container name, exit code, whether it's restarting."],
          ["Disk almost full", <>Docker filesystem usage crosses a threshold (default 90%, <Code>DISK_ALERT_PERCENT</Code>); checked once a day.</>, "Percentage used, threshold, space remaining."],
          ["Certificate failure", "Traefik fails to issue/renew a domain's certificate (checked every 10 minutes).", "The domain and the ACME error message."],
        ]}
      />
      <Ul>
        <li>
          A link to the application page is included when{" "}
          <Code>WEB_ORIGIN</Code> is set.
        </li>
        <li>
          A failure to deliver to one channel is only logged by the API and
          doesn&apos;t affect other channels or the process that triggered it (a
          deploy never fails because of a notification).
        </li>
        <li>Container down: at most 1 notification per container every 10 minutes.</li>
      </Ul>

      <H2 id="webhook">Generic webhook payload</H2>
      <P>
        The <strong>Webhook</strong> channel sends a <Code>POST</Code> with{" "}
        <Code>Content-Type: application/json</Code>. Common fields:{" "}
        <Code>title</Code>, <Code>level</Code> (<Code>success</Code> /{" "}
        <Code>failure</Code> / <Code>info</Code>), <Code>url</Code>, plus
        event-specific fields:
      </P>
      <Pre title="deployment.success / deployment.failure">{`{
  "title": "Deployment succeeded: shop",
  "level": "success",
  "url": "https://panel.example.com/applications/…",
  "event": "deployment.success",
  "deploymentId": "…",
  "kind": "deploy",
  "applicationId": "…",
  "application": "shop",
  "imageRef": "localhost:5000/toko/shop:a1b2c3d4e5f6",
  "error": null,
  "finishedAt": "2026-09-22T04:30:00.000Z"
}`}</Pre>
      <Pre title="container.down">{`{
  "title": "Container down: aoox-app-shop",
  "level": "failure",
  "event": "container.down",
  "container": "aoox-app-shop",
  "exitCode": 137,
  "restarting": true
}`}</Pre>
      <H3>Example receiver (Node.js)</H3>
      <Pre>{`app.post("/hooks/aoox", express.json(), (req, res) => {
  const { event, level, title } = req.body
  if (event === "deployment.failure") alertOnCall(title)
  res.sendStatus(204)
})`}</Pre>
      <H3>Headers & signature</H3>
      <Table
        head={["Header", "Contents"]}
        rows={[
          [<Code key="1">X-Aoox-Event</Code>, <>The event name, e.g. <Code>deployment.success</Code>.</>],
          [<Code key="2">X-Aoox-Delivery</Code>, "A unique delivery ID — use it for idempotency."],
          [
            <Code key="3">X-Aoox-Signature</Code>,
            <>
              Only when a <strong>Secret</strong> is set:{" "}
              <Code>sha256=HMAC-SHA256(secret, raw body)</Code>, the same
              scheme GitHub uses.
            </>,
          ],
        ]}
      />
      <Pre title="Verifying on the receiver (Node.js)">{`const sig = req.get("X-Aoox-Signature")
const mine = "sha256=" + createHmac("sha256", SECRET).update(rawBody).digest("hex")
if (!sig || !timingSafeEqual(Buffer.from(sig), Buffer.from(mine))) return res.sendStatus(401)`}</Pre>
      <Callout kind="warn">
        Compute the HMAC over the <strong>raw request body bytes</strong>, not
        a re-serialized <Code>JSON.stringify</Code>. Without a secret, secure
        the endpoint with a hard-to-guess URL instead. Outgoing webhooks can
        reach internal addresses (SSRF by design) — that&apos;s why only
        owner/admin can add a channel.
      </Callout>

      <H2 id="jebakan">Common pitfalls</H2>
      <Table
        head={["Symptom", "Cause & fix"]}
        rows={[
          ["The test succeeds but the real event never arrives", "The event's toggle isn't enabled on that channel, or the event genuinely didn't happen (e.g. a dead container on a remote server isn't detected)."],
          ["Telegram: chat not found / bot was blocked", "The bot hasn't been added to the group, the chat id is missing the -100 prefix for a supergroup, or the user hasn't hit /start."],
          ["Discord/Slack 4xx", "The webhook URL has expired or was deleted on the provider. Create a new one and update the channel."],
          ["Email doesn't arrive, test succeeds", "It landed in spam, or the sender isn't authorized for the SMTP domain (SPF/DKIM). Use a sender address on the SMTP domain."],
          ["Timeout", "The endpoint is slow (> 10 seconds) or unreachable from the API container. Reply fast (204) and process asynchronously."],
        ]}
      />

      <Callout kind="warn" title="Not available yet">
        Per-project or per-application notifications (channels are
        platform-wide); events for compose stacks beyond deploy failure; a
        daily digest.
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
