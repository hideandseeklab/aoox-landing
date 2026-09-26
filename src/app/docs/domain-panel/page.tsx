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

export const metadata: Metadata = { title: "Domain untuk panel" }

const SUMMARY = [
  { k: "Hasil", v: "https://panel.example.com + https://api.panel.example.com" },
  { k: "Cara", v: "Dashboard/CLI (otomatis) atau override compose manual — Traefik bawaan" },
  { k: "Butuh", v: "2 record DNS, port 80/443, PROXY_ACME_EMAIL" },
]

const BEFORE_AFTER = [
  { k: "Akses", before: "http://203.0.113.10:3000", after: "https://panel.example.com" },
  { k: "API", before: "http://203.0.113.10:3001", after: "https://api.panel.example.com" },
  { k: "Cookie sesi", before: "tanpa Secure", after: "Secure (mengikuti WEB_ORIGIN https)" },
  { k: "Webhook Git", before: "IP:3001 harus publik", after: "URL API yang rapi" },
  { k: "Port 3000/3001", before: "satu-satunya jalan", after: "tetap terbuka (akses via IP)" },
]

const NEXT = [
  { title: "Proxy & domain", description: "Router Traefik, ACME, cek DNS untuk aplikasi.", href: "/docs/domain" },
  { title: "Web terminal", description: "WEB_ORIGIN yang benar untuk terminal.", href: "/docs/terminal" },
  { title: "Webhook auto-deploy", description: "PUBLIC_API_URL yang dipanggil provider.", href: "/docs/webhook" },
  { title: "Instalasi", description: "Referensi .env.dist lengkap.", href: "/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/domain-panel"
      title="Domain untuk panel"
      description="Melayani dashboard dan API aoox lewat domain sendiri dengan HTTPS dari Let's Encrypt, memakai reverse proxy bawaan."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kenapa">Sebelum & sesudah</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium"></th>
              <th className="px-3 py-2 text-left font-medium">Via IP (default)</th>
              <th className="px-3 py-2 text-left font-medium">Via domain</th>
            </tr>
          </thead>
          <tbody>
            {BEFORE_AFTER.map((row) => (
              <tr key={row.k} className="border-t border-border">
                <td className="px-3 py-2 text-foreground">{row.k}</td>
                <td className="px-3 py-2"><Code>{row.before}</Code></td>
                <td className="px-3 py-2"><Code>{row.after}</Code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Dua hostname dibutuhkan karena browser memanggil API secara langsung
        (Socket.IO untuk terminal & log) — bukan lewat web.
      </P>

      <H2 id="prasyarat">Prasyarat</H2>
      <Ul>
        <li>
          aoox sudah berjalan via IP (<DocLink href="/docs/instalasi">Instalasi</DocLink>)
          dan kamu bisa login.
        </li>
        <li>Port <Code>80</Code> dan <Code>443</Code> di host kosong.</li>
        <li>Dua record DNS <Code>A</Code> ke IP server:</li>
      </Ul>
      <Pre title="DNS">{`panel.example.com.       A   203.0.113.10
api.panel.example.com.   A   203.0.113.10`}</Pre>
      <P>
        Tunggu sampai <Code>dig +short panel.example.com</Code> dari luar
        menjawab IP itu — sertifikat baru bisa terbit setelah DNS benar.
      </P>

      <H2 id="dashboard">Lewat dashboard atau CLI (tanpa SSH)</H2>
      <P>
        Cara tercepat: isi <Code>INSTALL_DIR</Code> sekali di <Code>.env.dist</Code>{" "}
        (path absolut folder yang berisi <Code>docker-compose.dist.yml</Code> di
        server ini), lalu domain bisa diganti kapan saja tanpa SSH. Proxy
        (Traefik) tetap harus sudah di-provision lewat Settings terlebih dahulu
        — lihat <DocLink href="/docs/domain">Proxy &amp; domain</DocLink>.
      </P>
      <Steps>
        <Step title="Isi INSTALL_DIR lalu restart stack">
          <Pre title=".env.dist">{`INSTALL_DIR=/opt/aoox   # path absolut folder docker-compose.dist.yml di host ini`}</Pre>
          <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
        </Step>
        <Step title="Settings → Domain panel (owner)">
          <P>
            Isi domain dashboard, domain API, dan email ACME, lalu{" "}
            <strong>Simpan &amp; terapkan</strong>. Panel menulis{" "}
            <Code>docker-compose.override.yml</Code> lewat container helper dan
            menjalankan ulang <Code>docker compose up -d</Code> — koneksi ke
            dashboard sempat terputus beberapa detik saat container{" "}
            <Code>web</Code>/<Code>api</Code> di-recreate, itu wajar.
          </P>
        </Step>
        <Step title="Atau dari CLI">
          <Pre>{`aoox domain set --web panel.example.com --api api.panel.example.com \\
  --acme-email kamu@example.com`}</Pre>
          <P>Memanggil endpoint yang sama, untuk operator yang lebih suka terminal.</P>
        </Step>
      </Steps>
      <Callout>
        Karena file yang ditulis bernama <Code>docker-compose.override.yml</Code>{" "}
        (bukan <Code>docker-compose.domain.yml</Code>), Compose otomatis
        menyertakannya di setiap <Code>up</Code> berikutnya — beda dari cara
        manual di bawah yang mengharuskan flag <Code>-f</Code> disebut setiap kali.
      </Callout>

      <H2 id="langkah">Manual lewat SSH</H2>
      <P>
        Alternatif bila <Code>INSTALL_DIR</Code> belum/tidak ingin diisi, atau
        ingin kendali penuh atas file compose.
      </P>
      <Steps>
        <Step title="Isi variabel domain di .env.dist">
          <Pre title=".env.dist">{`WEB_DOMAIN=panel.example.com
API_DOMAIN=api.panel.example.com
PROXY_ACME_EMAIL=kamu@example.com
PROXY_ACME_STAGING=false          # true saat uji coba

# ganti keduanya ke https + domain di atas
WEB_ORIGIN=https://panel.example.com
PUBLIC_API_URL=https://api.panel.example.com`}</Pre>
          <Table
            head={["Variabel", "Kenapa"]}
            rows={[
              [<><Code>WEB_DOMAIN</Code> / <Code>API_DOMAIN</Code></>, "Host untuk label Traefik di service web dan api."],
              [<Code key="o">WEB_ORIGIN</Code>, "Harus sama persis dengan URL di browser: cookie sesi mendapat flag Secure mengikutinya, dan gateway terminal/log menolak Origin lain."],
              [<Code key="p">PUBLIC_API_URL</Code>, "URL API yang dipanggil browser dan provider webhook."],
              [<Code key="e">PROXY_ACME_EMAIL</Code>, "Mengaktifkan resolver Let's Encrypt; tanpa ini tidak ada HTTPS dan tidak ada redirect."],
            ]}
          />
        </Step>

        <Step title="Jalankan ulang dengan override domain">
          <Pre>{`docker compose -f docker-compose.dist.yml -f docker-compose.domain.yml --env-file .env.dist up -d`}</Pre>
          <P>
            <Code>docker-compose.domain.yml</Code> memasang label Traefik ke
            service <Code>web</Code> dan <Code>api</Code> (router{" "}
            <Code>aoox-web</Code> / <Code>aoox-api</Code> + varian{" "}
            <Code>-secure</Code>, bentuk yang sama dengan domain aplikasi) dan
            memasukkannya ke network <Code>aoox</Code>. Compose menolak
            start bila <Code>WEB_DOMAIN</Code>/<Code>API_DOMAIN</Code> kosong.
          </P>
          <Callout>
            Mulai sekarang <strong>selalu sertakan kedua file</strong> <Code>-f</Code>{" "}
            pada setiap <Code>up</Code>/<Code>pull</Code>. Menjalankan tanpa
            override akan mencabut label dan domain berhenti dilayani.
          </Callout>
        </Step>

        <Step title="Provision reverse proxy (bila belum)">
          <P>
            Login (masih via IP:3000 bila perlu) → <strong>Settings → Reverse
            proxy (Traefik)</strong> → provision (owner). Proxy yang sudah ada
            tapi di-provision <em>tanpa</em> <Code>PROXY_ACME_EMAIL</Code> harus
            dihapus dan di-provision lagi agar resolver ACME aktif.
          </P>
        </Step>

        <Step title="Buka https://panel.example.com">
          <P>
            Sertifikat diminta saat host pertama kali diakses (± beberapa
            detik). Login ulang — sesi lama (cookie tanpa Secure di origin IP)
            tidak berlaku di origin baru.
          </P>
        </Step>
      </Steps>

      <H2 id="verifikasi">Verifikasi</H2>
      <Pre>{`curl -I https://panel.example.com          # 200, issuer Let's Encrypt
curl -I http://panel.example.com           # 301 → https
curl -s https://api.panel.example.com/auth/setup-status   # {"needsSetup":false}`}</Pre>
      <Ul>
        <li>Terminal web bisa dibuka tanpa pesan <em>origin not allowed</em>.</li>
        <li>
          Log realtime di tab Deploy mengalir (Socket.IO ke <Code>PUBLIC_API_URL</Code>).
        </li>
        <li>
          Webhook URL di tab Webhook aplikasi kini berawalan{" "}
          <Code>https://api.panel.example.com/webhooks/…</Code>.
        </li>
      </Ul>

      <H2 id="variasi">Variasi</H2>
      <H3>Uji coba dulu dengan staging</H3>
      <P>
        <Code>PROXY_ACME_STAGING=true</Code> memakai CA staging Let&apos;s Encrypt
        (tanpa rate limit; sertifikat tidak dipercaya browser). Setelah yakin
        DNS dan port benar, ganti ke <Code>false</Code>, hapus proxy, provision
        lagi — volume ACME akan meminta sertifikat produksi.
      </P>
      <H3>Di belakang Cloudflare</H3>
      <Ul>
        <li>Mode SSL <strong>Full (strict)</strong>; Flexible menyebabkan redirect loop.</li>
        <li>Saat pertama menerbitkan sertifikat, set kedua record ke <em>DNS only</em>.</li>
        <li>
          WebSocket (terminal, log) didukung Cloudflare; pastikan tidak
          diblokir oleh aturan.
        </li>
      </Ul>
      <H3>Reverse proxy sendiri (nginx/Caddy di depan)</H3>
      <P>
        Tidak perlu <Code>docker-compose.domain.yml</Code>: arahkan proxy-mu ke{" "}
        <Code>:3000</Code> dan <Code>:3001</Code>, aktifkan WebSocket upgrade,
        dan tetap set <Code>WEB_ORIGIN</Code>/<Code>PUBLIC_API_URL</Code> ke URL
        publik https. Bila TLS di-terminate di proxy-mu dan ke aoox lewat
        http, set <Code>COOKIE_SECURE=true</Code> agar cookie tetap Secure.
      </P>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["set WEB_DOMAIN in .env.dist saat up", "Variabel kosong; compose menolak start."],
          ["Domain jalan, lalu hilang setelah update", "up -d tanpa -f docker-compose.domain.yml. Selalu sertakan kedua file."],
          ["Login berhasil tapi langsung logout / 401", "WEB_ORIGIN masih http atau beda host — cookie Secure/origin tidak cocok. Samakan, up -d, login ulang."],
          ["Terminal: origin not allowed", "Sama seperti di atas: WEB_ORIGIN ≠ URL browser."],
          ["Sertifikat default Traefik", "PROXY_ACME_EMAIL kosong saat provision, DNS belum benar, atau port 80 tertutup. Hapus proxy → provision lagi setelah diperbaiki."],
          ["Log/terminal tidak mengalir, halaman lain normal", "PUBLIC_API_URL tidak bisa dijangkau dari browser (WebSocket diblokir oleh proxy di depan)."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Satu hostname untuk web+API (path-based); sertifikat wildcard;
        validasi DNS sebelum menerapkan (beda dari domain aplikasi yang punya
        cek DNS tersendiri); rollback otomatis kalau <Code>docker compose up</Code>{" "}
        gagal setelah domain diganti.
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
