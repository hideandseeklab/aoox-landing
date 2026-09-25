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
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Environment variables" }

const SUMMARY = [
  { k: "Dua lapis", v: "Env project (bersama) + env aplikasi" },
  { k: "Diterapkan", v: "Saat container dibuat, bukan saat build" },
  { k: "Referensi", v: "${{project.KEY}} · ${{database.<slug>.url}}" },
]

const RESOLVE = [
  { s: "env project", d: "KEY=VALUE bersama satu project" },
  { s: "env aplikasi", d: "menimpa key yang sama" },
  { s: "resolve ${{…}}", d: "project & database di project yang sama" },
  { s: "container", d: "hasil akhir masuk ke container" },
]

const NEXT = [
  { title: "Managed database", description: "Slug database yang bisa direferensikan.", href: "/docs/database" },
  { title: "Project", description: "Mengisi environment bersama.", href: "/docs/project" },
  { title: "Cara build", description: "Build args untuk nilai saat build.", href: "/docs/build#build-args" },
  { title: "Stack compose", description: "Env sebagai sumber interpolasi compose.", href: "/docs/compose#env" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/environment"
      title="Environment variables"
      description="Env aplikasi, env bersama project, dan referensi ke kredensial managed database — semuanya diselesaikan saat container dibuat."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="editor">Editor env</H2>
      <P>
        Tab <strong>Pengaturan</strong> aplikasi punya editor{" "}
        <strong>Environment variables</strong> dengan dua mode:
      </P>
      <Table
        head={["Mode", "Untuk apa"]}
        rows={[
          ["Per baris", "Satu key satu input; nilai disamarkan (input password) dengan toggle tampilkan. Cocok untuk mengubah satu nilai."],
          ["Teks", <>Textarea bebas — tempel isi <Code>.env</Code> apa adanya. Cocok untuk migrasi awal.</>],
        ]}
      />
      <P>
        Keduanya disimpan sebagai teks <Code>KEY=VALUE</Code> per baris. API
        tetap mengembalikan nilai asli — penyamaran hanya di UI.
      </P>
      <Pre title="Format yang diterima">{`PORT=3000
NODE_ENV=production
# baris komentar diabaikan
MESSAGE=nilai boleh mengandung spasi dan = di tengah
EMPTY=`}</Pre>

      <H2 id="alur">Bagaimana env digabung</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {RESOLVE.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Ul>
        <li>
          Bila key yang sama ada di env project dan env aplikasi,{" "}
          <strong>nilai aplikasi menang</strong>.
        </li>
        <li>
          Penggabungan dan resolusi terjadi <strong>setiap kali container dibuat</strong>:
          deploy, rollback, atau recreate karena domain/mount berubah.
        </li>
        <li>
          Env <strong>tidak tersedia saat build</strong>. Untuk itu pakai{" "}
          <DocLink href="/docs/build#build-args">Build args</DocLink> (non-rahasia).
        </li>
      </Ul>

      <H2 id="referensi">Referensi</H2>
      <Table
        head={["Sintaks", "Menghasilkan"]}
        rows={[
          [<Code key="1">{"${{project.KEY}}"}</Code>, "Nilai KEY dari environment bersama project."],
          [<Code key="2">{"${{database.<slug>.url}}"}</Code>, "URL koneksi internal managed database (host = nama container)."],
          [<Code key="3">{"${{database.<slug>.host}}"}</Code>, "Nama container database, mis. aoox-db-app-db."],
          [<Code key="4">{"${{database.<slug>.port}}"}</Code>, "Port engine di dalam network (5432, 3306, 6379)."],
          [<Code key="5">{"${{database.<slug>.username}}"}</Code>, "Username."],
          [<Code key="6">{"${{database.<slug>.password}}"}</Code>, "Password (disensor di log)."],
          [<Code key="7">{"${{database.<slug>.database}}"}</Code>, "Nama database."],
          [
            <Code key="8">{"${{database.<slug>.url:<nama>}}"}</Code>,
            "Database lain di server yang sama (mis. yang dibuat lewat query CREATE DATABASE): host/user/password sama, hanya bagian nama database yang berbeda.",
          ],
        ]}
      />
      <H3>Contoh lengkap</H3>
      <Pre title="Env project (bersama)">{`APP_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1`}</Pre>
      <Pre title="Env aplikasi web">{`NODE_ENV=\${{project.APP_ENV}}
SENTRY_DSN=\${{project.SENTRY_DSN}}
DATABASE_URL=\${{database.app-db.url}}
REDIS_URL=\${{database.cache.url}}
PORT=3000`}</Pre>
      <Pre title="Hasil di container (ilustrasi)">{`NODE_ENV=production
SENTRY_DSN=https://abc@sentry.example.com/1
DATABASE_URL=postgresql://app_db:s3cr3t@aoox-db-app-db:5432/app_db
REDIS_URL=redis://:s3cr3t@aoox-db-cache:6379
PORT=3000`}</Pre>
      <Ul>
        <li>
          Database hanya dicari di <strong>project yang sama</strong> — aplikasi
          tidak bisa membaca kredensial project lain. Slug adalah nama yang
          tampil di halaman database.
        </li>
        <li>
          Referensi tak dikenal → <strong>400</strong> saat menyimpan
          Pengaturan; bila baru salah saat deploy (mis. database dihapus) →
          deployment <Code>failed</Code>.
        </li>
        <li>
          Memutar password database → berlaku di deploy/rollback berikutnya
          tanpa build ulang.
        </li>
      </Ul>

      <H2 id="rahasia">Rahasia & log</H2>
      <Ul>
        <li>
          Password database yang ter-resolve dan token Git otomatis disensor
          dari log deployment dan pesan error.
        </li>
        <li>
          Nilai env lain <strong>tidak</strong> disensor — jangan mencetak env ke
          stdout dari aplikasi.
        </li>
        <li>
          Env disimpan sebagai teks di database aoox; akses ke halaman
          Pengaturan = akses ke nilainya. Semua anggota bisa membuka semua
          project.
        </li>
      </Ul>

      <H2 id="compose">Stack compose</H2>
      <Callout>
        Stack compose memakai mekanisme yang sama: env ter-resolve ditulis ke{" "}
        <Code>.aoox.env</Code> dan dipakai sebagai <Code>--env-file</Code>{" "}
        — sumber interpolasi <Code>{"${VAR}"}</Code> di file compose,{" "}
        <strong>bukan</strong> otomatis masuk ke container. Teruskan lewat{" "}
        <Code>environment:</Code> di tiap service — lihat{" "}
        <DocLink href="/docs/compose#env">Stack compose</DocLink>.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Env baru tidak terbaca aplikasi", "Belum ada container baru — deploy atau rollback sekali lagi."],
          ["400 saat menyimpan: referensi tidak dikenal", "Slug database salah, atau database ada di project lain."],
          [<><Code>NEXT_PUBLIC_*</Code> / nilai saat build kosong</>, "Env tidak ada di tahap build. Pindahkan ke Build args (kalau bukan rahasia) atau baca saat runtime."],
          ["Nilai dengan tanda kutip ikut terbawa", <>Tulis tanpa kutip: <Code>KEY=nilai</Code>, bukan <Code>KEY=&quot;nilai&quot;</Code>.</>],
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
