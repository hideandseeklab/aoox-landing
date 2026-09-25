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

export const metadata: Metadata = { title: "Project" }

const SUMMARY = [
  { k: "Isi", v: "Aplikasi · Stack compose · Managed database" },
  { k: "Berbagi", v: "Environment bersama + referensi database" },
  { k: "Akses", v: "Daftar anggota + peran per project" },
]

const TREE = `toko/                      ← project (env bersama: APP_ENV, SENTRY_DSN)
├── shop        aplikasi   Next.js, domain shop.example.com
├── worker      aplikasi   antrean, tanpa domain
├── app-db      database   PostgreSQL 16
├── cache       database   Redis 7
└── monitoring  stack      docker-compose (grafana + loki)`

const NEXT = [
  { title: "Membuat aplikasi", description: "Langkah berikutnya setelah project ada.", href: "/docs/aplikasi" },
  { title: "Environment variables", description: "Env project vs aplikasi, referensi database.", href: "/docs/environment" },
  { title: "Managed database", description: "Database per project.", href: "/docs/database" },
  { title: "Template one-click", description: "Stack siap pakai ke dalam project.", href: "/docs/template" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/project"
      title="Project"
      description="Project adalah wadah untuk aplikasi, stack compose, dan managed database yang saling terkait, lengkap dengan environment bersama."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
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
              Environment bersama (<Code>{"${{project.KEY}}"}</Code>), referensi{" "}
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
          <Code>toko-staging</Code> — env bersama dan database terpisah rapi.
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
        <Step title="Menu Projects → Project baru">
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
              ["Environment bersama", "Boleh diisi nanti di tab Pengaturan."],
            ]}
          />
        </Step>
        <Step title="Halaman detail project">
          <P>
            Tiga section — <strong>Aplikasi</strong>, <strong>Stack compose</strong>,{" "}
            <strong>Database</strong> — masing-masing dengan tombol tambah
            (<em>Aplikasi baru</em>, <em>Stack compose baru</em> / <em>Dari template</em>,{" "}
            <em>Database baru</em>) dan status ringkas tiap item. Tab{" "}
            <strong>Pengaturan</strong> untuk nama, deskripsi, env bersama, dan
            hapus project.
          </P>
        </Step>
      </Steps>

      <H2 id="env-bersama">Environment bersama</H2>
      <P>
        Editor di tab Pengaturan project, format <Code>KEY=VALUE</Code> per
        baris (komentar <Code>#</Code> diabaikan). Nilainya <em>tidak</em>{" "}
        otomatis masuk ke container — aplikasi/stack merujuknya secara
        eksplisit:
      </P>
      <Pre title="Env project">{`APP_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1
SMTP_HOST=smtp.example.com`}</Pre>
      <Pre title="Env aplikasi shop">{`NODE_ENV=\${{project.APP_ENV}}
SENTRY_DSN=\${{project.SENTRY_DSN}}
DATABASE_URL=\${{database.app-db.url}}`}</Pre>
      <Ul>
        <li>
          Key yang sama di env aplikasi <strong>menang</strong> atas env project.
        </li>
        <li>
          Perubahan env project baru berlaku di container yang{" "}
          <strong>dibuat ulang</strong> setelahnya — deploy/rollback tiap
          aplikasi yang merujuknya (tidak otomatis).
        </li>
        <li>
          Cocok untuk: DSN Sentry, host SMTP, feature flag lingkungan. Kurang
          cocok untuk: rahasia per aplikasi (taruh di env aplikasi).
        </li>
        <li>
          Detail sintaks dan urutan penggabungan di{" "}
          <DocLink href="/docs/environment#alur">Environment variables</DocLink>.
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
          <DocLink href="/docs/pengguna-peran#project">Pengguna &amp; peran</DocLink>.
        </li>
      </Ul>

      <H2 id="export">Export & import project</H2>
      <P>
        Tombol <strong>Ekspor konfigurasi (JSON)</strong> di halaman project
        mengunduh definisi portabel: aplikasi, database, stack compose beserta
        domain, mount, jobs, dan jadwal backup. Referensi ke hal di luar
        project (server, registry, kredensial Git, tujuan S3) dibawa{" "}
        <em>berdasarkan nama</em>.
      </P>
      <Table
        head={["Pilihan", "Isi"]}
        rows={[
          [<strong key="n">Tanpa rahasia</strong>, "Default. Password database dan secret tidak disertakan."],
          [
            <strong key="s">Dengan password database</strong>,
            "Hanya owner instance. File berisi kredensial — perlakukan seperti file rahasia.",
          ],
        ]}
      />
      <Steps>
        <Step title="Impor di instance lain">
          <P>
            <strong>Projects → Impor project</strong>: pilih file, beri nama
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
        <DocLink href="/docs/backup">backup &amp; restore</DocLink>; untuk
        memindahkan seluruh panel, pakai{" "}
        <DocLink href="/docs/backup#instance">backup instance</DocLink>.
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
          lihat <DocLink href="/docs/pengguna-peran#project">Pengguna &amp; peran</DocLink>.
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
          <P>Tab Pengaturan project → hapus. Backup yang sudah diunduh tidak terpengaruh.</P>
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
          ["Env project diubah, aplikasi tidak berubah", "Container belum dibuat ulang. Deploy/rollback aplikasi yang merujuknya."],
          ["Tidak bisa menghapus anggota tim", "Ia masih memiliki project. Hapus project itu, atau biarkan akunnya."],
          ["Project tidak terlihat oleh rekan", "Ia belum ditambahkan sebagai anggota project (member instance hanya melihat project yang ditugaskan)."],
          ["Impor: banyak peringatan referensi", "Server/registry/kredensial dengan nama itu belum ada di instance tujuan. Buat dulu, lalu sesuaikan aplikasi."],
          ["Container masih jalan setelah project dihapus", "Sesuai perilaku saat ini — hapus manual lewat terminal (lihat atas)."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Pindah kepemilikan project; menghentikan/menghapus container otomatis
        saat project dihapus; env project terenkripsi terpisah; impor yang
        membawa data (bukan hanya konfigurasi).
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
