export type DocLink = {
  href: string
  title: string
  description: string
}

export type DocGroup = {
  title: string
  items: DocLink[]
}

export const DOCS_NAV: DocGroup[] = [
  {
    title: "Mulai",
    items: [
      {
        href: "/docs",
        title: "Ikhtisar",
        description: "Apa itu aoox dan bagaimana dokumentasi ini disusun.",
      },
      {
        href: "/docs/instalasi",
        title: "Instalasi",
        description: "Menjalankan aoox di server sendiri dengan Docker Compose.",
      },
      {
        href: "/docs/domain-panel",
        title: "Domain untuk panel",
        description: "Melayani dashboard dan API lewat domain sendiri dengan HTTPS.",
      },
      {
        href: "/docs/pengguna-peran",
        title: "Pengguna & peran",
        description: "Akun owner pertama, undangan, batas tiap peran, 2FA, API token, audit log.",
      },
    ],
  },
  {
    title: "Aplikasi",
    items: [
      {
        href: "/docs/project",
        title: "Project",
        description: "Wadah aplikasi, database, dan environment bersama.",
      },
      {
        href: "/docs/aplikasi",
        title: "Membuat aplikasi",
        description: "Dari repo Git atau image siap pakai, plus mode deploy.",
      },
      {
        href: "/docs/build",
        title: "Cara build",
        description: "Dockerfile, Nixpacks, atau situs statis, plus build args.",
      },
      {
        href: "/docs/deploy",
        title: "Deploy & rollback",
        description: "Alur deploy, log realtime, health check, blue/green, rollback.",
      },
      {
        href: "/docs/environment",
        title: "Environment variables",
        description: "Env project vs aplikasi dan referensi ke database.",
      },
      {
        href: "/docs/mount",
        title: "Mount",
        description: "Volume, bind mount, dan file konfigurasi untuk aplikasi dan database.",
      },
      {
        href: "/docs/jobs",
        title: "Scheduled jobs",
        description: "Perintah terjadwal (cron) untuk aplikasi, database, dan stack compose.",
      },
      {
        href: "/docs/webhook",
        title: "Webhook auto-deploy",
        description: "Deploy otomatis saat push dari GitHub/GitLab.",
      },
      {
        href: "/docs/preview",
        title: "Preview pull request",
        description: "Container sementara per PR dengan subdomain sendiri.",
      },
    ],
  },
  {
    title: "Stack & database",
    items: [
      {
        href: "/docs/compose",
        title: "Stack compose",
        description: "Deploy docker-compose multi-service dari repo.",
      },
      {
        href: "/docs/template",
        title: "Template one-click",
        description: "WordPress, Ghost, n8n, dan lainnya dalam beberapa klik.",
      },
      {
        href: "/docs/database",
        title: "Managed database",
        description: "PostgreSQL, MySQL, MariaDB, Redis per project.",
      },
      {
        href: "/docs/data-browser",
        title: "Data browser",
        description: "Melihat tabel dan menjalankan query dari dashboard.",
      },
      {
        href: "/docs/backup",
        title: "Backup & restore",
        description: "Backup database dan volume, jadwal, retensi, tujuan S3.",
      },
    ],
  },
  {
    title: "CLI",
    items: [
      {
        href: "/docs/cli",
        title: "Mulai dengan CLI",
        description: "Pasang aoox, simpan token panel, dan pakai di CI.",
      },
    ],
  },
  {
    title: "Infrastruktur",
    items: [
      {
        href: "/docs/registry",
        title: "Registry",
        description: "Registry lokal untuk image hasil build dan registry eksternal.",
      },
      {
        href: "/docs/domain",
        title: "Proxy & domain",
        description: "Traefik, domain aplikasi, HTTPS otomatis, cek DNS.",
      },
      {
        href: "/docs/server-remote",
        title: "Server remote",
        description: "Deploy ke server lain lewat SSH.",
      },
      {
        href: "/docs/swarm",
        title: "Docker Swarm",
        description: "Multi-node: aplikasi sebagai service dengan replika.",
      },
      {
        href: "/docs/terminal",
        title: "Web terminal",
        description: "Shell ke host atau server remote dari browser.",
      },
      {
        href: "/docs/monitoring",
        title: "Monitoring",
        description: "Metrik host dan container, batas sumber daya.",
      },
      {
        href: "/docs/notifikasi",
        title: "Notifikasi",
        description: "Telegram, Slack, Discord, webhook, email.",
      },
      {
        href: "/docs/troubleshooting",
        title: "Troubleshooting",
        description: "Masalah umum dan cara mengatasinya.",
      },
    ],
  },
]

export const DOCS_FLAT: DocLink[] = DOCS_NAV.flatMap((group) => group.items)

export function getDocNeighbors(href: string) {
  const index = DOCS_FLAT.findIndex((item) => item.href === href)
  return {
    prev: index > 0 ? DOCS_FLAT[index - 1] : null,
    next: index >= 0 && index < DOCS_FLAT.length - 1 ? DOCS_FLAT[index + 1] : null,
  }
}
