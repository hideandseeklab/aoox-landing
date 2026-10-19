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
  path: "/id/docs/registry",
  lang: "id",
  title: "Registry",
  description:
    "Registry lokal untuk image hasil build dan registry eksternal.",
})

const SUMMARY = [
  { k: "Registry lokal", v: "Wajib — tempat image hasil build" },
  { k: "Registry eksternal", v: "Kredensial untuk registry lain" },
  { k: "Pemeliharaan", v: "Retensi per aplikasi + cleanup malam" },
]

const IMAGE_FLOW = [
  { s: "build", d: "image dibuat oleh daemon Docker" },
  { s: "push", d: <><PathArrow />{"localhost:5000/<project>/<app>:<id>"}</> },
  { s: "run", d: "container dibuat dari image itu" },
  { s: "rollback", d: "image lama ditarik lagi dari registry" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Kenapa tag lama perlu disimpan.", href: "/id/docs/deploy#rollback" },
  { title: "Cara build", description: "Bagaimana image dinamai.", href: "/id/docs/build#image" },
  { title: "Monitoring", description: "Pemakaian disk Docker di Dashboard.", href: "/id/docs/monitoring#host" },
  { title: "Instalasi", description: "REGISTRY_PORT & REGISTRY_PUBLIC_HOST di .env.dist.", href: "/id/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/registry"
      title="Registry"
      description="Registry lokal tempat image hasil build disimpan (prasyarat deploy), registry eksternal, dan pemeliharaan disk."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="peran">Peran registry dalam deploy</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4 rounded-lg overflow-hidden">
        {IMAGE_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Setiap deploy mem-push image ke registry lokal dan rollback menariknya
        kembali dari sana. Karena itu registry harus diaktifkan{" "}
        <strong>sebelum deploy pertama</strong> — tanpa itu deploy gagal dengan
        pesan <em>No self-hosted registry</em>. Aplikasi di{" "}
        <DocLink href="/id/docs/server-remote">server remote</DocLink> tidak
        memakai registry (image tetap di daemon server).
      </P>

      <H2 id="lokal">Registry lokal</H2>
      <Steps>
        <Step title={<>Menu Registry<PathArrow />tab Registry lokal<PathArrow />Aktifkan registry (owner)</>}>
          <P>
            aoox menjalankan <Code>registry:3</Code> sebagai container{" "}
            <Code>aoox-registry</Code> dengan autentikasi htpasswd, data di
            volume <Code>aoox_registry_data</Code>, dan penghapusan tag
            diaktifkan. Kartu menampilkan status <em>Registry siap</em>,
            container, dan URL.
          </P>
          <P>
            Sebelum diaktifkan, pilih tempat penyimpanan image: <strong>Lokal</strong>{" "}
            (disk VPS, default) atau salah satu tujuan S3 yang sudah ditambahkan
            di <DocLink href="/id/docs/backup#s3">Backup instance</DocLink>. Tidak
            bisa diganti setelahnya tanpa hapus lalu aktifkan ulang.
          </P>
        </Step>
        <Step title="Simpan kredensialnya">
          <P>
            Username <Code>aoox</Code> dan password acak ditampilkan saat
            registry diaktifkan — klik <strong>Sudah saya simpan</strong>{" "}
            setelah mencatatnya. Deploy dari dashboard <strong>tidak</strong>{" "}
            membutuhkannya; kredensial ini untuk push manual dari mesin lain.
            Kalau terlupa, owner dan admin bisa{" "}
            <DocLink href="/id/docs/registry#password">menampilkannya lagi</DocLink>,
            dan owner bisa meresetnya tanpa kehilangan image.
          </P>
        </Step>
      </Steps>
      <Pre title="Push manual dari host">{`docker login localhost:5000 -u aoox
docker tag myimage:latest localhost:5000/tools/myimage:1.0
docker push localhost:5000/tools/myimage:1.0`}</Pre>
      <Table
        head={["Env (.env.dist)", "Default", "Keterangan"]}
        rows={[
          [<Code key="1">REGISTRY_PORT</Code>, "5000", "Port host registry."],
          [
            <Code key="3">REGISTRY_PUBLISH_ADDRESS</Code>,
            <>kosong (<Code>127.0.0.1</Code>)</>,
            <>
              Antarmuka jaringan yang didengarkan port host. Default-nya
              membuat registry hanya bisa dijangkau <strong>dari server ini</strong>;
              isi <Code>0.0.0.0</Code> agar mesin lain bisa push lewat IP
              (lihat di bawah).
            </>,
          ],
          [
            <Code key="2">REGISTRY_PUBLIC_HOST</Code>,
            "localhost",
            <>
              Host yang dipakai <Code>docker push</Code> saat <strong>tanpa</strong>{" "}
              domain kustom (lihat di bawah). <Code>localhost</Code> dikecualikan
              dari aturan insecure-registry Docker; host lain butuh TLS (reverse
              proxy) atau entri <Code>insecure-registries</Code> di{" "}
              <Code>daemon.json</Code> setiap daemon yang mem-push.
            </>,
          ],
        ]}
      />

      <span id="jangkauan" />
      <H3>Siapa yang bisa menjangkau port 5000</H3>
      <P>
        Mulai rilis setelah 0.1.0-alpha.12 port host registry di-bind ke{" "}
        <Code>127.0.0.1</Code> secara default, jadi hanya server ini yang bisa
        push ke <Code>localhost:5000</Code> (deploy, <Code>docker push</Code>{" "}
        dari host sendiri, dan panel tidak terpengaruh: API menjangkau registry
        lewat jaringan internal <Code>aoox</Code>). Sebelumnya port itu
        mendengarkan di semua antarmuka, sehingga registry berpassword
        terbuka ke internet lewat HTTP biasa. Kartu menampilkan{" "}
        <em>hanya server ini</em> di samping alamat selama itu berlaku. Untuk
        push dari mesin lain, pilih salah satu:
      </P>
      <Ul>
        <li>
          <strong>Beri domain kustom</strong> (disarankan, di bawah): HTTPS
          lewat proxy, tidak ada port lain yang perlu dibuka.
        </li>
        <li>
          <strong>Buka port lewat IP:</strong> isi{" "}
          <Code>REGISTRY_PUBLISH_ADDRESS=0.0.0.0</Code> di <Code>.env.dist</Code>,
          restart stack (<Code>docker compose ... up -d</Code>), lalu buat ulang
          container registry (aktifkan ulang, atau terapkan/hapus domain
          kustom). Kartu lalu menampilkan alamat yang dipakai mesin lain
          (<Code>REGISTRY_PUBLIC_HOST</Code> atau IP publik server ini). Ini
          HTTP biasa, jadi mesin-mesin itu perlu mencantumkan alamatnya di{" "}
          <Code>insecure-registries</Code>, dan password adalah satu-satunya
          penghalang antara registry dan internet — lebih baik pakai domain.
        </li>
      </Ul>
      <Callout kind="warn" title="Memperbarui instalasi yang sudah ada">
        Binding hanya berubah saat container registry <strong>dibuat ulang</strong>.
        Setelah memperbarui aoox, registry yang sudah ada tetap mendengarkan di
        semua antarmuka sampai kamu mengaktifkannya ulang atau menerapkan/menghapus
        domain kustomnya. Selama itu kartu menampilkan alamat yang bisa dijangkau
        mesin lain. Membuat ulang tidak menghapus data dan kredensial. Kalau kamu
        push ke <Code>IP:5000</Code> dari laptop atau CI, itu berhenti bekerja
        setelahnya kecuali port dibuka seperti di atas atau beralih ke domain.
      </Callout>

      <H3>Domain kustom</H3>
      <P>
        Alternatif dari <Code>REGISTRY_PUBLIC_HOST</Code> + <Code>insecure-registries</Code>{" "}
        manual: arahkan registry lewat reverse proxy bawaan (Traefik) dengan
        sertifikat Let&apos;s Encrypt asli — <Code>docker push</Code>/<Code>login</Code>{" "}
        langsung percaya tanpa konfigurasi tambahan di daemon mana pun,
        termasuk node lain di Swarm.
      </P>
      <Ul>
        <li>Butuh proxy sudah diaktifkan (lihat <DocLink href="/id/docs/domain">Proxy &amp; domain</DocLink>) dengan <Code>PROXY_ACME_EMAIL</Code> terisi.</li>
        <li>
          Isi field <strong>Domain kustom</strong> di kartu Registry lokal
          (owner/admin) lalu <strong>Terapkan</strong> — container di-recreate
          dengan label Traefik (router <Code>aoox-registry</Code>), data &amp;
          kredensial tidak berubah. Bisa juga lewat CLI:
        </li>
      </Ul>
      <Pre>{`aoox registry domain --set registry.example.com`}</Pre>
      <P>
        Setelah domain aktif, <Code>docker login registry.example.com</Code>{" "}
        (tanpa port — HTTPS standar). Port host tetap di-bind sesuai pengaturan di
        atas (loopback secara default). Hapus domain dengan{" "}
        <Code>aoox registry domain --clear</Code> atau tombol{" "}
        <strong>Hapus domain</strong> di dashboard.
      </P>

      <span id="password" />
      <H3>Menampilkan atau mereset password</H3>
      <Ul>
        <li>
          <strong>Tampilkan password</strong> (ikon mata di kartu Registry
          lokal, owner dan admin) membaca lagi password yang tersimpan; tersembunyi
          sendiri setelah semenit dan setiap penampilan tercatat di audit log.
        </li>
        <li>
          <strong>Reset password</strong> (owner) membuat password baru, menulis
          ulang file login registry, dan me-restart container sebentar.{" "}
          <strong>Image tidak disentuh.</strong> Setiap klien dan job CI yang
          memakai password lama harus menjalankan <Code>docker login</Code>{" "}
          lagi. Kalau ada yang gagal di tengah jalan, password lama tetap
          berlaku.
        </li>
        <li>
          Lewat CLI: <Code>aoox registry password --show</Code> atau{" "}
          <Code>aoox registry password --reset --yes</Code>.
        </li>
      </Ul>

      <H3>Melihat & membersihkan isi</H3>
      <Ul>
        <li>
          Tab Registry lokal menampilkan repository<PathArrow />tag beserta{" "}
          <strong>digest</strong> dan <strong>ukuran</strong>. Nama repository ={" "}
          <Code>{"<project-slug>/<app-slug>"}</Code>.
        </li>
        <li>
          <strong>Hapus</strong> tag = hapus manifest. Tag lain yang menunjuk
          digest sama ikut hilang — UI memperingatkan.
        </li>
        <li>
          <strong>Garbage collect</strong> (owner) mengembalikan ruang disk
          setelah tag dihapus — dijalankan di dalam container registry yang
          sedang berjalan; ada mode <em>dry run</em> untuk melihat apa yang
          akan dihapus.
        </li>
        <li>
          <strong>Hapus image</strong> (tombol di header tiap repository)
          membuang repository itu <em>sepenuhnya</em>, bukan cuma satu tag:
          semua tag &amp; manifest-nya, foldernya di storage, lalu garbage
          collect otomatis — beda dari hapus tag satu-satu, dan ini yang
          dibutuhkan kalau sebuah repository menunjukkan{" "}
          <strong>&ldquo;0 tag&rdquo;</strong> tapi tidak mau hilang dari
          daftar walau garbage collect sudah dijalankan berkali-kali
          (garbage collect hanya membuang blob yang tidak terpakai, tidak
          pernah folder repository itu sendiri). Dialog konfirmasinya
          menampilkan aplikasi mana saja yang &ldquo;current image&rdquo;-nya
          tampak berasal dari repository ini — rollback atau redeploy tanpa
          build ke image itu akan gagal setelah dihapus.
        </li>
        <li>
          Menghapus tag yang masih dipakai container berjalan tidak
          menghentikannya, tapi rollback ke versi itu tidak lagi bisa.
        </li>
        <li>
          <strong>Hapus registry</strong> (owner) menghentikan container; volume
          data ditanyakan. Deploy tidak bisa dilakukan sampai diaktifkan lagi.
        </li>
      </Ul>

      <H2 id="pemeliharaan">Pemeliharaan disk</H2>
      <P>
        Supaya disk tidak penuh oleh image lama, aoox punya cleanup
        otomatis yang berjalan tiap malam
        pukul <Code>04:30</Code> (zona waktu server, UTC kecuali kamu mengisi{" "}
        <Code>TZ</Code>) dan bisa dipicu manual.
      </P>
      <Table
        head={["Yang dibersihkan", "Aturan"]}
        rows={[
          [
            "Deployment lama per aplikasi",
            <>
              Field <strong>Riwayat deployment</strong> di Pengaturan aplikasi
              (default <strong>10</strong>): deployment sukses di luar jumlah ini
              dipangkas, image-nya dihapus lokal <em>dan</em> dari registry.
              Image yang sedang dipakai tidak pernah disentuh.
            </>,
          ],
          ["Deployment gagal/queued", "Baris (log saja) lebih tua dari 30 hari dihapus."],
          ["Dangling image & build cache", "Dihapus di daemon lokal — tidak menyentuh image aplikasi."],
          ["Registry", "Garbage collect dijalankan setelah pemangkasan."],
        ]}
      />
      <Steps>
        <Step title={<>Docker<PathArrow />strip disk dan Detail</>}>
          <P>
            Strip di atas halaman Docker (host dipilih) menampilkan total pemakaian dan yang bisa dibebaskan; Detail menampilkan pemakaian image, container, volume, build cache,
            berapa yang bisa direklamasi, jumlah deployment yang bisa dipangkas,
            dan laporan cleanup terakhir.
          </P>
        </Step>
        <Step title="Bersihkan sekarang (owner)">
          <P>
            Menjalankan siklus yang sama secara on-demand. Laporan: deployment
            dipangkas, image dihapus, byte direklamasi, status GC registry, dan
            error bila ada.
          </P>
        </Step>
      </Steps>
      <Callout>
        Menurunkan <strong>Riwayat deployment</strong> mengurangi pilihan
        rollback. Untuk aplikasi penting, pertahankan ≥ 5; pemangkasan baru
        terjadi pada cleanup berikutnya.
      </Callout>

      <H2 id="eksternal">Registry eksternal</H2>
      <P>
        Tab <strong>Registry eksternal</strong> <PathArrow /><strong>Tambah registry</strong>{" "}
        (owner/admin): daftarkan kredensial Docker Hub, GHCR, GitLab, dsb.
      </P>
      <Table
        head={["Field", "Contoh"]}
        rows={[
          ["Nama", "GHCR perusahaan"],
          ["URL", <Code key="1">ghcr.io</Code>],
          ["Username / Password / token", "Token dengan akses baca (dan tulis bila perlu); disimpan terenkripsi"],
          ["Image prefix", <>Opsional, mis. <Code>myorg</Code> <PathArrow />image dirujuk sebagai <Code>{"<url>/<prefix>/<app>"}</Code></>],
        ]}
      />
      <Callout kind="warn" title="Belum dipakai pipeline">
        Saat ini pipeline deploy selalu mem-push ke registry lokal; registry
        eksternal baru bisa didaftarkan dan dites koneksinya. Dukungan
        men-deploy dari image di registry eksternal sedang dikerjakan.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Deploy gagal: No self-hosted registry", "Aktifkan registry lokal dulu."],
          ["Push manual: http: server gave HTTP response to HTTPS client", <><Code>REGISTRY_PUBLIC_HOST</Code> bukan localhost tanpa TLS. Tambahkan ke <Code>insecure-registries</Code> atau pasang reverse proxy TLS.</>],
          ["Disk tetap penuh setelah hapus tag", <>Jalankan Garbage collect, atau Bersihkan sekarang di strip disk di atas halaman Docker.</>],
          ["Repository “0 tag” tidak hilang walau sudah Garbage collect", "Garbage collect tidak pernah menghapus repository itu sendiri, hanya blob yang tidak terpakai. Pakai tombol Hapus image di header repository tersebut."],
          ["Rollback gagal: image not found", "Tag sudah dipangkas oleh retensi atau dihapus manual. Deploy ulang commit tersebut."],
          ["Kartu Registry: Docker tidak terjangkau", <><Code>DOCKER_GID</Code> salah atau socket tidak di-mount — lihat <DocLink href="/id/docs/troubleshooting">Troubleshooting</DocLink>.</>],
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
