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
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/id/docs/konfigurasi-proxy",
  lang: "id",
  title: "Konfigurasi proxy (middleware)",
  description:
    "Tulis konfigurasi dinamis Traefik dari dashboard (basic auth, header keamanan, rate limit, allowlist IP, redirect www) dan pasang sebagai middleware per domain.",
})

const SUMMARY = [
  { k: "Kelola", v: <>Infrastruktur<PathArrow />Reverse proxy<PathArrow />Konfigurasi dinamis (owner; admin hanya lihat)</> },
  { k: "Pasang", v: <>Aplikasi<PathArrow />tab Domain<PathArrow />Middleware<PathArrow />Atur</> },
  { k: "Cakupan", v: "Konfigurasi dinamis Traefik per proxy (host atau server remote)" },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik, domain aplikasi, dan Let's Encrypt otomatis.", href: "/id/docs/domain" },
  { title: "Sertifikat SSL kustom", description: "Sertifikat sendiri; dikelola terpisah dari berkas di sini.", href: "/id/docs/sertifikat-ssl" },
  { title: "Server remote", description: "Proxy per server dan deploy lewat SSH.", href: "/id/docs/server-remote" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/konfigurasi-proxy"
      title="Konfigurasi proxy (middleware)"
      description="Tulis middleware Traefik sendiri (autentikasi, header, pembatas laju, allowlist IP, redirect) dan pasang per domain tanpa menyentuh server."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="konsep">Cara kerja</H2>
      <P>
        Traefik membaca konfigurasi dinamis dari sebuah direktori dan memuat
        ulang tiap berkas berubah, tanpa restart. aoox menyimpan berkas YAML
        buatanmu di database (sumber kebenaran) dan menulisnya ke proxy sebagai{" "}
        <Code>user-&lt;nama&gt;.yml</Code>. Berkas ini terpisah dari sertifikat
        kustom: aoox tidak pernah mengubah <Code>certs.yml</Code> atau berkas
        sertifikat, dan sertifikat tidak pernah menyentuh berkas{" "}
        <Code>user-</Code>.
      </P>
      <Ul>
        <li>Satu daftar berkas <strong>per proxy</strong>: pilih <em>Host aoox</em> atau salah satu server remote di bagian atas kartu.</li>
        <li>Hanya bagian <Code>http</Code> yang diterima: <Code>middlewares</Code>, <Code>routers</Code>, <Code>services</Code>, <Code>serversTransports</Code>. <Code>tls</Code> (sertifikat dikelola di <DocLink href="/id/docs/sertifikat-ssl">Sertifikat SSL</DocLink>), <Code>tcp</Code>, <Code>udp</Code>, dan kunci lain ditolak dengan pesan jelas.</li>
        <li>Nama middleware, router, dan service hanya huruf kecil, angka, dan <Code>-</Code>, dan harus <strong>unik per proxy</strong> (lintas berkas aktif).</li>
        <li>Maksimal 64 KB per berkas. Berkas yang dinonaktifkan tetap tersimpan di aoox tetapi dihapus dari proxy.</li>
      </Ul>

      <H2 id="buat">Membuat berkas</H2>
      <Steps>
        <Step title={<>Infrastruktur<PathArrow />Reverse proxy<PathArrow />Konfigurasi dinamis</>}>
          <P>Hanya owner yang bisa mengubah; admin bisa membaca daftar dan isi berkas.</P>
        </Step>
        <Step title="Dari preset atau tulis sendiri">
          <P>
            <strong>Dari preset</strong> membuka formulir kecil dan menghasilkan
            YAML siap simpan di editor (kamu masih bisa mengubahnya):
          </P>
          <Table
            head={["Preset", "Isi"]}
            rows={[
              ["Basic auth", <>Username dan password. Yang disimpan hanya <strong>hash bcrypt</strong>; password tidak pernah ada di berkas atau audit log.</>],
              ["Security headers", "HSTS (hanya lewat HTTPS), nosniff, frame deny, referrer policy."],
              ["Rate limit", "Rata-rata, burst, dan periode per IP sumber."],
              ["IP allowlist", "Daftar alamat/CIDR yang divalidasi; selain itu 403."],
              ["Redirect www", <>Alihkan www ke non-www atau sebaliknya (301). Pasang ke domain yang <strong>diarahkan</strong> (<Code>www.contoh.com</Code> untuk ke non-www, <Code>contoh.com</Code> untuk ke www).</>],
            ]}
          />
          <P>Atau <strong>Berkas baru</strong> untuk menulis YAML sendiri, mis.:</P>
          <Pre>{`http:
  middlewares:
    header-aoox:
      headers:
        customResponseHeaders:
          X-Powered-By: aoox`}</Pre>
        </Step>
        <Step title="Simpan">
          <P>
            aoox memeriksa struktur YAML, menulis berkas ke proxy, menunggu
            beberapa detik, lalu membaca log Traefik. Bila Traefik melaporkan
            galat tentang berkas itu, perubahan <strong>dibatalkan otomatis</strong>{" "}
            (versi sebelumnya dipulihkan) dan galatnya ditampilkan apa adanya.
          </P>
        </Step>
      </Steps>

      <H2 id="pasang">Memasang ke domain</H2>
      <P>
        Di tab <strong>Domain</strong> aplikasi, tiap domain punya baris{" "}
        <strong>Middleware</strong> dengan tombol <strong>Atur</strong>. Pilih
        middleware dari berkas aktif di proxy yang melayani aplikasi itu
        (nama dalam bentuk <Code>nama@file</Code>). Urutan memilih adalah
        urutan menjalankan. Butuh peran developer ke atas; viewer hanya
        melihat. Menyimpan membuat ulang container aplikasi dengan label baru
        (tanpa build), seperti mengganti sertifikat.
      </P>
      <Ul>
        <li>Middleware dipasang di router HTTPS domain itu, dan di router HTTP untuk domain yang dilayani lewat HTTP. Pengalihan otomatis http→https tidak memakainya.</li>
        <li>Domain dengan daftar middleware yang sama berbagi satu router; daftar berbeda dipisah otomatis, jadi middleware satu domain tidak memengaruhi domain lain.</li>
        <li>Middleware yang <strong>dipakai domain</strong> tidak bisa dinonaktifkan, dihapus, atau diganti namanya (409, domainnya disebut). Lepas dari domain dulu.</li>
        <li>Nama yang tidak ada di berkas aktif pada proxy aplikasi itu ditolak (400).</li>
      </Ul>

      <H2 id="proxy-lama">Proxy dari aoox versi lama</H2>
      <Callout kind="warn">
        Proxy yang dibuat aoox versi lama belum membaca direktori konfigurasi
        dinamis. Saat berkas pertama diaktifkan, container proxy dibuat ulang{" "}
        <strong>satu kali</strong>: beberapa detik tanpa layanan untuk semua
        domain di proxy itu; sertifikat dan rute lain tetap. aoox meminta
        konfirmasi lebih dulu dan tidak menanyakannya lagi sesudahnya. Proxy
        baru tidak perlu dibuat ulang.
      </Callout>

      <H2 id="terapkan-ulang">Terapkan ulang</H2>
      <P>
        Tombol <strong>Terapkan ulang</strong> menulis ulang semua berkas aktif
        ke proxy dan membersihkan berkas <Code>user-*</Code> yang sudah tidak
        ada di aoox. Pakai setelah <DocLink href="/id/docs/backup">restore instance</DocLink>{" "}
        (restore memulihkan isi berkas di database tetapi tidak menulis volume
        proxy), setelah proxy atau server dipasang ulang, atau bila berkas di
        volume berubah di luar aoox.
      </P>

      <H2 id="batas">Batas</H2>
      <Ul>
        <li>Hanya konfigurasi <strong>dinamis</strong>. Opsi statis Traefik (entrypoint, level log, IP tepercaya) tidak bisa diubah dari sini.</li>
        <li>aoox hanya menangkap galat yang dicatat Traefik. Nilai yang keliru tetapi tidak dilaporkan (mis. URL service yang tidak valid) lolos, jadi uji hasilnya setelah menyimpan.</li>
        <li>Konfigurasi yang valid tetap bisa mengubah perutean semua domain di proxy itu (router buatanmu bisa bertabrakan dengan rute aplikasi). Karena itu hanya owner yang boleh menulis.</li>
        <li>Server remote: ditulis lewat jalur yang sama, tetapi belum diuji pada server sungguhan; pastikan berkas yang dibutuhkan ada di proxy server tujuan sebelum memindahkan aplikasi.</li>
        <li>Berkas bersifat <strong>per proxy</strong> dan tidak ikut ekspor/impor project; domain hasil impor tidak punya middleware (impor tetap berhasil bila sumbernya memakainya).</li>
        <li>Memindahkan aplikasi ke server lain membersihkan middleware domainnya: hanya yang namanya didefinisikan berkas <strong>aktif</strong> di proxy tujuan yang dipertahankan, sisanya dibuang (dicatat di log API; respons PATCH aplikasi memuat <Code>droppedMiddlewares</Code> bila ada yang dibuang). Berkasnya sendiri tidak ikut pindah.</li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["400: Traefik rejected the file", "Traefik menolak isi berkas (opsi tidak dikenal, tipe salah, router merujuk middleware yang tidak ada, rule rusak). Versi sebelumnya sudah dipulihkan; perbaiki sesuai kutipan galat."],
          ["400: sudah dideklarasikan di berkas lain", "Nama middleware/router/service harus unik per proxy. Ganti nama atau hapus yang lain."],
          ["409: masih dipakai domain", "Lepas middleware dari domain (tab Domain) sebelum menonaktifkan, menghapus, atau mengganti namanya."],
          ["409: proxy akan dibuat ulang", "Proxy lama; konfirmasi pembuatan ulang satu kali (beberapa detik tanpa layanan)."],
          ["Middleware terpasang tetapi tidak berlaku", "Domain belum menyimpan perubahan (container dibuat ulang saat disimpan), atau proxy belum berjalan; lihat peringatan setelah menyimpan."],
          ["Basic auth selalu 401", "Password salah, atau ada proxy lain (mis. Cloudflare) di depan yang menambah header Authorization."],
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
