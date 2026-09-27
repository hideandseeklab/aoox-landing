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
  { k: "Pemicu", v: "Push ke branch aplikasi" },
  { k: "Endpoint", v: "POST <PUBLIC_API_URL>/webhooks/<token>" },
  { k: "Keamanan", v: "Token di URL + secret HMAC opsional" },
]

const FLOW = [
  { s: "push", d: "git push origin main" },
  { s: "provider", d: "GitHub/GitLab memanggil Webhook URL" },
  { s: "verifikasi", d: "token URL (+ tanda tangan bila secret aktif)" },
  { s: "deploy", d: "diantrekan seperti tombol Deploy" },
]

const NEXT = [
  { title: "Preview pull request", description: "Container sementara per PR lewat webhook yang sama.", href: "/docs/preview" },
  { title: "Deploy & rollback", description: "Apa yang terjadi setelah deploy diantrekan.", href: "/docs/deploy" },
  { title: "Notifikasi", description: "Kabar deploy sukses/gagal.", href: "/docs/notifikasi" },
  { title: "Domain untuk panel", description: "Supaya PUBLIC_API_URL bisa dijangkau provider.", href: "/docs/domain-panel" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/webhook"
      title="Webhook auto-deploy"
      description="Deploy otomatis setiap push ke branch aplikasi, dan kredensial Git untuk repo privat."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="prasyarat">Prasyarat</H2>
      <Ul>
        <li>
          <Code>PUBLIC_API_URL</Code> bisa dijangkau <strong>dari internet</strong>{" "}
          — GitHub/GitLab memanggilnya dari luar. IP publik + port 3001, atau
          domain via <DocLink href="/docs/domain-panel">Domain untuk panel</DocLink>.
        </li>
        <li>Aplikasi sudah pernah di-deploy sekali secara manual (registry, build, dsb. sudah beres).</li>
      </Ul>

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

      <H2 id="kredensial">Kredensial Git (repo privat)</H2>
      <P>
        Dibutuhkan agar daemon Docker (dan helper Nixpacks) bisa meng-clone
        repo privat. Tidak berhubungan dengan webhook masuk, tapi biasanya
        diatur bersamaan.
      </P>
      <Steps>
        <Step title="Buat token di provider">
          <Table
            head={["Provider", "Jenis token", "Scope minimum"]}
            rows={[
              ["GitHub", "Fine-grained atau classic PAT", <>Classic: <Code>repo</Code>. Fine-grained: Contents → Read.</>],
              ["GitLab", "Project/Personal access token", <><Code>read_repository</Code></>],
              ["Generik", "Username + password/token HTTP basic", "Akses baca"],
            ]}
          />
        </Step>
        <Step title="Settings → Kredensial Git → Kredensial Git baru (owner/admin)">
          <P>
            Pilih <strong>Provider</strong>, isi <strong>Username</strong> dan{" "}
            <strong>Password / token</strong>. Token disimpan terenkripsi
            (<Code>ENCRYPTION_KEY</Code>) dan tidak ditampilkan lagi.
          </P>
        </Step>
        <Step title="Pilih di form aplikasi">
          <P>
            Select <strong>Kredensial Git</strong> di Pengaturan aplikasi. URL
            repo tetap ditulis tanpa <Code>user:token@</Code> — aoox
            menyusunnya sendiri saat build dan menyensor token di log.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          Menghapus kredensial melepasnya dari aplikasi yang memakainya; build
          berikutnya gagal bila repo privat.
        </li>
        <li>
          Untuk GitHub fine-grained token, pastikan repo-nya termasuk dalam
          daftar akses token.
        </li>
      </Ul>

      <H2 id="webhook">Mengaktifkan webhook</H2>
      <Steps>
        <Step title="Salin Webhook URL dari tab Webhook">
          <Pre>{`https://api.panel.example.com/webhooks/9f3a1c…e21d`}</Pre>
          <P>
            Token 32 byte acak, unik per aplikasi. <strong>Buat ulang</strong>{" "}
            kapan saja — URL lama langsung tidak berlaku.
          </P>
        </Step>
        <Step title="Daftarkan di provider">
          <H3>GitHub</H3>
          <Table
            head={["Field", "Nilai"]}
            rows={[
              ["Payload URL", "Webhook URL"],
              ["Content type", <Code key="ct">application/json</Code>],
              ["Secret", "Isi bila secret diaktifkan (langkah berikutnya)"],
              ["Events", <><strong>Just the push event</strong>; tambah <strong>Pull requests</strong> untuk preview</>],
            ]}
          />
          <H3>GitLab</H3>
          <Table
            head={["Field", "Nilai"]}
            rows={[
              ["URL", "Webhook URL"],
              ["Secret token", "Isi bila secret diaktifkan"],
              ["Trigger", <><strong>Push events</strong>; tambah <strong>Merge request events</strong> untuk preview</>],
            ]}
          />
        </Step>
        <Step title="Uji: push ke branch aplikasi">
          <P>
            Deployment baru muncul di tab Deploy beberapa detik setelah push.
            Di provider, halaman <em>Recent Deliveries</em> menampilkan respons
            API — lihat tabel di bawah untuk membacanya.
          </P>
          <P>
            Tanpa menunggu provider, tes langsung dari server dulu — event{" "}
            <Code>ping</Code> selalu <Code>ignored</Code>, aman dipakai untuk
            memastikan URL & token benar sebelum menyentuh GitHub/GitLab:
          </P>
          <Pre>{`curl -i -X POST https://<API_DOMAIN>/webhooks/<token> \\
  -H "Content-Type: application/json" \\
  -H "X-GitHub-Event: ping" \\
  -d "{}"
# harus 200 dengan body {"result":"ignored","reason":"event ping"}`}</Pre>
        </Step>
      </Steps>

      <H2 id="respons">Membaca respons webhook</H2>
      <Table
        head={["Situasi", "Status", "Body"]}
        rows={[
          ["Push ke branch aplikasi", "200", <><Code>{"{ result: \"queued\" }"}</Code> — deploy diantrekan</>],
          ["Push ke branch lain / event bukan push / branch dihapus", "200", <><Code>ignored</Code> + <Code>reason</Code> yang menjelaskan</>],
          ["Masih ada deployment berjalan", "200", <><Code>busy</Code> — tidak diantre; push lagi setelah selesai</>],
          ["PR/MR dibuka, diperbarui, ditutup (preview aktif)", "200", <><Code>preview</Code> / <Code>preview-closed</Code></>],
          ["Secret aktif tapi tanda tangan salah/hilang", "401", "Ditolak"],
          ["Token URL tidak dikenal", "404", "Ditolak"],
          ["Lebih dari 30 request/menit", "429", "Throttle"],
        ]}
      />
      <Callout>
        <Code>busy</Code> berarti push saat build masih berjalan{" "}
        <strong>tidak</strong> diantre. Kalau alur kerja timmu sering push
        beruntun, biasakan menunggu deployment selesai, atau push sekali lagi
        setelahnya.
      </Callout>

      <H2 id="redeliver">Redeliver: uji ulang tanpa push baru</H2>
      <Callout title="Paling sering menyelesaikan masalah">
        Setelah memperbaiki Payload URL, secret, atau masalah di sisi
        API/proxy, <strong>jangan hanya menunggu</strong> — provider tidak
        mengirim ulang sendiri. Kirim ulang delivery yang sama lewat{" "}
        <strong>Redeliver</strong> (GitHub) / <strong>Resend request</strong>{" "}
        (GitLab) untuk langsung tahu apakah perbaikannya berhasil, tanpa perlu
        push commit baru.
      </Callout>
      <H3>GitHub</H3>
      <Steps>
        <Step title="Repo → Settings → Webhooks">
          <P>Klik webhook yang dipakai aoox (Edit).</P>
        </Step>
        <Step title="Tab Recent Deliveries">
          <P>Klik delivery paling atas (yang terbaru).</P>
        </Step>
        <Step title="Tombol Redeliver">
          <P>
            Buka tab <strong>Response</strong> setelahnya — harus{" "}
            <Code>200</Code>. Status <em>&quot;Last delivery was not
            successful&quot;</em> di daftar webhook hanya diperbarui setelah
            ada delivery baru (redeliver atau push baru); memperbaiki
            penyebabnya saja tidak menghapus status merah itu sampai ada
            percobaan baru.
          </P>
        </Step>
      </Steps>
      <H3>GitLab</H3>
      <Steps>
        <Step title="Settings → Webhooks → Edit">
          <P>Buka bagian <strong>Recent events</strong> di bawah form.</P>
        </Step>
        <Step title="Resend request">
          <P>
            Pada baris event yang gagal. Alternatif tanpa event lama sama
            sekali: tombol <strong>Test</strong> → pilih <strong>Push
            events</strong> untuk memicu pengiriman baru tanpa perlu push
            sungguhan.
          </P>
        </Step>
      </Steps>

      <H2 id="secret">Secret (tanda tangan)</H2>
      <P>
        Tanpa secret, siapa pun yang tahu URL bisa memicu deploy (bukan
        mengubah kode — hanya membangun ulang branch yang sama). Untuk
        menutupnya, di bagian <strong>Secret (tanda tangan)</strong>:
      </P>
      <Steps>
        <Step title="Klik aktifkan, salin nilai secret">
          <P>Ditampilkan di tab Webhook selama aktif supaya bisa disalin ulang.</P>
        </Step>
        <Step title="Tempel di provider">
          <Ul>
            <li>
              GitHub: field <strong>Secret</strong> → header{" "}
              <Code>X-Hub-Signature-256</Code> = <Code>sha256=HMAC-SHA256(secret, raw body)</Code>.
            </li>
            <li>
              GitLab: field <strong>Secret token</strong> → header{" "}
              <Code>X-Gitlab-Token</Code> = secret apa adanya.
            </li>
          </Ul>
        </Step>
        <Step title="Kirim ulang delivery terakhir dari provider">
          <P>
            Lihat <DocLink href="/docs/webhook#redeliver">Redeliver</DocLink>{" "}
            di atas. Harus 200. Bila 401, secret di provider tidak cocok.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          <strong>Rotasi</strong> membuat nilai baru — perbarui di provider
          sebelum push berikutnya.
        </li>
        <li>
          <strong>Nonaktifkan</strong> kembali ke perilaku token-URL saja.
        </li>
        <li>
          Perbandingan memakai <Code>timingSafeEqual</Code>; HMAC dihitung atas
          byte body persis, bukan JSON hasil parse.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Provider: connection refused / timeout", <><Code>PUBLIC_API_URL</Code> tidak bisa dijangkau dari internet, atau port 3001 tertutup firewall.</>],
          ["200 ignored padahal push ke branch benar", <>Branch di form aplikasi berbeda (mis. <Code>master</Code> vs <Code>main</Code>), atau event yang dikirim bukan push.</>],
          ["Selalu 401 setelah mengaktifkan secret", "Content type GitHub bukan application/json, atau secret belum ditempel/berbeda."],
          ["Deploy jalan tapi build gagal: repository not found", "Repo privat tanpa Kredensial Git, atau token kedaluwarsa."],
          [
            "URL di tab Webhook masih menampilkan localhost:3001 padahal panel sudah pakai domain",
            <>
              Instalasi lama: <Code>PUBLIC_API_URL</Code> dulu hanya
              diteruskan ke container <Code>web</Code>, bukan <Code>api</Code>.
              Tambahkan{" "}
              <Code>{"PUBLIC_API_URL: ${PUBLIC_API_URL:-http://localhost:3001}"}</Code>{" "}
              ke <Code>environment:</Code> service <Code>api</Code> di{" "}
              <Code>docker-compose.dist.yml</Code>, lalu{" "}
              <Code>docker compose -f docker-compose.dist.yml -f docker-compose.override.yml --env-file .env.dist up -d</Code>
              . <Code>aoox update</Code> tidak menulis ulang file compose, jadi
              instalasi lama butuh langkah manual ini sekali.
            </>,
          ],
          [
            <>GitHub: <Code>Invalid HTTP Response: 404</Code></>,
            <>
              Payload URL memakai domain <strong>dashboard/web</strong>{" "}
              (mis. <Code>panel.example.com/webhooks/…</Code>), bukan domain{" "}
              <strong>API</strong> — endpoint webhook ada di API; web
              (Next.js) yang membalas 404. Pakai{" "}
              <Code>https://&lt;API_DOMAIN&gt;/webhooks/&lt;token&gt;</Code>{" "}
              (salin dari tab Webhook), bukan domain panel.
            </>,
          ],
          [
            "“Last delivery was not successful” masih merah setelah diperbaiki",
            <>
              Status itu hanya diperbarui setelah ada delivery baru — lihat{" "}
              <DocLink href="/docs/webhook#redeliver">
                Redeliver: uji ulang tanpa push baru
              </DocLink>
              .
            </>,
          ],
          [
            "Membedakan dua jenis 404",
            <>
              Body teks polos <Code>404 page not found</Code> = ditolak
              Traefik (router domain API tidak cocok, atau domain itu belum
              menjangkau container API); body JSON{" "}
              <Code>{'{"statusCode":404,...}'}</Code> = sampai ke API tapi
              token di URL tidak dikenal (token lama setelah &quot;Buat URL
              baru&quot;, atau salah salin).
            </>,
          ],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Verifikasi IP provider; antrean deploy saat <Code>busy</Code>;
        webhook untuk stack compose.
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
