import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"

type Faq = { q: string; a: React.ReactNode; href?: string }

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-foreground underline underline-offset-4 hover:no-underline">
      {children}
    </Link>
  )
}

const FAQ_ID: Faq[] = [
  {
    q: "Apa bedanya dengan Coolify atau PaaS self-hosted lain?",
    a: (
      <>
        Konsepnya serupa: PaaS self-hosted di atas Docker. aoox fokus pada
        alur yang ringkas — project, aplikasi, database — dan kode yang mudah
        dibaca (NestJS + Next.js), tanpa agen tambahan di server.
      </>
    ),
  },
  {
    q: "Apakah perlu Kubernetes?",
    a: (
      <>
        Tidak. Satu host dengan Docker Engine sudah cukup. Untuk beberapa
        mesin ada dua jalan tanpa Kubernetes: hubungkan server lewat SSH
        sebagai target deploy terpisah (<A href="/docs/server-remote">Server
        remote</A>), atau aktifkan <strong>Docker Swarm</strong> dan jalankan
        aplikasi sebagai service dengan replika, rolling update, dan
        penempatan per node.
      </>
    ),
  },
  {
    q: "Repo tanpa Dockerfile bisa di-deploy?",
    a: (
      <>
        Bisa, pilih cara build <strong>Nixpacks</strong>: stack dideteksi
        otomatis dan Dockerfile dibuat untukmu. Build pertama lebih lama dan
        tanpa cache dependensi — <A href="/docs/build">detail di Cara build</A>.
      </>
    ),
  },
  {
    q: "Bagaimana dengan data aplikasi dan database?",
    a: (
      <>
        Volume Docker untuk data persisten, bind mount untuk path host, file
        mount untuk konfigurasi. Database dan volume bisa di-backup manual atau
        terjadwal dengan salinan ke S3 — begitu juga panel aoox sendiri,
        sehingga instance bisa dipulihkan di server baru —{" "}
        <A href="/docs/backup">Backup &amp; restore</A>.
      </>
    ),
  },
  {
    q: "Deploy otomatis saat push?",
    a: (
      <>
        Ya, lewat webhook GitHub/GitLab dengan secret opsional. Pull request
        juga bisa mendapat preview di subdomain sendiri, dan aplikasi yang
        dijalankan dari image bisa memperbarui dirinya saat tag-nya berubah —{" "}
        <A href="/docs/webhook">Webhook</A> dan{" "}
        <A href="/docs/preview">Preview PR</A>.
      </>
    ),
  },
  {
    q: "Ada downtime saat deploy?",
    a: (
      <>
        Untuk aplikasi dengan domain dan health check, tidak: container baru
        naik di samping yang lama (blue/green) dan baru menggantikannya setelah
        sehat. Gagal build tidak pernah menyentuh container yang berjalan.
      </>
    ),
  },
  {
    q: "Bisa dipakai di Windows?",
    a: (
      <>
        Untuk pengembangan, ya (Docker Desktop). Untuk produksi, gunakan Linux.
      </>
    ),
  },
  {
    q: "Apakah datanya keluar dari server saya?",
    a: (
      <>
        Tidak ada telemetri dan tidak ada layanan cloud yang dihubungi, kecuali
        yang kamu atur sendiri: Let&apos;s Encrypt untuk sertifikat, tujuan S3
        untuk backup, dan kanal notifikasi.
      </>
    ),
  },
]

const FAQ_EN: Faq[] = [
  {
    q: "How is this different from Coolify or other self-hosted PaaS tools?",
    a: (
      <>
        The concept is similar: a self-hosted PaaS on top of Docker. aoox
        focuses on a lean flow — project, application, database — and code
        that&apos;s easy to read (NestJS + Next.js), with no extra agent on the
        server.
      </>
    ),
  },
  {
    q: "Do I need Kubernetes?",
    a: (
      <>
        No. A single host with the Docker Engine is enough. For several
        machines there are two paths without Kubernetes: connect a server over
        SSH as a separate deploy target (<A href="/en/docs/server-remote">Remote
        server</A>), or turn on <strong>Docker Swarm</strong> and run apps as
        a service with replicas, rolling updates, and per-node placement.
      </>
    ),
  },
  {
    q: "Can a repo without a Dockerfile be deployed?",
    a: (
      <>
        Yes, pick the <strong>Nixpacks</strong> build method: the stack is
        auto-detected and a Dockerfile is generated for you. The first build
        is slower and has no dependency cache —{" "}
        <A href="/en/docs/build">details in the build docs</A>.
      </>
    ),
  },
  {
    q: "What about application and database data?",
    a: (
      <>
        Docker volumes for persistent data, bind mounts for host paths, file
        mounts for config. Databases and volumes can be backed up manually or
        on a schedule with copies to S3 — and so can the aoox panel
        itself, so an instance can be restored on a new server —{" "}
        <A href="/en/docs/backup">Backup &amp; restore</A>.
      </>
    ),
  },
  {
    q: "Does it deploy automatically on push?",
    a: (
      <>
        Yes, via a GitHub/GitLab webhook with an optional secret. Pull
        requests can also get a preview on their own subdomain, and an app run
        from an image can update itself when its tag changes —{" "}
        <A href="/en/docs/webhook">Webhook</A> and{" "}
        <A href="/en/docs/preview">PR previews</A>.
      </>
    ),
  },
  {
    q: "Is there downtime during a deploy?",
    a: (
      <>
        For applications with a domain and a health check, no: the new
        container comes up next to the old one (blue/green) and only replaces
        it once healthy. A failed build never touches the running container.
      </>
    ),
  },
  {
    q: "Does it work on Windows?",
    a: (
      <>
        For development, yes (Docker Desktop). For production, use Linux.
      </>
    ),
  },
  {
    q: "Does data ever leave my server?",
    a: (
      <>
        No telemetry, no cloud service is contacted, except what you set up
        yourself: Let&apos;s Encrypt for certificates, an S3 destination for
        backups, and notification channels.
      </>
    ),
  },
  {
    q: "Is the dashboard available in English?",
    a: (
      <>
        Not yet — the dashboard, and all documentation, is Indonesian only for
        now. This landing page is the first English surface; an English UI is
        on the roadmap, not shipped.
      </>
    ),
  },
]

const COPY_ID = {
  label: "faq",
  title: "Pertanyaan umum.",
  description: "Jawaban singkat. Detailnya ada di dokumentasi.",
  moreQuestions: "Masih ada pertanyaan?",
  readDocs: "Baca dokumentasi",
  openIssue: "Buka issue di GitLab",
  items: FAQ_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    label: "faq",
    title: "Common questions.",
    description: "Short answers. The full detail is in the docs.",
    moreQuestions: "Still have questions?",
    readDocs: "Read the docs (Indonesian)",
    openIssue: "Open an issue on GitLab",
    items: FAQ_EN,
  },
}

function FaqSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading label={t.label} title={t.title} description={t.description} />
          <div className="-mt-4 flex flex-col gap-2 text-xs text-muted-foreground sm:-mt-8">
            <span>{t.moreQuestions}</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link
                href="/docs"
                className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:no-underline"
              >
                {t.readDocs}
                <ArrowRight className="size-3" />
              </Link>
              <a
                href="https://github.com/hideandseeklab/aoox-api/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-foreground underline underline-offset-4 hover:no-underline"
              >
                {t.openIssue}
                <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {t.items.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center gap-4 py-4 text-sm font-medium transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                <span className="flex size-5 shrink-0 items-center justify-center border border-border text-xs text-muted-foreground transition-colors group-open:border-primary group-open:text-primary-foreground dark:group-open:text-primary">
                  <span className="transition-transform group-open:rotate-45">+</span>
                </span>
                {item.q}
              </summary>
              <div className="pb-5 pl-9 text-xs leading-relaxed text-muted-foreground [&_strong]:text-foreground">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

export { FaqSection }
