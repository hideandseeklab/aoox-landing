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
  Table,
  Ul,
} from "@/components/docs/prose"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/id/docs/environment",
  lang: "id",
  title: "Environment variables",
  description:
    "Environment project, env aplikasi, dan referensi ke database.",
})

const SUMMARY = [
  { k: "Lapisan", v: "Environment project + sumber secret + env aplikasi" },
  { k: "Diterapkan", v: "Saat container dibuat, bukan saat build" },
  { k: "Referensi", v: "${{project.KEY}} · ${{database.<slug>.url}}" },
]

const RESOLVE = [
  { s: "environment", d: "environment project yang ditautkan ke aplikasi (terendah)" },
  { s: "sumber secret", d: "Infisical, bila sync menyala, menimpanya" },
  { s: "env aplikasi", d: "menimpa key yang sama (tertinggi)" },
  { s: "resolve ${{…}}", d: "project & database di project yang sama" },
  { s: "container", d: "hasil akhir masuk ke container" },
]

const NEXT = [
  { title: "Managed database", description: "Slug database yang bisa direferensikan.", href: "/id/docs/database" },
  { title: "Project", description: "Environment, perlindungan, dan penautan.", href: "/id/docs/project" },
  { title: "Cara build", description: "Build args untuk nilai saat build.", href: "/id/docs/build#build-args" },
  { title: "Stack compose", description: "Env sebagai sumber interpolasi compose.", href: "/id/docs/compose#env" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/environment"
      title="Environment variables"
      description="Env aplikasi, environment project, dan referensi ke kredensial managed database — semuanya diselesaikan saat container dibuat."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="editor">Editor env</H2>
      <P>
        Tab <strong>Environment</strong> aplikasi (setelah Mount) punya editor{" "}
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

      <P>
        Tab ini punya tombol <strong>Simpan</strong> sendiri yang hanya
        menyimpan env, jadi menyimpan Pengaturan lain tidak pernah menimpanya.
        Viewer melihat env tanpa bisa mengubahnya.
      </P>

      <H2 id="secret">Sumber secret (Infisical)</H2>
      <P>
        Alih-alih menyalin rahasia ke env, aplikasi bisa mengambilnya dari
        Infisical saat container dibuat.
      </P>
      <Ul>
        <li>
          <strong>Koneksi</strong>: owner/admin menambahkannya di Integrasi
          <PathArrow />Secret manager (nama, URL opsional untuk instance
          self-hosted, Client ID, Client secret machine identity). Client
          secret disimpan terenkripsi dan tidak bisa dilihat lagi; tombol tes
          memeriksa koneksinya.
        </li>
        <li>
          <strong>Sumber secret</strong> di tab Environment: pilih koneksi,
          isi project ID, environment, dan path (default <Code>/</Code>).{" "}
          <strong>Lihat key</strong> menampilkan nama key saja, tidak pernah
          nilainya.
        </li>
        <li>
          Rujuk satu secret dengan <Code>{"${{secret.KEY}}"}</Code> di env, atau
          nyalakan <strong>Sync semua secret ke container</strong> untuk
          meneruskan semuanya sebagai env.
        </li>
        <li>
          Nilai diambil <em>saat container dibuat</em> (deploy, apply config,
          rollback), bukan saat build. Bila key sama, <strong>env aplikasi
          menang</strong> atas secret. Preview pull request tidak mewarisi
          sumber secret.
        </li>
        <li>
          Bila Infisical tidak terjangkau saat deploy, deployment{" "}
          <strong>gagal</strong> dan container lama tetap berjalan.
        </li>
      </Ul>

      <H2 id="alur">Bagaimana env digabung</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-5 rounded-lg overflow-hidden">
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
          Prioritas, dari terendah ke tertinggi: <strong>environment
          project</strong> yang ditautkan &lt; <strong>sumber secret
          eksternal</strong> (Infisical, bila sync menyala) &lt;{" "}
          <strong>env aplikasi itu sendiri</strong>. Bila key yang sama ada di
          beberapa lapisan, yang lebih tinggi menang.
        </li>
        <li>
          Penggabungan dan resolusi terjadi <strong>setiap kali container dibuat</strong>:
          deploy, rollback, atau recreate karena domain/mount berubah. Mengubah
          environment tidak mengubah container yang berjalan — berlaku pada{" "}
          <strong>deploy berikutnya</strong> aplikasi.
        </li>
        <li>
          Env <strong>tidak tersedia saat build</strong>. Untuk itu pakai{" "}
          <DocLink href="/id/docs/build#build-args">Build args</DocLink> (non-rahasia).
        </li>
      </Ul>

      <H2 id="referensi">Referensi</H2>
      <Table
        head={["Sintaks", "Menghasilkan"]}
        rows={[
          [<Code key="1">{"${{project.KEY}}"}</Code>, "Nilai KEY dari environment yang ditautkan ke aplikasi (default production)."],
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
      <Pre title="Environment production (tertaut ke aplikasi)">{`APP_ENV=production
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
          Memindahkan aplikasi ke environment yang tidak punya{" "}
          <Code>{"${{project.KEY}}"}</Code> yang dirujuknya ditolak dengan
          pesan yang menyebut key-nya.
        </li>
        <li>
          Referensi tak dikenal<PathArrow /><strong>400</strong> saat menyimpan
          Pengaturan; bila baru salah saat deploy (mis. database dihapus)<PathArrow />
          deployment <Code>failed</Code>.
        </li>
        <li>
          Memutar password database<PathArrow />berlaku di deploy/rollback berikutnya
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
          Env aplikasi disimpan sebagai teks di database aoox; akses ke halaman
          Pengaturan = akses ke nilainya. Variabel environment project
          terenkripsi saat disimpan dan dilindungi — lihat di bawah.
        </li>
      </Ul>

      <H2 id="environments">Environment project</H2>
      <P>
        Project punya environment (<Code>development</Code>,{" "}
        <Code>staging</Code>, <Code>production</Code>, plus yang Anda tambah).
        Masing-masing menyimpan variabel <Code>KEY=VALUE</Code> sendiri,
        terenkripsi saat disimpan, diedit di tab <strong>Environment</strong>{" "}
        project. Setiap aplikasi dan stack compose ditautkan ke{" "}
        <strong>satu</strong> environment lewat pilihan <strong>Environment</strong>{" "}
        di Pengaturannya (default <Code>production</Code>);{" "}
        <Code>{"${{project.KEY}}"}</Code> diambil dari environment itu.
      </P>
      <Ul>
        <li>
          Nilai disamarkan di daftar; <em>Tampilkan</em> adalah aksi yang
          diaudit (audit log mencatatnya tanpa nilainya).
        </li>
        <li>
          <Code>production</Code> <strong>dilindungi</strong>: hanya admin
          project yang bisa menampilkan atau mengubah nilainya. Developer bisa
          menampilkan dan mengubah environment lain; viewer hanya melihat nama
          variabel.
        </li>
        <li>
          Nilai disamarkan di log deployment (nilai di bawah 8 karakter dan
          kata tunggal biasa seperti <Code>production</Code> tidak disamarkan).
        </li>
        <li>
          <strong>Penautan juga dilindungi:</strong> menautkan aplikasi atau
          stack <em>ke</em> environment terlindungi, atau memindahkannya{" "}
          <em>dari</em> situ, membutuhkan admin project (developer mendapat 403;
          pilihan Environment menampilkan environment terlindungi sebagai
          nonaktif). Tanpa aturan ini developer bisa menautkan aplikasi ke{" "}
          <Code>production</Code>, men-deploy-nya dan membaca nilainya dari
          console container. Aplikasi atau stack baru yang dibuat developer
          tanpa memilih environment dimulai di <Code>development</Code>.
          Resource yang sudah tertaut sebelum aturan ini tetap tertaut, dan
          siapa pun yang bisa membuka console resource yang tertaut ke{" "}
          <Code>production</Code> tetap melihat nilainya saat runtime, seperti
          env var pada umumnya.
        </li>
        <li>
          <strong>Dari terminal:</strong>{" "}
          <DocLink href="/id/docs/cli#env">aoox env dan aoox run</DocLink>{" "}
          membaca dan mengubah environment dengan API token. Token bisa dibatasi
          ke environment menurut nama (mis. hanya <Code>development</Code>) dan
          tidak pernah melebihi akses pemiliknya sendiri.
        </li>
      </Ul>
      <P>
        Selengkapnya di <DocLink href="/id/docs/project#environments">Project</DocLink>.
      </P>

      <H2 id="riwayat">Riwayat dan restore</H2>
      <P>
        Setiap perubahan pada sebuah environment disimpan sebagai versi: edit
        di dashboard, <Code>aoox env set|unset|push</Code>, restore, atau
        promosi dari environment lain. Buka <strong>History</strong> pada
        sebuah environment untuk melihat daftarnya, terbaru di atas.
      </P>
      <Ul>
        <li>
          Tiap baris menampilkan <strong>siapa</strong> (pengguna, atau token),{" "}
          <strong>kapan</strong>, dan nama variabel yang <strong>+ditambah</strong>,{" "}
          <strong>~diubah</strong> dan <strong>-dihapus</strong>. Nilai tidak
          pernah ditampilkan di daftar.
        </li>
        <li>
          <strong>Restore this version</strong> mengembalikan teks itu setelah
          konfirmasi. Tidak ada yang dihapus: teks yang dipulihkan menjadi
          versi <em>baru</em> di paling atas, jadi riwayat tidak pernah
          ditulis ulang dan restore bisa dibatalkan dengan cara yang sama.
        </li>
        <li>
          Siapa yang boleh restore: orang yang sama yang boleh mengedit
          environment itu. Untuk <Code>production</Code> yang dilindungi, itu
          admin project; viewer tidak melihat nilai dan tidak bisa restore.
        </li>
        <li>
          Bila teks lama tidak lolos pemeriksaan hari ini (mis.{" "}
          <Code>{"${{project.KEY}}"}</Code> yang menunjuk variabel yang sudah
          Anda hapus), restore ditolak dengan pesan dan tidak ada yang berubah.
          Memulihkan versi yang sudah menjadi isi saat ini juga ditolak.
        </li>
        <li>
          Perubahan pertama pada environment yang sudah berisi juga menyimpan{" "}
          <strong>baseline</strong> dari isi sebelumnya, sehingga edit pertama
          pun bisa dibatalkan. Menyimpan tanpa perubahan nyata (hanya akhir
          baris atau spasi di ujung) tidak membuat versi.
        </li>
        <li>
          <strong>50 versi terbaru</strong> tiap environment disimpan; yang
          lebih lama dihapus otomatis. Teks lama disimpan terenkripsi seperti
          yang aktif. Versi juga mengingat tanda rahasianya.
        </li>
      </Ul>

      <H2 id="bandingkan">Membandingkan dan mempromosikan</H2>
      <P>
        <strong>Compare</strong> memungkinkan Anda memilih dua environment dan
        menampilkan hasilnya per key: variabel yang hanya ada di satu sisi,
        variabel di kedua sisi dengan <strong>nilai berbeda</strong>, dan
        berapa yang sama. Nilainya dibandingkan di server dan tidak pernah
        dikirim ke browser Anda.
      </P>
      <Ul>
        <li>
          Untuk memberi tahu apakah suatu nilai berbeda, aoox harus boleh
          membaca kedua sisi. Bila Anda tidak bisa membaca keduanya (developer
          dan salah satu sisi adalah <Code>production</Code>), Anda tetap
          melihat nama mana ada di mana, tetapi tidak nilai mana yang berbeda.
        </li>
        <li>
          Pilih variabel yang diinginkan lalu tekan <strong>Promote</strong>.
          Dialog konfirmasi menyebut variabel dan environment tujuan. Tiap
          variabel disalin beserta nilai dan tanda rahasianya; tujuan
          mempertahankan komentar dan urutannya sendiri, variabel baru
          ditambahkan di akhir, dan versi <em>From &lt;sumber&gt;</em> tercatat.
        </li>
        <li>
          Promosi membutuhkan hak untuk <strong>membaca sumber</strong> dan{" "}
          <strong>mengubah tujuan</strong>, dengan aturan yang sama seperti
          editor: <strong>developer tidak bisa mempromosikan ke atau dari
          production</strong>; admin project dibutuhkan di sisi yang
          dilindungi. Viewer tidak bisa mempromosikan.
        </li>
        <li>
          Promosi ditolak bila akan meninggalkan{" "}
          <Code>{"${{project.KEY}}"}</Code> yang menunjuk variabel yang tidak
          ada di tujuan, dan bila orang lain mengubah tujuan di sela itu (tidak
          ada yang ditulis; coba lagi).
        </li>
        <li>
          Aplikasi yang berjalan tidak disentuh: seperti edit environment
          lainnya, promosi berlaku di deploy berikutnya aplikasi yang memakai
          environment tujuan.
        </li>
        <li>
          Dari terminal:{" "}
          <DocLink href="/id/docs/cli#env"><Code>aoox env diff</Code> dan <Code>aoox env promote</Code></DocLink>.
        </li>
      </Ul>

      <H2 id="flag-rahasia">Variabel rahasia</H2>
      <P>
        Setiap variabel di editor environment punya sakelar{" "}
        <strong>Secret</strong> (di CLI: <Code>aoox env set KEY=VALUE --secret</Code>{" "}
        atau <Code>--no-secret</Code>). Sakelar ini menentukan apakah nilainya
        disembunyikan di log deployment, output job, dan notifikasi error.
      </P>
      <Table
        head={["Tanda", "Yang terjadi pada nilai di log"]}
        rows={[
          [<strong key="s">Secret</strong>, "Selalu disamarkan, sependek apa pun."],
          [<strong key="n">Bukan rahasia</strong>, "Tidak pernah disamarkan."],
          [<strong key="u">Belum diatur</strong>, <>Aturan biasa: disamarkan bila 8 karakter atau lebih, bukan satu kata biasa, dan bukan hanya angka. Jadi <Code>NODE_ENV=production</Code> tetap terbaca dan token panjang disembunyikan.</>],
        ]}
      />
      <Ul>
        <li>
          <strong>Bukan rahasia berarti tidak pernah.</strong> Nilai panjang
          pada variabel yang <em>belum</em> diberi tanda tetap disamarkan oleh
          aturan biasa; hanya <Code>--no-secret</Code> yang eksplisit yang
          mematikan penyamaran.
        </li>
        <li>
          Tanda rahasia disimpan di samping <em>nama</em> variabel, bukan di
          dalam teks, sehingga teks <Code>KEY=VALUE</Code>,{" "}
          <Code>aoox env pull</Code>, ekspor dan <Code>.aoox.env</Code> compose
          tetap persis seperti semula. Editor dan CLI menampilkan variabel mana
          yang rahasia; nilainya tetap di balik Reveal.
        </li>
        <li>
          <strong>Variabel lama dan baru:</strong> saat fitur ini diperkenalkan,
          variabel yang namanya memuat <Code>password</Code>,{" "}
          <Code>secret</Code>, <Code>token</Code>, <Code>key</Code>,{" "}
          <Code>private</Code> atau <Code>credential</Code> otomatis ditandai
          rahasia; variabel lain dibiarkan tanpa tanda, sehingga penyamaran
          bekerja persis seperti sebelumnya. Aturan nama yang sama menandai
          variabel baru yang Anda tambah tanpa memilih tanda. Karena hanya
          mencocokkan nama, nama yang wajar seperti <Code>MONKEY</Code> atau{" "}
          <Code>KEYBOARD</Code> ikut ditandai: matikan di editor bila perlu.
        </li>
        <li>
          Promosi menyalin tandanya bersama nilai. Menghapus variabel juga
          menghapus tandanya. Bila variabel rahasia berisi referensi seperti{" "}
          <Code>{"${{database.app-db.password}}"}</Code>, nilai hasil
          resolusinya juga disamarkan.
        </li>
      </Ul>

      <H2 id="compose">Stack compose</H2>
      <Callout>
        Stack compose memakai mekanisme yang sama: env ter-resolve ditulis ke{" "}
        <Code>.aoox.env</Code> dan dipakai sebagai <Code>--env-file</Code>{" "}
        — sumber interpolasi <Code>{"${VAR}"}</Code> di file compose,{" "}
        <strong>bukan</strong> otomatis masuk ke container. Teruskan lewat{" "}
        <Code>environment:</Code> di tiap service — lihat{" "}
        <DocLink href="/id/docs/compose#env">Stack compose</DocLink>.
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
