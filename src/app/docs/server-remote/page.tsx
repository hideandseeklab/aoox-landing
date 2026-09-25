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

export const metadata: Metadata = { title: "Server remote" }

const SUMMARY = [
  { k: "Transport", v: "SSH → docker system dial-stdio" },
  { k: "Butuh di server", v: "sshd + Docker CLI, tanpa agen" },
  { k: "Siapa", v: "Owner/admin mendaftarkan; semua bisa memilih" },
]

const FLOW = [
  { s: "ssh", d: "satu sesi ssh2 dari API ke server (lazy, reconnect)" },
  { s: "dial-stdio", d: "tiap request Docker API dieksekusi lewat docker system dial-stdio" },
  { s: "build", d: "daemon server meng-clone & membangun image" },
  { s: "run", d: "container berjalan di server; log mengalir lewat tunnel yang sama" },
]

const NEXT = [
  { title: "Web terminal", description: "Shell ke server remote dari browser.", href: "/docs/terminal" },
  { title: "Membuat aplikasi", description: "Select Server di form aplikasi.", href: "/docs/aplikasi" },
  { title: "Managed database", description: "Menghubungkan app remote ke DB di host.", href: "/docs/database#koneksi" },
  { title: "Proxy & domain", description: "Kenapa domain tidak berlaku di server remote.", href: "/docs/domain#catatan" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/server-remote"
      title="Server remote"
      description="Menghubungkan server lain lewat SSH sebagai target deploy tambahan — tanpa agen, cukup docker CLI di server tujuan."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Kapan memakai server remote?</H2>
      <Ul>
        <li>Aplikasi berat yang tidak muat di host aoox.</li>
        <li>Memisahkan beban: panel + database di satu VPS, aplikasi di VPS lain.</li>
        <li>Region/lokasi berbeda untuk latensi.</li>
      </Ul>
      <P>
        Satu instance aoox tetap satu panel; server remote hanya
        menambah <em>tempat</em> container berjalan.
      </P>

      <H2 id="prasyarat">Prasyarat di server tujuan</H2>
      <Ul>
        <li>SSH server berjalan dan bisa dijangkau dari host aoox (port 22 atau lainnya).</li>
        <li>
          <strong>Docker terpasang</strong> dan user SSH boleh memakainya:
        </li>
      </Ul>
      <Pre title="Di server tujuan">{`curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy      # bila bukan root
docker system dial-stdio --help     # harus ada (Docker 20.10+)`}</Pre>
      <Ul>
        <li>
          Hanya CLI + daemon — <strong>tidak perlu port forwarding SSH</strong>.
          sshd yang di-hardening dengan <Code>AllowTcpForwarding no</Code> tetap
          bekerja.
        </li>
        <li>Tidak perlu membuka port Docker (2375/2376) ke jaringan.</li>
        <li>
          Untuk domain langsung di server itu: port 80/443 bebas (lihat{" "}
          <DocLink href="/docs/server-remote#proxy">proxy per server</DocLink>).
        </li>
      </Ul>

      <H2 id="cara-kerja">Cara kerja</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Ini cara yang sama dengan <Code>docker -H ssh://user@host</Code>: API
        berbicara ke daemon remote seolah lokal, lewat stdio proses{" "}
        <Code>docker</Code> di server. Satu sesi SSH per server di-cache dan
        disambung ulang bila putus.
      </P>

      <H2 id="langkah">Menambahkan server</H2>
      <Steps>
        <Step title="Settings → Server remote → Server remote baru (owner/admin)">
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              ["Nama", "Label, mis. app-sg-1."],
              ["Host / Port / Username", <>Alamat SSH, mis. <Code>203.0.113.10</Code>, <Code>22</Code>, <Code>root</Code> atau user yang ada di grup docker.</>],
              [
                "Private key (opsional)",
                "Kosongkan untuk memakai key platform aoox (disarankan). Isi PEM/OpenSSH bila mau key sendiri — disimpan terenkripsi, tidak ditampilkan lagi.",
              ],
            ]}
          />
        </Step>
        <Step title="Otorisasi key platform (bila tanpa key sendiri)">
          <P>
            Kartu Server remote menampilkan public key platform dan perintah
            yang harus dijalankan <strong>sekali</strong> di server tujuan
            sebagai user SSH itu — aoox tidak bisa menulis{" "}
            <Code>authorized_keys</Code> host lain:
          </P>
          <Pre>{`mkdir -p ~/.ssh && chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
echo 'ssh-ed25519 AAAA… aoox' >> ~/.ssh/authorized_keys`}</Pre>
          <P>
            Key platform dibuat otomatis (ed25519) saat pertama dibutuhkan dan
            disimpan di <Code>./secrets</Code> di host aoox — satu key
            untuk semua server dan terminal.
          </P>
        </Step>
        <Step title="Tes koneksi">
          <P>Tombol tes membuka shell singkat lalu mengecek Docker lewat tunnel. Hasilnya:</P>
          <Table
            head={["Hasil", "Arti"]}
            rows={[
              ["OK + versi Docker", "Siap dipakai."],
              ["Auth ditolak + perintah otorisasi", "Key belum ada di authorized_keys — jalankan perintah yang ditampilkan."],
              ["Terhubung, Docker error", "docker tidak ada di PATH user itu, user tidak di grup docker, atau daemon mati."],
            ]}
          />
        </Step>
      </Steps>

      <H2 id="deploy">Deploy ke server remote</H2>
      <P>
        Di form aplikasi pilih <strong>Server</strong> → server tujuan (select
        hanya tampil bila ada server terdaftar; member melihat daftar kosong
        karena endpoint server dibatasi owner/admin). Aplikasi menampilkan
        badge nama server.
      </P>
      <Table
        head={["Aspek", "Server remote"]}
        rows={[
          ["Build", "Di daemon server tujuan — Dockerfile, Nixpacks, situs statis (helper image dibangun di sana)."],
          ["Registry", <><strong>Tanpa push</strong>. Image tersimpan di server dengan ref <Code>{"aoox/<project>/<app>:<tag>"}</Code>; rollback memakai yang masih ada di sana.</>],
          ["Domain / Traefik", <><strong>Ya</strong> — provision proxy di server itu (kartu <em>Proxy (Traefik) di server ini</em>), lalu tambahkan domain seperti biasa. Alternatifnya tetap bisa pakai <strong>Port host</strong>.</>],
          ["Blue/green", "Ya bila server punya proxy dan aplikasi tanpa port host; tanpa proxy → replace biasa."],
          ["Log container", "Ada (realtime, lewat tunnel)."],
          ["Metrik CPU/RAM", <><strong>Tidak</strong> — sampler hanya membaca daemon host aoox.</>],
          ["Env & referensi database", <>Env berlaku; referensi <Code>{"${{database…}}"}</Code> menghasilkan host internal yang <strong>tidak terjangkau</strong> dari server lain — pakai koneksi eksternal.</>],
          ["Mount & backup volume", "Ya — volume, file, dan backup volume (termasuk unggah/unduh S3) berjalan di daemon server itu."],
          ["Jobs", "Ya, di daemon server."],
          ["Notifikasi container mati", "Hanya untuk host lokal."],
          ["Preview PR", "Tidak (tanpa host/domain)."],
          ["Pemeliharaan disk", "Image deployment lama dipangkas juga di server remote; dangling/build cache hanya lokal."],
        ]}
      />

      <H3>Contoh: app di server remote + database di host</H3>
      <Pre title="Env aplikasi (server remote)">{`# bukan \${{database.app-db.url}} — host internal tidak terjangkau dari server lain
DATABASE_URL=postgresql://app:PASSWORD@203.0.113.5:15432/app_db`}</Pre>
      <Ul>
        <li>Isi <strong>Port host</strong> pada database (mis. 15432) dan batasi akses port itu di firewall host ke IP server remote.</li>
        <li>Salin password dari tab Ringkasan database (mask → salin).</li>
      </Ul>

      <H2 id="proxy">Proxy & domain di server remote</H2>
      <P>
        Setiap server bisa menjalankan Traefik-nya sendiri. Di kartu server,
        bagian <strong>Proxy (Traefik) di server ini</strong>: atur port{" "}
        <strong>HTTP</strong>/<strong>HTTPS</strong> (default 80/443) dan{" "}
        <strong>Email ACME</strong> bila ingin sertifikat Let&apos;s Encrypt,
        lalu provision.
      </P>
      <Ul>
        <li>
          Setelah proxy ada, aplikasi di server itu mendapat label Traefik
          dengan setelan server tersebut — tab Domain bekerja seperti di host.
        </li>
        <li>
          DNS domain harus mengarah ke <strong>IP server itu</strong>, bukan ke
          host aoox. Cek DNS membandingkan dengan host server yang
          terdaftar.
        </li>
        <li>
          Port 80/443 di server itu harus bebas; ACME HTTP-01 butuh port 80
          terbuka dari internet.
        </li>
        <li>
          Tanpa proxy server, aplikasi tetap bisa diakses lewat{" "}
          <strong>Port host</strong> seperti sebelumnya.
        </li>
      </Ul>

      <H2 id="terminal">Terminal ke server remote</H2>
      <P>
        Halaman Terminal punya select target: <strong>Host aoox</strong>{" "}
        atau salah satu server. Target diikat ke tiket oleh API, bukan dikirim
        dari browser. Lihat <DocLink href="/docs/terminal">Web terminal</DocLink>.
      </P>

      <H2 id="hapus">Menghapus server</H2>
      <Callout kind="warn">
        Server yang masih memiliki aplikasi tidak bisa dihapus (409). Hapus
        atau pindahkan aplikasinya dulu (ubah <strong>Server</strong> di
        Pengaturan → deploy ulang membangun di target baru; container di
        server lama tidak dihapus otomatis).
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Tes: auth failed", "Key belum diotorisasi, atau username salah. Jalankan perintah otorisasi sebagai user yang sama."],
          ["Tes: docker: command not found", "Docker belum terpasang, atau PATH shell non-interaktif tidak memuatnya (snap). Pasang via get.docker.com."],
          ["Tes: permission denied while trying to connect to the Docker daemon", "User bukan anggota grup docker. usermod -aG docker <user>, login ulang."],
          ["Deploy sukses tapi tidak bisa diakses", "Port host belum diisi dan server belum punya proxy, atau firewall server menutup port itu."],
          ["Aplikasi tidak bisa konek ke database", "Memakai referensi/host internal. Pakai koneksi eksternal + port host database."],
          ["Nixpacks/statis: build pertama sangat lama", "Helper image & base image di-pull di server itu (sekali per server)."],
        ]}
      />

      <Callout kind="warn" title="Keamanan">
        Host key SSH server tujuan <strong>belum diverifikasi</strong> —
        rentan MITM di jaringan yang tidak dipercaya.
        Gunakan jaringan privat/VPN antar server bila memungkinkan. Kredensial
        SSH memberi aoox akses setara root Docker di server itu.
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
