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
  path: "/id/docs/cli",
  lang: "id",
  title: "Mulai dengan CLI",
  description:
    "Pasang aoox, simpan token panel, dan pakai di CI.",
})

const SUMMARY = [
  { k: "Perintah", v: "aoox" },
  { k: "Autentikasi", v: "API token aoox_… dari panel" },
  { k: "Butuh", v: "Script installer (tanpa Node.js), atau Node.js 22+ (npm)" },
]

const COMMANDS = [
  {
    cmd: "aoox install",
    what: "Memasang aoox (postgres + api + web) di VPS baru lewat Docker Compose.",
    flags: "--web-domain, --api-domain, --acme-email, --admin-email/-name/-password, --dir, --force, --yes/-y",
  },
  {
    cmd: "aoox login",
    what: "Menyimpan alamat dashboard dan API token untuk perintah lain (alamat API ditemukan otomatis).",
    flags: "--url/-u, --token/-t",
  },
  {
    cmd: "aoox whoami",
    what: "Menampilkan akun dan panel yang sedang dipakai.",
    flags: "--url/-u, --token/-t, --json",
  },
  {
    cmd: "aoox link",
    what: "Menghubungkan folder repo ke sebuah aplikasi di panel (dipakai aoox deploy).",
    flags: "--project, --app",
  },
  {
    cmd: "aoox deploy",
    what: "Build image lokal, push ke registry, lalu deploy — mengikuti log sampai selesai.",
    flags: "--tag, --dockerfile/-f, --context, --registry",
  },
  {
    cmd: "aoox domain set",
    what: "Set domain kustom untuk panel itu sendiri (dashboard + API) tanpa SSH.",
    flags: "--web, --api, --acme-email, --[no-]domain-only",
  },
  {
    cmd: "aoox domain clear",
    what: "Menghapus domain kustom panel dan kembali ke akses lewat IP (IP:3000), setelah konfirmasi.",
    flags: "--yes/-y",
  },
  {
    cmd: "aoox registry domain",
    what: "Set atau hapus domain kustom untuk registry self-hosted.",
    flags: "--set, --clear",
  },
  {
    cmd: "aoox update",
    what: "Memperbarui CLI aoox itu sendiri dari npm (menggantikan update panel yang lama — lihat aoox update panel).",
    flags: "--check",
  },
  {
    cmd: "aoox update panel",
    what: "Cek atau terapkan update untuk panel aoox itu sendiri (aoox update yang lama).",
    flags: "--apply",
  },
  {
    cmd: "aoox registry build",
    what: "Build ./Dockerfile menjadi image lokal bernama registry; menolak versi yang sudah ada di sana. Dengan --push, image langsung dikirim juga.",
    flags: "--push, --yes/-y, --registry, --dockerfile/-f, --context, --force",
  },
  {
    cmd: "aoox env list | pull | push | set | unset | history | diff | promote",
    what: "Menampilkan, mengunduh, mengunggah, membandingkan atau mengubah environment set variabel (lihat Variabel).",
    flags: "--set/-s, --env/-e, --app, --stack, --url/-u, --token/-t; --reveal, --json (list); --file, --force, --format (pull); --file, --yes (push); --secret/--no-secret (set); --limit, --json (history); --from, --to (diff, promote); --all, --yes (promote)",
  },
  {
    cmd: "aoox env links | link | unlink",
    what: "Menampilkan atau mengubah urutan environment set yang dipakai aplikasi (atau --stack).",
    flags: "--app, --stack; --set/-s, --env/-e, --position (link, unlink)",
  },
  {
    cmd: "aoox run -- <perintah>",
    what: "Menjalankan perintah dengan variabel yang didapat aplikasi tertaut saat deploy (atau satu environment set), tanpa menulisnya ke disk.",
    flags: "--set/-s, --env/-e, --app, --stack, --file, --quiet/-q, --url/-u, --token/-t",
  },
  {
    cmd: "aoox registry push",
    what: "Push image lokal yang sudah ada ke registry; menolak versi yang sudah ada di sana.",
    flags: "--yes/-y, --registry, --force",
  },
  {
    cmd: "aoox reinstall",
    what: "Perbaiki/segarkan instalasi panel yang ada tanpa kehilangan data (compose ditulis ulang, .env.dist digabung, pull + recreate).",
    flags: "--dir, --dry-run, --yes, --no-pull, --terminal-ssh-user",
  },
  {
    cmd: "aoox help [PERINTAH]",
    what: "Daftar perintah, atau bantuan satu perintah.",
    flags: "—",
  },
]

const NEXT = [
  { title: "Variabel", description: "Set variabel, perlindungan, penautan dan referensi.", href: "/id/docs/variabel" },
  { title: "Pengguna & peran", description: "Membuat API token dan scope-nya.", href: "/id/docs/pengguna-peran#akun" },
  { title: "Instalasi", description: "Langkah manual yang di-otomatisasi aoox install.", href: "/id/docs/instalasi" },
  { title: "Registry", description: "Tempat image dari aoox deploy disimpan.", href: "/id/docs/registry" },
  { title: "Deploy & rollback", description: "Apa yang terjadi di balik layar saat deploy.", href: "/id/docs/deploy" },
]

export default function Page() {
  return (
    <DocPage
      href="/id/docs/cli"
      title="Mulai dengan CLI"
      description="aoox adalah CLI resmi aoox: menyimpan kredensial panel di mesinmu dan berbicara ke API yang sama dengan dashboard."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3 rounded-lg overflow-hidden">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <Callout kind="warn" title="Tahap awal">
        CLI sudah bisa memasang aoox (<Code>install</Code>), masuk (
        <Code>login</Code>/<Code>whoami</Code>), dan build + deploy repo lokal
        (<Code>link</Code>/<Code>deploy</Code>). Perintah untuk project,
        database, log tail, dan lainnya belum ada — untuk itu pakai dashboard,{" "}
        <DocLink href="/id/docs/webhook">webhook</DocLink>, atau panggil API
        langsung dengan token yang sama.
      </Callout>

      <H2 id="instalasi-cli">Memasang CLI</H2>
      <P>
        Di Linux atau macOS, script installer memasang <Code>aoox</Code> tanpa
        perlu Node.js sama sekali — tarball-nya membawa runtime Node sendiri:
      </P>
      <Pre title="Linux / macOS, tanpa Node.js">{`curl -fsSL https://aoox.dev/install-cli.sh | sh

aoox --version`}</Pre>
      <P>
        Terpasang ke <Code>/usr/local/lib/aoox</Code> +{" "}
        <Code>/usr/local/bin/aoox</Code> (root/sudo), atau{" "}
        <Code>~/.local/lib/aoox</Code> kalau tidak ada akses itu. Menjalankan
        ulang perintah yang sama berarti upgrade. Mendukung Linux (glibc —{" "}
        <strong>bukan</strong> Alpine/musl) dan macOS, x64 maupun arm64.
      </P>
      <Callout kind="note" title="Windows, Alpine, atau sudah punya Node.js?">
        Pakai npm — butuh <strong>Node.js 22+</strong> lebih dulu.
        Nanti, perbarui dengan <Code>aoox update</Code>.
      </Callout>
      <Pre title="Dari npm">{`npm install -g @hideandseeklab/aoox

aoox --version`}</Pre>
      <P>
        Perintah terpasang sebagai <Code>aoox</Code> meski nama paketnya{" "}
        <Code>@hideandseeklab/aoox</Code>. Untuk ikut <Code>main</Code> sebelum
        dirilis, pasang dari source:
      </P>
      <Pre title="Dari source">{`git clone https://github.com/hideandseeklab/aoox-cli.git
cd aoox-cli
npm install
npm run build
npm link          # menyediakan perintah aoox secara global

aoox --version`}</Pre>

      <H2 id="install">Memasang aoox lewat aoox install</H2>
      <P>
        Perintah ini berbeda dari bagian sebelumnya: <Code>aoox install</Code>{" "}
        tidak menyambung ke panel yang sudah ada — ia{" "}
        <strong>memasang panelnya sendiri</strong> (postgres + api + web) di
        VPS Linux yang masih kosong, sebagai alternatif dari cara manual di{" "}
        <DocLink href="/id/docs/instalasi">Instalasi</DocLink>. Jalankan sebagai
        root, langsung di server tujuan.
      </P>
      <Pre title="Paling sederhana (tanpa domain, akses lewat IP)">{`$ sudo aoox install
==> Detecting the server public IP
Install aoox in /opt/aoox and run docker compose up -d? (Y/n)
==> Running docker compose up -d
==> Waiting for the API to be ready

aoox is installed in /opt/aoox.
Open: http://203.0.113.10:3000
Create the first owner account at /setup.`}</Pre>
      <Pre title="Dengan domain + HTTPS otomatis dan owner langsung dibuat">{`sudo aoox install \\
  --web-domain panel.example.com \\
  --api-domain api.panel.example.com \\
  --acme-email saya@example.com \\
  --admin-email saya@example.com \\
  --admin-name "Admin" \\
  --admin-password "kata-sandi-kuat" \\
  --yes`}</Pre>
      <Ul>
        <li>
          Docker dipasang otomatis lewat <Code>get.docker.com</Code> bila
          belum ada — minta konfirmasi kecuali <Code>--yes</Code>.
        </li>
        <li>
          <Code>--web-domain</Code> dan <Code>--api-domain</Code> harus
          dipakai bersamaan, dan keduanya butuh <Code>--acme-email</Code> untuk
          sertifikat Let&apos;s Encrypt lewat proxy bawaan.
        </li>
        <li>
          Tanpa <Code>--admin-email</Code>, buat akun owner lewat{" "}
          <Code>/setup</Code> di browser seperti instalasi manual.
        </li>
        <li>
          Folder instalasi default <Code>/opt/aoox</Code> (ubah dengan{" "}
          <Code>--dir</Code>); instalasi yang sudah ada di folder itu ditolak
          kecuali diberi <Code>--force</Code>.
        </li>
        <li>
          Secret (<Code>JWT_SECRET</Code>, <Code>ENCRYPTION_KEY</Code>,
          password Postgres) dibuat acak dan ditulis ke{" "}
          <Code>.env.dist</Code> dengan mode <Code>0600</Code> — tidak perlu
          <Code>openssl rand</Code> manual.
        </li>
      </Ul>
      <Callout>
        Perintah ini menjalankan ulang langkah-langkah di{" "}
        <DocLink href="/id/docs/instalasi">Instalasi</DocLink> secara otomatis:
        clone compose distribusi, isi env, <Code>docker compose up -d</Code>,
        lalu tunggu <Code>/auth/setup-status</Code> menjawab. Bukan pengganti
        <Code>aoox login</Code> — setelah panel terpasang, login seperti biasa
        untuk memakai <Code>aoox link</Code>/<Code>aoox deploy</Code>.
      </Callout>

      <H2 id="login">Masuk ke panel</H2>
      <Steps>
        <Step title="Buat API token di panel">
          <P>
            <strong>Settings<PathArrow />API token</strong>: beri nama (mis.{" "}
            <Code>laptop-saya</Code>), pilih kedaluwarsa, lalu salin token{" "}
            <Code>aoox_…</Code> yang hanya tampil sekali. Token bertindak{" "}
            <strong>sebagai pemiliknya</strong> dengan peran yang sama — lihat{" "}
            <DocLink href="/id/docs/pengguna-peran#akun">Keamanan akun</DocLink>.
            Dialog yang menampilkan token juga berisi baris{" "}
            <Code>aoox login --url … --token …</Code> yang siap disalin.
          </P>
        </Step>
        <Step title="Jalankan aoox login">
          <Pre>{`$ aoox login
Use the address you open the dashboard with: your panel domain (e.g. https://dashboard.example.com),
or http://<server-IP>:3000 if no panel domain is set yet.
? Dashboard URL https://panel.example.com
Looking for the panel... ok
API token (aoox_…) ********
Verifying token... ok
Logged in as kamu@example.com (owner) at https://panel.example.com
Token saved to /home/kamu/.config/aoox/config.json`}</Pre>
          <P>
            Yang kamu isi hanya alamat <strong>dashboard</strong> — alamat yang
            kamu buka di browser, bukan alamat API. CLI membaca alamat API dari
            dashboard (<Code>/.well-known/aoox.json</Code>). Skema boleh
            dihilangkan: host tanpa skema dicoba lewat https lalu http, dan IP
            polos juga di port <Code>3000</Code>, jadi{" "}
            <Code>203.0.113.10</Code> berfungsi pada instalasi baru tanpa domain
            panel. Bila dashboard tidak mengumumkan alamat API publik, CLI
            mengasumsikan <Code>&lt;host yang sama&gt;:3001</Code> dan
            mengatakannya. Alamat API dari skrip lama tetap berfungsi (dengan
            satu baris catatan).
          </P>
          <P>
            Token diminta lewat prompt tersembunyi, bukan argumen, supaya tidak
            tertinggal di riwayat shell atau daftar proses. Sebelum disimpan,
            CLI memanggil <Code>GET /auth/me</Code> — kredensial yang ditolak
            tidak pernah ditulis ke disk.
          </P>
        </Step>
        <Step title="Pastikan tersambung">
          <Pre>{`$ aoox whoami
kamu@example.com · owner · Admin
Panel: https://panel.example.com`}</Pre>
          <P>
            Tambahkan <Code>--json</Code> untuk keluaran yang bisa diproses
            skrip; baris teks di atas otomatis disembunyikan.
          </P>
        </Step>
      </Steps>

      <H2 id="connection">Terhubung ke panel yang mana?</H2>
      <P>
        Menjalankan <Code>aoox</Code> tanpa argumen menampilkan daftar perintah
        dan, di bawahnya, ke mana CLI terhubung. Alamat dashboard dan API
        diambil dari login tersimpan (tanpa jaringan); baris registry meminta
        registry default ke panel dengan timeout singkat dan tidak pernah
        menggagalkan perintah. <Code>aoox --help</Code> dan{" "}
        <Code>aoox &lt;perintah&gt; --help</Code> tidak berubah.
      </P>
      <Pre>{`$ aoox
...
Connected to
  Dashboard  https://dashboard.example.com
  API        https://api.example.com
  Registry   registry.example.com (self-hosted)

$ aoox            # belum login
Not connected — run: aoox login`}</Pre>
      <P>
        Kalau registry tidak bisa dicek muncul{" "}
        <Code>Registry   (could not check: panel unreachable)</Code>; alamat
        registry <Code>localhost:…</Code> mendapat peringatan singkat untuk
        mengatur domain dengan <Code>aoox registry domain --set &lt;host&gt;</Code>.
      </P>

      <H2 id="link-deploy">Build & deploy dari repo lokal</H2>
      <P>
        <Code>aoox link</Code> menghubungkan folder repo ke satu aplikasi di
        panel, lalu <Code>aoox deploy</Code> membangun image di mesinmu,
        mem-push-nya ke registry, dan memicu deploy — mengikuti log sampai
        selesai seperti tab Deploy di dashboard.
      </P>
      <Steps>
        <Step title="Link folder ke aplikasi">
          <Pre>{`$ cd repo-aplikasiku
$ aoox link
? Select a project › toko
? Select an application › shop (shop)
Linked: toko / shop (shop)
Written to .aoox.json — safe to commit, contains no secrets.`}</Pre>
          <P>
            <Code>--project</Code>/<Code>--app</Code> melewati pemilihan
            interaktif — dipakai di CI. File <Code>.aoox.json</Code>{" "}
            yang dihasilkan tidak berisi token, aman masuk repo.
          </P>
        </Step>
        <Step title="Deploy">
          <Pre>{`$ aoox deploy
==> Build localhost:5000/toko/shop:a1b2c3d
==> docker login localhost:5000
==> Push localhost:5000/toko/shop:a1b2c3d
==> Updating the application & triggering a deploy
[building] Building localhost:5000/toko/shop:a1b2c3d from https://…
...
Deployed: localhost:5000/toko/shop:a1b2c3d`}</Pre>
          <P>
            Build berjalan di Docker lokal (<Code>docker build</Code> dengan{" "}
            <Code>--dockerfile</Code>/<Code>--context</Code>), lalu di-push ke
            registry aplikasi itu — default registry self-hosted bila ada
            lebih dari satu, pilih manual dengan <Code>--registry</Code>. Tag
            default git short SHA (<Code>+ -dirty</Code> bila ada perubahan
            belum di-commit); timpa dengan <Code>--tag</Code>.
          </P>
        </Step>
      </Steps>
      <Callout>
        Aplikasi otomatis dipindah ke <Code>sourceType: image</Code> memakai
        registry dan tag yang baru saja di-push — bukan mem-build ulang di
        server seperti build dari Git.{" "}
        <DocLink href="/id/docs/aplikasi#sumber">Dua sumber aplikasi</DocLink>.
        Deploy yang masih berjalan untuk aplikasi yang sama ditolak (409) —
        tunggu selesai dulu.
      </Callout>

      <H2 id="env">Variabel (aoox env, aoox run)</H2>
      <P>
        <Code>aoox env</Code> membaca dan mengubah environment dari{" "}
        <DocLink href="/id/docs/variabel">set variabel</DocLink> (yang sama
        dengan menu <strong>Variabel</strong> di dashboard) dan mengatur
        environment mana yang dipakai aplikasi tertaut. <Code>aoox run</Code>{" "}
        menjalankan perintah dengan variabel yang didapat aplikasi saat deploy,
        tanpa menulis file.
      </P>
      <Ul>
        <li>
          Environment set dipilih dengan <Code>--set &lt;slug&gt;</Code> (singkat{" "}
          <Code>-s</Code>) dan <Code>--env &lt;nama&gt;</Code> (<Code>-e</Code>).
        </li>
        <li>
          <strong>Bawaan</strong>: <Code>--set</Code> adalah satu-satunya set
          yang dipakai aplikasi yang ditautkan dengan <Code>aoox link</Code>{" "}
          (atau satu-satunya set yang bisa kamu lihat); <Code>--env</Code>{" "}
          adalah satu-satunya environment set itu yang ditautkan. Bila ada
          beberapa kandidat, perintah berhenti dan menampilkan daftarnya — tidak
          pernah menebak. Tidak ada nama environment bawaan.
        </li>
        <li>
          <Code>--app &lt;id&gt;</Code> memakai aplikasi lain, dan{" "}
          <Code>--stack &lt;id&gt;</Code> sebuah stack compose, sebagai ganti
          aplikasi tertaut.
        </li>
      </Ul>
      <Pre title="Contoh sesi">{`$ aoox env list
backend  (Backend) · shared with shop, blog · your role: developer
  development             3 variables
  staging                 0 variables
  production (protected)  7 variables  used by 2

$ aoox env set API_URL=https://api.example.com GREETING="hello world" -s backend -e development
backend/development: added API_URL, GREETING (5 variables now)

$ aoox env list --set backend --env development            # hanya nama, nilai disamarkan
API_URL=••••••••
$ aoox env list --set backend --env development --reveal   # nilai (diaudit)
$ aoox env pull --set backend --env development            # menulis ./.env (mode 0600)
$ aoox env unset OLD_KEY --set backend --env development
$ aoox run -- npm run dev                                  # variabel aplikasi yang di-deploy (kemungkinan production)`}</Pre>
      <Callout kind="warn" title="Untuk kerja lokal, sertakan --set dan --env">
        Tanpa keduanya <Code>aoox run</Code> mereplikasi aplikasi tertaut
        seperti yang di-deploy, biasanya production. Lihat{" "}
        <DocLink href="/id/docs/cli#local-development">Pengembangan lokal</DocLink>.
      </Callout>
      <Table
        head={["Perintah", "Fungsi"]}
        rows={[
          [<Code key="l">aoox env list [--set slug] [--env nama] [--reveal] [--json]</Code>, "Tanpa flag: semua set yang bisa kamu lihat, peranmu, pembagiannya, dan jumlah variabel tiap environment (juga sebagai aoox env sets). Dengan --set: satu set. Dengan --env: nama variabel environment itu; --reveal menampilkan nilainya lewat aksi reveal yang diaudit."],
          [<Code key="p">aoox env pull [--set slug] [--env nama] [--file .env] [--format dotenv|json|shell] [--force]</Code>, <>Menulis variabel ke file dengan mode <Code>0600</Code> (hanya pemilik, bila OS mendukung). Tidak pernah menimpa file yang sudah ada kecuali dengan <Code>--force</Code>, dan memperingatkan sekali bila file tidak tercakup <Code>.gitignore</Code> (tidak pernah mengubah <Code>.gitignore</Code> sendiri).</>],
          [<Code key="s">aoox env set KEY=VALUE [KEY2=VALUE2 …] [--set slug] [--env nama] [--secret | --no-secret]</Code>, <>Menambah atau mengubah variabel. Komentar (termasuk <DocLink href="/id/docs/variabel#catatan">catatan</DocLink>) dan urutan baris yang ada dipertahankan; variabel baru ditaruh di akhir. <Code>--secret</Code> menandai variabel sebagai rahasia, <Code>--no-secret</Code> sebagai jelas bukan rahasia; tanpa keduanya, tandanya tetap (lihat <DocLink href="/id/docs/variabel#flag-rahasia">Variabel rahasia</DocLink>). Nilai dengan <Code>{"${{project.KEY}}"}</Code> ditolak: tulis <Code>{"${{vars.KEY}}"}</Code>.</>],
          [<Code key="u">aoox env unset KEY [KEY2 …] [--set slug] [--env nama]</Code>, "Menghapus variabel; komentar dan baris lain tetap."],
          [<Code key="pu">aoox env push --file .env [--set slug] [--env nama] [--yes]</Code>, "Mengganti seluruh environment dengan file lokal, setelah menampilkan variabel yang ditambah, diubah dan dihapus lalu meminta konfirmasi."],
          [<Code key="h">aoox env history [--set slug] [--env nama] [--limit 20] [--json]</Code>, "Riwayat versi sebuah environment, terbaru dulu: kapan, siapa, dan nama variabel yang ditambah (+), diubah (~) atau dihapus (-). Tidak pernah nilai."],
          [<Code key="d">aoox env diff --from nama --to nama [--set slug] [--json]</Code>, "Membandingkan dua environment dalam satu set menurut nama variabel: hanya di satu sisi, nilai berbeda, sama. Hanya mencetak nama."],
          [<Code key="pr">aoox env promote --from nama --to nama [KEY …] [--all] [--yes] [--set slug]</Code>, "Menyalin variabel yang disebut (atau semuanya) beserta tanda rahasianya dari satu environment set ke environment lain, setelah menampilkan perubahannya dan meminta konfirmasi."],
          [<Code key="ls">aoox env links [--app id | --stack id] [--json]</Code>, "Environment set yang dipakai aplikasi (atau stack), sesuai urutan penggabungan (1 = pertama, ditimpa yang berikutnya), beserta variabel yang ditimpa tautan berikutnya atau env sendiri."],
          [<Code key="ln">aoox env link --set slug --env nama [--position n] [--app id | --stack id]</Code>, "Menautkan environment set. Ditaruh di akhir (jadi menang atas yang lain) kecuali --position (mulai dari 1) diberikan; environment yang sudah tertaut dipindah ke posisi itu. Berlaku pada deploy berikutnya."],
          [<Code key="ul">aoox env unlink (--set slug --env nama | --position n) [--app id | --stack id]</Code>, "Melepas tautan. Berlaku pada deploy berikutnya."],
          [<Code key="r">aoox run [--set slug --env nama] [--file .env.local] [--quiet] [--app id | --stack id] -- perintah [argumen…]</Code>, "Menjalankan perintah dengan variabel di atas environment-mu saat ini (lihat di bawah). Tidak ada yang ditulis ke disk. Output langsung ke terminalmu, exit code perintah menjadi exit code aoox run, dan Ctrl+C atau SIGTERM diteruskan ke perintah."],
        ]}
      />
      <H3>Apa yang diteruskan aoox run ke perintah</H3>
      <Ul>
        <li>
          <strong>Secara bawaan</strong> ia meniru yang dilakukan panel saat
          membuat container, sejauh yang bisa dilakukan dari terminal: membaca
          setiap environment set yang ditautkan aplikasi, berurutan (yang
          belakangan menang pada key yang sama), lalu menaruh env milik aplikasi
          di atasnya. Setiap pembacaan diaudit. Bila salah satunya tidak bisa
          dibaca (environment terlindungi, viewer, scope token), tidak ada yang
          dijalankan.
        </li>
        <li>
          <Code>{"${{vars.KEY}}"}</Code> diganti dengan nilai gabungan{" "}
          <Code>KEY</Code> dari set, satu tingkat seperti di panel.
        </li>
        <li>
          Referensi <Code>{"${{database.…}}"}</Code> dan{" "}
          <Code>{"${{secret.…}}"}</Code>, serta <Code>{"${{vars.KEY}}"}</Code>{" "}
          yang tidak didefinisikan set tertaut mana pun, <strong>dibiarkan apa
          adanya</strong>, dengan satu peringatan yang menyebut variabelnya:
          hanya panel yang meresolusinya saat deploy. Secret yang disinkronkan
          dari Infisical tidak ikut (ada peringatannya).
        </li>
        <li>
          <Code>--set</Code>/<Code>--env</Code> memakai tepat satu environment
          set saja: tanpa tautan dan tanpa env sendiri.
        </li>
        <li>
          <Code>--file .env.local</Code> berada di atas semua itu: urutannya,
          dari terendah ke tertinggi, environment-mu saat ini, lalu aoox, lalu
          file. File hanya dibaca, dan referensi di dalamnya tidak diresolusi.
        </li>
      </Ul>
      <Pre title="Yang disuntikkan dan dari lapisan mana (dicetak ke standard error)">{`$ aoox run -- node server.js
aoox  Injecting 9 variables into your process · Application "shop-web": shared/production < backend/production < own env`}</Pre>
      <P>
        Jumlahnya adalah yang ditambah atau ditimpa aoox, termasuk{" "}
        <Code>--file</Code>; variabel bawaan shell-mu tidak dihitung. Baris ini
        berwarna hanya di terminal: <Code>NO_COLOR</Code> mematikan warna,{" "}
        <Code>FORCE_COLOR</Code> memaksanya, dan pipe serta log CI tetap polos.{" "}
        <Code>--quiet</Code> (<Code>-q</Code>) menyembunyikan baris itu, tetapi
        peringatan tentang referensi yang tidak bisa diresolusi aoox selalu
        dicetak.
      </P>
      <H3>Format pull dan push</H3>
      <Pre title="Format dan standard output">{`$ aoox env pull --env staging                        # ./.env, teks tersimpan beserta komentarnya
$ aoox env pull --format json                        # ./.env.json  {"KEY":"value"}
$ aoox env pull --format shell                       # ./.env.sh    export KEY='value'
$ aoox env pull --format json --file - | jq .PORT    # hanya ke standard output
$ eval "$(aoox env pull --format shell --file -)"    # muat ke shell saat ini`}</Pre>
      <Ul>
        <li>
          <Code>--file -</Code> menulis data ke standard output dan tidak ada
          yang lain di sana, jadi bisa di-pipe atau diberikan ke{" "}
          <Code>eval</Code>. Catatan (mis. soal referensi{" "}
          <Code>{"${{…}}"}</Code>) dikirim ke standard error. Pada mode ini
          tidak ada pemeriksaan &quot;file sudah ada&quot; dan tidak ada
          peringatan <Code>.gitignore</Code>, karena tidak ada file yang ditulis.
        </li>
        <li>
          Format <Code>shell</Code> membungkus tiap nilai dengan kutip tunggal
          dan menulis kutip tunggal di dalam nilai sebagai{" "}
          <Code>{"'\\''"}</Code>, sehingga spasi, <Code>$</Code> dan kutip
          selamat saat <Code>eval</Code>. Tanpa <Code>--file</Code>, filenya{" "}
          <Code>.env</Code>, <Code>.env.json</Code> atau <Code>.env.sh</Code>{" "}
          menurut format, selalu dengan mode <Code>0600</Code> bila OS
          mendukung.
        </li>
      </Ul>
      <Pre title="Unggah file dan lihat hasilnya">{`$ aoox env push --file .env.staging --set backend --env staging
Environment: backend/staging
  + added (1): NEW_FLAG
  ~ changed (1): API_URL
  - removed (1): OLD_KEY
  = unchanged: 6
Variables that are not in the file are removed: this replaces the whole environment.
? Replace "backend/staging" with the contents of .env.staging? (y/N)`}</Pre>
      <Ul>
        <li>
          File diperiksa sebelum apa pun dikirim. Ditolak: nama tidak valid,
          awalan <Code>export </Code>, spasi di ujung baris, nama ganda, dan{" "}
          <Code>{"${{project.…}}"}</Code>. Nilai ber-kutip (<Code>KEY=&quot;value&quot;</Code>) diterima dengan
          peringatan, karena panel menyimpan kutipnya sebagai bagian dari
          nilai. Akhir baris Windows dan BOM di awal dinormalkan.
        </li>
        <li>
          <Code>push</Code>, <Code>promote</Code> dan <Code>diff</Code> tidak
          pernah mencetak nilai. <Code>push</Code> dan <Code>promote</Code>{" "}
          meminta konfirmasi; tanpa terminal (CI) keduanya menolak kecuali kamu
          memberi <Code>--yes</Code>. Bila orang lain mengubah environment di
          sela itu, tidak ada yang ditulis (409), sama seperti{" "}
          <Code>set</Code>.
        </li>
        <li>
          Setiap perubahan tercatat sebagai versi (lihat{" "}
          <DocLink href="/id/docs/variabel#riwayat">riwayat dan restore</DocLink>);
          memulihkan versi lama dilakukan di dashboard.
        </li>
      </Ul>
      <H3>Cara nilai disimpan (tanda kutip)</H3>
      <P>
        Panel menyimpan satu environment sebagai teks <Code>KEY=VALUE</Code>{" "}
        biasa, satu variabel per baris. Key adalah semua sebelum{" "}
        <Code>=</Code> pertama; nilainya adalah <strong>semua setelahnya,
        persis seperti yang diberikan</strong>. Tidak ada pemrosesan kutip atau
        escape — tidak di CLI, tidak di panel, tidak saat nilai dimasukkan ke
        container — jadi tanda kutip yang kamu ketik dihapus oleh{" "}
        <em>shell-mu</em>, dan kutip yang menjadi bagian nilai tetap menjadi
        bagiannya.
      </P>
      <Table
        head={["Yang kamu ketik", "Nilai tersimpan"]}
        rows={[
          [<Code key="1">{`GREETING="hello world"`}</Code>, <Code key="1b">hello world</Code>],
          [<Code key="2">{`QUERY=a=b=c`}</Code>, <Code key="2b">a=b=c</Code>],
          [<Code key="3">{`MSG='say "hi" # not a comment'`}</Code>, <Code key="3b">{`say "hi" # not a comment`}</Code>],
          [<Code key="4">{`EMPTY=`}</Code>, "nilai kosong"],
        ]}
      />
      <Ul>
        <li>
          Ditolak sebelum apa pun dikirim: nama tidak valid (huruf, angka dan{" "}
          <Code>_</Code>, tidak diawali angka), nilai dengan baris baru (satu
          variabel per baris), dan nilai yang berakhir dengan spasi (panel
          memangkas ujung tiap baris).
        </li>
        <li>
          Referensi <Code>{"${{vars.KEY}}"}</Code> dan{" "}
          <Code>{"${{database.<slug>.url}}"}</Code> disimpan dan di-pull apa
          adanya; panel meresolusinya saat container dibuat.
        </li>
        <li>
          Stack compose membaca teks hasil resolusi lewat parser{" "}
          <Code>--env-file</Code> Docker Compose sendiri, yang menghapus kutip
          yang membungkus seluruh nilai. Hindari kutip pembungkus pada nilai
          yang dipakai stack.
        </li>
      </Ul>
      <H3>Mengedit bersamaan</H3>
      <P>
        <Code>set</Code>, <Code>unset</Code> dan <Code>push</Code> membaca
        environment, mengubah teksnya, lalu menyimpannya kembali bersama versi
        yang dibaca. Bila orang lain menyimpan di sela itu (dashboard, terminal
        lain), panel menjawab <Code>409</Code> dan CLI mengatakan tidak ada yang
        ditulis — jalankan perintahnya lagi agar perubahanmu diterapkan di atas
        versi terbaru. Editor di dashboard bekerja dengan cara yang sama.
      </P>
      <H3>Siapa boleh apa</H3>
      <Table
        head={["Peran", "Environment biasa", "Environment terlindungi (mis. production)"]}
        rows={[
          [<strong key="i">Owner / admin instance</strong>, "Semuanya", "Semuanya"],
          [<strong key="d">Admin project, developer</strong>, "list, pull, set, unset, push, promote, run", <>Hanya nama variabel. Selebihnya menampilkan <Code>error  &quot;backend/production&quot; is protected; only instance owners and admins can read it.</Code></>],
          [<strong key="v">Viewer</strong>, "Hanya nama variabel", "Hanya nama variabel"],
        ]}
      />
      <Ul>
        <li>
          <strong>Tautan</strong>: <Code>env link</Code>/<Code>unlink</Code>{" "}
          butuh peran developer di project aplikasi itu; menambah atau melepas
          tautan ke environment terlindungi butuh peran admin project. Set harus
          dibagikan ke project itu.
        </li>
        <li>
          <strong>Di CI</strong> buat API token lalu ekspor{" "}
          <Code>AOOX_TOKEN</Code>/<Code>AOOX_URL</Code>. Token bisa dibatasi ke
          sebagian environment set (Pengaturan<PathArrow />API token
          <PathArrow />batas variabel), mis.{" "}
          <Code>backend/staging</Code>, <Code>backend/*</Code> atau{" "}
          <Code>*/development</Code>: environment lain ditolak dengan 403. Lihat{" "}
          <DocLink href="/id/docs/variabel#token">Scope API token</DocLink>.
        </li>
        <li>
          Token <strong>baca saja</strong> tetap bisa menjalankan{" "}
          <Code>aoox env pull</Code>, <Code>aoox env list --reveal</Code> dan{" "}
          <Code>aoox run</Code> (membaca tidak mengubah apa pun dan diaudit),
          tetapi <Code>set</Code>, <Code>unset</Code>, <Code>push</Code>,{" "}
          <Code>promote</Code>, <Code>link</Code> dan <Code>unlink</Code>{" "}
          ditolak. Viewer tidak pernah bisa membaca nilai, dengan atau tanpa
          token.
        </li>
        <li>
          Setiap pembacaan nilai tercatat di audit log tanpa nilainya. CLI tidak
          pernah menyimpan environment di disk.
        </li>
        <li>
          Membuat, membagikan, dan menghapus set serta environment dilakukan di
          dashboard oleh owner atau admin instance.
        </li>
      </Ul>

      <H2 id="local-development">Pengembangan lokal</H2>
      <P>
        Jalankan aplikasi di laptop dengan variabel satu environment set,
        tanpa file <Code>.env</Code> dan tanpa menautkan folder. Cukup sudah
        masuk (login).
      </P>
      <Steps>
        <Step title="Pasang CLI, buat token sempit, lalu masuk">
          <Pre>{`$ npm i -g @hideandseeklab/aoox
$ aoox login`}</Pre>
          <P>
            Di panel, <strong>Pengaturan<PathArrow />API token<PathArrow />Buat
            token</strong>: aktifkan <strong>Read-only</strong> dan isi{" "}
            <strong>Batasi ke variabel</strong> dengan environment yang Anda
            pakai, mis. <Code>backend/development</Code>. Dengan begitu token di
            laptop tidak bisa menyentuh production. Lihat{" "}
            <DocLink href="/id/docs/variabel#token">cakupan API token</DocLink>.
          </P>
        </Step>
        <Step title="Taruh perintahnya di package.json">
          <Pre title="package.json">{`"scripts": {
  "start:dev": "aoox run --set backend --env development -- nest start --watch"
}`}</Pre>
          <P>
            Pindahan dari Infisical? <Code>infisical run --env=dev -- …</Code>{" "}
            menjadi <Code>aoox run --set &lt;slug&gt; --env development -- …</Code>.
          </P>
        </Step>
        <Step title="Selalu sertakan --set dan --env di lokal">
          <Callout kind="warn" title="Tanpa keduanya, Anda mendapat variabel aplikasi yang sudah di-deploy">
            <Code>aoox run -- …</Code> tanpa <Code>--set</Code>/<Code>--env</Code>{" "}
            butuh aplikasi tertaut dan menyuntikkan apa yang didapat
            kontainernya saat deploy: environment set yang tertaut ke aplikasi
            plus env miliknya sendiri. Itu biasanya{" "}
            <strong>production</strong>, dan mengubah tautan aplikasi di panel
            akan diam-diam mengubah apa yang didapat laptop Anda. Dengan{" "}
            <Code>--set</Code>/<Code>--env</Code> hanya satu environment yang
            disuntikkan: tanpa tautan, tanpa env aplikasi.
          </Callout>
        </Step>
        <Step title="Yang Anda lihat">
          <Pre>{`$ aoox run --set backend --env development -- nest start --watch
aoox  Injecting 5 variables from backend/development (no links, no own env)`}</Pre>
          <Ul>
            <li>
              Baris itu keluar di standard error dan berwarna hanya di
              terminal (polos saat di-pipe atau dengan <Code>NO_COLOR</Code>).{" "}
              <Code>--quiet</Code> (<Code>-q</Code>) menyembunyikannya, tetapi
              tidak pernah peringatan.
            </li>
            <li>
              <strong>Gagal dengan aman</strong>: kalau pembacaan ditolak (token
              salah, tidak punya akses, environment terproteksi, cakupan token),
              perintah tidak dijalankan sama sekali.
            </li>
            <li>
              Variabel hanya ada di proses anak; tidak ada yang ditulis ke
              disk.
            </li>
          </Ul>
        </Step>
        <Step title="Alat yang hanya membaca file">
          <Pre>{`$ aoox env pull --set backend --env development --file .env`}</Pre>
          <P>
            File ditulis dengan mode <Code>0600</Code> dan tidak ditimpa tanpa{" "}
            <Code>--force</Code>. Pastikan <Code>.env</Code> ada di{" "}
            <Code>.gitignore</Code>; aoox memperingatkan bila belum.
          </P>
        </Step>
        <Step title="Perlukah aoox link?">
          <P>
            Tidak untuk variabel lokal: <Code>--set</Code>/<Code>--env</Code>{" "}
            hanya butuh Anda sudah login. Anda memerlukannya untuk{" "}
            <Code>aoox deploy</Code>, untuk <Code>aoox run</Code> tanpa flag,
            dan untuk mengatur tautan lewat{" "}
            <Code>aoox env links/link/unlink</Code>. Perintah itu menulis{" "}
            <Code>.aoox.json</Code> (alamat panel, id dan nama project serta
            aplikasi, tanpa rahasia), aman untuk di-commit.
          </P>
        </Step>
        <Step title="CI">
          <P>
            Lewati <Code>aoox login</Code> dan isi <Code>AOOX_URL</Code> serta{" "}
            <Code>AOOX_TOKEN</Code> (variabel CI yang di-mask) dari token
            read-only yang dibatasi ke environment yang dibutuhkan job.
          </P>
          <Pre>{`$ AOOX_URL=https://panel.example.com aoox run --set backend --env development -- npm test`}</Pre>
        </Step>
      </Steps>
      <H3>Batasan</H3>
      <Ul>
        <li>
          Referensi <Code>{"${{database.…}}"}</Code> dan{" "}
          <Code>{"${{secret.…}}"}</Code> tetap apa adanya, dengan peringatan:
          hanya panel yang menyelesaikannya saat deploy. Arahkan variabel itu
          ke database lokal lewat variabel khusus lokal atau <Code>--file</Code>.
        </li>
        <li>Secret yang disinkronkan dari Infisical tidak ikut.</li>
        <li>
          Bila <Code>--set</Code>/<Code>--env</Code> dihilangkan dan kandidatnya
          banyak, perintah berhenti dan mendaftarkannya; tidak pernah menebak.
        </li>
      </Ul>

      <H2 id="registry-images">Build &amp; push image (aoox registry)</H2>
      <P>
        Dua perintah untuk memasukkan image ke registry <em>tanpa</em>{" "}
        men-deploy-nya — berguna kalau image dipilih nanti di dashboard (
        <Code>Aplikasi baru</Code><PathArrow /><Code>Image siap pakai</Code>).
        Keduanya tidak butuh <Code>aoox link</Code>; memakai login biasa (atau{" "}
        <Code>--url</Code>/<Code>--token</Code>). Registry default adalah yang
        self-hosted; pakai <Code>--registry &lt;id&gt;</Code> untuk yang lain.
      </P>
      <Pre>{`$ aoox registry build myapp:1.0.0
==> Build registry.example.com/myapp:1.0.0
...
Built registry.example.com/myapp:1.0.0
Next: aoox registry push myapp:1.0.0 (or build with --push next time)

$ aoox registry push myapp:1.0.0
==> docker login registry.example.com
==> Push registry.example.com/myapp:1.0.0
Pushed registry.example.com/myapp:1.0.0
Use it in the dashboard: New application → Ready-made image`}</Pre>
      <P>
        <Code>build</Code> membaca <Code>./Dockerfile</Code> (
        <Code>-f/--dockerfile</Code>, <Code>--context</Code>) dan menamai image{" "}
        <Code>&lt;host registry&gt;/&lt;nama&gt;:&lt;versi&gt;</Code>.{" "}
        <Code>push</Code> hanya mendorong image yang sudah ada secara lokal dan
        menerima nama pendek maupun lengkap. Untuk build dan push sekaligus,
        pakai <Code>aoox registry build myapp:1.0.0 --push</Code>. Nama harus
        huruf kecil.
      </P>
      <P>
        Tidak perlu mengetik semuanya. Kalau versinya dihilangkan (
        <Code>aoox registry build myapp</Code>) atau seluruh argumennya (
        <Code>aoox registry build</Code>), CLI membacanya dari proyek: konteks
        build untuk <Code>build</Code>, folder saat ini untuk{" "}
        <Code>push</Code>. <Code>nama:versi</Code> yang diketik selalu menang.
        File pertama yang ditemukan, dengan urutan ini, memberi tiap nilai:
      </P>
      <Table
        head={["Urutan", "Sumber", "Nama", "Versi"]}
        rows={[
          ["1", <Code key="1">package.json</Code>, <>name (scope dibuang: <Code>@acme/web</Code> jadi <Code>web</Code>)</>, "version"],
          ["2", <Code key="2">pyproject.toml</Code>, <>name di <Code>[project]</Code> atau <Code>[tool.poetry]</Code></>, "version (dilewati bila dynamic)"],
          ["3", <Code key="3">Cargo.toml</Code>, <>name di <Code>[package]</Code></>, <>version di <Code>[package]</Code> (bukan versi workspace)</>],
          ["4", <Code key="4">composer.json</Code>, <>name (<Code>vendor/pkg</Code> jadi <Code>pkg</Code>)</>, "version, bila ada"],
          ["5", <Code key="5">pubspec.yaml</Code>, "name", "version"],
          ["6", <Code key="6">*.csproj</Code>, <>AssemblyName, atau nama file</>, <>Version, atau VersionPrefix-VersionSuffix (hanya satu file)</>],
          ["7", <Code key="7">pom.xml</Code>, "artifactId proyek", "version proyek (bukan milik parent)"],
          ["8", <Code key="8">VERSION</Code>, "—", "baris pertama yang tidak kosong"],
          ["9", "tag git", "—", <>tag tempat HEAD berada, tanpa awalan <Code>v</Code></>],
          ["10", "nama folder", "nama folder, huruf kecil", "—"],
        ]}
      />
      <P>
        Nilai dari file yang tidak bisa dipakai (variabel <Code>$(…)</Code>{" "}
        atau <Code>${"{…}"}</Code>, versi dynamic) dilewati dan sumber
        berikutnya dicoba. Nama diubah ke huruf kecil; tanda <Code>+</Code>{" "}
        pada versi (metadata build, tidak boleh ada di tag) menjadi{" "}
        <Code>_</Code>. Kalau HEAD sudah melewati tag git terakhir, tidak ada
        yang ditebak: beri tag rilisnya, ketik <Code>nama:versi</Code>, atau
        tambahkan <Code>--force</Code> untuk memakai bentuk{" "}
        <Code>git describe</Code> seperti <Code>1.4.2-3-gabc1234</Code>.
      </P>
      <Pre>{`$ aoox registry build
==> Image web:1.4.2 (name and version from package.json)
? Build web:1.4.2? (Y/n/e)`}</Pre>
      <P>
        Karena nama atau versi turunan bisa saja keliru, CLI bertanya dulu
        sebelum melakukan apa pun: <Code>Y</Code> lanjut, <Code>n</Code>{" "}
        berhenti, <Code>e</Code> untuk mengetik <Code>nama:versi</Code> lain.{" "}
        <Code>--yes</Code> (<Code>-y</Code>) melewati pertanyaan. Tanpa
        terminal, atau saat <Code>CI</Code> terisi, CLI menolak dan meminta{" "}
        <Code>nama:versi</Code> atau <Code>--yes</Code>. <Code>nama:versi</Code>{" "}
        yang diketik lengkap tidak pernah ditanyakan. Kalau lupa menaikkan
        versi, pengecekan &quot;already exists&quot; di bawah tetap melindungi
        registry dan menunjukkan di mana mengubahnya.
      </P>
      <Table
        head={["Yang muncul", "Artinya"]}
        rows={[
          [
            <Code key="1">error  myapp:1.0.0 already exists in registry.example.com.</Code>,
            <>Versi itu sudah ada di registry (dicek sebelum build dan sebelum push). Pilih versi baru — petunjuknya menyarankan yang berikutnya — atau tambahkan <Code>--force</Code> untuk menimpa. <Code>latest</Code> selalu boleh ditimpa.</>,
          ],
          [
            <Code key="2">error  No local image myapp:1.0.0.</Code>,
            <><Code>push</Code> tidak pernah build. Jalankan <Code>aoox registry build myapp:1.0.0</Code> dulu.</>,
          ],
          [
            <Code key="3">error  A version is required: &quot;myapp&quot; has none.</Code>,
            <>Versi tidak diketik dan tidak ditemukan di proyek. Tulis <Code>nama:versi</Code>, mis. <Code>aoox registry build myapp:1.0.0</Code>, atau isi versi di salah satu file pada daftar di atas.</>,
          ],
          [
            <>Registry-nya <Code>localhost:5000</Code></>,
            <>Peringatan: alamat itu hanya bekerja di server itu sendiri. Beri registry domain dengan <Code>aoox registry domain --set registry.example.com</Code>.</>,
          ],
        ]}
      />

      <H2 id="domain">Ganti domain panel</H2>
      <P>
        Alternatif dari Settings<PathArrow />Domain panel di dashboard — cocok untuk
        skrip provisioning. Lihat{" "}
        <DocLink href="/id/docs/domain-panel">Domain untuk panel</DocLink> untuk
        detail apa yang terjadi di baliknya.
      </P>
      <Pre>{`$ aoox domain set --web panel.example.com --api api.panel.example.com \\
  --acme-email kamu@example.com
Domain saved: panel.example.com (dashboard), api.panel.example.com (API).
The panel will restart for a few seconds to apply it — the connection to this API will drop briefly.`}</Pre>
      <P>
        Untuk membatalkannya, <Code>aoox domain clear</Code> menghapus domain
        dan kembali ke <Code>http://&lt;IP server&gt;:3000</Code> (bertanya
        dulu; <Code>--yes</Code> melewati pertanyaan). Proxy dan domain
        aplikasi tidak disentuh. Lihat{" "}
        <DocLink href="/id/docs/domain-panel#hapus-domain">Menghapus domain</DocLink>.
      </P>
      <Callout>
        Panel harus sudah punya <Code>INSTALL_DIR</Code> terisi di{" "}
        <Code>.env.dist</Code> (path absolut folder <Code>docker-compose.dist.yml</Code>{" "}
        di host itu) — tanpa itu perintah gagal dengan 400.
      </Callout>

      <H2 id="update">Update aoox</H2>
      <P>
        Ada dua hal berbeda yang diperbarui, dengan dua perintah.{" "}
        <Code>aoox update</Code> memperbarui <strong>CLI itu sendiri</strong> di
        komputermu; <Code>aoox update panel</Code> memperbarui{" "}
        <strong>panel</strong> (image <Code>aoox-api</Code>/<Code>aoox-web</Code>{" "}
        di server).
      </P>
      <Callout kind="warn" title="Arti aoox update berubah">
        Sebelum rilis ini <Code>aoox update</Code> mengecek panel. Perilaku
        lama sekarang jadi <Code>aoox update panel</Code>; menjalankan{" "}
        <Code>aoox update --apply</Code> mencetak{" "}
        <Code>Panel updates moved to: aoox update panel --apply</Code> dan
        keluar dengan error tanpa mengubah apa pun.
      </Callout>
      <H3>CLI: aoox update</H3>
      <P>
        Mencari versi terbaru di npm (tanpa login, tanpa panel). Instalasi
        pre-release mengikuti yang terbaru antara tag <Code>latest</Code> dan{" "}
        <Code>alpha</Code>; instalasi stabil tidak pernah pindah ke
        pre-release. Kalau CLI dipasang lewat npm, ia menjalankan{" "}
        <Code>npm i -g @hideandseeklab/aoox@&lt;versi&gt;</Code> untukmu; untuk
        tarball standalone atau source checkout ia mencetak perintah persisnya
        alih-alih menebak.
      </P>
      <Pre>{`$ aoox update --check
Update available: aoox CLI 0.1.0-alpha.7 → 0.1.0-alpha.8
Run: aoox update

$ aoox update
==> npm i -g @hideandseeklab/aoox@0.1.0-alpha.8
Updated aoox CLI 0.1.0-alpha.7 → 0.1.0-alpha.8

$ aoox update
aoox CLI 0.1.0-alpha.8 is up to date`}</Pre>
      <P>
        Kalau registry npm tidak terjangkau, perintah gagal dengan pesan jelas
        (exit status bukan nol).
      </P>
      <H3>Panel: aoox update panel</H3>
      <P>
        Cek dan terapkan update untuk panel itu sendiri (bukan aplikasi yang
        di-deploy) — bandingkan digest image <Code>aoox-api</Code>/
        <Code>aoox-web</Code> di registry, bukan sekadar nomor versi.
      </P>
      <Pre>{`$ aoox update panel
Running version: 0.1.0-alpha.1
  api: hideandseeklab/aoox-api:latest (update available)
  web: hideandseeklab/aoox-web:latest (up to date)
Update available. Run with --apply to apply it.

$ aoox update panel --apply
Update applied — the panel will restart for a few seconds to apply it.`}</Pre>
      <P>
        Sama seperti <Code>aoox domain set</Code>, butuh <Code>INSTALL_DIR</Code>{" "}
        terisi. Lihat <DocLink href="/id/docs/instalasi#update">Memperbarui versi</DocLink>{" "}
        untuk cara manual lewat SSH sebagai alternatif.
      </P>

      <H2 id="reinstall">Memperbaiki instalasi (aoox reinstall)</H2>
      <P>
        <Code>aoox update</Code> hanya <Code>pull</Code> + <Code>up -d</Code>: ia
        tidak menulis ulang <Code>docker-compose.dist.yml</Code> dan tidak
        menambah variabel baru ke <Code>.env.dist</Code>. Instalasi lama karena
        itu tidak menerima perbaikan yang butuh perubahan compose atau env
        (contoh nyata: Terminal error <Code>TERMINAL_SSH_USER is not set</Code>{" "}
        setelah update, karena instalasi lama tidak pernah menulis variabel
        itu). <Code>aoox reinstall</Code> memperbaikinya <strong>tanpa
        menyentuh data</strong>. Jalankan di server panel, sebagai root:
      </P>
      <Pre title="Lihat dulu apa yang akan berubah, lalu terapkan">{`$ sudo aoox reinstall --dry-run
$ sudo aoox reinstall`}</Pre>
      <Table
        head={["Langkah", "Yang terjadi"]}
        rows={[
          [
            "Backup",
            <>File yang akan berubah disalin ke <Code>&lt;dir&gt;/backups/&lt;waktu&gt;/</Code> (<Code>.env.dist</Code> tetap izin 600).</>,
          ],
          [
            "Compose",
            <><Code>docker-compose.dist.yml</Code> (dan <Code>docker-compose.domain.yml</Code> bila ada) ditulis ulang dari salinan yang dibundel di CLI. <Code>docker-compose.override.yml</Code> milik fitur Domain panel/Environment <strong>tidak disentuh</strong>.</>,
          ],
          [
            ".env.dist",
            <>Digabung, bukan dibuat ulang: semua nilai, urutan, komentar, dan key tak dikenal dipertahankan; hanya key yang belum ada dan punya default aman yang ditambahkan (mis. <Code>TERMINAL_SSH_USER=root</Code>, <Code>INSTALL_DIR</Code>). <Code>POSTGRES_PASSWORD</Code>, <Code>JWT_SECRET</Code>, <Code>ENCRYPTION_KEY</Code> tidak pernah diubah — bila salah satunya hilang, perintah berhenti dengan pesan jelas.</>,
          ],
          [
            "Jalankan ulang",
            <><Code>docker compose pull</Code> lalu <Code>up -d --force-recreate</Code> memakai daftar file compose yang sama dengan stack yang sedang berjalan. Volume (database) tidak disentuh. Lalu menunggu API sehat dan mencetak ringkasan.</>,
          ],
        ]}
      />
      <P>
        Aman dijalankan berulang: bila tidak ada yang perlu diubah, tidak ada
        file yang ditulis dan tidak ada backup — container tetap disegarkan.
        Bila <Code>docker-compose.override.yml</Code> memakai tag{" "}
        <Code>!override</Code> (opsi <em>Hanya izinkan akses lewat domain</em>)
        dan Docker Compose di host lebih lama dari 2.24.4, perintah berhenti
        sebelum mengubah apa pun: upgrade plugin Compose atau matikan opsi itu
        di dashboard dulu. Opsi: <Code>--dir</Code> (default <Code>/opt/aoox</Code>),{" "}
        <Code>--yes</Code> (tanpa konfirmasi), <Code>--no-pull</Code>,{" "}
        <Code>--terminal-ssh-user &lt;user&gt;</Code> (mengisi atau menimpa nilai
        itu), dan <Code>--dry-run</Code> (hanya cetak rencana).
      </P>
      <Callout kind="warn" title="Jangan pakai aoox install --force untuk memperbaiki">
        <Code>aoox install --force</Code> menulis <Code>.env.dist</Code> baru
        dengan secret acak baru: database lama tidak bisa diakses lagi dan semua
        kredensial tersimpan tidak bisa didekripsi. Untuk instalasi yang sudah
        berjalan, selalu pakai <Code>aoox reinstall</Code>.
      </Callout>
      <P>
        Tanpa CLI: edit <Code>.env.dist</Code> langsung (mis. tambah{" "}
        <Code>TERMINAL_SSH_USER=root</Code>) atau pakai halaman{" "}
        <DocLink href="/id/docs/environment">Environment</DocLink> di Settings, lalu{" "}
        <Code>docker compose … up -d</Code>.
      </P>

      <H2 id="perintah">Referensi perintah</H2>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Perintah</th>
              <th className="px-3 py-2 text-left font-medium">Fungsi</th>
              <th className="px-3 py-2 text-left font-medium">Flag</th>
            </tr>
          </thead>
          <tbody>
            {COMMANDS.map((row) => (
              <tr key={row.cmd} className="border-t border-border align-top">
                <td className="px-3 py-2"><Code>{row.cmd}</Code></td>
                <td className="px-3 py-2 text-muted-foreground">{row.what}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.flags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="konfigurasi">Konfigurasi & variabel lingkungan</H2>
      <Table
        head={["Sumber", "Isi", "Catatan"]}
        rows={[
          [
            <Code key="1">config.json</Code>,
            <>
              <Code>{'{ "url": "<api>", "webUrl": "<dashboard>", "token": "aoox_…" }'}</Code> di direktori
              konfigurasi oclif (<Code>~/.config/aoox/</Code> di Linux).
            </>,
            <>Ditulis dengan mode <Code>0600</Code>; jalur lengkapnya dicetak saat login.</>,
          ],
          [
            <><Code>--url</Code> / <Code>--token</Code></>,
            "Menimpa isi file untuk satu perintah. --url adalah alamat dashboard (alamat API tetap diterima).",
            "Berguna saat berpindah antar panel (produksi vs staging).",
          ],
          [
            <><Code>AOOX_URL</Code> / <Code>AOOX_TOKEN</Code></>,
            "Sumber yang sama lewat environment.",
            "Dipakai CI; muncul juga di --help.",
          ],
        ]}
      />
      <Ul>
        <li>
          Urutan: flag<PathArrow />environment<PathArrow />isi <Code>config.json</Code>. Bila tidak
          ada yang lengkap, CLI menyuruh menjalankan <Code>aoox login</Code>.
        </li>
        <li>
          Beberapa panel? Jangan login ulang bolak-balik — simpan satu sebagai
          default lalu timpa dengan <Code>--url</Code>/<Code>--token</Code>{" "}
          seperlunya.
        </li>
      </Ul>

      <H3>Di CI (tanpa terminal)</H3>
      <P>
        <Code>aoox login</Code> butuh terminal interaktif. Di pipeline, lewati
        login dan berikan kredensial lewat environment:
      </P>
      <Pre title=".gitlab-ci.yml">{`deploy:
  image: node:20
  variables:
    AOOX_URL: https://panel.example.com
  script:
    - npx -p @hideandseeklab/aoox aoox whoami   # AOOX_TOKEN dari CI variable (masked)`}</Pre>
      <Callout>
        Simpan token sebagai variabel CI yang <em>masked</em>, dan buat token
        terpisah per pipeline agar bisa dicabut tanpa mengganggu yang lain.
      </Callout>

      <H2 id="antivirus">Di balik antivirus atau proxy perusahaan</H2>
      <P>
        Pemindaian HTTPS oleh antivirus (AVG, Avast, Kaspersky, ESET,
        Bitdefender) dan proxy perusahaan (Zscaler, Netskope, Fortinet, Palo
        Alto) menandatangani ulang lalu lintas HTTPS dengan sertifikat root
        mereka sendiri. Sertifikat itu terpasang di penyimpanan sertifikat
        sistem operasi Anda, tetapi Node hanya mengenal daftar bawaannya, jadi
        CLI dulu gagal dengan galat sertifikat padahal sertifikat panel
        sebenarnya baik-baik saja.
      </P>
      <P>
        Pada <strong>Node 22.19+ atau 24.5+</strong> CLI kini juga memercayai
        penyimpanan sistem selain daftar Node, sehingga langsung berfungsi tanpa
        pengaturan. Verifikasi sertifikat tidak pernah dimatikan. Pada Node yang
        lebih lama tidak ada yang berubah, dan pesan galat menyebut penerbit
        yang terlihat (misalnya <Code>AVG Web/Mail Shield Root</Code>).
      </P>
      <Ul>
        <li>
          Nonaktifkan penyimpanan sistem dengan <Code>AOOX_SYSTEM_CA=0</Code>.
        </li>
        <li>
          <Code>NODE_EXTRA_CA_CERTS=/path/ke/root.pem</Code> tetap berfungsi
          bila Anda ingin memercayai satu root tertentu.
        </li>
        <li>
          Node lama: setel <Code>NODE_OPTIONS=--use-system-ca</Code> (Node
          22.15+ / 23.10+), perbarui Node, atau tambahkan domain panel ke
          pengecualian pemindaian HTTPS antivirus.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Pesan", "Penyebab & solusi"]}
        rows={[
          [
            <>The panel rejected the token (401)</>,
            <>Token kedaluwarsa, dicabut, atau salah salin. Buat token baru di Settings<PathArrow />API token.</>,
          ],
          [
            <>No interactive terminal</>,
            <>Berjalan di CI/skrip. Beri <Code>--url</Code> dan <Code>--token</Code>, atau set <Code>AOOX_URL</Code> dan <Code>AOOX_TOKEN</Code>.</>,
          ],
          [
            <>Cannot reach the panel</>,
            <>Alamat salah atau panel tidak terjangkau dari mesin ini. Pakai alamat yang kamu buka untuk dashboard, periksa firewall / security group, atau pasang domain panel (Infrastructure<PathArrow />Panel domain). Uji dengan <Code>curl &lt;url-dashboard&gt;/.well-known/aoox.json</Code>.</>,
          ],
          [
            <>… answers plain HTTP</>,
            <>Kamu memakai <Code>https://</Code> di port yang berbicara HTTP biasa (mis. <Code>:3000</Code>). Pakai alamat <Code>http://</Code>, atau pasang domain panel untuk mendapat HTTPS.</>,
          ],
          [
            <>Your aoox CLI is older than the panel</>,
            <>Peringatan, bukan error. Perbarui dengan <Code>aoox update</Code>.</>,
          ],
          [
            <>Config is corrupt (not valid JSON)</>,
            <>File konfigurasi teredit manual. Hapus file itu lalu <Code>aoox login</Code> lagi.</>,
          ],
          [
            <>403 pada perintah tertentu</>,
            <>Peran akun pemilik token tidak cukup — token tidak menambah hak apa pun di atas pemiliknya. Bila tokennya punya scope, lihat <DocLink href="/id/docs/pengguna-peran#akun">token read-only/project-limited</DocLink>.</>,
          ],
          [
            <>This repo is not linked yet</>,
            <><Code>aoox deploy</Code> dijalankan sebelum <Code>aoox link</Code>. Jalankan <Code>aoox link</Code> dulu di folder repo.</>,
          ],
          [
            <>A deployment is already running for this application (409)</>,
            <>Aplikasi yang sama sedang di-deploy — dari dashboard, webhook, atau <Code>aoox deploy</Code> lain. Tunggu selesai, cek tab Deploy.</>,
          ],
          [
            <>aoox install: Root is required</>,
            <>Jalankan dengan <Code>sudo</Code> — instalasi menulis ke path sistem dan mengelola Docker.</>,
          ],
          [
            <>aoox install: An installation already exists in …</>,
            <>Folder <Code>--dir</Code> (default <Code>/opt/aoox</Code>) sudah terisi. Untuk memperbaiki instalasi itu, pakai <Code>aoox reinstall</Code>. <Code>--force</Code> hanya untuk instalasi ulang dari nol (membuat secret baru — data lama tidak terbaca), atau pakai <Code>--dir</Code> lain.</>,
          ],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Perintah untuk project, log tail mandiri, dan database; paket npm
        resmi; autocomplete shell; keluaran <Code>--json</Code> untuk semua
        perintah (baru <Code>whoami</Code>).
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
