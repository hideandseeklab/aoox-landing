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

export const metadata: Metadata = { title: "Docker Swarm" }

const SUMMARY = [
  { k: "Untuk apa", v: "Beberapa mesin di bawah satu panel" },
  { k: "Bentuk", v: "Aplikasi sebagai service + replika" },
  { k: "Siapa", v: "Owner (init/leave/node), admin melihat status" },
]

const FLOW = [
  { s: "init", d: "host jadi manager, overlay aoox-swarm dibuat" },
  { s: "join", d: "node lain bergabung dengan token dari panel" },
  { s: "service", d: "aplikasi diubah ke Mode deploy service + replika" },
  { s: "rolling", d: "daemon mengganti task bertahap, rollback bila gagal" },
]

const COMPARE = [
  {
    k: "Bentuk",
    server: "Panel mengendalikan daemon lain lewat SSH",
    swarm: "Satu cluster; scheduler Docker yang menempatkan task",
  },
  {
    k: "Aplikasi",
    server: "Satu container di server yang dipilih",
    swarm: "N replika yang bisa tersebar di beberapa node",
  },
  {
    k: "Domain",
    server: "Proxy per server (atau port host)",
    swarm: "Traefik di manager dengan swarm provider",
  },
  {
    k: "Cocok untuk",
    server: "Lingkungan terpisah, region berbeda",
    swarm: "Menambah kapasitas untuk aplikasi yang sama",
  },
]

const NEXT = [
  { title: "Deploy & rollback", description: "Mode container vs service, rolling update.", href: "/docs/deploy#mode" },
  { title: "Server remote", description: "Alternatif multi-mesin tanpa cluster.", href: "/docs/server-remote" },
  { title: "Registry", description: "Node lain harus bisa menarik image.", href: "/docs/registry" },
  { title: "Monitoring", description: "Metrik service dan task per node.", href: "/docs/monitoring" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/swarm"
      title="Docker Swarm"
      description="Menjalankan aplikasi sebagai service dengan replika di beberapa mesin, memakai orkestrator yang sudah ada di Docker — tanpa Kubernetes."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="kapan">Swarm atau server remote?</H2>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium"></th>
              <th className="px-3 py-2 text-left font-medium">Server remote (SSH)</th>
              <th className="px-3 py-2 text-left font-medium">Swarm</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map((row) => (
              <tr key={row.k} className="border-t border-border align-top">
                <td className="px-3 py-2 text-foreground">{row.k}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.server}</td>
                <td className="px-3 py-2 text-muted-foreground">{row.swarm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <P>
        Keduanya bisa dipakai bersamaan: host aoox menjadi manager swarm,
        sementara <DocLink href="/docs/server-remote">server remote</DocLink>{" "}
        tetap melayani aplikasi lain secara terpisah.
      </P>

      <H2 id="alur">Alur</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>

      <H2 id="aktifkan">Mengaktifkan swarm</H2>
      <Steps>
        <Step title="Settings → Docker Swarm → Init swarm (owner)">
          <P>
            Isi <strong>Advertise address</strong> bila host punya lebih dari
            satu IP — alamat inilah yang dipakai node lain untuk menghubungi
            manager. Kosongkan untuk deteksi otomatis.
          </P>
          <P>
            aoox menjadikan daemon host sebagai <strong>manager</strong>,
            membuat overlay network <Code>aoox-swarm</Code> yang bisa
            di-attach, memasukkan proxy dan managed database ke sana, lalu
            mengaktifkan <em>swarm provider</em> Traefik.
          </P>
        </Step>
        <Step title="Gabungkan node lain">
          <P>
            Kartu Swarm menampilkan perintah join lengkap dengan token — jalankan
            di mesin yang akan bergabung (Docker sudah terpasang, port{" "}
            <Code>2377</Code>, <Code>7946</Code>, dan <Code>4789/udp</Code>{" "}
            terbuka antar node):
          </P>
          <Pre>{`docker swarm join --token SWMTKN-1-… <ip-manager>:2377`}</Pre>
          <P>
            Token worker dan manager berbeda; token hanya ditampilkan kepada
            owner. Node yang bergabung muncul di daftar node beberapa detik
            kemudian.
          </P>
        </Step>
        <Step title="Pastikan registry terjangkau dari node lain">
          <P>
            Node menarik image sendiri dari registry lokal. Status swarm
            memperingatkan bila <Code>REGISTRY_PUBLIC_HOST</Code> masih{" "}
            <Code>localhost</Code> — node lain tidak bisa menariknya. Set ke
            hostname/IP yang terjangkau (dengan TLS atau{" "}
            <Code>insecure-registries</Code>) — lihat{" "}
            <DocLink href="/docs/registry#lokal">Registry</DocLink>.
          </P>
        </Step>
      </Steps>

      <H2 id="node">Mengelola node</H2>
      <Table
        head={["Aksi", "Efek"]}
        rows={[
          ["Availability: active", "Node menerima task baru."],
          ["Availability: pause", "Task yang ada tetap jalan; tidak menerima task baru."],
          ["Availability: drain", "Task dipindahkan ke node lain — dipakai sebelum maintenance."],
          ["Role: manager / worker", "Promosikan atau turunkan node. Jumlah manager ganjil (1, 3, 5) agar kuorum aman."],
          ["Label", <>Pasangan <Code>key=value</Code>, mis. <Code>zone=eu</Code> — dipakai sebagai constraint penempatan.</>],
          ["Hapus node", <>Ditolak (409) bila node masih aktif; drain dulu, lalu hapus. Di node itu jalankan <Code>docker swarm leave</Code>.</>],
        ]}
      />

      <H2 id="service">Aplikasi sebagai service</H2>
      <P>
        Di Pengaturan aplikasi, ubah <strong>Mode deploy</strong> dari{" "}
        <em>container</em> ke <em>service</em>:
      </P>
      <Table
        head={["Field", "Keterangan"]}
        rows={[
          ["Replika", "Jumlah task yang dijalankan. Stop = skala ke 0; Start mengembalikannya."],
          [
            "Penempatan",
            <>
              Node tertentu, atau constraint bebas (<Code>node.labels.zone==eu</Code>,{" "}
              <Code>node.role==worker</Code>, <Code>node.hostname</Code>,{" "}
              <Code>node.platform.os</Code>).
            </>,
          ],
          [
            "Rolling update",
            <>
              Paralelisme (berapa task diganti sekaligus), jeda antar batch, dan
              urutan (<Code>start-first</Code> / <Code>stop-first</Code>).
            </>,
          ],
        ]}
      />
      <Ul>
        <li>
          Pergantian mode, replika, penempatan, atau limit dijalankan sebagai
          deployment <Code>config</Code> — tanpa build, dan tidak memblokir
          request.
        </li>
        <li>
          Daemon melakukan rolling update sendiri; bila task baru tidak pernah
          jalan sampai batas waktu, spec lama dikembalikan dan aplikasi tetap
          melayani.
        </li>
        <li>
          Aplikasi yang punya <DocLink href="/docs/mount">mount</DocLink> selalu
          ditempatkan di host tempat volumenya berada — volume Docker tidak
          ikut berpindah node.
        </li>
        <li>
          Deploy ulang yang identik tetap memicu rolling update
          (<Code>ForceUpdate</Code>), jadi tombol Deploy selalu berefek.
        </li>
      </Ul>

      <H3>Yang perlu diketahui tentang task</H3>
      <Table
        head={["Aspek", "Di mode service"]}
        rows={[
          ["Log", "Semua task, dari node mana pun."],
          ["Metrik", <>Dijumlahkan dari task yang berjalan <strong>di host</strong> — Engine API tidak bisa membaca task di node lain.</>],
          ["Job & terminal exec", "Hanya task lokal."],
          ["Notifikasi", <>Watcher memberi tahu bila service bertahan di bawah jumlah replika (task yang tidak pernah start).</>],
          ["Domain", "Traefik swarm provider merutekan ke service, bukan ke container."],
        ]}
      />

      <H2 id="keluar">Keluar dari swarm</H2>
      <Callout kind="warn">
        Kembalikan dulu semua aplikasi ke <em>Mode deploy: container</em> —
        keluar dari swarm menghapus service yang berjalan. Setelah itu{" "}
        <strong>Settings → Docker Swarm → keluar</strong> (owner). Node lain
        perlu menjalankan <Code>docker swarm leave</Code> sendiri.
      </Callout>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Task pending: no suitable node", <>Constraint tidak cocok dengan label node mana pun, atau aplikasi punya mount sehingga terkunci di host. Longgarkan penempatan.</>],
          ["Node lain: image pull failed / x509", <><Code>REGISTRY_PUBLIC_HOST</Code> masih localhost, registry tanpa TLS, atau node belum punya entri <Code>insecure-registries</Code>.</>],
          ["Service tidak pernah mencapai jumlah replika", "Health check gagal atau resource kurang; rolling update di-rollback otomatis setelah timeout. Cek log task."],
          ["Metrik kosong untuk aplikasi di node lain", "Sesuai batasan: metrik hanya dari task lokal."],
          ["Node hilang setelah reboot", <>Daemon node belum start, atau firewall menutup port swarm (2377/7946/4789).</>],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        Stack compose sebagai swarm stack; secret/config Swarm; exec dan metrik
        lintas node; penjadwalan otomatis volume antar node.
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
