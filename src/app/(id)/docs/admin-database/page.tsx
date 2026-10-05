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
  P,
  Steps,
  Step,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/admin-database",
  lang: "id",
  title: "Admin UI database",
  description:
    "Adminer, phpMyAdmin, pgAdmin, Mongo Express, Redis Commander, atau DbGate untuk database terkelola, dipasang sekali klik.",
})

const SUMMARY = [
  { k: "Di mana", v: <>Halaman database<PathArrow />tab Ringkasan<PathArrow />kartu Admin UI</> },
  { k: "Bentuknya", v: "Satu container web-admin per database, di server aoox" },
  { k: "Siapa", v: "Developer ke atas memasang; viewer tidak melihat kredensial" },
]

const TOOLS = [
  { s: "Adminer", d: "MySQL, MariaDB, PostgreSQL (termasuk varian)", v: "adminer:5.4.2" },
  { s: "phpMyAdmin", d: "MySQL, MariaDB", v: "phpmyadmin:5.2.3" },
  { s: "pgAdmin", d: "PostgreSQL (termasuk varian)", v: "dpage/pgadmin4:9.18.0" },
  { s: "Mongo Express", d: "MongoDB", v: "mongo-express:1.0.2-20-alpine3.19" },
  { s: "Redis Commander", d: "Redis, Valkey", v: "ghcr.io/joeferner/redis-commander:0.9.1" },
  { s: "DbGate", d: "Semua engine", v: "dbgate/dbgate:7.3.1-alpine" },
]

const NEXT = [
  { title: "Managed database", description: "Engine, koneksi, dan database tambahan.", href: "/docs/database" },
  { title: "Data browser", description: "Alternatif ringan bawaan dashboard.", href: "/docs/data-browser" },
  { title: "Proxy & domain", description: "Traefik dan HTTPS untuk domain Admin UI.", href: "/docs/domain" },
  { title: "Pengguna & peran", description: "Siapa boleh memasang dan melihat kredensial.", href: "/docs/pengguna-peran" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/admin-database"
      title="Admin UI database"
      description="Pasang antarmuka web admin (Adminer, phpMyAdmin, pgAdmin, Mongo Express, Redis Commander, atau DbGate) untuk database terkelola dengan satu klik, lalu buka dari domain atau IP dan port."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="apa-itu">Apa itu</H2>
      <P>
        <DocLink href="/docs/data-browser">Data browser</DocLink> cukup untuk
        melihat tabel dan menjalankan query. Kalau kamu butuh alat yang lebih
        lengkap, aoox bisa memasang satu <strong>Admin UI</strong> per database
        terkelola: sebuah container web-admin populer yang berjalan di sebelah
        database dan tersambung ke server database itu. Container-nya bernama{" "}
        <Code>aoox-dbadmin-&lt;slug&gt;</Code> dan berjalan di host aoox.
      </P>

      <H2 id="alat">Alat per engine</H2>
      <Table
        head={["Alat", "Engine", "Image (versi dikunci)"]}
        rows={TOOLS.map((t) => [
          <strong key={t.s}>{t.s}</strong>,
          t.d,
          <Code key={t.v}>{t.v}</Code>,
        ])}
      />
      <P>
        Daftar alat yang tampil di dialog pemasangan menyesuaikan engine
        database-nya. Versi image dikunci supaya hasil pemasangan sama dari
        waktu ke waktu; Redis Commander diambil dari GHCR karena Docker Hub
        hanya punya tag <Code>latest</Code> lama.
      </P>

      <H2 id="memasang">Memasang</H2>
      <Steps>
        <Step title={<>Buka database<PathArrow />tab Ringkasan</>}>
          <P>
            Database harus <strong>berjalan</strong> (kalau tidak, pemasangan
            ditolak 409). Setiap database punya paling banyak satu Admin UI.
          </P>
        </Step>
        <Step title="Klik Pasang Admin UI pada kartu Admin UI">
          <P>Pilih alat, lalu pilih cara membukanya:</P>
          <Ul>
            <li>
              <strong>Domain</strong> — lewat reverse proxy dengan hostname
              sendiri (DNS-nya diarahkan ke server ini). Proxy dipasang
              otomatis bila belum berjalan; HTTPS aktif bila email ACME sudah
              diisi. Hostname tidak boleh sudah dipakai domain lain.
            </li>
            <li>
              <strong>IP &amp; port</strong> — dipublikasikan di port host
              server ini, tanpa domain. Port harus belum dipakai aplikasi,
              database, stack, atau container lain.
            </li>
          </Ul>
          <P>Minimal salah satu harus diisi; domain dan IP &amp; port juga boleh dipakai sekaligus, sama seperti pada aplikasi.</P>
        </Step>
        <Step title="Tunggu status berubah dari creating ke running">
          <P>
            Pemasangan berjalan di latar belakang; menarik image bisa memakan
            beberapa menit. Kalau gagal, kartu menampilkan pesan galatnya.
            Tombol alamat muncul setelah <Code>running</Code>.
          </P>
        </Step>
      </Steps>

      <H2 id="login">Login</H2>
      <Table
        head={["Alat", "Cara masuk"]}
        rows={[
          [
            <strong key="a">Adminer, phpMyAdmin</strong>,
            "Memakai login database sendiri. Ambil username dan password-nya dari kartu Koneksi internal di tab Ringkasan (tombol Tampilkan password); tidak ada password tambahan yang dibuat.",
          ],
          [
            <strong key="o">pgAdmin, Mongo Express, Redis Commander, DbGate</strong>,
            <>
              Memakai kredensial yang dibuat aoox otomatis (nama pengguna{" "}
              <Code>admin</Code>; pgAdmin memakai <Code>admin@example.com</Code>).
              Klik <strong>Tampilkan kredensial</strong> pada kartu Admin UI.
              pgAdmin akan menanyakan password database saat kamu menyambung ke
              server.
            </>,
          ],
        ]}
      />
      <P>
        Anggota dengan peran <strong>viewer</strong> tidak bisa melihat
        kredensial itu, dan tidak bisa memasang atau menghapus Admin UI.
      </P>

      <H2 id="menghapus">Menghapus</H2>
      <Ul>
        <li>
          <strong>Hapus Admin UI</strong> di kartu menghentikan dan menghapus
          container-nya. Data database tidak terpengaruh.
        </li>
        <li>
          Menghapus <strong>database</strong> ikut menghapus Admin UI-nya.
        </li>
        <li>
          Menghentikan database tidak menghentikan Admin UI, tetapi Admin UI
          tidak bisa menyambung sampai database dijalankan lagi.
        </li>
        <li>
          Admin UI <strong>tidak ikut</strong> ekspor/impor project; pasang
          lagi setelah impor.
        </li>
        <li>
          Container Admin UI tidak punya volume: pengaturan datang dari
          konfigurasi aoox setiap kali dibuat, jadi tidak ada data yang hilang
          saat dihapus.
        </li>
      </Ul>

      <H2 id="keamanan">Keamanan</H2>
      <Callout kind="warn">
        Admin UI memberi akses ke seluruh isi database. DbGate, Mongo Express,
        dan Redis Commander sudah membawa password database di dalam
        container-nya, jadi siapa pun yang punya login-nya punya akses penuh.
        Jangan buka lewat HTTP polos di internet publik.
      </Callout>
      <Ul>
        <li>Pakai <strong>domain dengan HTTPS</strong> untuk akses dari luar, atau IP &amp; port hanya di jaringan tepercaya / lewat firewall.</li>
        <li>Adminer bisa dicoba ke host lain di jaringan <Code>aoox</Code> bila penggunanya punya kredensial host itu.</li>
        <li>Hapus Admin UI saat tidak dipakai, dan batasi siapa yang punya peran developer ke atas di project ini.</li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["409 saat memasang", "Database belum berjalan, atau sudah punya Admin UI. Jalankan database dulu."],
          ["409 / 400: hostname atau port", "Hostname sudah dipakai domain lain atau Admin UI lain (409), atau port host sudah dipakai (400). Pilih yang lain."],
          ["Status error: container tidak ada lagi", "Container dihapus dari luar aoox. Hapus Admin UI lalu pasang lagi."],
          ["Tidak bisa masuk ke Adminer/phpMyAdmin", "Pakai login database (bukan kredensial Admin UI); lihat kartu Koneksi internal di tab Ringkasan."],
          ["Halaman tidak terbuka lewat domain", "Cek DNS menunjuk ke server ini dan proxy berjalan. HTTPS butuh email ACME di pengaturan proxy."],
        ]}
      />

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
