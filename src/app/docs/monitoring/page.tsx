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

export const metadata: Metadata = { title: "Monitoring" }

const SUMMARY = [
  { k: "Host", v: "CPU, RAM, storage — tiap 2 detik, 5 menit" },
  { k: "Container", v: "CPU, memori, jaringan — 1 jam live, 24h/7d/30d tersimpan" },
  { k: "Limit", v: "CPU millicore & memori MiB per app/database" },
]

const SOURCES = [
  { s: "Dashboard", d: "CPU/RAM/Storage host live + kartu Host & Disk Docker (owner/admin)" },
  { s: "Aplikasi → Deploy", d: "KPI CPU / memori / jaringan + sparkline" },
  { s: "Database", d: "KPI yang sama di atas panel" },
  { s: "Settings → Disk Docker", d: "rincian image/volume/container/cache + cleanup" },
]

const NEXT = [
  { title: "Notifikasi", description: "Container mati, deploy, backup, job.", href: "/docs/notifikasi" },
  { title: "Registry", description: "Pemeliharaan disk & retensi deployment.", href: "/docs/registry#pemeliharaan" },
  { title: "Deploy & rollback", description: "Health check yang melepas container unhealthy.", href: "/docs/deploy#health-check" },
  { title: "Instalasi", description: "STORAGE_PATH dan env monitoring lain.", href: "/docs/instalasi" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/monitoring"
      title="Monitoring"
      description="Metrik host secara live, metrik per container aplikasi/database, pemakaian disk, dan batas sumber daya."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="di-mana">Di mana melihatnya</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {SOURCES.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>

      <H2 id="host">Dashboard: host live</H2>
      <P>
        Untuk owner/admin, Dashboard menampilkan tiga grafik 5 menit terakhir
        (sampel tiap 2 detik, di-poll hanya saat tab terlihat):
      </P>
      <Table
        head={["Grafik", "Sumber", "Catatan"]}
        rows={[
          ["CPU host", <>Delta idle/total dari <Code>os.cpus()</Code> — semua core</>, "Keterangan menampilkan porsi container aoox (dibagi jumlah core)."],
          ["RAM host", <><Code>totalmem − freemem</Code></>, "Termasuk cache OS — angka lebih tinggi dari htop wajar."],
          ["Storage host", <><Code>statfs(STORAGE_PATH)</Code>, default <Code>/</Code></>, <>Di Docker itu adalah disk host di balik <Code>/var/lib/docker</Code>. Set <Code>STORAGE_PATH</Code> bila data Docker di partisi lain. <em>Filesystem tidak terbaca</em> = path tidak ada di container.</>],
        ]}
      />
      <P>
        Di container Docker, <Code>/proc/stat</Code> dan <Code>/proc/meminfo</Code>{" "}
        adalah milik host, jadi angkanya = host tanpa panggilan Docker per tick.
        Riwayat 150 titik di memori API (hilang saat restart).
      </P>
      <H3>Kartu Host & Disk Docker</H3>
      <Ul>
        <li>
          <strong>Host</strong>: versi Docker, container running/total, serta
          CPU dan memori yang dipakai container aoox (dari{" "}
          <Code>docker info</Code> + sampler).
        </li>
        <li>
          <strong>Disk Docker</strong>: meter bertumpuk image / volume /
          container / build cache (dari <Code>docker system df</Code>) — bukan
          seluruh filesystem host; untuk itu lihat grafik Storage.
        </li>
        <li>
          Ringkasan project: berapa project yang punya sesuatu yang{" "}
          <em>running</em> (aplikasi, database, atau stack).
        </li>
      </Ul>

      <H2 id="container">Metrik per container</H2>
      <P>
        Tab Deploy aplikasi dan halaman database punya baris KPI{" "}
        <strong>CPU / Memori / Jaringan</strong> dengan sparkline: sampel tiap{" "}
        <strong>15 detik</strong>. Pemilih rentang di atas grafik menentukan
        dari mana datanya diambil:
      </P>
      <Table
        head={["Rentang", "Sumber", "Resolusi"]}
        rows={[
          [<Code key="1">1h</Code>, "Sampel live di memori API (240 titik)", "15 detik"],
          [<Code key="2">24h</Code>, "Rollup tersimpan di database", "1 menit"],
          [<><Code>7d</Code> / <Code>30d</Code></>, "Rollup tersimpan di database", "1 jam"],
        ]}
      />
      <Ul>
        <li>
          Sampel 15 detik diringkas menjadi satu baris per menit per
          aplikasi/database (task swarm dijumlahkan), lalu dirata-rata menjadi
          baris per jam.
        </li>
        <li>
          Baris menit dipangkas setelah <strong>48 jam</strong>; baris jam
          setelah <Code>METRICS_RETENTION_DAYS</Code> hari (default{" "}
          <strong>30</strong>).
        </li>
        <li>
          Karena tersimpan di database, riwayat <strong>bertahan saat API
          restart</strong> — hanya jendela 1 jam terakhir yang bersifat live.
        </li>
      </Ul>
      <Table
        head={["Metrik", "Rumus", "Catatan"]}
        rows={[
          ["CPU %", <>Δcpu_total / Δsystem × online_cpus × 100 — seperti <Code>docker stats</Code></>, "Dua panggilan stats berjarak 1 detik per sampel, karena mode non-stream tidak mengisi precpu."],
          ["Memori", <>usage − inactive_file (cgroup v2) / − cache (v1)</>, <>100 % = limit container bila diset, kalau tidak = RAM host (<Code>memoryLimitBytes</Code>).</>],
          ["Jaringan", "rx/tx byte kumulatif semua interface", "Ditampilkan sebagai laju antar sampel."],
        ]}
      />
      <Ul>
        <li>
          <Code>current: null</Code> bila container stop atau belum ada sampel
          (baru start &lt; 15 detik).
        </li>
        <li>I/O disk per container tidak tersedia di Docker Desktop, jadi tidak ditampilkan.</li>
        <li>
          Container berlabel komponen aoox (app, database) disampel
          lewat satu stream; container stack compose lewat stream kedua yang
          dikenali dari nama project compose (<Code>aoox-&lt;slug&gt;</Code>)
          — job dan helper build tetap tidak disampel.
        </li>
        <li>Aplikasi di <strong>server remote tidak disampel</strong> — sampler hanya membaca daemon host aoox.</li>
        <li>
          Untuk aplikasi mode <em>service</em>, metrik adalah jumlah task yang
          berjalan di host — lihat <DocLink href="/docs/swarm#service">Docker Swarm</DocLink>.
        </li>
      </Ul>

      <H2 id="limit">Batas sumber daya</H2>
      <P>
        Aplikasi (Pengaturan) dan database (kartu <strong>Batas sumber daya</strong>)
        punya <strong>CPU (millicore)</strong> dan <strong>Memori (MiB)</strong>.
        1000 millicore = 1 core; kosong = tanpa batas.
      </P>
      <Pre title="Contoh">{`CPU 500    → maksimal setengah core (NanoCpus 0.5e9)
Memori 512 → limit keras 512 MiB, tanpa swap (MemorySwap = Memory)`}</Pre>
      <Table
        head={["Aksi", "Efek"]}
        rows={[
          ["Menetapkan / mengubah nilai", <>Diterapkan langsung ke container yang berjalan (<Code>docker update</Code>), tanpa restart.</>],
          ["Mencabut (mengosongkan)", "Container dibuat ulang — Docker tidak bisa menghapus limit lewat update. Aplikasi: recreate dari image saat ini; database: provision ulang (data di volume aman)."],
        ]}
      />
      <Ul>
        <li>
          Container yang melewati limit memori di-<strong>OOM-kill</strong>{" "}
          oleh kernel → restart oleh Docker → notifikasi container mati bila
          berulang. Cek sparkline memori sebelum menurunkan limit.
        </li>
        <li>Preview PR dan job <em>Container terpisah</em> mewarisi limit aplikasinya.</li>
        <li>
          Stack compose: atur <Code>deploy.resources</Code> di file compose.
        </li>
      </Ul>

      <H2 id="container-mati">Deteksi container mati</H2>
      <P>
        API menjaga stream <Code>docker events</Code> (<Code>die</Code>)
        untuk container berlabel aoox, plus stream kedua untuk
        container stack compose (dikenali dari nama project). Setelah jeda
        5 detik ia memutuskan:
      </P>
      <Table
        head={["Kondisi", "Keputusan"]}
        rows={[
          ["Container sudah tidak ada (diganti deploy / dihapus)", "Diabaikan"],
          ["Aplikasi/database berstatus stopped (stop disengaja)", "Diabaikan"],
          ["Running lagi dengan exit code 0 (restart bersih)", "Diabaikan"],
          ["Selain itu (crash, OOM, exit ≠ 0)", <>Kirim notifikasi <Code>containerDown</Code>, maks 1× per container per 10 menit</>],
        ]}
      />
      <P>
        Aktifkan di <DocLink href="/docs/notifikasi">Notifikasi</DocLink> →
        toggle <strong>Container mati</strong>. Hanya untuk host lokal.
      </P>

      <H2 id="disk">Peringatan disk menipis</H2>
      <P>
        Sekali sehari (pukul <Code>07:00</Code> waktu API) aoox mengukur
        pemakaian filesystem tempat data Docker berada. Bila melewati ambang —
        default <strong>90 %</strong>, ubah dengan{" "}
        <Code>DISK_ALERT_PERCENT</Code> — event <Code>diskLow</Code> dikirim ke
        channel notifikasi yang mengaktifkannya, maksimal sekali sehari selama
        masih di atas ambang.
      </P>
      <P>
        Tindak lanjutnya biasanya <strong>Bersihkan sekarang</strong> di kartu
        Disk Docker, menurunkan retensi deployment, atau memangkas backup lama —
        lihat <DocLink href="/docs/registry#pemeliharaan">Registry</DocLink>.
      </P>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Storage host: Filesystem tidak terbaca", <><Code>STORAGE_PATH</Code> menunjuk path yang tidak ada di container API. Kosongkan (default /) atau mount path itu.</>],
          ["CPU host 100 % padahal htop rendah", "Sampel 2 detik sensitif terhadap burst; lihat tren, bukan satu titik."],
          ["Metrik container kosong", "Container baru start (< 15 detik), stopped, atau bukan container app/database (compose tidak disampel)."],
          ["Memori 100 % setelah set limit", "Aplikasi memang butuh lebih; naikkan limit atau cek kebocoran. Nilai 100 % = limit, bukan RAM host."],
          ["Riwayat 1h hilang setelah restart", "Rentang 1h memang live di memori; 24h ke atas dibaca dari database dan tetap ada."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Metrik untuk aplikasi di server remote; alert berdasarkan ambang
        CPU/RAM; ekspor ke Prometheus; I/O disk per container.
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
