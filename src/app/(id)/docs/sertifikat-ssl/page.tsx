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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/docs/sertifikat-ssl",
  lang: "id",
  title: "Sertifikat SSL kustom",
  description:
    "Unggah sertifikat sendiri (CA perusahaan, wildcard, Cloudflare Origin CA) dan pasang ke domain aplikasi sebagai ganti Let's Encrypt.",
})

const SUMMARY = [
  { k: "Unggah", v: <>Settings<PathArrow />Integrasi<PathArrow />Sertifikat SSL (owner/admin)</> },
  { k: "Pasang", v: <>Aplikasi<PathArrow />tab Domain, per domain HTTPS</> },
  { k: "Berlaku untuk", v: "Domain aplikasi saja" },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik, domain aplikasi, dan Let's Encrypt otomatis.", href: "/docs/domain" },
  { title: "Notifikasi", description: "Peringatan sertifikat hampir kedaluwarsa.", href: "/docs/notifikasi" },
  { title: "Pengguna & peran", description: "Siapa boleh mengunggah dan memasang.", href: "/docs/pengguna-peran" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/sertifikat-ssl"
      title="Sertifikat SSL kustom"
      description="Pakai sertifikat sendiri untuk domain aplikasi, sebagai ganti Let's Encrypt otomatis: unggah sekali, pilih per domain."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Kapan dipakai</H2>
      <P>
        Secara default domain HTTPS memakai{" "}
        <DocLink href="/docs/domain#https">Let&apos;s Encrypt</DocLink> otomatis.
        Sertifikat kustom berguna bila:
      </P>
      <Ul>
        <li>perusahaanmu mewajibkan sertifikat dari <strong>CA internal</strong> atau CA tertentu;</li>
        <li>kamu sudah punya sertifikat <strong>wildcard</strong> berbayar yang ingin dipakai untuk banyak subdomain;</li>
        <li>kamu memakai <strong>Cloudflare Origin CA</strong> di belakang proxy Cloudflare;</li>
        <li>jaringan server tidak bisa dijangkau Let&apos;s Encrypt (mis. tidak ada akses port 80 dari luar).</li>
      </Ul>

      <H2 id="unggah">Mengunggah sertifikat</H2>
      <Steps>
        <Step title={<>Settings<PathArrow />Integrasi<PathArrow />kartu Sertifikat SSL</>}>
          <P>Hanya owner/admin yang melihat kartu ini. Klik <strong>Unggah</strong>.</P>
        </Step>
        <Step title="Isi nama, sertifikat, dan kunci privat">
          <P>
            Tempel isi PEM atau klik <strong>Pilih berkas</strong> untuk
            membaca berkas <Code>.pem</Code>/<Code>.crt</Code> dan kunci
            dari komputermu (dibaca di browser). Syaratnya:
          </P>
          <Ul>
            <li>Format <strong>PEM</strong>: blok <Code>-----BEGIN CERTIFICATE-----</Code> untuk sertifikat dan <Code>-----BEGIN PRIVATE KEY-----</Code> (atau RSA/EC) untuk kunci.</li>
            <li>Sertifikat boleh berupa <strong>bundle</strong>: sertifikat server lebih dulu, lalu intermediate (rantai). Urutan salah ditolak.</li>
            <li>Kunci privat <strong>tidak boleh dilindungi passphrase</strong>. Lepas dulu, mis. <Code>openssl pkey -in kunci.pem -out kunci-tanpa-pass.pem</Code>.</li>
            <li>Kunci harus cocok dengan sertifikat, dan sertifikat belum kedaluwarsa.</li>
            <li>Nama harus unik.</li>
          </Ul>
        </Step>
        <Step title="Klik Unggah">
          <P>
            aoox membaca nama domain yang dicakup (termasuk wildcard),
            penerbit, dan tanggal kedaluwarsanya. Kunci privat{" "}
            <strong>tidak bisa dilihat lagi</strong> setelah disimpan.
          </P>
        </Step>
      </Steps>
      <P>Daftar di kartu menampilkan nama, domain yang dicakup, penerbit, tanggal kedaluwarsa, dan berapa domain yang memakainya.</P>

      <H2 id="pasang">Memasang ke domain</H2>
      <P>
        Di tab <strong>Domain</strong> aplikasi, setiap domain <strong>HTTPS</strong>{" "}
        punya pilihan <strong>Sertifikat</strong>:
      </P>
      <Ul>
        <li><strong>Otomatis (Let&apos;s Encrypt)</strong> — default; proxy meminta sertifikat sendiri.</li>
        <li>Salah satu sertifikat yang kamu unggah. Hanya yang <strong>mencakup host</strong> domain itu yang bisa dipilih; yang lain tampil nonaktif dengan keterangan &ldquo;tidak mencakup host&rdquo;.</li>
      </Ul>
      <P>
        Pilihan yang sama ada saat menambah domain baru (setelah HTTPS
        dinyalakan). Mengubahnya butuh peran developer ke atas; viewer hanya
        melihat sertifikat yang dipakai. Domain tanpa HTTPS tidak punya
        pilihan ini. Memilih kembali <em>Otomatis</em> mengembalikan domain
        ke Let&apos;s Encrypt.
      </P>

      <H2 id="wildcard">Wildcard</H2>
      <P>
        Sertifikat <Code>*.example.com</Code> mencakup <strong>satu level</strong>:{" "}
        <Code>app.example.com</Code> ya, tetapi <Code>a.b.example.com</Code>{" "}
        dan <Code>example.com</Code> sendiri tidak. Aturannya sama dengan yang
        dipakai browser; sertifikat yang mencakup <Code>example.com</Code> dan{" "}
        <Code>*.example.com</Code> sekaligus melayani keduanya.
      </P>

      <H2 id="kedaluwarsa">Kedaluwarsa dan perpanjangan</H2>
      <Ul>
        <li>Kartu memberi lencana: hijau (normal), ambar (kurang dari <strong>14 hari</strong>), merah (sudah kedaluwarsa). Tab Domain menandai domain yang sertifikatnya hampir atau sudah kedaluwarsa.</li>
        <li>aoox mengirim <DocLink href="/docs/notifikasi">notifikasi</DocLink> (jenis <em>kegagalan sertifikat</em>) saat sisa waktunya 14 hari atau kurang, dan lagi bila sudah kedaluwarsa; paling sering sekali per 24 jam per sertifikat. Hanya sertifikat yang <strong>dipakai</strong> domain yang diperingatkan.</li>
        <li>Sertifikat kustom yang kedaluwarsa <strong>tidak jatuh otomatis ke Let&apos;s Encrypt</strong>: browser akan menolak domain itu sampai kamu memperbaruinya atau memilih <em>Otomatis</em>.</li>
      </Ul>
      <P>
        Untuk memperpanjang, klik <strong>Perbarui</strong> pada sertifikat
        dan tempel sertifikat serta kunci baru. Nama tetap, dan semua domain
        yang memakainya otomatis ikut. Isi baru harus tetap mencakup domain
        yang sudah memakainya; kalau tidak, pembaruan ditolak (400).
      </P>

      <H2 id="menghapus">Menghapus</H2>
      <P>
        Tombol hapus memunculkan dialog konfirmasi. Sertifikat yang masih
        dipakai domain <strong>tidak bisa dihapus</strong> (409): pindahkan
        domainnya ke sertifikat lain atau Let&apos;s Encrypt dulu.
      </P>

      <H2 id="batas">Batas</H2>
      <Ul>
        <li>Hanya untuk <strong>domain aplikasi</strong>. Domain untuk <DocLink href="/docs/domain-panel">panel</DocLink> dan registry lokal tetap memakai ACME.</li>
        <li>Pada instalasi proxy lama yang belum bisa membaca sertifikat kustom, container proxy dibuat ulang <strong>satu kali</strong> (beberapa detik) saat sertifikat kustom pertama dipakai; port dan pengaturan ACME-nya dipertahankan. Proxy baru tidak perlu dibuat ulang, dan mengganti isi sertifikat tidak me-restart apa pun.</li>
        <li>Sertifikat dan penugasannya <strong>tidak ikut</strong> ekspor/impor project (domain hasil impor memakai Let&apos;s Encrypt) dan tidak dipulihkan oleh restore instance; unggah ulang bila perlu.</li>
      </Ul>

      <H2 id="keamanan">Keamanan</H2>
      <Callout kind="warn">
        Kunci privat disimpan <strong>terenkripsi</strong> di database aoox dan
        sebagai berkas dengan izin <Code>0600</Code> di volume proxy. API tidak
        pernah mengembalikannya, dan tidak masuk log atau notifikasi. Tetap
        batasi siapa yang jadi owner/admin, dan cabut sertifikat yang
        kuncinya bocor.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["400: kunci tidak cocok", "Kunci bukan pasangan sertifikat pertama di bundle. Pastikan sertifikat server ada di atas, rantai di bawahnya."],
          ["400: kunci terenkripsi", <>Lepas passphrase dulu (<Code>openssl pkey</Code>), lalu unggah ulang.</>],
          ["400: sudah kedaluwarsa", "Unggah sertifikat yang masih berlaku."],
          ["409: nama sudah dipakai", "Pakai nama lain, atau perbarui sertifikat yang ada."],
          ["Sertifikat tidak bisa dipilih untuk domain", "Sertifikat tidak mencakup host itu (ingat wildcard hanya satu level)."],
          ["Browser tetap menolak", "Rantai tidak lengkap: sertakan intermediate di bundle. Atau domain belum diarahkan ke server ini."],
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
