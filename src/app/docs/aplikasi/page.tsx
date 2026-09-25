import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
  Callout,
  Code,
  DocLink,
  DocPage,
  H2,
  P,
  Pre,
  Step,
  Steps,
  Table,
  Ul,
} from "@/components/docs/prose"

export const metadata: Metadata = { title: "Membuat aplikasi" }

const SUMMARY = [
  { k: "Waktu", v: "± 3 menit + durasi build" },
  { k: "Butuh", v: "Registry lokal (sumber Git) atau image" },
  { k: "Hasil", v: "Container berjalan dari branch pilihanmu" },
]

const EXAMPLE = [
  { k: "Nama", v: "shop" },
  { k: "Git repository", v: "https://github.com/acme/shop" },
  { k: "Branch", v: "main" },
  { k: "Kredensial Git", v: "Tidak ada (repo publik)" },
  { k: "Cara build", v: "Nixpacks" },
  { k: "Port container", v: "3000" },
  { k: "Port host", v: "(kosong — pakai domain)" },
  { k: "Health check path", v: "/health" },
]

const NEXT = [
  { title: "Tambahkan domain", description: "Hostname + HTTPS otomatis lewat Traefik.", href: "/docs/domain" },
  { title: "Deploy otomatis saat push", description: "Webhook GitHub/GitLab dengan secret.", href: "/docs/webhook" },
  { title: "Hubungkan database", description: "Referensi ${{database.<slug>.url}} di env.", href: "/docs/database" },
  { title: "Simpan data di volume", description: "Mount volume/bind/file ke container.", href: "/docs/mount" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/aplikasi"
      title="Membuat aplikasi"
      description="Menghubungkan repo Git atau image siap pakai ke sebuah project dan mengatur bagaimana container-nya dijalankan."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="prasyarat">Prasyarat</H2>
      <Ul>
        <li>
          Untuk aplikasi dari repo Git:{" "}
          <DocLink href="/docs/registry">registry lokal</DocLink> sudah
          di-provision — image hasil build di-push ke sana. Tanpa ini deploy
          pertama gagal.
        </li>
        <li>
          Sudah ada <DocLink href="/docs/project">project</DocLink> tempat
          aplikasi ini akan tinggal.
        </li>
        <li>
          Untuk repo privat: <DocLink href="/docs/webhook#kredensial">kredensial Git</DocLink>{" "}
          sudah ditambahkan di Settings.
        </li>
        <li>
          Aplikasi <strong>listen di port yang tetap</strong> dan menerima
          koneksi dari <Code>0.0.0.0</Code>, bukan hanya <Code>localhost</Code>.
        </li>
      </Ul>

      <H2 id="sumber">Dua sumber aplikasi</H2>
      <Table
        head={["Sumber", "Yang diisi", "Alur deploy"]}
        rows={[
          [
            <strong key="g">Git repository</strong>,
            "URL repo, branch, kredensial (bila privat), cara build",
            <>Clone → build (<DocLink href="/docs/build">Dockerfile / Nixpacks / statis</DocLink>) → push ke registry → jalankan.</>,
          ],
          [
            <strong key="i">Image siap pakai (di-pull)</strong>,
            <>Referensi image (<Code>ghcr.io/acme/api:1.4</Code>) dan, bila privat, registry eksternal yang menyimpan kredensialnya</>,
            <>Tanpa build: image ditarik lalu dijalankan. Bisa <DocLink href="/docs/deploy#auto-update">update otomatis</DocLink> saat digest tag berubah.</>,
          ],
        ]}
      />
      <P>
        Registry lokal hanya wajib untuk sumber Git (tempat image hasil build
        disimpan). Aplikasi dari image tidak memerlukannya.
      </P>

      <H2 id="langkah">Langkah</H2>
      <Steps>
        <Step title="Di halaman project, klik Aplikasi baru">
          <P>Isi form. Sebagian besar bisa diubah lagi nanti di tab Pengaturan.</P>
          <Table
            head={["Field", "Keterangan"]}
            rows={[
              ["Nama", "Jadi slug unik (app_name); nama container = aoox-app-<slug>."],
              [
                "Git repository",
                <>
                  URL https repo. <strong>Tanpa</strong> user:token di URL —
                  pakai select Kredensial Git untuk repo privat.
                </>,
              ],
              ["Branch", "Branch yang di-build. Webhook hanya bereaksi pada push ke branch ini."],
              ["Kredensial Git", "Tidak ada (repo publik) atau salah satu kredensial tersimpan."],
              [
                "Cara build",
                <>
                  Dockerfile atau Nixpacks — lihat{" "}
                  <DocLink href="/docs/build">Cara build</DocLink>.
                </>,
              ],
              ["Port container", "Port yang di-listen aplikasi di dalam container (mis. 3000)."],
              [
                "Port host",
                "Opsional. Isi kalau mau akses lewat IP:port tanpa domain. Kosongkan bila memakai domain — blue/green butuh port host kosong.",
              ],
              [
                "Health check path",
                <>
                  Opsional tapi disarankan, mis. <Code>/health</Code>. Menentukan
                  sukses/gagal deploy dan mengaktifkan blue/green.
                </>,
              ],
              [
                "Server",
                "Host aoox (default) atau server remote. Hanya tampil bila ada server terdaftar.",
              ],
              [
                "Mode deploy",
                <>
                  <em>container</em> (default) atau <em>service</em> dengan
                  replika bila <DocLink href="/docs/swarm">Swarm</DocLink> aktif
                  — beserta penempatan node dan setelan rolling update.
                </>,
              ],
              [
                "Update otomatis",
                <>
                  Hanya untuk sumber image: cek digest tag secara berkala dan
                  deploy saat berubah.
                </>,
              ],
              [
                "Batas CPU / memori",
                <>
                  Opsional. Lihat <DocLink href="/docs/monitoring#limit">Monitoring</DocLink>.
                </>,
              ],
            ]}
          />
          <div className="border border-border bg-card text-xs">
            <div className="border-b border-border px-3 py-1.5 text-[0.7rem] text-muted-foreground">
              Contoh pengisian — aplikasi Next.js di repo publik
            </div>
            <dl className="grid grid-cols-[minmax(8rem,auto)_1fr] gap-x-4 gap-y-1.5 p-3">
              {EXAMPLE.map((row) => (
                <div key={row.k} className="contents">
                  <dt className="text-muted-foreground">{row.k}</dt>
                  <dd className="text-card-foreground">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Step>

        <Step title="Simpan, lalu isi Environment variables (bila perlu)">
          <P>
            Tab <strong>Pengaturan</strong> → editor env, satu <Code>KEY=VALUE</Code>{" "}
            per baris. Nilai diterapkan saat container dibuat, bukan saat
            build — lihat{" "}
            <DocLink href="/docs/environment">Environment variables</DocLink>.
          </P>
        </Step>

        <Step title="Buka tab Deploy dan klik Deploy">
          <P>Yang terjadi, dan terlihat di log realtime:</P>
          <Pre>{`queued    deployment dibuat
building  daemon Docker clone repo → build image
pushing   image → registry lokal   (dilewati di server remote)
starting  container baru dibuat, tunggu healthy
success   container lama diganti · status aplikasi Running`}</Pre>
          <P>
            Deploy berikutnya menolak (409) selama masih ada deployment aktif.
            Gagal build/push tidak menyentuh container yang sedang berjalan.
            Detail di <DocLink href="/docs/deploy">Deploy &amp; rollback</DocLink>.
          </P>
        </Step>
      </Steps>

      <H2 id="verifikasi">Verifikasi</H2>
      <Ul>
        <li>
          Deployment pertama berakhir <Code>success</Code> dan badge status
          aplikasi <strong>Running</strong>.
        </li>
        <li>
          Log container (tab Deploy) menampilkan output aplikasi, mis.{" "}
          <Code>Listening on :3000</Code>.
        </li>
        <li>
          Bila memakai port host: <Code>{"curl http://<ip-server>:<port-host>/"}</Code>{" "}
          menjawab. Bila memakai domain: lanjut ke{" "}
          <DocLink href="/docs/domain">Proxy &amp; domain</DocLink>.
        </li>
      </Ul>

      <H2 id="tab">Tab di halaman aplikasi</H2>
      <Table
        head={["Tab", "Isi"]}
        rows={[
          ["Deploy", "Tombol Deploy/Stop/Start, daftar deployment, log deployment & log container streaming, metrik, Rollback."],
          ["Pengaturan", "Form yang sama dengan saat membuat, plus Environment variables dan Build args."],
          ["Domain", "Hostname untuk aplikasi + toggle HTTPS + cek DNS."],
          ["Mount", "Volume, bind, file — dan backup volume."],
          ["Jobs", "Perintah terjadwal."],
          ["Webhook", "URL webhook, secret, dan preview pull request."],
        ]}
      />

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          [
            "Deploy gagal di tahap pushing",
            <>Registry lokal belum di-provision, atau <Code>REGISTRY_PUBLIC_HOST</Code> bukan localhost tanpa TLS.</>,
          ],
          [
            "Build gagal: repository not found",
            "Repo privat tanpa Kredensial Git, atau token tidak punya akses baca.",
          ],
          [
            "Pull gagal: unauthorized (sumber image)",
            "Image privat tanpa registry eksternal terpilih, atau token registry kedaluwarsa.",
          ],
          [
            "Health check tidak pernah healthy",
            <>
              Port container tidak cocok dengan port yang di-listen, aplikasi
              hanya listen di <Code>127.0.0.1</Code>, path tidak menjawab 2xx,
              atau image tidak punya <Code>wget</Code>/<Code>curl</Code>/<Code>node</Code>/<Code>python3</Code>.
            </>,
          ],
          [
            "Running tapi domain 404",
            "Container belum healthy, atau DNS belum mengarah — pakai tombol cek DNS di tab Domain.",
          ],
          [
            "Env baru tidak berlaku",
            "Env diterapkan saat container dibuat — deploy (atau rollback) sekali lagi.",
          ],
        ]}
      />

      <Callout title="Server remote punya batasan">
        Aplikasi di server remote di-build di daemon server itu, tanpa push ke
        registry dan tanpa domain/Traefik — akses lewat port host. Detail di{" "}
        <DocLink href="/docs/server-remote">Server remote</DocLink>.
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
