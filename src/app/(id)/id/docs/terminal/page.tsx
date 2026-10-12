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
  path: "/id/docs/terminal",
  lang: "id",
  title: "Web terminal",
  description:
    "Shell ke host atau server remote dari browser.",
})

const SUMMARY = [
  { k: "Siapa", v: "Owner & admin saja" },
  { k: "Ke mana", v: "Host aoox (SSH) atau server remote" },
  { k: "Klien", v: <>xterm.js di browser<PathArrow />Socket.IO<PathArrow />SSH</> },
]

const FLOW = [
  { s: "tiket", d: "browser minta tiket JWT 60 detik, sekali pakai, scope terminal" },
  { s: "socket", d: "Socket.IO /terminal dengan tiket + ukuran kolom/baris" },
  { s: "ssh", d: "API membuka sesi SSH ke target memakai key platform" },
  { s: "shell", d: "input/output diteruskan; resize mengikuti jendela" },
]

const NEXT = [
  { title: "Server remote", description: "Target terminal selain host.", href: "/id/docs/server-remote" },
  { title: "Pengguna & peran", description: "Kenapa member tidak punya terminal.", href: "/id/docs/pengguna-peran" },
  { title: "Domain untuk panel", description: "WEB_ORIGIN yang benar untuk terminal.", href: "/id/docs/domain-panel" },
  { title: "Troubleshooting", description: "origin not allowed dan kawan-kawannya.", href: "/id/docs/troubleshooting" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/terminal"
      title="Web terminal"
      description="Shell ke host aoox (atau server remote) langsung dari browser, untuk owner dan admin."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="cara-kerja">Cara kerja</H2>
      <P>
        Container tidak bisa membuka shell di host-nya sendiri, jadi API
        terhubung ke host lewat <strong>SSH</strong>. Browser
        tidak pernah memegang kredensial SSH:
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4 rounded-lg overflow-hidden">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Table
        head={["Mode", "Kapan", "Shell yang didapat"]}
        rows={[
          [
            <strong key="s">SSH ke host</strong>,
            <><Code>TERMINAL_SSH_HOST</Code> terisi (default <Code>host.docker.internal</Code>)</>,
            "Shell user SSH di host — yang biasanya kamu mau.",
          ],
          [
            <strong key="l">Lokal</strong>,
            <><Code>TERMINAL_SSH_HOST</Code> kosong</>,
            "Shell di dalam container API (bash sebagai user node) — hanya untuk debug API.",
          ],
        ]}
      />

      <H2 id="setup">Menyiapkan SSH ke host</H2>
      <Steps>
        <Step title="Aktifkan SSH server di host">
          <Pre title="Linux">{`sudo apt install openssh-server && sudo systemctl enable --now ssh`}</Pre>
          <P>
            Windows (dev): fitur opsional <em>OpenSSH Server</em>. Compose
            distribusi sudah memetakan <Code>host.docker.internal</Code> ke
            gateway host di Linux.
          </P>
        </Step>
        <Step title="Isi env terminal di .env.dist">
          <Pre title=".env.dist">{`TERMINAL_SSH_HOST=host.docker.internal
TERMINAL_SSH_PORT=22
TERMINAL_SSH_USER=deploy        # user host yang dipakai terminal`}</Pre>
          <P>
            Jalankan <Code>up -d</Code> lagi setelah mengubah env. Bila{" "}
            <Code>TERMINAL_SSH_USER</Code> kosong, terminal masuk sebagai{" "}
            <Code>root</Code> (default instalasi lama) — kartu Terminal
            menandainya sebagai user default. Instalasi baru lewat{" "}
            <Code>sudo aoox install</Code> atau skrip satu-perintah (
            <Code>curl … | sudo sh</Code>) mengisinya otomatis dengan nama user
            yang menjalankan <Code>sudo</Code> (bila berupa nama login polos
            dan bukan <Code>root</Code>; selain itu <Code>root</Code>; flag{" "}
            <Code>--terminal-ssh-user</Code> atau env{" "}
            <Code>TERMINAL_SSH_USER</Code> yang eksplisit selalu menang);
            instalasi lama tidak berubah
            (ubah lewat Environment, lihat{" "}
            <DocLink href="#user-ssh">User SSH di VPS cloud</DocLink>). Kalau
            koneksi gagal, terminal menampilkan
            tautan ke <strong>Infrastruktur<PathArrow />Environment</strong> untuk
            memperbaiki pengaturannya.
          </P>
        </Step>
        <Step title="Otorisasi key platform">
          <P>
            <strong>Instalasi baru</strong> melakukannya sendiri:{" "}
            <Code>sudo aoox install</Code> dan skrip satu-perintah membuat key
            di <Code>secrets/</Code> lalu menambahkannya ke{" "}
            <Code>~/.ssh/authorized_keys</Code> user terminal. Untuk{" "}
            <strong>instalasi yang sudah ada</strong>, owner cukup klik{" "}
            <strong>Otorisasi otomatis</strong> di Infrastruktur
            <PathArrow />Terminal (atau di notifikasi galat halaman Terminal);
            aoox menambahkan public key ke <Code>authorized_keys</Code> user itu,
            menguji login, dan menyambung ulang. Tidak ada password atau private
            key yang ditulis. Perintah manual di bawah tetap tampil sebagai
            cadangan.
          </P>
          <P>
            API membuat keypair ed25519 di <Code>./secrets</Code> saat pertama
            dibutuhkan. <strong>Settings<PathArrow />Terminal</strong> menampilkan public
            key dan perintah untuk dijalankan <strong>sekali</strong> di host
            sebagai <Code>TERMINAL_SSH_USER</Code>:
          </P>
          <Pre>{`mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
echo 'ssh-ed25519 AAAA… aoox' >> ~/.ssh/authorized_keys`}</Pre>
          <P>Key yang sama dipakai untuk server remote — otorisasi sekali per host.</P>
        </Step>
        <Step title="Buka menu Terminal">
          <P>
            Pilih target (<strong>Host aoox</strong> / server remote) dan
            mulai mengetik. Ukuran terminal mengikuti jendela browser; sesi
            ditutup saat tab ditutup atau koneksi putus.
          </P>
        </Step>
      </Steps>

      <H2 id="user-ssh">User SSH di VPS cloud</H2>
      <P>
        Terminal masuk ke host sebagai user di kolom <strong>User</strong>{" "}
        (<Code>TERMINAL_SSH_USER</Code>), dan perintah otorisasi key harus
        dijalankan di host <strong>sebagai user yang sama</strong>. Di VPS cloud
        (Ubuntu, Tencent, dan sejenisnya) login <Code>root</Code> biasanya
        dimatikan di sshd (<Code>PermitRootLogin no</Code> atau hanya lewat key
        provider), jadi default <Code>root</Code> sering ditolak.
      </P>
      <Steps>
        <Step title="Isi User dengan user login VPS">
          <P>
            Buka <strong>Infrastruktur<PathArrow />Environment</strong> (owner),
            isi <strong>User</strong> dengan user yang kamu pakai untuk SSH ke
            VPS — di Ubuntu biasanya <Code>ubuntu</Code> — lalu simpan. Panel
            memulai ulang kontainer API beberapa detik.
          </P>
        </Step>
        <Step title="Otorisasi key sebagai user itu">
          <P>
            Di VPS, login sebagai user yang sama dan jalankan perintah otorisasi
            dari <strong>Infrastruktur<PathArrow />Akses terminal</strong> (tiga baris
            di atas). Perintah itu menulis ke <Code>~/.ssh/authorized_keys</Code>{" "}
            milik user yang sedang menjalankannya, jadi jangan dijalankan
            dengan <Code>sudo</Code>.
          </P>
        </Step>
        <Step title="Sambung ulang">
          <P>Klik <strong>Sambung ulang</strong> di menu Terminal.</P>
        </Step>
      </Steps>

      <H3>Batas otorisasi otomatis</H3>
      <Ul>
        <li>Hanya untuk <strong>host aoox</strong> dengan key platform. <strong>Server remote</strong> tetap manual (perintah otorisasi di halaman Server remote), begitu juga bila memakai key atau password sendiri.</li>
        <li>Hanya owner yang melihat tombolnya (admin tetap bisa memakai perintah manual).</li>
        <li>Key ditulis ke <Code>~/.ssh/authorized_keys</Code> user terminal. Kalau sshd memakai <Code>AuthorizedKeysFile</Code> di lokasi lain, key tidak akan dibaca: aoox melaporkan bahwa uji koneksi gagal, dan kamu perlu memasang key di lokasi itu.</li>
        <li>SELinux (mis. RHEL/Rocky) bisa menolak sshd membaca berkas yang baru ditulis; perbaiki konteksnya dengan <Code>restorecon -R ~/.ssh</Code> di host.</li>
        <li>Bila <Code>~/.ssh</Code> atau <Code>authorized_keys</Code> berupa symlink, aoox menolak mengikutinya dan meminta otorisasi manual.</li>
        <li>Bila Docker memakai bridge/gateway kustom (bukan alamat default seperti <Code>host.docker.internal</Code> atau <Code>172.17.0.1</Code>), tombol tidak muncul; gunakan perintah manual.</li>
        <li>Instalasi baru bisa melewatkan langkah otomatis dengan <Code>--no-terminal-authorize</Code> (CLI) atau <Code>AOOX_NO_TERMINAL_AUTHORIZE=1</Code> (skrip satu-perintah).</li>
      </Ul>

      <H3>Kredensial alternatif</H3>
      <Table
        head={["Env", "Kapan dipakai", "Catatan"]}
        rows={[
          [<Code key="1">TERMINAL_SSH_PRIVATE_KEY_FILE</Code>, "Bawa key sendiri", <>Path di container API (mount ke <Code>/run/secrets/…</Code>); <Code>TERMINAL_SSH_PASSPHRASE</Code> bila terenkripsi.</>],
          [<Code key="2">TERMINAL_SSH_PRIVATE_KEY</Code>, "Key inline di env", "Kurang praktis; hindari di file yang di-commit."],
          [<Code key="3">TERMINAL_SSH_PASSWORD</Code>, "Password SSH", "Kurang aman — hanya untuk uji cepat."],
        ]}
      />
      <P>Prioritas: key eksplisit<PathArrow />password<PathArrow />key platform (default).</P>

      <H2 id="pakai">Tips pemakaian</H2>
      <Ul>
        <li>
          Semua container aoox terlihat dari host:{" "}
          <Code>docker ps --filter label=com.docker.compose.project=aoox</Code>.
        </li>
        <li>
          Masuk ke container aplikasi: <Code>docker exec -it aoox-app-&lt;slug&gt; sh</Code>.
          Untuk perintah rutin, lebih rapi pakai <DocLink href="/id/docs/jobs">job</DocLink>.
        </li>
        <li>
          Log proxy saat sertifikat bermasalah:{" "}
          <Code>docker logs -f aoox-proxy</Code>.
        </li>
        <li>
          Tempel dengan <Code>Ctrl+Shift+V</Code> (Linux/Windows) atau{" "}
          <Code>Cmd+V</Code> (macOS); <Code>Ctrl+C</Code> diteruskan ke shell,
          bukan menyalin.
        </li>
      </Ul>

      <H2 id="masalah">Bila gagal</H2>
      <Table
        head={["Pesan", "Penyebab & solusi"]}
        rows={[
          ["auth failed + perintah otorisasi", "Key belum ada di authorized_keys user itu. Jalankan perintah yang ditampilkan di terminal/Settings."],
          [<>SSH authentication failed for root@host.docker.internal</>, <>Terminal mencoba masuk sebagai <Code>root</Code>, padahal login VPS-mu user lain dan sshd biasanya menolak root. Owner bisa mencoba tombol <strong>Otorisasi otomatis</strong> setelah User di Environment benar. Periksa: (1) kolom User di Infrastruktur<PathArrow />Environment sama dengan user login VPS (mis. <Code>ubuntu</Code>); (2) key platform ada di <Code>~/.ssh/authorized_keys</Code> <em>user itu</em> (bukan root); (3) kalau tetap ingin root, <Code>PermitRootLogin</Code> di <Code>/etc/ssh/sshd_config</Code> mengizinkan login key (<Code>prohibit-password</Code> atau <Code>yes</Code>), lalu <Code>sudo systemctl reload ssh</Code>.</>],
          ["Otorisasi otomatis: \"…but the connection test failed\"", <>Key sudah ditulis, tetapi login uji masih ditolak: sshd memakai <Code>AuthorizedKeysFile</Code> di tempat lain, SELinux memblokir, atau login key dimatikan (<Code>PubkeyAuthentication no</Code>). Periksa <Code>/etc/ssh/sshd_config</Code>, lalu <Code>restorecon -R ~/.ssh</Code> bila SELinux aktif; perintah manual tetap tersedia.</>],
          ["origin not allowed", <><Code>WEB_ORIGIN</Code> tidak sama persis dengan URL di browser (skema/host/port). Samakan, <Code>up -d</Code> ulang.</>],
          ["connect ECONNREFUSED / timeout", "sshd tidak jalan, port salah, atau host.docker.internal tidak resolve (Linux tanpa extra_hosts — pakai IP gateway docker0, mis. 172.17.0.1)."],
          ["Direktori key tidak writable (uid 1000)", <>Perbaiki kepemilikan folder <Code>./secrets</Code>: <Code>sudo chown -R 1000:1000 ./secrets</Code>.</>],
          ["403 saat membuka terminal", "Peran member. Hanya owner/admin."],
        ]}
      />

      <Callout kind="warn" title="Ini setara shell di host">
        Hanya <strong>owner</strong> dan <strong>admin</strong> yang bisa
        membuat tiket terminal; dicek lagi di gateway. Tiket berumur 60 detik
        dan sekali pakai; gateway menolak <Code>Origin</Code> selain{" "}
        <Code>WEB_ORIGIN</Code>. Fitur ini dimaksudkan untuk lingkungan
        dev/self-hosted yang dipercaya — host key SSH belum diverifikasi.
        Pembukaan sesi (pembuatan tiket) tercatat di audit log; perintah yang
        diketik tidak.
      </Callout>

      <H2 id="berikutnya">Langkah berikutnya</H2>
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
