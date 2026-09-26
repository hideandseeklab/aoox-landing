import type { Lang } from "./lang"

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

/** English mirror of DOCS_NAV — same order/slugs, under /en/docs. */
export const DOCS_NAV_EN: DocGroup[] = [
  {
    title: "Start here",
    items: [
      {
        href: "/en/docs",
        title: "Overview",
        description: "What aoox is and how these docs are organized.",
      },
      {
        href: "/en/docs/instalasi",
        title: "Installation",
        description: "Running aoox on your own server with Docker Compose.",
      },
      {
        href: "/en/docs/domain-panel",
        title: "Domain for the panel",
        description: "Serve the dashboard and API on your own domain with HTTPS.",
      },
      {
        href: "/en/docs/pengguna-peran",
        title: "Users & roles",
        description: "First owner account, invitations, per-role limits, 2FA, API tokens, audit log.",
      },
    ],
  },
  {
    title: "Applications",
    items: [
      {
        href: "/en/docs/project",
        title: "Project",
        description: "The container for apps, databases, and shared environment.",
      },
      {
        href: "/en/docs/aplikasi",
        title: "Creating an application",
        description: "From a Git repo or a ready-made image, plus deploy modes.",
      },
      {
        href: "/en/docs/build",
        title: "How builds work",
        description: "Dockerfile, Nixpacks, or a static site, plus build args.",
      },
      {
        href: "/en/docs/deploy",
        title: "Deploy & rollback",
        description: "The deploy flow, realtime logs, health checks, blue/green, rollback.",
      },
      {
        href: "/en/docs/environment",
        title: "Environment variables",
        description: "Project vs. application env, and database references.",
      },
      {
        href: "/en/docs/mount",
        title: "Mounts",
        description: "Volumes, bind mounts, and config files for apps and databases.",
      },
      {
        href: "/en/docs/jobs",
        title: "Scheduled jobs",
        description: "Cron commands for applications, databases, and compose stacks.",
      },
      {
        href: "/en/docs/webhook",
        title: "Webhook auto-deploy",
        description: "Automatic deploy on push from GitHub/GitLab.",
      },
      {
        href: "/en/docs/preview",
        title: "Pull request previews",
        description: "A temporary container per PR with its own subdomain.",
      },
    ],
  },
  {
    title: "Stacks & databases",
    items: [
      {
        href: "/en/docs/compose",
        title: "Compose stacks",
        description: "Deploy a multi-service docker-compose stack from a repo.",
      },
      {
        href: "/en/docs/template",
        title: "One-click templates",
        description: "WordPress, Ghost, n8n, and more in a few clicks.",
      },
      {
        href: "/en/docs/database",
        title: "Managed databases",
        description: "PostgreSQL, MySQL, MariaDB, Redis per project.",
      },
      {
        href: "/en/docs/data-browser",
        title: "Data browser",
        description: "Browse tables and run queries from the dashboard.",
      },
      {
        href: "/en/docs/backup",
        title: "Backup & restore",
        description: "Back up databases and volumes, schedules, retention, S3 destinations.",
      },
    ],
  },
  {
    title: "CLI",
    items: [
      {
        href: "/en/docs/cli",
        title: "Getting started with the CLI",
        description: "Install aoox, store a panel token, and use it in CI.",
      },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      {
        href: "/en/docs/registry",
        title: "Registry",
        description: "A local registry for built images, and external registries.",
      },
      {
        href: "/en/docs/domain",
        title: "Proxy & domain",
        description: "Traefik, application domains, automatic HTTPS, DNS checks.",
      },
      {
        href: "/en/docs/server-remote",
        title: "Remote servers",
        description: "Deploy to another server over SSH.",
      },
      {
        href: "/en/docs/swarm",
        title: "Docker Swarm",
        description: "Multi-node: applications as a service with replicas.",
      },
      {
        href: "/en/docs/terminal",
        title: "Web terminal",
        description: "A shell into the host or a remote server, from the browser.",
      },
      {
        href: "/en/docs/monitoring",
        title: "Monitoring",
        description: "Host and container metrics, resource limits.",
      },
      {
        href: "/en/docs/notifikasi",
        title: "Notifications",
        description: "Telegram, Slack, Discord, webhook, email.",
      },
      {
        href: "/en/docs/troubleshooting",
        title: "Troubleshooting",
        description: "Common problems and how to fix them.",
      },
    ],
  },
]

export function docsNavFor(lang: Lang): DocGroup[] {
  return lang === "en" ? DOCS_NAV_EN : DOCS_NAV
}

export const DOCS_FLAT: DocLink[] = DOCS_NAV.flatMap((group) => group.items)
export const DOCS_FLAT_EN: DocLink[] = DOCS_NAV_EN.flatMap((group) => group.items)

export function getDocNeighbors(href: string, lang: Lang = "id") {
  const flat = lang === "en" ? DOCS_FLAT_EN : DOCS_FLAT
  const index = flat.findIndex((item) => item.href === href)
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  }
}
