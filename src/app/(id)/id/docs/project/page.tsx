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
  path: "/id/docs/project",
  lang: "id",
  title: "Project",
  description:
    "Wadah aplikasi, database, dan stack compose.",
})

const SUMMARY = [
  { k: "Isi", v: "Aplikasi · Stack compose · Managed database" },
  { k: "Berbagi", v: "Referensi database + set variabel bersama" },
  { k: "Akses", v: "Daftar anggota + peran per project" },
]

const TREE = `toko/                      ← project (memakai set variabel yang dibagikan kepadanya)
├── shop        aplikasi   Next.js, domain shop.example.com
├── worker      aplikasi   antrean, tanpa domain
├── app-db      database   PostgreSQL 16
├── cache       database   Redis 7
└── monitoring  stack      docker-compose (grafana + loki)`

const NEXT = [
  { title: "Membuat aplikasi", description: "Langkah berikutnya setelah project ada.", href: "/id/docs/aplikasi" },
  { title: "Variabel", description: "Set variabel yang dibagikan ke project.", href: "/id/docs/variabel" },
  { title: "Managed database", description: "Database per project.", href: "/id/docs/database" },
  { title: "Template one-click", description: "Stack siap pakai ke dalam project.", href: "/id/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/project"
      title="Project"
      description="Project adalah wadah untuk aplikasi, stack compose, dan managed database yang saling terkait. Variabel bersama berasal dari set variabel yang dibagikan kepadanya."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="konsep">Apa yang dikelompokkan project</H2>
      <Pre title="Contoh project toko">{TREE}</Pre>
      <Table
        head={["Yang dibagi dalam satu project", "Yang tidak"]}
        rows={[
          [
            <>
              Referensi <Code>{"${{database.<slug>…}}"}</Code> ke database di
              project yang sama,{" "}
              <DocLink href="/id/docs/variabel">set variabel</DocLink> yang
              dibagikan ke project (<Code>{"${{vars.KEY}}"}</Code>), nama
              repository image <Code>{"<project>/<app>"}</Code> di
              registry.
            </>,
            <>
              Network Docker — semua container berada di network{" "}
              <Code>aoox</Code> yang sama, lintas project. Isolasi ada di
              lapisan akses (daftar anggota), bukan jaringan.
            </>,
          ],
        ]}
      />
      <H3>Satu project atau banyak?</H3>
      <Ul>
        <li>
          <strong>Satu project per produk/lingkungan</strong>: <Code>toko</Code>,{" "}
          <Code>toko-staging</Code> — database dan akses terpisah rapi. Tidak perlu project tambahan hanya untuk variabel development/staging — pakai environment dari sebuah set variabel.
        </li>
        <li>
          Aplikasi yang berbagi database <strong>harus</strong> satu project
          agar bisa merujuknya lewat referensi.
        </li>
        <li>
          Slug database bersifat global (unik lintas project) — beri nama
          spesifik, mis. <Code>toko-db</Code>, bukan <Code>db</Code>.
        </li>
      </Ul>

      <H2 id="membuat">Membuat project</H2>
      <Steps>
        <Step title={<>Menu Projects<PathArrow />Project baru</>}>
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              [
                "Nama",
                <>
                  Mis. <Code>my-app</Code>. Versi slug-nya menjadi bagian nama
                  image di registry (<Code>{"<registry>/<project>/<app>:<tag>"}</Code>);
                  mengganti nama project setelah ada deployment membuat image
                  berikutnya memakai repository baru — yang lama tetap ada.
                </>,
              ],
              ["Deskripsi", "Opsional, tampil di daftar project."],
            ]}
          />
        </Step>
        <Step title="Halaman detail project">
          <P>
            Tiga section — <strong>Aplikasi</strong>, <strong>Stack compose</strong>,{" "}
            <strong>Database</strong> — masing-masing dengan tombol tambah
            (<em>Aplikasi baru</em>, <em>Stack compose baru</em> / <em>Dari template</em>,{" "}
            <em>Database baru</em>) dan status ringkas tiap item. Tab{" "}
            <strong>Pengaturan</strong> untuk nama, deskripsi, anggota, set
            variabel yang dibagikan ke project, dan hapus project.
          </P>
        </Step>
      </Steps>

      <H2 id="variabel">Variabel</H2>
      <P>
        Project tidak lagi punya environment sendiri. Variabel bersama berada
        di <DocLink href="/id/docs/variabel">set variabel</DocLink>: owner atau
        admin instance membuat set (dengan environment seperti{" "}
        <Code>development</Code>, <Code>staging</Code>, dan{" "}
        <Code>production</Code>) lalu membagikannya ke semua project atau ke
        project tertentu. Aplikasi dan stack di project itu kemudian menautkan
        environment set, berurutan, di tab <strong>Environment</strong>{" "}
        masing-masing dan merujuk nilainya dengan{" "}
        <Code>{"${{vars.KEY}}"}</Code>.
      </P>
      <Ul>
        <li>
          Tab <strong>Pengaturan</strong> project menampilkan set yang
          dibagikan kepadanya dan aplikasi serta stack mana yang memakainya.
        </li>
        <li>
          Peran project-mu menentukan apa yang boleh kamu lakukan pada nilai
          sebuah set: developer dan admin project membuka dan mengubah
          environment yang tidak dilindungi, viewer hanya melihat nama, dan
          environment terlindungi untuk owner dan admin instance. Menautkan atau
          melepas environment terlindungi butuh peran admin project.
        </li>
        <li>
          Upgrade dari 0.1.0-alpha.9: project yang environment-nya berisi
          menjadi satu set bernama sesuai project, hanya dibagikan kepadanya;
          lihat <DocLink href="/id/docs/variabel#upgrade">catatan upgrade</DocLink>.
        </li>
      </Ul>

      <H2 id="anggota">Anggota project</H2>
      <P>
        Tab <strong>Anggota</strong> di halaman project menentukan siapa yang
        melihat dan boleh mengubah project ini. Tambahkan dengan email akun
        yang sudah ada, lalu pilih perannya:
      </P>
      <Table
        head={["Peran project", "Boleh"]}
        rows={[
          [<strong key="a">admin</strong>, "Semua yang bisa developer + kelola anggota dan hapus project."],
          [<strong key="d">developer</strong>, "Aplikasi, database, stack, domain, mount, jobs, backup."],
          [<strong key="v">viewer</strong>, "Baca saja — status, log, metrik, daftar backup."],
        ]}
      />
      <Ul>
        <li>
          Pembuat project otomatis menjadi admin project; owner dan admin
          instance melihat semua project tanpa ditambahkan.
        </li>
        <li>
          Member instance lain hanya melihat project tempat ia ditambahkan —
          project lain menjawab 404. Detail di{" "}
          <DocLink href="/id/docs/pengguna-peran#project">Pengguna &amp; peran</DocLink>.
        </li>
      </Ul>

      <H2 id="export">Export & import project</H2>
      <P>
        Tombol <strong>Ekspor konfigurasi (JSON)</strong> di halaman project
        mengunduh definisi portabel: aplikasi, database, stack compose beserta
        domain, mount, jobs, dan jadwal backup. Referensi ke hal di luar
        project (server, registry, kredensial Git, tujuan S3) dibawa{" "}
        <em>berdasarkan nama</em>. Aplikasi dan stack mempertahankan tautan set
        variabelnya (nama set dan environment, berurutan); saat impor, set yang
        namanya sudah ada dipakai ulang dan tidak pernah ditimpa. File dari
        0.1.0-alpha.9 dan sebelumnya menjadi satu set variabel bernama sesuai
        project baru. Rinciannya di{" "}
        <DocLink href="/id/docs/variabel#ekspor-impor">Variabel</DocLink>.
      </P>
      <Table
        head={["Pilihan", "Isi"]}
        rows={[
          [<strong key="n">Tanpa rahasia</strong>, "Default. Tautan set variabel diekspor menurut nama, tetapi nilai set, password database, dan secret tidak disertakan."],
          [
            <strong key="s">Dengan rahasia</strong>,
            "Hanya owner instance. Berisi set variabel yang dipakai project (beserta nilainya) dan password database apa adanya — perlakukan file seperti file rahasia.",
          ],
        ]}
      />
      <Steps>
        <Step title="Impor di instance lain">
          <P>
            <strong>Projects<PathArrow />Impor project</strong>: pilih file, beri nama
            baru atau pakai nama dari file.
          </P>
        </Step>
        <Step title="Periksa peringatan">
          <P>
            Slug dipakai ulang bila masih bebas; port host atau domain yang
            bentrok dan referensi yang tidak ditemukan dilaporkan sebagai{" "}
            <em>Perlu diperiksa</em> — bukan gagal. Database di-provision di
            latar; jobs dan jadwal backup langsung didaftarkan.
          </P>
        </Step>
      </Steps>
      <Callout>
        Export/import memindahkan <strong>konfigurasi</strong>, bukan data.
        Untuk isi database dan volume, pakai{" "}
        <DocLink href="/id/docs/backup">backup &amp; restore</DocLink>; untuk
        memindahkan seluruh panel, pakai{" "}
        <DocLink href="/id/docs/backup#instance">backup instance</DocLink>.
      </Callout>

      <H2 id="dashboard">Di Dashboard</H2>
      <P>
        Dashboard menampilkan ringkasan: jumlah project yang punya sesuatu yang{" "}
        <em>running</em> (aplikasi, database, atau stack) dan daftar project
        terbaru dengan tautan <em>Lihat semua</em>.
      </P>

      <H2 id="kepemilikan">Kepemilikan & akses</H2>
      <Ul>
        <li>
          Project mencatat pembuatnya, dan ia selalu menjadi admin project.
          Siapa lagi yang melihatnya ditentukan daftar anggota di atas —
          lihat <DocLink href="/id/docs/pengguna-peran#project">Pengguna &amp; peran</DocLink>.
        </li>
        <li>
          Pengguna yang masih memiliki project tidak bisa dihapus dari tim —
          hapus project-nya dulu (kepemilikan belum bisa dipindahkan dari UI).
        </li>
        <li>Semua perubahan project tercatat di audit log.</li>
      </Ul>

      <H2 id="hapus">Menghapus project</H2>
      <Callout kind="warn" title="Baca sebelum menghapus">
        Menghapus project menghapus <strong>catatan</strong> aplikasi, stack
        compose, database, dan backup-nya di aoox (cascade) — tetapi{" "}
        <strong>container dan volume Docker-nya tidak dihentikan/dihapus</strong>.
        Mereka jadi yatim: tetap berjalan, memakai disk, tanpa bisa dikelola
        dari dashboard.
      </Callout>
      <Steps>
        <Step title="Hapus isinya dulu dari dashboard">
          <P>
            Aplikasi (hapus), stack compose (Hapus = <Code>down --volumes</Code>),
            database (hapus + purge volume bila memang tidak dibutuhkan). Unduh
            backup yang masih diperlukan.
          </P>
        </Step>
        <Step title="Baru hapus project">
          <P>Tab Pengaturan project<PathArrow />hapus. Backup yang sudah diunduh tidak terpengaruh.</P>
        </Step>
      </Steps>
      <P>Bila terlanjur, bersihkan yatim dari terminal:</P>
      <Pre>{`docker ps -a --filter label=com.docker.compose.project=aoox
docker rm -f aoox-app-<slug> aoox-db-<slug>
docker volume rm aoox_app_<slug>_<nama> aoox_db_<slug>`}</Pre>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Referensi ${{database.x.url}} 400 padahal database ada", "Database di project lain. Referensi hanya dalam project yang sama."],
          ["Set variabel diubah, aplikasi tidak berubah", "Container belum dibuat ulang. Deploy/rollback aplikasi yang menautkannya."],
          ["Tidak bisa menghapus environment atau set, atau berhenti membagikan set", "Masih ada aplikasi atau stack yang menautkannya (pesan menyebutnya). Lepas tautannya dulu."],
          ["Tidak bisa menampilkan nilai production", "Environment terlindungi hanya untuk owner dan admin instance. Minta salah satunya, atau pakai environment yang tidak dilindungi."],
          ["Tidak bisa menghapus anggota tim", "Ia masih memiliki project. Hapus project itu, atau biarkan akunnya."],
          ["Project tidak terlihat oleh rekan", "Ia belum ditambahkan sebagai anggota project (member instance hanya melihat project yang ditugaskan)."],
          ["Impor: banyak peringatan referensi", "Server/registry/kredensial dengan nama itu belum ada di instance tujuan. Buat dulu, lalu sesuaikan aplikasi."],
          ["Container masih jalan setelah project dihapus", "Sesuai perilaku saat ini — hapus manual lewat terminal (lihat atas)."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Pindah kepemilikan project; menghentikan/menghapus container otomatis
        saat project dihapus; impor yang
        membawa data (bukan hanya konfigurasi).
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
