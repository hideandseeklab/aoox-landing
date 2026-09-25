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

export const metadata: Metadata = { title: "Registry" }

const SUMMARY = [
  { k: "Registry lokal", v: "Wajib — tempat image hasil build" },
  { k: "Registry eksternal", v: "Kredensial untuk registry lain" },
  { k: "Pemeliharaan", v: "Retensi per aplikasi + cleanup malam" },
]

const IMAGE_FLOW = [
  { s: "build", d: "image dibuat oleh daemon Docker" },
  { s: "push", d: "→ localhost:5000/<project>/<app>:<id>" },
  { s: "run", d: "container dibuat dari image itu" },
  { s: "rollback", d: "image lama ditarik lagi dari registry" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Kenapa tag lama perlu disimpan.", href: "/docs/deploy#rollback" },
  { title: "Cara build", description: "Bagaimana image dinamai.", href: "/docs/build#image" },
  { title: "Monitoring", description: "Pemakaian disk Docker di Dashboard.", href: "/docs/monitoring#host" },
  { title: "Instalasi", description: "REGISTRY_PORT & REGISTRY_PUBLIC_HOST di .env.dist.", href: "/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/registry"
      title="Registry"
      description="Registry lokal tempat image hasil build disimpan (prasyarat deploy), registry eksternal, dan pemeliharaan disk."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="peran">Peran registry dalam deploy</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
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
        kembali dari sana. Karena itu registry harus di-provision{" "}
        <strong>sebelum deploy pertama</strong> — tanpa itu deploy gagal dengan
        pesan <em>No self-hosted registry</em>. Aplikasi di{" "}
        <DocLink href="/docs/server-remote">server remote</DocLink> tidak
        memakai registry (image tetap di daemon server).
      </P>

      <H2 id="lokal">Registry lokal</H2>
      <Steps>
        <Step title="Menu Registry → tab Registry lokal → Provision registry (owner)">
          <P>
            aoox menjalankan <Code>registry:3</Code> sebagai container{" "}
            <Code>aoox-registry</Code> dengan autentikasi htpasswd, data di
            volume <Code>aoox_registry_data</Code>, dan penghapusan tag
            diaktifkan. Kartu menampilkan status <em>Registry siap</em>,
            container, dan URL.
          </P>
        </Step>
        <Step title="Simpan kredensial yang ditampilkan sekali">
          <P>
            Username <Code>aoox</Code> dan password acak hanya tampil
            sekali — klik <strong>Sudah saya simpan</strong> setelah mencatatnya.
            Deploy dari dashboard <strong>tidak</strong> membutuhkannya; kredensial
            ini untuk push manual dari mesin lain.
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
            <Code key="2">REGISTRY_PUBLIC_HOST</Code>,
            "localhost",
            <>
              Host yang dipakai <Code>docker push</Code>. <Code>localhost</Code>{" "}
              dikecualikan dari aturan insecure-registry Docker; host lain butuh
              TLS (reverse proxy) atau entri <Code>insecure-registries</Code> di{" "}
              <Code>daemon.json</Code> setiap daemon yang mem-push.
            </>,
          ],
        ]}
      />

      <H3>Melihat & membersihkan isi</H3>
      <Ul>
        <li>
          Tab Registry lokal menampilkan repository → tag beserta{" "}
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
          Menghapus tag yang masih dipakai container berjalan tidak
          menghentikannya, tapi rollback ke versi itu tidak lagi bisa.
        </li>
        <li>
          <strong>Hapus registry</strong> (owner) menghentikan container; volume
          data ditanyakan. Deploy tidak bisa dilakukan sampai di-provision lagi.
        </li>
      </Ul>

      <H2 id="pemeliharaan">Pemeliharaan disk</H2>
      <P>
        Supaya disk tidak penuh oleh image lama, aoox punya cleanup
        otomatis yang berjalan tiap malam
        pukul <Code>04:30</Code> (UTC) dan bisa dipicu manual.
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
        <Step title="Settings → Disk Docker">
          <P>
            Kartu menampilkan pemakaian image, container, volume, build cache,
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
        Tab <strong>Registry eksternal</strong> → <strong>Tambah registry</strong>{" "}
        (owner/admin): daftarkan kredensial Docker Hub, GHCR, GitLab, dsb.
      </P>
      <Table
        head={["Field", "Contoh"]}
        rows={[
          ["Nama", "GHCR perusahaan"],
          ["URL", <Code key="1">ghcr.io</Code>],
          ["Username / Password / token", "Token dengan akses baca (dan tulis bila perlu); disimpan terenkripsi"],
          ["Image prefix", <>Opsional, mis. <Code>myorg</Code> → image dirujuk sebagai <Code>{"<url>/<prefix>/<app>"}</Code></>],
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
          ["Deploy gagal: No self-hosted registry", "Provision registry lokal dulu."],
          ["Push manual: http: server gave HTTP response to HTTPS client", <><Code>REGISTRY_PUBLIC_HOST</Code> bukan localhost tanpa TLS. Tambahkan ke <Code>insecure-registries</Code> atau pasang reverse proxy TLS.</>],
          ["Disk tetap penuh setelah hapus tag", "Jalankan Garbage collect, atau Bersihkan sekarang di Settings → Disk Docker."],
          ["Rollback gagal: image not found", "Tag sudah dipangkas oleh retensi atau dihapus manual. Deploy ulang commit tersebut."],
          ["Kartu Registry: Docker tidak terjangkau", <><Code>DOCKER_GID</Code> salah atau socket tidak di-mount — lihat <DocLink href="/docs/troubleshooting">Troubleshooting</DocLink>.</>],
        ]}
      />

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
