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
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Pengguna & peran" }

const SUMMARY = [
  { k: "Dua lapis", v: "Peran instance + keanggotaan per project" },
  { k: "Undangan", v: "Tautan sekali pakai, 7 hari, tanpa email" },
  { k: "Keamanan", v: "2FA TOTP, API token, audit log" },
]

const ROLES = ["owner", "admin", "member"] as const
type Role = (typeof ROLES)[number]

const CAPABILITIES: { label: string; roles: Role[] }[] = [
  { label: "Project yang dibuat sendiri atau ditugaskan", roles: ["owner", "admin", "member"] },
  { label: "Melihat & mengelola semua project", roles: ["owner", "admin"] },
  { label: "Deploy, rollback, backup, jobs, mount volume/file", roles: ["owner", "admin", "member"] },
  { label: "Data browser: baca", roles: ["owner", "admin", "member"] },
  { label: "Akun sendiri: password, 2FA, API token", roles: ["owner", "admin", "member"] },
  { label: "Data browser: tulis, Impor SQL, buat database tambahan", roles: ["owner", "admin"] },
  { label: "Undang anggota (admin/member)", roles: ["owner", "admin"] },
  { label: "Registry, server remote, Swarm, notifikasi, kredensial Git, tujuan S3", roles: ["owner", "admin"] },
  { label: "Web terminal & bind mount", roles: ["owner", "admin"] },
  { label: "Audit log", roles: ["owner", "admin"] },
  { label: "Undang owner, ubah peran, hapus pengguna", roles: ["owner"] },
  { label: "Reset password & nonaktifkan 2FA anggota", roles: ["owner"] },
  { label: "Provision/hapus registry & proxy, GC, cleanup disk", roles: ["owner"] },
  { label: "Init/keluar Swarm & kelola node, backup instance", roles: ["owner"] },
]

const INVITE_FLOW = [
  { s: "Undang", d: "email + peran → tautan tampil sekali" },
  { s: "Kirim", d: "salin tautan, kirim lewat chat" },
  { s: "Bergabung", d: "penerima isi nama + password" },
  { s: "Masuk", d: "langsung login, undangan ditutup" },
]

const NEXT = [
  { title: "Instalasi", description: "Akun owner pertama lewat /setup atau ADMIN_*.", href: "/docs/instalasi" },
  { title: "Web terminal", description: "Kenapa hanya owner/admin.", href: "/docs/terminal" },
  { title: "Data browser", description: "Hak baca vs tulis per peran.", href: "/docs/data-browser#hak-tulis" },
  { title: "Webhook auto-deploy", description: "Memicu deploy dari CI dengan API token.", href: "/docs/webhook" },
]

export default function Page() {
  return (
    <DocPage
      href="/docs/pengguna-peran"
      title="Pengguna & peran"
      description="Peran instance menentukan siapa boleh menyentuh infrastruktur; keanggotaan per project menentukan siapa melihat dan mengubah project mana."
    >
      <dl className="grid gap-px border border-border bg-border text-xs sm:grid-cols-3">
        {SUMMARY.map((item) => (
          <div key={item.k} className="flex flex-col gap-0.5 bg-background px-4 py-3">
            <dt className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">{item.k}</dt>
            <dd className="text-foreground">{item.v}</dd>
          </div>
        ))}
      </dl>

      <H2 id="peran">Peran instance</H2>
      <P>
        Seperti di select peran UI: <strong>Member</strong> — project &amp;
        deploy; <strong>Admin</strong> — + registry, server, notifikasi,
        terminal; <strong>Owner</strong> — semuanya.
      </P>
      <div className="overflow-x-auto border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="min-w-[14rem] px-4 py-2.5 text-left font-normal text-muted-foreground">
                Boleh apa
              </th>
              {ROLES.map((role) => (
                <th key={role} className="w-20 px-2 py-2.5 text-center font-semibold">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CAPABILITIES.map((cap) => (
              <tr key={cap.label} className="border-b border-border last:border-b-0">
                <td className="px-4 py-2 text-muted-foreground">{cap.label}</td>
                {ROLES.map((role) => {
                  const ok = cap.roles.includes(role)
                  return (
                    <td
                      key={role}
                      className={cn(
                        "px-2 py-2 text-center",
                        ok ? "text-primary-foreground dark:text-primary" : "text-muted-foreground/40"
                      )}
                    >
                      {ok ? "✓" : "–"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Ul>
        <li>
          Peran dibaca ulang dari database <strong>setiap request</strong>:
          mengubah peran atau menghapus pengguna berlaku seketika, tanpa
          menunggu sesi (7 hari) kedaluwarsa.
        </li>
        <li>
          Owner tidak bisa menghapus/menurunkan dirinya sendiri bila ia owner
          terakhir, dan pengguna yang masih memiliki project tidak bisa dihapus.
        </li>
      </Ul>

      <H2 id="project">Keanggotaan per project</H2>
      <P>
        Selain peran instance, setiap project punya daftar anggotanya sendiri
        (tab <strong>Anggota</strong> di halaman project). Inilah yang
        menentukan siapa melihat project itu:
      </P>
      <Table
        head={["Siapa", "Melihat project apa"]}
        rows={[
          [<strong key="oa">Owner &amp; admin instance</strong>, "Semua project, tanpa perlu ditambahkan."],
          [<strong key="c">Pembuat project</strong>, "Project yang ia buat — selalu sebagai admin project."],
          [<strong key="m">Member instance lain</strong>, "Hanya project tempat ia ditambahkan; yang lain menjawab 404, bukan 403."],
        ]}
      />
      <Table
        head={["Peran project", "Boleh"]}
        rows={[
          [
            <strong key="pa">admin</strong>,
            "Semua yang bisa developer, plus kelola anggota project dan hapus project.",
          ],
          [
            <strong key="pd">developer</strong>,
            "Buat & ubah aplikasi, database, stack, domain, mount, jobs, backup — pekerjaan sehari-hari.",
          ],
          [
            <strong key="pv">viewer</strong>,
            "Baca saja: status, log, metrik, daftar backup. Semua request yang mengubah ditolak, termasuk lewat API token.",
          ],
        ]}
      />
      <Ul>
        <li>
          Menambah anggota project memakai email akun yang <strong>sudah ada</strong>{" "}
          di instance — undang dulu ke instance bila belum punya akun.
        </li>
        <li>
          Pembatasan viewer ditegakkan terpusat di API untuk semua endpoint
          project, bukan sekadar disembunyikan di UI. Tiket log/terminal tetap
          bisa dibaca.
        </li>
        <li>
          Saat fitur ini dipasang, semua anggota yang ada di-backfill ke semua
          project sehingga upgrade tidak mengubah akses siapa pun — sesuaikan
          setelahnya bila ingin membatasi.
        </li>
      </Ul>

      <H2 id="owner-pertama">Owner pertama</H2>
      <Table
        head={["Cara", "Kapan", "Catatan"]}
        rows={[
          [<Code key="1">/setup</Code>, "Tabel pengguna masih kosong", "Form nama, email, password. Transaksi serializable — dua orang tidak bisa sama-sama jadi owner pertama."],
          [<><Code>ADMIN_EMAIL</Code> + <Code>ADMIN_PASSWORD</Code></>, "Saat boot, bila belum ada pengguna", "Untuk instalasi otomatis. Idempotent: tidak pernah menimpa akun yang sudah ada; boleh dibiarkan di env."],
        ]}
      />

      <H2 id="undang">Mengundang anggota</H2>
      <ol className="grid gap-px border border-border bg-border text-xs sm:grid-cols-4">
        {INVITE_FLOW.map((item, i) => (
          <li key={item.s} className="flex flex-col gap-1 bg-background px-3 py-3">
            <span className="text-[0.6rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-foreground">{item.s}</span>
            <span className="text-muted-foreground">{item.d}</span>
          </li>
        ))}
      </ol>
      <Steps>
        <Step title="Settings → Anggota → Undang anggota">
          <P>
            Isi <strong>Email</strong> dan <strong>Peran</strong>. Admin hanya
            bisa mengundang admin/member; owner bisa mengundang owner.
          </P>
        </Step>
        <Step title="Salin tautan — hanya tampil sekali">
          <Pre>{`https://panel.example.com/invite/9f3a1c…e21d`}</Pre>
          <P>
            Diawali <Code>WEB_ORIGIN</Code>; kalau masih IP, tautan berisi IP
            itu. aoox <strong>tidak mengirim email</strong> — kirim sendiri
            lewat chat.
          </P>
        </Step>
        <Step title="Penerima membuka tautan">
          <P>
            Halaman undangan menampilkan email dan peran yang sudah ditetapkan;
            penerima hanya mengisi nama dan password (min. 8), lalu langsung
            masuk. Tautan menjadi tidak berlaku setelah dipakai.
          </P>
        </Step>
      </Steps>
      <H3>Aturan undangan</H3>
      <Ul>
        <li>Berlaku <strong>7 hari</strong>; satu tautan = satu akun.</li>
        <li>
          Mengundang email yang sudah punya undangan menunggu <strong>mengganti</strong>{" "}
          undangan lama (tautan lama mati).
        </li>
        <li>
          Daftar <strong>Undangan menunggu</strong> di kartu Anggota menampilkan
          yang belum diterima; bisa dicabut.
        </li>
        <li>Halaman terima undangan dibatasi 10 percobaan/menit per IP.</li>
      </Ul>

      <H2 id="kelola">Mengelola anggota (owner)</H2>
      <Table
        head={["Aksi", "Di mana", "Catatan"]}
        rows={[
          ["Ubah peran", "Select peran di baris anggota", "Berlaku pada request berikutnya."],
          ["Reset password", <>Ikon <em>Set password baru (reset)</em> di baris anggota</>, "Untuk anggota yang lupa password; sampaikan password sementara lewat jalur aman, minta ganti."],
          ["Nonaktifkan 2FA anggota", "Baris anggota (non-owner)", "Untuk yang kehilangan authenticator dan kode cadangan. Owner sendiri harus memakai kode cadangan."],
          ["Hapus pengguna", "Baris anggota", "Ditolak bila ia owner terakhir atau masih memiliki project (pindahkan/hapus project dulu). Undangan dan token API miliknya ikut hilang."],
          ["Keluarkan dari satu project", "Tab Anggota di halaman project", "Cukup dilakukan project admin; akun penggunanya tetap ada."],
        ]}
      />

      <H2 id="akun">Keamanan akun</H2>
      <P>Kartu <strong>Akun</strong> di Settings, untuk semua peran:</P>
      <H3>Ganti password</H3>
      <P>
        Isi <strong>Password sekarang</strong> + <strong>Password baru (min. 8)</strong>.
        Sesi lain tidak dipaksa logout.
      </P>
      <H3>Verifikasi dua langkah (2FA)</H3>
      <Steps>
        <Step title="Aktifkan 2FA → pindai QR">
          <P>Aplikasi TOTP apa pun (Google Authenticator, Aegis, 1Password, Bitwarden).</P>
        </Step>
        <Step title="Masukkan kode 6 digit untuk konfirmasi">
          <P>
            Setelah benar, <strong>10 kode cadangan</strong> ditampilkan{" "}
            <strong>sekali</strong> — simpan di password manager. Tiap kode
            sekali pakai.
          </P>
        </Step>
        <Step title="Sign-in berikutnya jadi dua langkah">
          <P>
            Password → halaman kode (TOTP atau kode cadangan). Langkah kedua
            harus selesai dalam <strong>5 menit</strong>.
          </P>
        </Step>
      </Steps>
      <Ul>
        <li>
          <strong>Nonaktifkan 2FA</strong> dari kartu Akun membutuhkan
          password sekarang <em>dan</em> kode yang valid — tidak bisa dari sesi
          yang dicuri saja.
        </li>
        <li>
          Kehilangan authenticator: pakai kode cadangan; habis semua → minta
          owner menonaktifkan 2FA-mu. Owner terakhir tanpa kode cadangan tidak
          bisa dipulihkan dari UI — jangan sampai.
        </li>
        <li>API token tidak terpengaruh 2FA (dipakai tanpa langkah kedua).</li>
      </Ul>
      <H3>API token</H3>
      <Steps>
        <Step title="Kartu API token → beri Nama dan Kedaluwarsa">
          <P>
            Nama mis. <Code>GitLab CI</Code>; kedaluwarsa 30 hari, 90 hari,
            1 tahun, atau tidak kedaluwarsa.
          </P>
        </Step>
        <Step title="Atur Hak (opsional): Baca saja dan Batasi ke project">
          <P>
            <strong>Baca saja</strong> menolak semua request yang mengubah
            state — sama seperti peran viewer, termasuk tiket log websocket.{" "}
            <strong>Batasi ke project</strong> memilih satu atau beberapa
            project; token menjadi 404 di luar itu dan ditolak di semua rute
            Settings instance (server, registry, proxy).
          </P>
        </Step>
        <Step title="Salin token aoox_… — hanya tampil sekali">
          <Pre title="Memakai token">{`curl -H "Authorization: Bearer aoox_…" \\
  https://api.panel.example.com/applications/<id>/deploy -X POST`}</Pre>
        </Step>
      </Steps>
      <Ul>
        <li>
          Token bertindak <strong>sebagai pemiliknya</strong> dengan peran
          yang sama — Hak hanya bisa <strong>mempersempit</strong>, tidak
          pernah menambah akses di atas pemiliknya, termasuk untuk owner.
        </li>
        <li>
          Scope diperiksa di satu tempat sebelum route mana pun berjalan,
          jadi berlaku juga untuk{" "}
          <DocLink href="/docs/cli">CLI aoox</DocLink> yang memakai token yang
          sama.
        </li>
        <li>Token disimpan sebagai hash; hilang = buat baru. Cabut kapan saja dari daftar.</li>
        <li>
          Dokumentasi endpoint (OpenAPI/Swagger) di{" "}
          <Code>{"<PUBLIC_API_URL>/docs"}</Code>.
        </li>
      </Ul>
      <H3>Audit log</H3>
      <P>
        <strong>Settings → Audit log</strong> (owner/admin): siapa melakukan
        apa, kapan, dari IP mana — termasuk sign-in, deploy, perubahan env,
        undangan. Filter per aksi, mis. <Code>deploy</Code>,{" "}
        <Code>/databases/</Code>, <Code>sign-in</Code>. Body request disimpan
        dengan rahasia disensor; entri lebih tua dari <strong>90 hari</strong>{" "}
        dihapus otomatis.
      </P>

      <H2 id="praktik">Praktik yang disarankan</H2>
      <Ul>
        <li>Minimal <strong>dua owner</strong>, keduanya dengan 2FA dan kode cadangan tersimpan.</li>
        <li>Beri peran <strong>member</strong> secara default; naikkan ke admin hanya bila perlu mengelola infrastruktur.</li>
        <li>Satu API token per integrasi, dengan kedaluwarsa — cabut saat integrasi pensiun.</li>
        <li>Cek audit log setelah insiden atau saat ada deploy yang tidak dikenali.</li>
      </Ul>

      <H2 id="jebakan">Jebakan umum</H2>
      <Table
        head={["Gejala", "Penyebab & solusi"]}
        rows={[
          ["Tautan undangan berisi IP / http", "WEB_ORIGIN masih IP. Tetap bisa dipakai; untuk rapi, pasang domain panel dulu."],
          ["Undangan tidak berlaku", "Sudah dipakai, kedaluwarsa (7 hari), dicabut, atau diganti undangan baru untuk email yang sama."],
          ["Tidak bisa menghapus pengguna", "Owner terakhir, atau masih memiliki project — pindahkan/hapus project dulu."],
          ["Sign-in minta kode padahal tidak punya authenticator", "Pakai kode cadangan; habis → minta owner menonaktifkan 2FA."],
          ["API token 401", "Kedaluwarsa/dicabut, atau header bukan Bearer aoox_…. Buat token baru."],
        ]}
      />

      <Callout kind="warn" title="Belum tersedia">
        SSO/OAuth; pengiriman undangan lewat email; memindahkan kepemilikan
        project.
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
