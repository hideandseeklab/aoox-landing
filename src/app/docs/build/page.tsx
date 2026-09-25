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
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Cara build" }

const SUMMARY = [
  { k: "Pilihan", v: "Dockerfile · Nixpacks · Railpack · Situs statis, per aplikasi" },
  { k: "Berjalan di", v: "Daemon Docker (builder klasik); Railpack lewat BuildKit sendiri" },
  { k: "Hasil", v: "Image <registry>/<project>/<app>:<id>" },
]

const DECISION = [
  { q: "Hasilnya hanya file HTML/CSS/JS (Vite, CRA, Astro, Hugo, dokumentasi)?", yes: "Situs statis", no: null },
  { q: "Repo sudah punya Dockerfile?", yes: "Dockerfile", no: null },
  { q: "Butuh build ulang cepat / cache layer?", yes: "Dockerfile atau Railpack", no: null },
  { q: "Ingin nol konfigurasi dan cache antar deploy (di host, bukan server remote)?", yes: "Railpack", no: null },
  { q: "Ingin nol konfigurasi, terima build lambat tiap kali?", yes: "Nixpacks", no: "Dockerfile" },
]

const NIXPACKS_FLOW = [
  { s: "helper", d: "image aoox-nixpacks dibangun sekali (debian + git + nixpacks CLI)" },
  { s: "clone", d: "container sekali-jalan git clone --depth 1 (kredensial tidak keluar dari helper)" },
  { s: "plan", d: "nixpacks build → menulis .nixpacks/Dockerfile" },
  { s: "build", d: "source di-tar → POST /build dengan Dockerfile hasil generate" },
]

const RAILPACK_FLOW = [
  { s: "helper", d: "image aoox-railpack dibangun sekali (docker CLI + git + binary railpack)" },
  { s: "buildkit", d: "container aoox-buildkit (moby/buildkit) dinyalakan sekali, volume cache sendiri" },
  { s: "clone", d: "helper git clone --depth 1, lalu railpack build --cache-key <project>/<app>" },
  { s: "cache", d: "layer dependensi tersimpan di volume BuildKit — deploy berikutnya memakainya lagi" },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Apa yang terjadi setelah image jadi.", href: "/docs/deploy" },
  { title: "Environment variables", description: "Nilai runtime — tempat rahasia seharusnya.", href: "/docs/environment" },
  { title: "Registry", description: "Tempat image disimpan; hapus tag lama, GC.", href: "/docs/registry" },
  { title: "Stack compose", description: "Untuk repo multi-service dengan docker-compose.yml.", href: "/docs/compose" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/build"
      title="Cara build"
      description="Tiga cara mengubah repo menjadi image: Dockerfile milikmu sendiri, deteksi otomatis oleh Nixpacks, atau situs statis dengan nginx."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <Callout>
        Halaman ini tentang aplikasi yang <strong>dibangun dari repo Git</strong>.
        Aplikasi yang sumbernya image siap pakai tidak melewati tahap build sama
        sekali — lihat{" "}
        <DocLink href="/docs/aplikasi#sumber">Dua sumber aplikasi</DocLink>.
      </Callout>

      <H2 id="memilih">Mana yang dipilih?</H2>
      <div className="border border-border text-xs">
        {DECISION.map((row, i) => (
          <div
            key={row.q}
            className={cn(
              "grid gap-2 px-4 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6",
              i > 0 && "border-t border-border"
            )}
          >
            <span className="text-foreground">{row.q}</span>
            <span className="text-muted-foreground">
              ya → <span className="text-primary-foreground dark:text-primary">{row.yes}</span>
            </span>
            <span className="text-muted-foreground">
              {row.no ? (
                <>
                  tidak → <span className="text-foreground">{row.no}</span>
                </>
              ) : (
                "tidak → lanjut"
              )}
            </span>
          </div>
        ))}
      </div>
      <Table
        head={["", "Dockerfile", "Nixpacks", "Railpack", "Situs statis"]}
        rows={[
          ["Setup", "Tulis Dockerfile sendiri", "Nol konfigurasi", "Nol konfigurasi", "Perintah build + folder output"],
          ["Build ulang", "Cache layer Docker", "Selalu dari awal (--no-cache)", "Cache BuildKit antar deploy", "Selalu dari awal"],
          ["Build pertama", "Tergantung base image", "Lambat: base ± 350 MB + nix-env", "284 detik (helper + BuildKit sekali)", "Cepat: node alpine + nginx alpine"],
          ["Build berikutnya", "Cepat bila layer tak berubah", "Tetap lambat, unduh ulang dependensi", "±8 detik — dependensi dari cache", "Selalu dari awal"],
          ["Kontrol image", "Penuh", "Terbatas ke opsi nixpacks", "Terbatas ke opsi railpack", "Tidak ada — nginx :80"],
          ["Server remote", "Ya", "Ya", "Tidak — host saja", "Ya"],
          ["Cocok untuk", "Produksi, image ramping", "Prototipe, repo tanpa Dockerfile", "Deploy berulang tanpa Dockerfile", "SPA, landing page, dokumentasi"],
        ]}
      />

      <H2 id="dockerfile">Dockerfile</H2>
      <P>
        Pilih <strong>Cara build → Dockerfile</strong> dan isi{" "}
        <strong>Dockerfile di repo</strong> (default <Code>Dockerfile</Code> di
        root). Build dijalankan daemon Docker langsung dari URL Git
        (<Code>POST /build?remote=…</Code>) — daemon yang meng-clone, API tidak
        butuh git.
      </P>
      <Pre title="Contoh minimal (Node.js)">{`FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "server.js"]`}</Pre>
      <Ul>
        <li>
          <strong>Builder klasik</strong>, bukan BuildKit: sintaks{" "}
          <Code>RUN --mount</Code>, <Code>COPY --link</Code>, dan heredoc tidak
          didukung.
        </li>
        <li>
          Layer cache berlaku antar build selama base image dan langkah awal
          tidak berubah — letakkan <Code>COPY package*.json</Code> +{" "}
          <Code>npm ci</Code> sebelum <Code>COPY . .</Code>.
        </li>
        <li>
          Sertakan <Code>wget</Code> atau <Code>curl</Code> di image bila memakai
          health check (alpine punya <Code>wget</Code> bawaan busybox).
        </li>
      </Ul>

      <H2 id="nixpacks">Nixpacks</H2>
      <P>
        Pilih <strong>Cara build → Nixpacks</strong> untuk repo tanpa Dockerfile.
        Tidak ada binary nixpacks di host maupun di image API — semuanya
        berjalan di container:
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {NIXPACKS_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Callout kind="warn" title="Konsekuensi yang perlu diketahui">
        <Ul>
          <li>
            <strong>Build pertama lambat</strong>: base image nixpacks (± 350 MB)
            di-pull dan helper image dibangun sekali; versi nixpacks dipin oleh
            aoox.
          </li>
          <li>
            <strong>Tidak ada cache dependensi antar build</strong> —{" "}
            <Code>--no-cache</Code> wajib karena cache mount nixpacks butuh
            BuildKit. Setiap deploy mengunduh ulang dependensi.
          </li>
          <li>
            Source tree ditahan di memori API selama build (tanpa{" "}
            <Code>.git</Code>) — repo yang sangat besar sebaiknya memakai
            Dockerfile.
          </li>
        </Ul>
      </Callout>
      <H3>Mengarahkan Nixpacks</H3>
      <P>
        Nixpacks membaca variabel <Code>NIXPACKS_*</Code>. Isi lewat{" "}
        <strong>Build args</strong>:
      </P>
      <Pre title="Build args">{`NIXPACKS_NODE_VERSION=22
NIXPACKS_BUILD_CMD=npm run build
NIXPACKS_START_CMD=node server.js`}</Pre>
      <P>
        Alternatif: taruh <Code>nixpacks.toml</Code> di repo — dibaca otomatis
        saat <Code>plan</Code>.
      </P>

      <H2 id="railpack">Railpack</H2>
      <P>
        Pilih <strong>Cara build → Railpack</strong> untuk repo tanpa
        Dockerfile yang di-deploy berulang kali dan ingin cache dependensi
        tetap ada. Berbeda dari Nixpacks, Railpack mengeksekusi build plan-nya
        lewat container <Code>moby/buildkit</Code> yang hidup terus dengan
        volume sendiri — layer dependensi bertahan antar deploy.
      </P>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {RAILPACK_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Callout kind="warn" title="Hanya di host">
        Railpack menjalankan BuildKit di sebelah registry di host aoox
        sendiri — belum ada BuildKit per server remote. Aplikasi dengan{" "}
        <strong>server remote</strong> harus memakai Dockerfile atau Nixpacks.
      </Callout>
      <Ul>
        <li>
          Image hasil Railpack mendengarkan di <Code>$PORT</Code> (konvensi
          Railway). aoox otomatis mengisi <Code>PORT</Code> dengan{" "}
          <strong>container port</strong> yang dikonfigurasi, kecuali
          aplikasi sudah men-set <Code>PORT</Code> sendiri di env.
        </li>
        <li>
          <strong>Build args</strong> diteruskan sebagai <Code>--env</Code> ke
          railpack — sama seperti Nixpacks, ikut memengaruhi hasil deteksi
          provider-nya.
        </li>
        <li>
          Cache di-scope per <Code>project/aplikasi</Code>, jadi aplikasi lain
          tidak berbagi layer secara tidak sengaja. Volume BuildKit dipangkas
          otomatis oleh maintenance malam — prune bawaan Docker tidak
          menjangkaunya.
        </li>
      </Ul>

      <H2 id="static">Situs statis (nginx)</H2>
      <P>
        Pilih <strong>Cara build → Situs statis (nginx)</strong> untuk repo
        yang hasil akhirnya hanya file statis. aoox membuat Dockerfile
        dua tahap: (opsional) tahap build di <Code>node:22-alpine</Code>, lalu{" "}
        <Code>nginx:1.27-alpine</Code> yang melayani folder output di port 80.
      </P>
      <Table
        head={["Field", "Keterangan"]}
        rows={[
          [
            "Perintah build",
            <>
              Mis. <Code>npm ci &amp;&amp; npm run build</Code>. Kosongkan bila
              file sudah ada di repo (tanpa tahap Node).
            </>,
          ],
          [
            "Folder output",
            <>
              Relatif dari root repo: <Code>dist</Code> (default), <Code>build</Code>,{" "}
              <Code>out</Code>, atau <Code>.</Code> untuk seluruh repo.
            </>,
          ],
          [
            "Mode SPA",
            <>
              Aktif (default): path tak dikenal dilayani <Code>index.html</Code>{" "}
              (client-side routing). Nonaktif: 404 biasa untuk situs multi-halaman.
            </>,
          ],
        ]}
      />
      <Pre title="Dockerfile yang dihasilkan (ilustrasi)">{`FROM node:22-alpine AS build
WORKDIR /src
COPY . .
RUN npm ci && npm run build

FROM nginx:1.27-alpine
COPY --from=build /src/dist/ /usr/share/nginx/html/
COPY .aoox/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80`}</Pre>
      <Ul>
        <li>
          <strong>Port container</strong> harus <Code>80</Code>. Health check
          path <Code>/</Code> cukup (nginx alpine punya <Code>wget</Code>).
        </li>
        <li>
          Build berjalan lewat helper yang sama dengan Nixpacks (clone di
          container, konteks tar) — repo privat aman, tapi tanpa cache antar
          build.
        </li>
        <li>
          Env runtime tidak berguna untuk file statis, dan <strong>Build args
          belum diteruskan</strong> ke tahap build statis. Nilai saat build
          (mis. <Code>VITE_API_URL</Code>) untuk sementara ditaruh di repo
          (<Code>.env.production</Code>) atau di perintah build:{" "}
          <Code>VITE_API_URL=https://api.example.com npm run build</Code>.
        </li>
        <li>
          Versi Node dipin ke 22 oleh aoox; belum bisa diubah dari UI.
        </li>
      </Ul>

      <H2 id="build-args">Build args</H2>
      <P>
        Field <strong>Build args</strong> (tab Pengaturan) berformat{" "}
        <Code>KEY=VALUE</Code> per baris dan diteruskan sebagai{" "}
        <Code>--build-arg</Code>. Untuk Nixpacks dan Railpack nilainya juga
        menjadi env saat plan/build. Belum berlaku untuk situs statis.
      </P>
      <Pre title="Dockerfile yang memakainya">{`ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build`}</Pre>
      <Callout kind="warn">
        Build args <strong>tidak</strong> mendukung referensi{" "}
        <Code>{"${{…}}"}</Code> dan ikut tersimpan di image yang di-push. Jangan
        taruh rahasia di sini — pakai{" "}
        <DocLink href="/docs/environment">environment variables</DocLink> yang
        diterapkan saat runtime.
      </Callout>

      <H2 id="image">Image yang dihasilkan</H2>
      <Pre>{`<registry.url>/<project-slug>/<app-slug>:<12 karakter id deployment>
# contoh: localhost:5000/toko/shop:a1b2c3d4e5f6`}</Pre>
      <Ul>
        <li>
          Tag lama tetap ada di registry sampai dihapus di halaman{" "}
          <DocLink href="/docs/registry">Registry</DocLink> — itulah yang
          memungkinkan rollback. Hapus + garbage collect untuk mengembalikan
          disk.
        </li>
        <li>
          Di server remote image tidak di-push; tersimpan di daemon server itu
          dengan ref <Code>{"aoox/<project>/<app>:<tag>"}</Code>.
        </li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Build gagal: unknown flag / --mount", "Sintaks BuildKit di Dockerfile. Ganti dengan langkah biasa."],
          ["Nixpacks: build menggantung", <>Tidak seharusnya terjadi — aoox memaksa <Code>--no-cache</Code>. Cek log helper di tab Deploy.</>],
          ["Nixpacks memilih versi Node/Python yang salah", <>Set <Code>NIXPACKS_NODE_VERSION</Code> / <Code>NIXPACKS_PYTHON_VERSION</Code> di Build args, atau engines di package.json.</>],
          ["Env kosong saat build", "Env memang tidak tersedia di tahap build. Pakai Build args (non-rahasia) atau baca env saat runtime."],
          ["Railpack: \"run on the aoox host only\"", "Aplikasi ini punya server remote. Pindahkan ke Dockerfile/Nixpacks, atau hapus penempatan server-nya."],
          ["Railpack: aplikasi tidak menerima koneksi", <>Cek aplikasi membaca <Code>process.env.PORT</Code>, bukan port tertulis. aoox mengisinya otomatis dari container port.</>],
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
