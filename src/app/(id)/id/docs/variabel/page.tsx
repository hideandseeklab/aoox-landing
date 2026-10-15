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
  path: "/id/docs/variabel",
  lang: "id",
  title: "Variabel (set variabel)",
  description:
    "Set variabel bersama dengan environment: berbagi, environment terlindungi, urutan tautan, ${{vars.KEY}}, scope token, riwayat, bandingkan, dan promosi.",
})

const SUMMARY = [
  { k: "Letak", v: "Variabel di sidebar (tingkat instance)" },
  { k: "Penggabungan", v: "Environment tertaut berurutan < Infisical < env sendiri" },
  { k: "Referensi", v: "${{vars.KEY}}" },
]

const ORDER = [
  { s: "tautan 1", d: "environment set pertama yang ditautkan (terendah)" },
  { s: "tautan 2 … 10", d: "tautan berikutnya menimpa yang sebelumnya pada key yang sama" },
  { s: "sumber secret", d: "secret Infisical, bila sync menyala" },
  { s: "env sendiri", d: "env milik aplikasi atau stack selalu menang" },
  { s: "container", d: "referensi diselesaikan, hasilnya masuk ke container" },
]

const NEXT = [
  { title: "Environment variables", description: "Env sendiri, Infisical, dan referensi database.", href: "/id/docs/environment" },
  { title: "CLI", description: "aoox env dan aoox run dari terminal.", href: "/id/docs/cli#env" },
  { title: "Pengguna & peran", description: "Peran, API token, dan scope-nya.", href: "/id/docs/pengguna-peran" },
  { title: "Project", description: "Tempat aplikasi, database, dan stack berada.", href: "/id/docs/project" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/variabel"
      title="Variabel"
      description="Set variabel menyimpan variabel bersama per environment. Bagikan set ke project, tautkan environment-nya ke aplikasi dan stack secara berurutan, lalu rujuk nilainya dengan ${{vars.KEY}}."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="konsep">Konsep</H2>
      <Table
        head={["Istilah", "Arti"]}
        rows={[
          [<strong key="s">Set variabel</strong>, <>Kelompok variabel bernama, misalnya <em>Backend</em>. Set milik instance, bukan milik satu project, jadi beberapa project bisa memakainya.</>],
          [<strong key="g">Slug</strong>, <>Nama pendek huruf kecil seperti <Code>backend</Code>, diturunkan dari nama bila dikosongkan. Slug <strong>tidak bisa diubah</strong> kemudian: scope API token dan CLI (<Code>--set backend</Code>) merujuknya.</>],
          [<strong key="e">Environment</strong>, <>Satu teks <Code>KEY=VALUE</Code> di dalam set. Set baru mendapat <Code>development</Code>, <Code>staging</Code>, dan <Code>production</Code>; paling banyak 20 per set (huruf kecil, angka, dan <Code>-</Code>, maksimal 32 karakter). Nilainya dienkripsi saat disimpan.</>],
          [<strong key="p">Terlindungi</strong>, <>Environment yang nilainya hanya boleh dibuka atau diubah owner dan admin instance. <Code>production</Code> terlindungi sejak awal.</>],
          [<strong key="l">Tautan</strong>, <>Aplikasi atau stack compose memakai satu atau beberapa environment set, dengan urutan yang kamu pilih. Tanpa tautan berarti tanpa variabel set: hanya env miliknya sendiri.</>],
        ]}
      />
      <P>
        Buka <strong>Variabel</strong> di sidebar untuk melihat set yang bisa
        kamu pakai. Tiap environment punya tab; nilainya tetap disamarkan sampai
        kamu menekan tombol untuk membuka dan mengedit, dan tindakan itu
        tercatat di audit log.
      </P>

      <H2 id="berbagi">Berbagi</H2>
      <P>
        Set dibagikan ke <strong>semua project</strong> (yang ada dan yang akan
        datang) atau ke <strong>project tertentu</strong>. Hanya aplikasi dan
        stack di project itu yang bisa menautkannya, dan hanya anggota project
        itu yang melihatnya. Set yang tidak dibagikan ke siapa pun hanya
        terlihat oleh owner dan admin instance.
      </P>
      <Ul>
        <li>
          Membuat, mengganti nama, membagikan, dan menghapus set, serta menambah
          atau menghapus environment, adalah tugas <strong>owner dan admin
          instance</strong>.
        </li>
        <li>
          Sebuah project tidak bisa kehilangan akses selama masih ada yang
          menautkan set itu di dalamnya: perubahan ditolak dengan menyebut nama
          aplikasi dan stack tersebut. Lepas tautannya dulu. Menghapus set atau
          environment juga ditolak dengan cara yang sama selama masih ditautkan.
        </li>
      </Ul>

      <H2 id="akses">Siapa boleh apa</H2>
      <P>
        Peranmu pada sebuah set mengikuti peranmu di project tempat set itu
        dibagikan (yang tertinggi yang dihitung). Owner dan admin instance
        menjadi <em>admin instance</em> di setiap set.
      </P>
      <Table
        head={["Peran pada set", "Nama dan key", "Nilai environment biasa", "Nilai environment terlindungi", "Mengelola set"]}
        rows={[
          ["Owner / admin instance", "Ya", "Buka, ubah", "Buka, ubah", "Ya"],
          ["Admin project, developer", "Ya", "Buka, ubah", "Tidak", "Tidak"],
          ["Viewer", "Ya", "Tidak", "Tidak", "Tidak"],
        ]}
      />
      <Ul>
        <li>
          Mengubah termasuk me-restore versi dan mempromosikan; melihat daftar
          riwayat dan membandingkan nama terbuka untuk semua peran.
        </li>
        <li>
          Environment terlindungi <strong>lebih ketat daripada di 0.1.0-alpha.9</strong>:
          admin project tidak lagi bisa membuka atau mengubahnya.
        </li>
      </Ul>

      <H2 id="menautkan">Menautkan ke aplikasi dan stack</H2>
      <P>
        Di tab <strong>Environment</strong> sebuah aplikasi atau stack, kartu{" "}
        <strong>Set variabel</strong> menampilkan environment yang ditautkan
        sesuai urutan penggabungan. Tambahkan dengan tombol tautkan, geser ke
        atas atau ke bawah, atau lepas tautannya. Form pembuatan (aplikasi,
        stack, template) juga menerima satu environment set secara opsional.
      </P>
      <Ul>
        <li>Paling banyak <strong>10</strong> tautan; satu environment hanya bisa ditautkan sekali per aplikasi atau stack.</li>
        <li>Set harus dibagikan ke project itu (atau ke semua project).</li>
        <li>
          Mengubah tautan butuh peran <strong>developer</strong> atau lebih.
          Menambah atau melepas tautan ke environment <strong>terlindungi</strong>{" "}
          butuh peran <strong>admin project</strong>; mengubah urutan tautan yang
          tetap selalu boleh.
        </li>
        <li>
          Perubahan berlaku pada <strong>deploy berikutnya</strong>; container
          yang sedang berjalan tidak disentuh. Hal yang sama berlaku saat
          environment yang ditautkan diubah.
        </li>
        <li>
          Kartu itu menunjukkan bentrokan: key yang <em>ditimpa tautan
          berikutnya</em> dan key yang <em>ditimpa env sendiri</em>.
        </li>
      </Ul>

      <H2 id="urutan">Urutan penggabungan</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-5 rounded-lg overflow-hidden">
        {ORDER.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <P>
        Penggabungan terjadi setiap kali container dibuat (deploy, rollback,
        pembuatan ulang setelah perubahan domain atau mount), tidak pernah saat
        build. Tiap key membawa tanda rahasia dari lapisan asal nilainya.
      </P>
      <Pre title="Tertaut: 1. shared/production, 2. backend/production">{`# shared/production
LOG_LEVEL=info
SENTRY_DSN=https://abc@sentry.example.com/1

# backend/production
LOG_LEVEL=warn
API_HOST=api.example.com

# env milik aplikasi
LOG_LEVEL=debug
API_URL=https://\${{vars.API_HOST}}/v1`}</Pre>
      <Pre title="Hasil di container">{`LOG_LEVEL=debug          # env sendiri menang
SENTRY_DSN=https://abc@sentry.example.com/1
API_HOST=api.example.com
API_URL=https://api.example.com/v1`}</Pre>

      <H2 id="referensi">Referensi: {"${{vars.KEY}}"}</H2>
      <Ul>
        <li>
          <Code>{"${{vars.KEY}}"}</Code> adalah nilai gabungan <Code>KEY</Code>{" "}
          dari environment set yang ditautkan (urutannya sama seperti di atas).
          Bisa dipakai di env sendiri maupun di nilai set; nilai set boleh
          merujuk key dari set lain yang ditautkan ke aplikasi yang sama.
        </li>
        <li>
          Penjabarannya <strong>satu tingkat</strong>: nilai yang dirujuk dipakai
          apa adanya. Dengan <Code>{"URL=https://${{vars.HOST}}"}</Code> di sebuah
          set, <Code>URL</Code> dijabarkan di tempat ia dipakai, tetapi{" "}
          <Code>{"FULL=${{vars.URL}}"}</Code> menerima teks mentah{" "}
          <Code>{"https://${{vars.HOST}}"}</Code>.
        </li>
        <li>
          Key yang tidak dikenal ditolak dengan 400 saat tautan atau env sendiri
          disimpan, dan membuat deployment gagal (dengan menyebut referensinya)
          bila baru rusak kemudian, misalnya setelah key itu dihapus dari set.
        </li>
        <li>
          <Code>{"${{project.KEY}}"}</Code> sudah tidak ada: ditolak dengan pesan
          bahwa namanya diganti menjadi <Code>{"${{vars.KEY}}"}</Code>. Proses
          upgrade menulis ulang referensi yang ada untukmu.{" "}
          <Code>{"${{database.…}}"}</Code> dan <Code>{"${{secret.…}}"}</Code> tetap
          seperti sebelumnya (lihat <DocLink href="/id/docs/environment#referensi">Environment variables</DocLink>).
        </li>
      </Ul>

      <H2 id="riwayat">Riwayat dan restore</H2>
      <Ul>
        <li>
          Setiap perubahan pada environment disimpan sebagai versi: edit di
          dashboard, <Code>aoox env set|unset|push</Code>, restore, atau
          promosi. <strong>Riwayat</strong> menampilkan siapa (pengguna atau
          token), kapan, dan nama yang ditambah, diubah, dan dihapus; nilainya
          hanya tampil bila kamu membuka sebuah versi.
        </li>
        <li>
          Restore menulis kembali teks versi itu sebagai versi <em>baru</em>,
          jadi tidak ada yang hilang dan restore bisa dibatalkan. Ditolak bila
          sama dengan isi saat ini atau tidak lagi lolos pemeriksaan sekarang.
        </li>
        <li>
          Perubahan pertama yang tercatat juga menyimpan baseline isi
          sebelumnya. <strong>50</strong> versi terbaru disimpan, terenkripsi
          seperti teks aktifnya.
        </li>
        <li>Yang boleh me-restore: orang yang sama yang boleh mengubah environment itu.</li>
      </Ul>

      <H2 id="bandingkan">Membandingkan dan mempromosikan</H2>
      <Ul>
        <li>
          <strong>Bandingkan</strong> dua environment dalam satu set: nama yang
          hanya ada di satu sisi, nama dengan <strong>nilai berbeda</strong>, dan
          berapa yang sama. Nilai dibandingkan di server dan tidak pernah dikirim
          ke browser; bila kamu tidak bisa membaca kedua sisi, kamu hanya melihat
          nama mana ada di mana.
        </li>
        <li>
          Pilih variabel lalu <strong>promosikan</strong> ke environment lain:
          tiap variabel disalin beserta nilai dan tanda rahasianya, target tetap
          mempertahankan komentar dan urutannya, variabel baru ditaruh di akhir,
          dan sebuah versi promosi dari sumbernya dicatat.
        </li>
        <li>
          Promosi butuh hak membaca sumber dan mengubah target, jadi sisi yang
          terlindungi butuh owner atau admin instance. Perubahan oleh orang lain
          di antaranya membuat promosi ditolak; tidak ada yang ditulis.
        </li>
      </Ul>

      <H2 id="catatan">Catatan</H2>
      <P>
        Catatan sebuah variabel adalah blok baris <Code>#</Code> tepat di
        atasnya. Baris kosong di antaranya memutus kaitan itu, jadi judul bagian
        yang diikuti baris kosong tetap menjadi komentar biasa.
      </P>
      <Pre title="development">{`# Payments

# Base URL of the payments API, including the /v1 prefix.
PAYMENTS_URL=https://pay.example.com/v1
# Must equal WEBHOOK_SECRET in the payments service.
WEBHOOK_SECRET=…`}</Pre>
      <Ul>
        <li>
          Di sini <Code>PAYMENTS_URL</Code> dan <Code>WEBHOOK_SECRET</Code>{" "}
          punya catatan; <Code># Payments</Code> adalah komentar yang berdiri
          sendiri.
        </li>
        <li>
          Di halaman set, ikon catatan muncul di samping variabel yang punya
          catatan; arahkan kursor, klik, atau ketuk untuk membacanya. Di{" "}
          <strong>Tampilkan dan ubah</strong>, tampilan Baris menampilkan catatan
          di bawah variabelnya dan bisa menambah atau mengubahnya; tampilan Teks
          menampilkan baris <Code>#</Code>-nya.
        </li>
        <li>
          <strong>Catatan terlihat tanpa membuka nilai</strong>, oleh semua yang
          bisa melihat set itu, termasuk viewer. Jangan menaruh rahasia di
          dalamnya.
        </li>
        <li>
          Catatan adalah bagian dari teks, jadi ikut terbawa: riwayat dan
          restore, <Code>aoox env pull</Code> / <Code>push</Code>, serta ekspor
          dan impor. <strong>Promosi</strong> membawa catatan variabel yang baru
          bagi target; variabel yang sudah ada di target tetap memakai
          catatannya sendiri. Catatan dipotong di 1000 karakter.
        </li>
      </Ul>

      <H2 id="flag-rahasia">Variabel rahasia</H2>
      <Table
        head={["Tanda", "Apa yang terjadi pada nilai di log"]}
        rows={[
          [<strong key="s">Rahasia</strong>, "Selalu disamarkan, sependek apa pun."],
          [<strong key="n">Bukan rahasia</strong>, "Tidak pernah disamarkan."],
          [<strong key="u">Tidak diatur</strong>, <>Disamarkan bila terlihat seperti rahasia: 8 karakter atau lebih, bukan satu kata biasa, bukan hanya angka. <Code>NODE_ENV=production</Code> tetap terbaca.</>],
        ]}
      />
      <Ul>
        <li>
          Atur tandanya dengan sakelar rahasia di editor atau{" "}
          <Code>aoox env set KEY=VALUE --secret</Code> / <Code>--no-secret</Code>.
          Variabel baru yang namanya memuat password, secret, token, key,
          private, atau credential otomatis ditandai rahasia.
        </li>
        <li>
          Tanda disimpan di samping nama, bukan di dalam teks, jadi file hasil
          pull dan <Code>.aoox.env</Code> compose tidak berubah. Penyamaran
          berlaku di log deployment, output job, dan notifikasi error.
        </li>
        <li>
          <strong>Yang tidak dilakukan tanda ini</strong>: semua nilai
          disimpan terenkripsi, rahasia atau bukan. Tanda tidak menentukan siapa
          yang boleh melihat nilai: di dashboard nilai tetap tersembunyi sampai
          Anda memilih membuka dan mengubahnya (tercatat di audit), dan akses
          mengikuti peran serta environment terproteksi. Kontainer selalu
          menerima nilai aslinya. Tanda hanya mengatur penyamaran dengan{" "}
          <Code>***</Code> di log.
        </li>
        <li>
          <strong>Salah deteksi yang diketahui</strong>: aturan nama otomatis
          juga cocok dengan nama seperti <Code>MONKEY</Code> atau{" "}
          <Code>KEYBOARD</Code> karena memuat &quot;key&quot;. Matikan sakelarnya
          untuk nama seperti itu.
        </li>
        <li>
          <strong>Tips</strong>: aktifkan untuk password, token, API key, dan
          connection string; matikan untuk nilai biasa seperti{" "}
          <Code>NODE_ENV</Code>, <Code>PORT</Code>, dan <Code>LOG_LEVEL</Code>{" "}
          agar tetap terbaca di log.
        </li>
      </Ul>

      <H2 id="token">Scope API token</H2>
      <P>
        API token bisa dibatasi ke sebagian environment set lewat batas
        variabel pada token (Settings<PathArrow />Akun<PathArrow />API token;{" "}
        <Code>variableScopes</Code> di API, paling banyak 20 entri):
      </P>
      <Table
        head={["Entri", "Mengizinkan"]}
        rows={[
          [<Code key="1">backend/staging</Code>, "Satu environment dari satu set."],
          [<Code key="2">backend/*</Code>, "Semua environment dari set backend."],
          [<Code key="3">*/staging</Code>, "Environment staging di setiap set."],
        ]}
      />
      <Ul>
        <li>
          Tanpa entri: token boleh memakai semua environment set yang bisa
          dipakai pemiliknya. Entri hanya mempersempit; token tidak pernah
          melebihi pemiliknya.
        </li>
        <li>
          Scope berlaku untuk membuka, mengubah, restore, promosi, serta membuat
          atau menghapus environment. Perbandingan menganggap sisi di luar scope
          tidak bisa dibandingkan. Penautan tidak dibatasi olehnya.
        </li>
        <li>
          Token <strong>read-only</strong> tetap boleh membuka nilai (membaca
          diaudit tetapi tidak mengubah apa pun); semua penulisan ditolak.
        </li>
      </Ul>

      <H2 id="cli">Dari terminal</H2>
      <Pre title="aoox CLI">{`$ aoox env list                                   # set, environment, jumlah variabel
$ aoox env set API_URL=https://api.example.com --set backend --env staging
$ aoox env pull --set backend --env development  # ./.env (mode 0600)
$ aoox env links                                  # yang dipakai aplikasi tertaut, berurutan
$ aoox env link --set shared --env production --position 1
$ aoox run -- npm run dev                         # environment tertaut + env sendiri`}</Pre>
      <P>
        Rinciannya di <DocLink href="/id/docs/cli#env">CLI: aoox env dan aoox run</DocLink>. Untuk menjalankan aplikasi di lokal dengan satu environment, lihat{" "}
        <DocLink href="/id/docs/cli#local-development">Pengembangan lokal</DocLink>.
      </P>

      <H2 id="ekspor-impor">Ekspor dan impor</H2>
      <Ul>
        <li>
          Ekspor project mencatat tautan tiap aplikasi dan stack menurut{" "}
          <em>nama</em> set dan environment, sesuai urutan penggabungan.
        </li>
        <li>
          Set itu sendiri (beserta nilainya) hanya ikut bila owner mengekspor{" "}
          <strong>dengan secret</strong>: set yang dibagikan langsung ke project
          atau ditautkan oleh salah satu aplikasi atau stack-nya.
        </li>
        <li>
          Saat impor, set yang namanya sudah ada <strong>dipakai ulang dan tidak
          pernah ditimpa</strong> (ada peringatan); set baru dibuat dan hanya
          dibagikan ke project hasil impor. Tautan ke set yang sudah ada tetapi
          belum dibagikan ke project baru akan dibagikan bila pengimpor owner
          atau admin instance, atau dilewati dengan peringatan untuk yang lain.
        </li>
        <li>
          File lama (environment 0.1.0-alpha.9) menjadi satu set bernama sesuai
          project baru, dan <Code>{"${{project."}</Code> menjadi{" "}
          <Code>{"${{vars."}</Code>.
        </li>
      </Ul>

      <H2 id="upgrade">Upgrade dari 0.1.0-alpha.9</H2>
      <Callout title="Yang dilakukan upgrade">
        Migrasi berjalan sekali, dalam satu transaksi, saat API baru menyala.
      </Callout>
      <Ul>
        <li>
          Setiap project yang environment-nya berisi menjadi <strong>satu set
          bernama sesuai project</strong>, hanya dibagikan ke project itu, dengan
          environment, nilai, tanda rahasia, dan riwayat yang sama. Aplikasi dan
          stack tetap memakai environment-nya sebagai tautan pertama.
        </li>
        <li>
          <strong>Environment kosong dibuang</strong>; project yang hanya punya
          environment kosong tidak mendapat set, dan tautan ke sana dihapus.
        </li>
        <li>
          <Code>{"${{project.KEY}}"}</Code> menjadi <Code>{"${{vars.KEY}}"}</Code>{" "}
          di env aplikasi dan stack serta di setiap teks dan versi tersimpan.
        </li>
        <li>
          Daftar <Code>environments</Code> pada API token menjadi scope berbentuk{" "}
          <Code>{"*/<nama>"}</Code> (artinya sama: nama itu di setiap set). Buat
          ulang token dengan scope per set bila ingin lebih sempit.
        </li>
        <li>
          <strong>Environment terlindungi kini hanya untuk owner/admin instance.</strong>{" "}
          Admin project yang dulu membuka atau mengubah <Code>production</Code>{" "}
          kini butuh admin instance, atau perlindungan environment itu dilepas.
        </li>
        <li>
          <Code>ENCRYPTION_KEY</Code> wajib terpasang (pada instalasi normal sudah
          ada) karena teks tersimpan dienkripsi ulang. Perbarui juga CLI-nya:
          perintah <Code>aoox env</Code> lama memanggil endpoint yang sudah tidak
          ada.
        </li>
      </Ul>

      <H3>Batasan</H3>
      <Ul>
        <li>Tidak ada peran per set: akses mengikuti peran project.</li>
        <li>Slug tidak bisa diganti, dan environment tidak bisa dipindah antarset.</li>
        <li>Referensi dijabarkan satu tingkat.</li>
      </Ul>

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
