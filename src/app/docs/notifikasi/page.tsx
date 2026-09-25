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

export const metadata: Metadata = { title: "Notifikasi" }

const SUMMARY = [
  { k: "Channel", v: "Telegram · Slack · Discord · Webhook · Email" },
  { k: "Event", v: "7 toggle per channel" },
  { k: "Lingkup", v: "Platform-wide, owner/admin" },
]

const FLOW = [
  { s: "event", d: "deploy, backup, job, container mati, disk, sertifikat" },
  { s: "filter", d: "channel dengan toggle event itu aktif" },
  { s: "format", d: "payload per platform: HTML, attachments, embeds, JSON, email" },
  { s: "kirim", d: "fetch dengan timeout 10 detik; gagal hanya dicatat di log" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Event deploy sukses/gagal.", href: "/docs/deploy" },
  { title: "Backup & restore", description: "Event backup gagal.", href: "/docs/backup" },
  { title: "Scheduled jobs", description: "Event job gagal/timeout.", href: "/docs/jobs" },
  { title: "Monitoring", description: "Aturan deteksi container mati.", href: "/docs/monitoring#container-mati" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/notifikasi"
      title="Notifikasi"
      description="Mengirim kabar deploy, backup, job, container mati, disk menipis, dan sertifikat gagal ke Telegram, Slack, Discord, webhook, atau email."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">Alur</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>

      <H2 id="channel">Channel yang didukung</H2>
      <Table
        head={["Tipe", "Yang diisi", "Cara mendapatkannya"]}
        rows={[
          [
            <strong key="t">Telegram</strong>,
            <><strong>Bot token</strong> + <strong>Chat ID</strong></>,
            <>Buat bot lewat @BotFather (token <Code>123456789:AAH…</Code>). Chat ID: kirim pesan ke bot lalu buka <Code>https://api.telegram.org/bot&lt;token&gt;/getUpdates</Code>; grup/channel biasanya diawali <Code>-100…</Code>. Bot harus ada di grup itu.</>,
          ],
          [
            <strong key="s">Slack</strong>,
            "Webhook URL",
            "Slack app → Incoming Webhooks → Add New Webhook to Workspace → pilih channel.",
          ],
          [
            <strong key="d">Discord</strong>,
            "Webhook URL",
            "Channel → Edit → Integrations → Webhooks → New Webhook → Copy URL.",
          ],
          [
            <strong key="w">Webhook</strong>,
            <>Webhook URL (https://…) + <strong>Secret</strong> opsional</>,
            "Endpoint apa pun yang menerima POST JSON — n8n, Zapier, aplikasi sendiri. Secret mengaktifkan tanda tangan HMAC.",
          ],
          [
            <strong key="e">Email</strong>,
            "Host SMTP, Port, Username, Password, Pengirim, Penerima",
            <>Penerima dipisah koma. Port 465 = TLS implisit, 587 = STARTTLS. Untuk Gmail pakai app password.</>,
          ],
        ]}
      />

      <H2 id="langkah">Menambahkan channel</H2>
      <Steps>
        <Step title="Settings → Notifikasi → Channel notifikasi baru (owner/admin)">
          <P>
            Isi <strong>Nama</strong>, pilih <strong>Tipe</strong>, isi
            field-nya, dan nyalakan toggle event yang diinginkan. Token/URL/
            password disimpan terenkripsi dan tidak ditampilkan lagi — daftar
            channel hanya menunjukkan petunjuk target (mis. chat id, domain).
          </P>
        </Step>
        <Step title="Kirim tes">
          <P>
            Tombol tes mengirim pesan contoh ke channel itu. Error provider
            ditampilkan apa adanya — mis. Telegram <Code>chat not found</Code>{" "}
            (bot belum di grup / chat id salah) atau SMTP{" "}
            <Code>535 Authentication failed</Code>.
          </P>
        </Step>
        <Step title="Picu event sungguhan">
          <P>
            Deploy sekali, atau jalankan job yang sengaja gagal (<Code>exit 1</Code>)
            untuk memastikan toggle bekerja.
          </P>
        </Step>
      </Steps>

      <H2 id="event">Event</H2>
      <Table
        head={["Toggle", "Terpicu saat", "Isi pesan"]}
        rows={[
          ["Deploy sukses", "Deployment aplikasi berakhir success (termasuk rollback).", "Aplikasi, project, image, durasi, tautan ke halaman aplikasi."],
          ["Deploy gagal", "Deployment aplikasi atau stack compose gagal.", "Sama + potongan pesan error (500 karakter)."],
          ["Backup gagal", "Backup database/volume (manual atau terjadwal) gagal, termasuk gagal unggah ke S3.", "Database/aplikasi, pemicu (manual/terjadwal), error."],
          ["Job gagal", "Scheduled job berstatus failed atau timeout.", "Nama job, perintah (200 karakter), 500 karakter terakhir output."],
          ["Container mati", "Container aplikasi/database berhenti tak terduga — lihat aturan di Monitoring.", "Nama container, exit code, apakah sedang restart."],
          ["Disk hampir penuh", <>Pemakaian filesystem Docker melewati ambang (default 90 %, <Code>DISK_ALERT_PERCENT</Code>); diperiksa sekali sehari.</>, "Persentase terpakai, ambang, ruang tersisa."],
          ["Sertifikat gagal", "Traefik gagal menerbitkan/memperbarui sertifikat sebuah domain (diperiksa tiap 10 menit).", "Domain dan pesan error dari ACME."],
        ]}
      />
      <Ul>
        <li>
          Tautan ke halaman aplikasi disertakan bila <Code>WEB_ORIGIN</Code>{" "}
          terisi.
        </li>
        <li>
          Kegagalan kirim ke satu channel hanya dicatat di log API dan tidak
          mempengaruhi channel lain maupun proses yang memicunya (deploy tidak
          pernah gagal karena notifikasi).
        </li>
        <li>Container mati: maksimal 1 notifikasi per container per 10 menit.</li>
      </Ul>

      <H2 id="webhook">Payload webhook generik</H2>
      <P>
        Channel <strong>Webhook</strong> mengirim <Code>POST</Code> dengan{" "}
        <Code>Content-Type: application/json</Code>. Field umum:{" "}
        <Code>title</Code>, <Code>level</Code> (<Code>success</Code> /{" "}
        <Code>failure</Code> / <Code>info</Code>), <Code>url</Code>, lalu
        field khusus event:
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
      <H3>Contoh penerima (Node.js)</H3>
      <Pre>{`app.post("/hooks/aoox", express.json(), (req, res) => {
  const { event, level, title } = req.body
  if (event === "deployment.failure") alertOnCall(title)
  res.sendStatus(204)
})`}</Pre>
      <H3>Header & tanda tangan</H3>
      <Table
        head={["Header", "Isi"]}
        rows={[
          [<Code key="1">X-Aoox-Event</Code>, <>Nama event, mis. <Code>deployment.success</Code>.</>],
          [<Code key="2">X-Aoox-Delivery</Code>, "ID unik pengiriman — pakai untuk idempotensi."],
          [
            <Code key="3">X-Aoox-Signature</Code>,
            <>
              Hanya bila <strong>Secret</strong> diisi:{" "}
              <Code>sha256=HMAC-SHA256(secret, raw body)</Code>, skema yang sama
              dengan GitHub.
            </>,
          ],
        ]}
      />
      <Pre title="Verifikasi di penerima (Node.js)">{`const sig = req.get("X-Aoox-Signature")
const mine = "sha256=" + createHmac("sha256", SECRET).update(rawBody).digest("hex")
if (!sig || !timingSafeEqual(Buffer.from(sig), Buffer.from(mine))) return res.sendStatus(401)`}</Pre>
      <Callout kind="warn">
        Hitung HMAC atas <strong>byte body mentah</strong>, bukan hasil
        <Code>JSON.stringify</Code> ulang. Tanpa secret, amankan endpoint dengan
        URL yang sulit ditebak. Webhook keluar bisa mencapai alamat internal
        (SSRF by design) — itulah sebabnya hanya owner/admin yang boleh
        menambah channel.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Tes sukses tapi event tidak pernah masuk", "Toggle event belum dinyalakan di channel itu, atau event memang tidak terjadi (mis. container mati di server remote tidak terdeteksi)."],
          ["Telegram: chat not found / bot was blocked", "Bot belum ditambahkan ke grup, chat id tanpa prefix -100 untuk supergroup, atau pengguna belum /start."],
          ["Discord/Slack 4xx", "URL webhook kedaluwarsa/dihapus di provider. Buat ulang dan perbarui channel."],
          ["Email tidak sampai, tes sukses", "Masuk spam, atau Pengirim tidak diizinkan domain SMTP (SPF/DKIM). Pakai alamat pengirim milik domain SMTP."],
          ["Timeout", "Endpoint lambat > 10 detik atau tidak terjangkau dari container API. Balas cepat (204) lalu proses async."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Notifikasi per project atau per aplikasi (channel berlaku
        platform-wide); event untuk stack compose selain deploy gagal;
        ringkasan harian.
      </Callout>

      <H2 id="berikutnya">Langkah berikutnya</H2>
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
