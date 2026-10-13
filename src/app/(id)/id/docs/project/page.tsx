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
    "Wadah aplikasi, database, dan environment.",
})

const SUMMARY = [
  { k: "Isi", v: "Aplikasi · Stack compose · Managed database" },
  { k: "Berbagi", v: "Environment + referensi database" },
  { k: "Akses", v: "Daftar anggota + peran per project" },
]

const TREE = `toko/                      ← project (environment: development, staging, production)
├── shop        aplikasi   Next.js, domain shop.example.com
├── worker      aplikasi   antrean, tanpa domain
├── app-db      database   PostgreSQL 16
├── cache       database   Redis 7
└── monitoring  stack      docker-compose (grafana + loki)`

const NEXT = [
  { title: "Membuat aplikasi", description: "Langkah berikutnya setelah project ada.", href: "/id/docs/aplikasi" },
  { title: "Environment variables", description: "Env project vs aplikasi, referensi database.", href: "/id/docs/environment" },
  { title: "Managed database", description: "Database per project.", href: "/id/docs/database" },
  { title: "Template one-click", description: "Stack siap pakai ke dalam project.", href: "/id/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/project"
      title="Project"
      description="Project adalah wadah untuk aplikasi, stack compose, dan managed database yang saling terkait, lengkap dengan environment (development, staging, production) untuk variabelnya."
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
              Environment (<Code>{"${{project.KEY}}"}</Code>), referensi{" "}
              <Code>{"${{database.<slug>…}}"}</Code> ke database di project yang
              sama, nama repository image <Code>{"<project>/<app>"}</Code> di
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
          <Code>toko-staging</Code> — environment dan database terpisah rapi. Tidak perlu project tambahan hanya untuk variabel development/staging — pakai environment bawaan.
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
              ["Environment", "Project baru mulai dengan development, staging, dan production. Isi variabelnya nanti di tab Environment."],
            ]}
          />
        </Step>
        <Step title="Halaman detail project">
          <P>
            Tiga section — <strong>Aplikasi</strong>, <strong>Stack compose</strong>,{" "}
            <strong>Database</strong> — masing-masing dengan tombol tambah
            (<em>Aplikasi baru</em>, <em>Stack compose baru</em> / <em>Dari template</em>,{" "}
            <em>Database baru</em>) dan status ringkas tiap item. Tab{" "}
            <strong>Environment</strong> untuk variabel per environment; tab{" "}
            <strong>Pengaturan</strong> untuk nama, deskripsi, dan hapus project.
          </P>
        </Step>
      </Steps>

      <H2 id="environments">Environment</H2>
      <P>
        Project punya <strong>environment</strong>: <Code>development</Code>,{" "}
        <Code>staging</Code>, dan <Code>production</Code> sejak awal, dan Anda
        bisa menambah yang lain. Tiap environment menyimpan variabel{" "}
        <Code>KEY=VALUE</Code> sendiri (satu per baris, komentar <Code>#</Code>{" "}
        diabaikan), <strong>terenkripsi saat disimpan</strong>. Nilainya{" "}
        <em>tidak</em> otomatis masuk ke container — aplikasi/stack merujuknya
        secara eksplisit:
      </P>
      <Pre title="Environment production">{`APP_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1
SMTP_HOST=smtp.example.com`}</Pre>
      <Pre title="Env aplikasi shop">{`NODE_ENV=\${{project.APP_ENV}}
SENTRY_DSN=\${{project.SENTRY_DSN}}
DATABASE_URL=\${{database.app-db.url}}`}</Pre>
      <H3>Menautkan aplikasi atau stack</H3>
      <Ul>
        <li>
          Setiap aplikasi dan stack compose ditautkan ke{" "}
          <strong>satu environment</strong> project-nya, dipilih lewat pilihan{" "}
          <strong>Environment</strong> di Pengaturan aplikasi (atau pengaturan
          stack compose). Bila tidak dipilih: <Code>production</Code> untuk admin
          project, dan environment pertama yang tidak dilindungi (
          <Code>development</Code>) untuk yang lain; jika project hanya punya{" "}
          <Code>production</Code>, non-admin mendapat 403.
        </li>
        <li>
          Menautkan ke <Code>production</Code> (atau environment terlindungi
          mana pun), atau memindahkan sesuatu dari situ, membutuhkan{" "}
          <strong>admin project</strong>: developer mendapat 403 dan pilihan
          Environment menampilkan environment terlindungi sebagai nonaktif.
          Aturan yang sama berlaku saat membuat aplikasi atau stack dan saat
          men-deploy template. Tautan yang sudah ada tidak berubah.
        </li>
        <li>
          <Code>{"${{project.KEY}}"}</Code> diambil dari{" "}
          <strong>environment yang ditautkan</strong>. Prioritas, dari terendah
          ke tertinggi: environment &lt; sumber secret eksternal (Infisical,
          bila sync menyala) &lt; env aplikasi itu sendiri.
        </li>
        <li>
          Memindahkan aplikasi ke environment yang tidak punya{" "}
          <Code>{"${{project.KEY}}"}</Code> yang dirujuknya ditolak dengan
          pesan yang menyebut key-nya.
        </li>
        <li>
          Perubahan baru berlaku di container yang <strong>dibuat ulang</strong>{" "}
          setelahnya — untuk aplikasi, pada <strong>deploy berikutnya</strong>,
          tidak langsung.
        </li>
        <li>
          Cocok untuk: DSN Sentry, host SMTP, feature flag per environment.
          Kurang cocok untuk: rahasia per aplikasi (taruh di env aplikasi).
        </li>
        <li>
          Detail sintaks dan urutan penggabungan di{" "}
          <DocLink href="/id/docs/environment#alur">Environment variables</DocLink>.
        </li>
      </Ul>
      <H3>Melihat dan perlindungan</H3>
      <P>
        Di tab <strong>Environment</strong> project, daftar menampilkan nama
        variabel dengan <strong>nilai disamarkan</strong>. <em>Tampilkan</em>{" "}
        memperlihatkan nilainya; ini aksi yang diaudit — audit log mencatat
        bahwa aksi itu terjadi, tanpa nilainya.
      </P>
      <Table
        head={["Siapa", "Development / staging / kustom", "production (dilindungi)"]}
        rows={[
          [<strong key="a">Admin project</strong>, "Tampilkan dan ubah.", "Tampilkan dan ubah."],
          [<strong key="d">Developer</strong>, "Tampilkan dan ubah.", "Hanya nama variabel — tidak bisa menampilkan atau mengubah."],
          [<strong key="v">Viewer</strong>, "Hanya nama variabel.", "Hanya nama variabel."],
        ]}
      />
      <Ul>
        <li>
          Admin project adalah owner dan admin platform, pembuat project, dan
          anggota dengan peran project <Code>admin</Code>.
        </li>
        <li>
          Developer bisa <strong>menambah</strong> environment; hanya admin
          project yang bisa <strong>menghapus</strong>. <Code>production</Code>{" "}
          tidak pernah bisa dihapus, dan environment yang masih dipakai
          aplikasi atau stack tidak bisa dihapus — pesannya menyebut yang
          memakainya.
        </li>
        <li>
          Nilai disamarkan di log deployment menurut tanda rahasia variabelnya:
          variabel <em>Rahasia</em> selalu disamarkan, berapa pun panjangnya;
          variabel yang ditandai <em>bukan rahasia</em> tidak pernah
          disamarkan; variabel tanpa tanda disamarkan hanya bila nilainya
          tampak seperti rahasia (8 karakter atau lebih, bukan satu kata biasa
          seperti <Code>production</Code>, bukan hanya angka), agar teks log
          biasa tidak rusak. Nama yang memuat password, secret, token, key,
          private, atau credential otomatis ditandai Rahasia saat pertama kali
          ditambahkan (upgrade menandai yang sudah ada). Lihat{" "}
          <DocLink href="/id/docs/environment#flag-rahasia">Variabel rahasia</DocLink>.
        </li>
      </Ul>
      <Callout kind="warn" title="Cakupan perlindungan">
        Perlindungan mencakup <em>melihat dan mengubah nilai tersimpan</em> serta{" "}
        <em>penautan</em> ke atau dari environment terlindungi. Siapa pun yang
        bisa membuka console container resource yang sudah tertaut ke{" "}
        <Code>production</Code> tetap bisa melihat nilainya saat runtime —
        seperti env var pada umumnya.
      </Callout>
      <Callout>
        <strong>Saat upgrade:</strong> teks &ldquo;Environment bersama&rdquo;
        tunggal yang dulu dimiliki project dipindahkan ke{" "}
        <Code>production</Code>, dan semua aplikasi serta stack ditautkan
        ke sana, jadi tidak ada yang berubah saat upgrade.
      </Callout>

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
        <em>berdasarkan nama</em>. Aplikasi dan stack mempertahankan tautan
        environment-nya; saat impor dicocokkan berdasarkan nama. File ekspor
        lama yang membawa satu env project diimpor ke <Code>production</Code>.
      </P>
      <Table
        head={["Pilihan", "Isi"]}
        rows={[
          [<strong key="n">Tanpa rahasia</strong>, "Default. Environment diekspor (nama dan tautan), tetapi variabel, password database, dan secret tidak disertakan."],
          [
            <strong key="s">Dengan rahasia</strong>,
            "Hanya owner instance. Berisi variabel environment dan password database apa adanya — perlakukan file seperti file rahasia.",
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
          ["Environment diubah, aplikasi tidak berubah", "Container belum dibuat ulang. Deploy/rollback aplikasi yang merujuknya."],
          ["Tidak bisa menghapus environment", "Itu environment production yang dilindungi, atau masih ada aplikasi/stack yang tertaut (pesan menyebutnya). Pindahkan dulu."],
          ["Tidak bisa menampilkan nilai production", "Hanya admin project yang bisa menampilkan atau mengubah production. Minta salah satunya, atau pakai environment non-production."],
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
