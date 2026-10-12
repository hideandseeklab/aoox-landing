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
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/id/docs/dns-cloudflare",
  lang: "id",
  title: "DNS Cloudflare",
  description:
    "Biarkan aoox membuat record DNS domain aplikasi di Cloudflare, dan menerbitkan sertifikat wildcard lewat ACME DNS-01.",
})

const SUMMARY = [
  { k: "Hubungkan", v: <>Pengaturan<PathArrow />Integrasi<PathArrow />Penyedia DNS (owner/admin)</> },
  { k: "Per domain", v: <>Aplikasi<PathArrow />tab Domain: Record DNS, mode sertifikat</> },
  { k: "Wildcard", v: <>Infrastruktur<PathArrow />Reverse proxy<PathArrow />Sertifikat DNS-01 (owner)</> },
]

const NEXT = [
  { title: "Proxy & domain", description: "Traefik, domain aplikasi, cek DNS, HTTPS otomatis.", href: "/id/docs/domain" },
  { title: "Sertifikat SSL kustom", description: "Unggah sertifikat sendiri sebagai gantinya.", href: "/id/docs/sertifikat-ssl" },
  { title: "Preview deployment", description: "Preview pull request dan record DNS wildcard-nya.", href: "/id/docs/preview" },
  { title: "Pengguna & peran", description: "Siapa boleh menghubungkan Cloudflare dan mengubah domain.", href: "/id/docs/pengguna-peran" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/dns-cloudflare"
      title="DNS Cloudflare"
      description="Buat record DNS domain aplikasi secara otomatis dan dapatkan sertifikat wildcard lewat DNS-01, memakai API token Cloudflare."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="apa">Apa yang dilakukan</H2>
      <P>
        Biasanya Anda membuat record DNS domain sendiri dan aoox hanya{" "}
        <DocLink href="/id/docs/domain#domain">memeriksanya</DocLink>. Dengan
        koneksi Cloudflare ada dua tambahan opsional:
      </P>
      <Ul>
        <li><strong>Record DNS</strong>: saat Anda menambah domain ke aplikasi, aoox membuat record A (atau AAAA bila alamat server berupa IPv6) di zona Cloudflare Anda, mengarah ke IP yang sama dengan yang diharapkan cek DNS.</li>
        <li><strong>Sertifikat DNS-01</strong>: proxy membuktikan kepemilikan domain lewat API Cloudflare, bukan port 80, sehingga sertifikat <strong>wildcard</strong> menjadi mungkin (misalnya satu sertifikat untuk semua preview pull request).</li>
      </Ul>
      <P>
        Keduanya opsional. Tanpa koneksi, tidak ada yang berubah: DNS dan
        sertifikat tetap Anda kelola seperti biasa. Untuk saat ini hanya
        Cloudflare yang didukung.
      </P>

      <H2 id="token">Membuat API token</H2>
      <Steps>
        <Step title="Di Cloudflare: My Profile, API Tokens, Create Token">
          <P>
            Pilih token kustom dengan dua izin, dibatasi ke zona yang Anda pakai:
          </P>
          <Ul>
            <li><Code>Zone:Zone:Read</Code></li>
            <li><Code>Zone:DNS:Edit</Code></li>
          </Ul>
        </Step>
        <Step title="Salin tokennya">
          <P>
            Cloudflare hanya menampilkannya sekali. Token milik akun (bukan
            pengguna) juga membutuhkan ID akun, lihat di bawah.
          </P>
        </Step>
      </Steps>

      <H2 id="koneksi">Menambah koneksi</H2>
      <Steps>
        <Step title={<>Pengaturan<PathArrow />Integrasi<PathArrow />kartu Penyedia DNS</>}>
          <P>
            Owner dan admin melihatnya. Klik tambah; dialognya bernama{" "}
            <strong>Koneksi Cloudflare baru</strong>.
          </P>
        </Step>
        <Step title="Isi nama dan token">
          <P>
            Beri nama (harus unik), tempel <strong>API token</strong>, dan isi{" "}
            <strong>ID akun (opsional)</strong> hanya untuk token milik akun.
            Token disimpan terenkripsi dan{" "}
            <strong>tidak dapat dilihat lagi</strong>.
          </P>
        </Step>
        <Step title="Uji">
          <P>
            Tombol uji memverifikasi token dan menampilkan zona yang bisa
            dilihatnya, misalnya &ldquo;3 zona&rdquo;. Token yang dibatasi ke satu
            sub-zona juga bisa: aoox mencari zona yang paling panjang cocok untuk
            tiap host.
          </P>
        </Step>
      </Steps>
      <P>
        Menghapus koneksi ditolak (409) selama masih ada domain atau proxy yang
        memakainya, karena aoox tidak lagi bisa membersihkan record yang pernah
        dibuatnya. Semua anggota project bisa melihat nama koneksi (untuk memilih
        pada domain); hanya owner dan admin yang menambah, menguji, atau menghapus.
      </P>

      <H2 id="record">Record DNS untuk sebuah domain</H2>
      <P>
        Di tab <strong>Domain</strong> aplikasi, form tambah punya pilihan{" "}
        <strong>Record DNS</strong>: <em>Saya atur DNS sendiri</em> (default) atau{" "}
        <em>Cloudflare: &lt;nama koneksi&gt;</em>. Tiap domain yang sudah ada
        punya pilihan yang sama di barisnya, dengan lencana status, tombol
        sinkronkan, dan pesan terakhir. Developer ke atas bisa mengubahnya;
        viewer hanya melihat.
      </P>
      <Table
        head={["Opsi", "Arti"]}
        rows={[
          ["Proxied (awan oranye)", <>Mati secara default. Proxy perlu melihat host asli dan menjawab tantangan sertifikat sendiri. Nyalakan hanya bila Anda memang ingin Cloudflare di depan; mode SSL-nya lalu harus <em>Full (strict)</em> (lihat <DocLink href="/id/docs/domain#https">Bagaimana HTTPS bekerja</DocLink>).</>],
          ["Ganti record yang sudah ada dengan isi berbeda", "Mati secara default. Lihat aturan di bawah."],
        ]}
      />
      <H3>Perlakuan aoox terhadap record yang sudah ada</H3>
      <Table
        head={["Situasi", "Yang dilakukan aoox"]}
        rows={[
          ["Belum ada record untuk nama itu", "Membuatnya (TTL otomatis, komentar “Managed by aoox”)."],
          ["Record buatan aoox sebelumnya telah berubah", "Memperbaruinya di tempat."],
          ["Ada record dengan isi lain", <>Dibiarkan dan dilaporkan sebagai peringatan. Bila <em>Ganti record yang sudah ada…</em> aktif, aoox memperbarui dan mengambil alih record itu.</>],
          ["Ada record identik yang bukan buatan aoox", "Dibiarkan apa adanya dan tidak dilacak, jadi tidak akan pernah dihapus nanti."],
          ["Ada CNAME pada nama itu", "Tidak membuat apa pun dan memberi peringatan."],
          ["Tidak ada zona yang cocok dengan host, atau Cloudflare tidak terjangkau", "Memberi peringatan; domainnya tetap ditambahkan."],
        ]}
      />
      <Ul>
        <li><strong>DNS tidak pernah menggagalkan permintaan.</strong> Domain tetap ditambahkan dan masalahnya muncul sebagai peringatan (&ldquo;Domain ditambahkan, tetapi DNS perlu diperiksa&rdquo;) plus lencana <strong>Peringatan DNS</strong> atau <strong>DNS gagal</strong> di barisnya. Perbaiki penyebabnya lalu tekan tombol sinkronkan untuk mencoba lagi; <strong>DNS ok</strong> berarti record sudah ada.</li>
        <li><strong>aoox hanya menghapus record yang dibuatnya sendiri</strong>, berdasarkan id yang tersimpan, saat Anda menghapus domain, menghapus aplikasi, atau mengembalikan domain ke <em>Saya atur DNS sendiri</em>. Ia tidak pernah mendaftar atau menghapus hal lain di zona Anda.</li>
        <li>Record ditulis sebelum container dibuat ulang, jadi permintaan sertifikat pertama sudah menemukan namanya.</li>
        <li>Menghapus seluruh <em>project</em> hanya menghapus barisnya: record di Cloudflare tetap ada.</li>
        <li>Ekspor project menyimpan <em>nama</em> koneksi dan flag proxied, tidak pernah token atau id record. Impor tidak membuat record: pakai tombol sinkronkan.</li>
      </Ul>

      <H2 id="dns01">DNS-01 pada proxy</H2>
      <P>
        Sertifikat memakai HTTP-01 kecuali Anda mengaktifkan ini. Fitur ini
        menambah resolver ACME kedua di Traefik yang menjawab tantangan lewat
        Cloudflare.
      </P>
      <Steps>
        <Step title="Atur email ACME pada proxy dulu">
          <P>
            DNS-01 memakai email akun ACME yang sama, jadi proxy harus sudah
            punya satu (<DocLink href="/id/docs/domain#proxy">Aktifkan reverse proxy</DocLink>).
          </P>
        </Step>
        <Step title={<>Infrastruktur<PathArrow />Reverse proxy<PathArrow />kartu Sertifikat DNS-01</>}>
          <P>
            Pilih proxy (<strong>Host aoox</strong> atau{" "}
            <DocLink href="/id/docs/server-remote">server remote</DocLink>), pilih{" "}
            <strong>Koneksi DNS</strong>, lalu klik <strong>Aktifkan DNS-01</strong>.
            Owner yang bisa mengubahnya; admin bisa melihat.
          </P>
        </Step>
        <Step title="Konfirmasi pembuatan ulang">
          <P>
            Pada proxy yang berjalan muncul dialog <strong>Buat ulang proxy?</strong>:
            proxy dibuat ulang, beberapa detik tanpa layanan untuk semua domain
            di dalamnya. Sertifikat dan rute lain tetap ada. Lanjutkan dengan{" "}
            <strong>Buat ulang dan lanjutkan</strong>.
          </P>
        </Step>
      </Steps>
      <P>
        Kartu menampilkan status: <strong>Aktif</strong>, <strong>Mati</strong>,{" "}
        <strong>Belum diterapkan</strong> (tersimpan, proxy belum dibuat ulang)
        atau <strong>Proxy tidak berjalan</strong>, beserta apa yang bergantung
        padanya. Tombol <strong>Nonaktifkan</strong> ditolak (409) selama masih
        ada domain atau preview yang memakai DNS-01; kembalikan dulu ke otomatis.
      </P>
      <Callout kind="warn" title="Token terlihat di mesin itu">
        Token diteruskan ke container proxy sebagai variabel lingkungan, sehingga
        siapa pun yang bisa menjalankan <Code>docker inspect</Code> di mesin itu
        dapat membacanya, seperti rahasia lain yang aoox berikan ke container.
        Pakai token yang dibatasi ke zona yang diperlukan.
      </Callout>

      <H2 id="mode">Mode sertifikat</H2>
      <P>
        Setelah proxy punya DNS-01, domain HTTPS mendapat pilihan{" "}
        <strong>Mode sertifikat</strong> di tab Domain (tanpa DNS-01 hanya muncul
        keterangan bahwa DNS-01 belum diaktifkan pada proxy ini):
      </P>
      <Table
        head={["Mode", "Sertifikat"]}
        rows={[
          ["Otomatis (HTTP-01)", "Default: diminta saat host pertama kali diakses, butuh port 80."],
          ["DNS-01 untuk host ini", "Satu sertifikat untuk host itu, dibuktikan lewat DNS."],
          [<>Wildcard DNS-01 (<Code key="1">*.example.com</Code>)</>, <>Satu sertifikat untuk domain induk host (<Code key="2">app.example.com</Code> menjadi <Code key="3">*.example.com</Code>), dipakai bersama oleh semua host di bawahnya.</>],
        ]}
      />
      <Ul>
        <li>Hanya untuk domain HTTPS, dan tidak bersama <DocLink href="/id/docs/sertifikat-ssl">sertifikat yang diunggah</DocLink> (API menjawab 400).</li>
        <li>Bila domain meminta DNS-01 tetapi proxy-nya tidak lagi punya resolver, ia kembali ke HTTP-01 dengan peringatan, bukan gagal.</li>
        <li>Impor project mempertahankan mode DNS-01 hanya bila proxy tujuan punya DNS-01; jika tidak, domain memakai HTTP-01 dan laporan mencatatnya.</li>
      </Ul>

      <H2 id="previews">Sertifikat wildcard untuk preview</H2>
      <P>
        <DocLink href="/id/docs/preview">Preview pull request</DocLink> biasanya
        mendapat sertifikat per host preview. Di tab <strong>Webhook</strong>{" "}
        aplikasi, kartu preview punya{" "}
        <strong>Sertifikat wildcard untuk preview</strong>: satu sertifikat DNS-01
        untuk <Code>*.&lt;domain preview&gt;</Code>, bukan satu per pull request.
        Perlu DNS-01 pada proxy dan domain preview; sakelarnya nonaktif beserta
        penjelasan sampai keduanya ada.
      </P>
      <Callout title="Record DNS wildcard tetap Anda buat sendiri">
        aoox tidak membuat record untuk wildcard preview. Tambahkan{" "}
        <Code>*.preview.example.com</Code> sendiri, seperti pada prasyarat preview.
      </Callout>

      <H2 id="batasan">Batasan</H2>
      <Ul>
        <li>Hanya Cloudflare. Penyedia DNS lain belum didukung.</li>
        <li>Record dibuat hanya untuk <strong>domain aplikasi</strong>. Domain stack compose dan host UI admin database tetap DNS manual.</li>
        <li>Tidak ada cek DNS ke Cloudflare sendiri; <DocLink href="/id/docs/domain#domain">cek DNS</DocLink> biasa tetap membandingkan DNS publik dengan IP yang diharapkan.</li>
        <li>Penerbitan sertifikat DNS-01 yang sebenarnya dan proxy di server remote belum dicoba dengan akun Cloudflare sungguhan; uji dulu dengan ACME staging.</li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Uji menjawab 403 atau tidak ada zona", <>Token tidak punya <Code key="1">Zone:Zone:Read</Code> atau <Code key="2">Zone:DNS:Edit</Code>, atau dibatasi ke zona lain. Buat token baru.</>],
          ["Peringatan: tidak ada zona untuk host", "Token tidak bisa melihat zona yang memuat host itu. Tambahkan zonanya ke token."],
          ["Peringatan: record sudah ada", <>Ada record lain dengan isi berbeda pada nama itu. Ubah sendiri, atau pakai <em>Ganti record yang sudah ada…</em>.</>],
          ["Browser menolak sertifikat saat Proxied aktif", <>Mode SSL Cloudflare harus <em>Full (strict)</em>; atau matikan Proxied.</>],
          ["Aktifkan DNS-01 meminta email ACME", "Proxy belum punya email ACME; atur dulu."],
          ["Koneksi tidak bisa dihapus atau DNS-01 tidak bisa dinonaktifkan (409)", "Masih ada domain, preview, atau proxy yang memakainya. Lepaskan dulu."],
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
