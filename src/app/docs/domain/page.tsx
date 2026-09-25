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

export const metadata: Metadata = { title: "Proxy & domain" }

const SUMMARY = [
  { k: "Proxy", v: "Traefik v3, container aoox-proxy" },
  { k: "HTTPS", v: "Let's Encrypt HTTP-01, otomatis per host" },
  { k: "Lingkup", v: "Host aoox dan tiap server remote" },
]

const REQUEST_FLOW = [
  { s: "browser", d: "https://app.example.com" },
  { s: "DNS", d: "A record → IP server" },
  { s: "Traefik :443", d: "router <app>-secure, sertifikat ACME" },
  { s: "container", d: "network aoox → :<port container>" },
]

const ROUTERS = [
  { name: "<app>", entry: "web (:80)", when: "Selalu", does: "Melayani http untuk host tanpa HTTPS" },
  { name: "<app>-secure", entry: "websecure (:443)", when: "HTTPS aktif", does: "TLS via certresolver le" },
  { name: "<app>-redirect", entry: "web (:80)", when: "HTTPS aktif + ACME terpasang", does: "301 http → https" },
]

const NEXT = [
  { title: "Domain untuk panel", description: "Dashboard & API di domain sendiri.", href: "/docs/domain-panel" },
  { title: "Deploy & rollback", description: "Blue/green membutuhkan domain tanpa port host.", href: "/docs/deploy#blue-green" },
  { title: "Preview pull request", description: "Subdomain wildcard per PR.", href: "/docs/preview" },
  { title: "Stack compose", description: "Domain per service.", href: "/docs/compose#domain" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/domain"
      title="Proxy & domain"
      description="Mengaktifkan reverse proxy Traefik, mengarahkan domain ke aplikasi, HTTPS otomatis dari Let's Encrypt, dan memeriksa DNS."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="alur">Alur satu request</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {REQUEST_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Traefik memakai <em>docker provider</em>: ia membaca label pada
        container aplikasi dan hanya mengekspos yang berlabel
        (<Code>exposedbydefault=false</Code>). Tidak ada file konfigurasi yang
        perlu diedit — aoox menulis label saat container dibuat.
      </P>

      <H2 id="proxy">Provision reverse proxy</H2>
      <P>
        Traefik berjalan per <em>daemon</em>: satu di host aoox, dan
        opsional satu di tiap <DocLink href="/docs/server-remote#proxy">server
        remote</DocLink> dengan port dan email ACME sendiri. Langkah di bawah
        untuk host.
      </P>
      <Steps>
        <Step title="Pastikan port 80/443 di host kosong">
          <Pre>{`ss -ltnp | grep -E ':80 |:443 '   # harus kosong`}</Pre>
          <P>
            Port bisa diubah lewat <Code>PROXY_HTTP_PORT</Code> /{" "}
            <Code>PROXY_HTTPS_PORT</Code> di <Code>.env.dist</Code>, tapi
            Let&apos;s Encrypt HTTP-01 <strong>membutuhkan port 80</strong> dan
            browser mengharapkan 443.
          </P>
        </Step>
        <Step title="Isi PROXY_ACME_EMAIL (untuk HTTPS)">
          <Pre title=".env.dist">{`PROXY_ACME_EMAIL=kamu@example.com
PROXY_ACME_STAGING=false     # true saat uji coba, agar tidak kena rate limit`}</Pre>
          <P>
            Tanpa email, Traefik berjalan tanpa resolver ACME: domain hanya
            dilayani lewat http dan toggle HTTPS di UI nonaktif. Mengubah nilai
            ini setelah provision → hapus proxy lalu provision lagi.
          </P>
        </Step>
        <Step title="Settings → Reverse proxy (Traefik) → provision (owner)">
          <P>
            Container <Code>aoox-proxy</Code> dibuat di network{" "}
            <Code>aoox</Code> dengan volume <Code>aoox_proxy_acme</Code>{" "}
            untuk sertifikat. Kartu menampilkan status <em>Running</em> dan
            apakah ACME aktif.
          </P>
        </Step>
      </Steps>

      <H2 id="domain">Menambah domain ke aplikasi</H2>
      <Steps>
        <Step title="Arahkan DNS">
          <Pre title="DNS">{`app.example.com.   A      203.0.113.10
# atau
app.example.com.   CNAME  server.example.com.`}</Pre>
          <P>
            DNS boleh diatur belakangan — aoox tidak memblokir. Tapi
            sertifikat baru bisa terbit setelah DNS benar.
          </P>
        </Step>
        <Step title="Halaman aplikasi → tab Domain → tambah">
          <P>
            Isi <strong>Hostname</strong> (<Code>app.example.com</Code>, tanpa
            skema/path) dan nyalakan <strong>HTTPS</strong> bila proxy punya
            ACME. Container dibuat ulang dengan label Traefik baru — tanpa
            build. Satu aplikasi boleh punya beberapa hostname.
          </P>
        </Step>
        <Step title="Kosongkan Port host (disarankan)">
          <P>
            Dengan domain, port host tidak diperlukan; mengosongkannya
            mengaktifkan <DocLink href="/docs/deploy#blue-green">blue/green</DocLink>{" "}
            dan menutup akses langsung lewat IP:port.
          </P>
        </Step>
        <Step title="Cek DNS">
          <P>
            Tombol cek DNS di baris domain membandingkan hasil resolve dengan
            IP yang diharapkan — <Code>PUBLIC_IP</Code> bila diset, auto-deteksi
            via ipify (cache 10 menit), atau host server remote:
          </P>
          <Table
            head={["Badge", "Arti", "Tindakan"]}
            rows={[
              [<Code key="1">ok</Code>, "Mengarah ke server ini.", "—"],
              [<Code key="2">salah arah</Code>, "Resolve ke IP lain.", "Perbaiki record A/CNAME; tunggu TTL."],
              [<Code key="3">belum ada</Code>, "Belum ada record.", "Buat record di DNS provider."],
              [<Code key="4">?</Code>, "IP publik server tidak diketahui.", <>Set <Code>PUBLIC_IP</Code> di <Code>.env.dist</Code> (server di belakang NAT/Cloudflare).</>],
            ]}
          />
        </Step>
      </Steps>

      <H2 id="https">Bagaimana HTTPS bekerja</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Router</th>
              <th className="px-3 py-2 text-left font-medium">Entrypoint</th>
              <th className="px-3 py-2 text-left font-medium">Dibuat bila</th>
              <th className="px-3 py-2 text-left font-medium">Fungsi</th>
            </tr>
          </thead>
          <tbody>
            {ROUTERS.map((r) => (
              <tr key={r.name} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{r.name}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{r.entry}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.when}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Ul>
        <li>
          Sertifikat diminta via <strong>HTTP-01</strong> saat host pertama
          kali diakses; Let&apos;s Encrypt harus bisa mencapai port 80 server
          dari internet. Perpanjangan otomatis oleh Traefik.
        </li>
        <li>
          Redirect http → https hanya dibuat bila ACME aktif, supaya tanpa{" "}
          <Code>PROXY_ACME_EMAIL</Code> (dev) host tetap bisa diakses http,
          bukan diarahkan ke sertifikat self-signed Traefik.
        </li>
        <li>
          Container yang menjadi <Code>unhealthy</Code> otomatis dilepas dari
          router (404) — itulah gunanya health check.
        </li>
      </Ul>

      <H3>Di belakang Cloudflare</H3>
      <Ul>
        <li>
          Cek DNS menampilkan <em>salah arah</em> karena hostname resolve ke IP
          Cloudflare — abaikan bila memang proxied. Saat pertama kali
          menerbitkan sertifikat, set record ke <em>DNS only</em> dulu agar
          HTTP-01 mencapai server, lalu aktifkan proxy lagi.
        </li>
        <li>
          Mode SSL Cloudflare harus <strong>Full (strict)</strong> agar origin
          dilayani lewat HTTPS Traefik; mode Flexible menyebabkan redirect loop
          dengan router <Code>-redirect</Code>.
        </li>
      </Ul>

      <H2 id="operasi">Operasi</H2>
      <Table
        head={["Aksi", "Efek"]}
        rows={[
          ["Hapus domain", "Container dibuat ulang tanpa label host itu; sertifikat tetap di volume ACME."],
          ["Toggle HTTPS", "Container dibuat ulang; router -secure/-redirect ditambah/dihapus."],
          ["Hapus proxy (owner)", "Semua domain berhenti dilayani; container aplikasi tidak disentuh. Volume ACME ditanyakan."],
          ["Ganti PROXY_ACME_EMAIL / port", "Ubah .env.dist → hapus proxy → provision lagi."],
        ]}
      />

      <H2 id="catatan">Catatan</H2>
      <Ul>
        <li>
          Aplikasi di <strong>server remote</strong> memakai proxy milik server
          itu sendiri: provision dari kartu server (port + email ACME), lalu
          arahkan DNS ke IP server tersebut — lihat{" "}
          <DocLink href="/docs/server-remote#proxy">Server remote</DocLink>.
          Tanpa proxy di sana, pakai port host.
        </li>
        <li>
          Stack compose memakai domain per service — lihat{" "}
          <DocLink href="/docs/compose#domain">Stack compose</DocLink>. File
          compose juga boleh membawa label <Code>traefik.*</Code> sendiri
          asalkan bergabung ke network <Code>aoox</Code>.
        </li>
        <li>
          Domain untuk panel aoox sendiri diatur lewat env, bukan tab
          Domain — lihat <DocLink href="/docs/domain-panel">Domain untuk panel</DocLink>.
        </li>
        <li>
          Dev lokal memakai port 8088/8443 (80 sering terpakai); produksi
          80/443. Jangan campur nilai antar lingkungan.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Tab Domain: Proxy belum berjalan", "Provision di Settings dulu."],
          ["Toggle HTTPS nonaktif", <><Code>PROXY_ACME_EMAIL</Code> kosong saat provision. Isi, hapus proxy, provision lagi.</>],
          ["404 page not found dari Traefik", "Container belum healthy, atau domain ditambahkan tapi container belum dibuat ulang (cek log deploy)."],
          ["Sertifikat self-signed / TRAEFIK DEFAULT CERT", "ACME gagal: DNS belum benar, port 80 tertutup, atau rate limit. Lihat log container aoox-proxy di terminal; uji dengan PROXY_ACME_STAGING=true."],
          ["Redirect loop", "Cloudflare mode Flexible, atau reverse proxy lain di depan yang men-terminate TLS. Pakai Full (strict) atau matikan HTTPS di aoox."],
          ["Bekerja via IP:port tapi tidak via domain", "Port host masih terisi tidak masalah — cek DNS dan bahwa proxy Running."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Cek DNS berkala/otomatis; sertifikat wildcard (DNS-01); redirect
        www ↔ apex; path/prefix routing; basic auth per domain. Sertifikat
        yang gagal terbit kini dilaporkan lewat{" "}
        <DocLink href="/docs/notifikasi">notifikasi</DocLink>.
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
