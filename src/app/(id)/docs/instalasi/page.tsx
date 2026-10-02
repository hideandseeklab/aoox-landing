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
  path: "/docs/instalasi",
  lang: "id",
  title: "Instalasi",
  description:
    "Menjalankan aoox di server sendiri dengan Docker Compose.",
})

const SUMMARY = [
  { k: "Waktu", v: "± 5 menit" },
  { k: "Butuh", v: "VPS Linux + Docker" },
  { k: "Hasil", v: "Dashboard di :3000, akun owner" },
]

const NEXT = [
  {
    title: "Aktifkan registry lokal",
    description: "Wajib sebelum deploy aplikasi pertama.",
    href: "/docs/registry",
  },
  {
    title: "Aktifkan reverse proxy",
    description: "Supaya aplikasi bisa diakses lewat domain + HTTPS.",
    href: "/docs/domain",
  },
  {
    title: "Domain untuk panel",
    description: "Layani dashboard di panel.example.com.",
    href: "/docs/domain-panel",
  },
  {
    title: "Undang tim",
    description: "Tambah anggota dengan peran owner/admin/member.",
    href: "/docs/pengguna-peran",
  },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/instalasi"
      title="Instalasi"
      description="Menjalankan aoox di server sendiri dengan Docker Compose, lalu membuat akun owner pertama."
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

      <H2 id="satu-perintah">Cara tercepat: satu perintah</H2>
      <P>
        Untuk VPS Linux baru yang masih kosong — memasang Docker (bila belum
        ada), membuat semua secret, dan menjalankan stack. Tidak perlu
        Node.js atau <Code>git clone</Code> apa pun dulu.
      </P>
      <Pre>{`curl -fsSL https://aoox.dev/install.sh | sudo sh`}</Pre>
      <P>Dengan domain + HTTPS otomatis dan owner langsung dibuat:</P>
      <Pre>{`curl -fsSL https://aoox.dev/install.sh \\
  | sudo WEB_DOMAIN=panel.example.com API_DOMAIN=api.panel.example.com \\
    ACME_EMAIL=kamu@example.com \\
    ADMIN_EMAIL=kamu@example.com ADMIN_PASSWORD='kata-sandi-kuat' \\
    sh`}</Pre>
      <Callout>
        Butuh <Code>sudo</Code> (atau login sebagai <Code>root</Code>) —
        skrip memasang Docker dan menulis ke <Code>/opt/aoox</Code>. Kalau
        lupa, gagal dengan pesan <Code>must be run as root</Code>.
      </Callout>
      <Callout>
        Skrip ini di-serve dari domain aoox sendiri (bukan pihak ketiga) dan
        mengambil file compose langsung dari repo <Code>aoox-cli</Code> —
        source-nya bisa dibaca dulu di{" "}
        <a
          href="https://github.com/hideandseeklab/aoox-landing/blob/main/public/install.sh"
          target="_blank"
          rel="noreferrer"
          className="text-foreground underline underline-offset-4"
        >
          public/install.sh
        </a>{" "}
        sebelum menjalankannya. Perlu perintah yang meminta konfirmasi dan
        mendukung flag, bukan env var? Pakai{" "}
        <DocLink href="/docs/cli#install">aoox install</DocLink> dari CLI —
        logikanya sama persis, tinggal preferensi. Bedanya dengan skrip di
        atas: <Code>aoox install</Code> butuh CLI-nya sendiri sudah terpasang
        di server itu dulu, sedangkan <Code>install.sh</Code> di atas tidak
        butuh apa-apa selain <Code>curl</Code> dan <Code>sh</Code>. Memasang
        CLI-nya sendiri juga tidak butuh Node.js — lihat{" "}
        <DocLink href="/docs/cli#instalasi-cli">
          instalasi CLI tanpa Node.js
        </DocLink>{" "}
        (<Code>curl -fsSL https://aoox.dev/install-cli.sh | sh</Code>).
      </Callout>

      <H2 id="prasyarat">Manual: prasyarat</H2>
      <P>Langkah di bawah ini cocok kalau kamu ingin lihat/kendalikan setiap bagian sendiri.</P>
      <Ul>
        <li>
          Server Linux dengan <strong>Docker 24+</strong> dan{" "}
          <strong>Compose v2</strong>. Cek: <Code>docker compose version</Code>.
        </li>
        <li>
          Port <Code>3000</Code> (web) dan <Code>3001</Code> (API) terbuka di
          firewall untuk browser kamu. Port <Code>80</Code>/<Code>443</Code>{" "}
          harus kosong bila nanti memakai domain.
        </li>
        <li>
          Akses ke socket Docker (<Code>/var/run/docker.sock</Code>) — API
          memakainya untuk build dan menjalankan container.
        </li>
      </Ul>
      <Callout title="Spesifikasi minimum">
        1 vCPU / 1 GB RAM cukup untuk aoox sendiri. Kebutuhan sebenarnya
        ditentukan aplikasi dan database yang kamu deploy; build Nixpacks
        pertama butuh ± 1 GB ruang disk tambahan untuk base image.
      </Callout>

      <H2 id="langkah">Manual: langkah demi langkah</H2>
      <Steps>
        <Step title="Clone repo API dan salin file env">
          <P>
            File compose distribusi dan contoh env ada di repo{" "}
            <Code>aoox-api</Code>.
          </P>
          <Pre>{`git clone https://github.com/hideandseeklab/aoox-api.git
cd aoox-api
cp .env.dist.example .env.dist`}</Pre>
        </Step>

        <Step title="Buat secret dan cari GID Docker">
          <P>Jalankan di server, lalu salin hasilnya ke langkah berikutnya:</P>
          <Pre title="Nilai yang dibutuhkan">{`openssl rand -hex 32                  # JWT_SECRET
openssl rand -hex 32                  # ENCRYPTION_KEY
stat -c %g /var/run/docker.sock       # DOCKER_GID (biasanya 999 atau 0)`}</Pre>
        </Step>

        <Step title="Isi .env.dist">
          <Pre title=".env.dist (minimal)">{`POSTGRES_PASSWORD=ganti-dengan-password-kuat
JWT_SECRET=<hasil openssl #1>
ENCRYPTION_KEY=<hasil openssl #2>
DOCKER_GID=<hasil stat>

# URL yang diketik di browser — harus sama persis
WEB_ORIGIN=http://192.168.1.10:3000
PUBLIC_API_URL=http://192.168.1.10:3001`}</Pre>
          <Table
            head={["Variabel", "Keterangan"]}
            rows={[
              [
                <Code key="1">POSTGRES_PASSWORD</Code>,
                "Password database internal aoox.",
              ],
              [
                <Code key="2">JWT_SECRET</Code>,
                "Rahasia untuk token sesi. Mengganti = semua pengguna logout.",
              ],
              [
                <Code key="3">ENCRYPTION_KEY</Code>,
                <>
                  Kunci enkripsi kredensial tersimpan (registry, Git, notifikasi,
                  S3). <strong>Jangan diganti</strong> setelah ada data —
                  kredensial lama tidak bisa dibaca lagi.
                </>,
              ],
              [
                <Code key="4">DOCKER_GID</Code>,
                "GID socket Docker agar container API boleh memakai Docker host.",
              ],
              [
                <>
                  <Code key="5a">WEB_ORIGIN</Code> /{" "}
                  <Code key="5b">PUBLIC_API_URL</Code>
                </>,
                "URL web & API dari sisi browser. Cookie sesi dan gateway terminal memeriksa origin ini — beda skema/host/port = ditolak.",
              ],
            ]}
          />
        </Step>

        <Step title="Jalankan stack">
          <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
          <P>
            Image diambil dari Docker Hub (
            <Code>hideandseeklab/aoox-api</Code> dan{" "}
            <Code>hideandseeklab/aoox-web</Code>). Migrasi database dijalankan
            otomatis saat container API pertama kali boot.
          </P>
        </Step>

        <Step title="Buat akun owner">
          <P>
            Buka <Code>WEB_ORIGIN</Code> di browser. Saat tabel pengguna masih
            kosong kamu diarahkan ke <Code>/setup</Code> — isi nama, email, dan
            password untuk akun <strong>owner</strong> pertama.
          </P>
          <H3>Tanpa interaksi (opsional)</H3>
          <P>
            Isi <Code>ADMIN_EMAIL</Code>, <Code>ADMIN_PASSWORD</Code>,{" "}
            <Code>ADMIN_NAME</Code> di <Code>.env.dist</Code> sebelum{" "}
            <Code>up -d</Code>. Nilai ini hanya dipakai saat belum ada pengguna
            dan tidak pernah menimpa akun yang sudah ada.
          </P>
        </Step>
      </Steps>

      <H2 id="verifikasi">Verifikasi</H2>
      <Pre title="Dari server">{`docker compose -f docker-compose.dist.yml --env-file .env.dist ps
# api, web, postgres → running

curl -s http://localhost:3001/auth/setup-status
# {"needsSetup":true}  sebelum akun owner dibuat
# {"needsSetup":false} sesudahnya`}</Pre>
      <Ul>
        <li>
          Setelah login, Dashboard tampil dan menu <strong>Settings</strong>{" "}
          bisa dibuka tanpa error.
        </li>
        <li>
          Menu <strong>Terminal</strong> boleh menampilkan petunjuk SSH — itu
          normal sebelum <DocLink href="/docs/terminal">terminal</DocLink>{" "}
          dikonfigurasi.
        </li>
      </Ul>

      <H2 id="setelah-instalasi">Langkah berikutnya</H2>
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

      <H2 id="update">Memperbarui versi</H2>
      <P>
        Cara tercepat (butuh <Code>INSTALL_DIR</Code> terisi, sama seperti{" "}
        <DocLink href="/docs/domain-panel">Domain panel</DocLink>): Settings<PathArrow />
        <strong>Update aoox</strong> <PathArrow />Cek update<PathArrow />Terapkan. Atau dari CLI:
      </P>
      <P>
        Menekan <strong>Terapkan update</strong> memunculkan dialog konfirmasi
        (restart panel biasanya 1–3 menit), lalu kartu berpindah ke mode
        &ldquo;Sedang memperbarui&rdquo; — tombol dinonaktifkan, dan dashboard
        memeriksa sendiri secara berkala sampai panel kembali dengan versi
        baru, lalu memuat ulang halaman otomatis. Selama menunggu, koneksi
        yang sempat terputus (karena container <Code>api</Code>/<Code>web</Code>{" "}
        sedang di-restart) tidak ditampilkan sebagai error — itu memang bagian
        dari prosesnya. Kalau lebih dari 5 menit panel belum juga kembali,
        kartu menampilkan langkah cek manual lewat SSH.
      </P>
      <P>
        Saat ada versi aoox yang lebih baru dipublikasikan, owner melihat tombol{" "}
        <strong>Update tersedia</strong> (dengan nomor versinya) di bagian bawah
        sidebar — klik untuk membuka halaman Update aoox. Peran lain tidak melihatnya.
        Server memeriksa versi terbaru di Docker Hub sendiri (sekali setelah
        panel menyala, lalu tiap beberapa jam); kalau server tidak punya akses
        internet, tombolnya tidak muncul dan tidak ada error. Tombol hanya muncul
        untuk instalasi yang mengikuti tag <Code>:latest</Code> — kalau image
        dikunci ke tag lain, halaman Update aoox hanya menampilkan versi terbaru
        sebagai informasi.
      </P>
      <Pre>{`aoox update            # cek saja
aoox update --apply    # terapkan kalau ada update`}</Pre>
      <P>Manual lewat SSH, kalau <Code>INSTALL_DIR</Code> belum diisi:</P>
      <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist pull
docker compose -f docker-compose.dist.yml --env-file .env.dist up -d`}</Pre>
      <P>
        Migrasi database berjalan otomatis saat API boot. Untuk mengunci versi,
        isi <Code>API_IMAGE</Code> dan <Code>WEB_IMAGE</Code> di{" "}
        <Code>.env.dist</Code>, mis. <Code>hideandseeklab/aoox-api:0.1.0-alpha.0</Code>{" "}
        (lihat tag yang tersedia di Docker Hub) — kedua cara di atas membaca
        variabel yang sama. Instalasi yang mengunci tag tidak akan melihat tombol{" "}
        &ldquo;Update tersedia&rdquo; di sidebar; halaman Update aoox tetap menampilkan
        versi terbaru sebagai informasi. Panel mengenali tag yang terpasang dari
        variabel <Code>API_IMAGE</Code> yang kini diteruskan compose ke container API
        (instalasi lama: jalankan <Code>aoox reinstall</Code> supaya compose-nya ikut
        diperbarui).
      </P>
      <P>
        <strong>Catatan penting</strong>: baik <Code>aoox update</Code> maupun tombol
        &ldquo;Terapkan update&rdquo; hanya menjalankan <Code>pull</Code> +{" "}
        <Code>up -d</Code> dengan file <Code>docker-compose.dist.yml</Code> yang
        <strong> sudah ada</strong> di server — keduanya tidak pernah menulis ulang
        file compose itu sendiri. Kalau sebuah rilis menambahkan variabel baru ke
        file compose (misalnya env baru yang harus diteruskan ke sebuah service),
        instalasi lama tidak otomatis mendapatkannya lewat update — begitu juga
        variabel baru di <Code>.env.dist</Code> (contohnya Terminal yang error{" "}
        <Code>TERMINAL_SSH_USER is not set</Code> setelah update). Perbaikan
        paling mudah dan aman untuk data:{" "}
        <DocLink href="/docs/cli#reinstall"><Code>sudo aoox reinstall</Code></DocLink>{" "}
        — menulis ulang compose dari salinan terbaru, menggabungkan{" "}
        <Code>.env.dist</Code> (secret tidak pernah dibuat ulang), lalu pull +
        recreate tanpa menyentuh volume. Jangan pakai{" "}
        <Code>aoox install --force</Code> untuk ini (secret baru memutus akses
        ke data lama). Cara manual: edit <Code>docker-compose.dist.yml</Code> di <Code>INSTALL_DIR</Code>{" "}
        (default <Code>/opt/aoox</Code>) sesuai catatan rilis, lalu:
      </P>
      <Pre>{`docker compose -f docker-compose.dist.yml -f docker-compose.override.yml --env-file .env.dist up -d`}</Pre>
      <P>
        (<Code>-f docker-compose.override.yml</Code> hanya kalau file itu ada —
        dibuat otomatis saat memakai <DocLink href="/docs/domain-panel">Domain panel</DocLink>{" "}
        dari dashboard).
      </P>

      <H2 id="dari-source">Build dari source</H2>
      <P>
        Checkout <Code>aoox-api</Code> dan <Code>aoox-web</Code>{" "}
        bersebelahan, lalu tambahkan file compose build:
      </P>
      <Pre>{`docker compose -f docker-compose.dist.yml -f docker-compose.build.yml --env-file .env.dist up -d --build`}</Pre>

      <H2 id="hapus">Menghapus</H2>
      <Pre>{`docker compose -f docker-compose.dist.yml --env-file .env.dist down -v`}</Pre>
      <Callout kind="warn" title="Hati-hati">
        <Code>-v</Code> menghapus volume data aoox (pengguna, project,
        riwayat deployment). Container aplikasi, database, registry, dan proxy
        yang dibuat dari dashboard <strong>tidak</strong> ikut terhapus — hapus
        dari dashboard dulu, atau lewat <Code>docker</Code> dengan filter label{" "}
        <Code>com.docker.compose.project=aoox</Code>.
      </Callout>
    </DocPage>
  )
}
