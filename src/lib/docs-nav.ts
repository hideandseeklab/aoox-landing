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

/** Indonesian navigation, under /id/docs. */
export const DOCS_NAV: DocGroup[] = [
  {
    title: "Mulai",
    items: [
      {
        href: "/id/docs",
        title: "Ikhtisar",
        description: "Apa itu aoox dan bagaimana dokumentasi ini disusun.",
      },
      {
        href: "/id/docs/instalasi",
        title: "Instalasi",
        description: "Menjalankan aoox di server sendiri dengan Docker Compose.",
      },
      {
        href: "/id/docs/domain-panel",
        title: "Domain untuk panel",
        description: "Melayani dashboard dan API lewat domain sendiri dengan HTTPS.",
      },
      {
        href: "/id/docs/pengguna-peran",
        title: "Pengguna & peran",
        description: "Akun owner pertama, undangan, batas tiap peran, 2FA, API token, audit log.",
      },
    ],
  },
  {
    title: "Aplikasi",
    items: [
      {
        href: "/id/docs/project",
        title: "Project",
        description: "Wadah aplikasi, database, dan environment (development, staging, production).",
      },
      {
        href: "/id/docs/aplikasi",
        title: "Membuat aplikasi",
        description: "Dari repo Git atau image siap pakai, plus mode deploy.",
      },
      {
        href: "/id/docs/build",
        title: "Cara build",
        description: "Dockerfile, Nixpacks, atau situs statis, plus build args.",
      },
      {
        href: "/id/docs/deploy",
        title: "Deploy & rollback",
        description: "Alur deploy, log realtime, health check, blue/green, rollback.",
      },
      {
        href: "/id/docs/environment",
        title: "Environment variables",
        description: "Env project vs aplikasi dan referensi ke database.",
      },
      {
        href: "/id/docs/mount",
        title: "Mount",
        description: "Volume, bind mount, dan file konfigurasi untuk aplikasi dan database.",
      },
      {
        href: "/id/docs/jobs",
        title: "Scheduled jobs",
        description: "Perintah terjadwal (cron) untuk aplikasi, database, dan stack compose.",
      },
      {
        href: "/id/docs/webhook",
        title: "Webhook auto-deploy",
        description: "Deploy otomatis saat push dari GitHub/GitLab.",
      },
      {
        href: "/id/docs/preview",
        title: "Preview pull request",
        description: "Container sementara per PR dengan subdomain sendiri.",
      },
    ],
  },
  {
    title: "Stack & database",
    items: [
      {
        href: "/id/docs/compose",
        title: "Stack compose",
        description: "Deploy docker-compose multi-service dari repo.",
      },
      {
        href: "/id/docs/template",
        title: "Template one-click",
        description: "WordPress, Ghost, n8n, dan lainnya dalam beberapa klik.",
      },
      {
        href: "/id/docs/database",
        title: "Managed database",
        description: "PostgreSQL, MySQL, MariaDB, Redis per project.",
      },
      {
        href: "/id/docs/data-browser",
        title: "Data browser",
        description: "Melihat tabel dan menjalankan query dari dashboard.",
      },
      {
        href: "/id/docs/admin-database",
        title: "Admin UI database",
        description: "Adminer, phpMyAdmin, pgAdmin, dan lainnya, dipasang sekali klik.",
      },
      {
        href: "/id/docs/backup",
        title: "Backup & restore",
        description: "Backup database dan volume, jadwal, retensi, tujuan S3.",
      },
    ],
  },
  {
    title: "CLI",
    items: [
      {
        href: "/id/docs/cli",
        title: "Mulai dengan CLI",
        description: "Pasang aoox, simpan token panel, dan pakai di CI.",
      },
    ],
  },
  {
    title: "Infrastruktur",
    items: [
      {
        href: "/id/docs/registry",
        title: "Registry",
        description: "Registry lokal untuk image hasil build dan registry eksternal.",
      },
      {
        href: "/id/docs/domain",
        title: "Proxy & domain",
        description: "Traefik, domain aplikasi, HTTPS otomatis, cek DNS.",
      },
      {
        href: "/id/docs/sertifikat-ssl",
        title: "Sertifikat SSL kustom",
        description: "Sertifikat sendiri (CA perusahaan, wildcard) sebagai ganti Let's Encrypt.",
      },
      {
        href: "/id/docs/dns-cloudflare",
        title: "DNS Cloudflare",
        description: "Record DNS otomatis untuk domain aplikasi dan sertifikat wildcard lewat DNS-01.",
      },
      {
        href: "/id/docs/konfigurasi-proxy",
        title: "Konfigurasi proxy",
        description: "Middleware Traefik sendiri (basic auth, header, rate limit) dan pasang per domain.",
      },
      {
        href: "/id/docs/server-remote",
        title: "Server remote",
        description: "Deploy ke server lain lewat SSH.",
      },
      {
        href: "/id/docs/swarm",
        title: "Docker Swarm",
        description: "Multi-node: aplikasi sebagai service dengan replika.",
      },
      {
        href: "/id/docs/terminal",
        title: "Web terminal",
        description: "Shell ke host atau server remote dari browser.",
      },
      {
        href: "/id/docs/monitoring",
        title: "Monitoring",
        description: "Metrik host dan container, batas sumber daya.",
      },
      {
        href: "/id/docs/notifikasi",
        title: "Notifikasi",
        description: "Telegram, Slack, Discord, webhook, email.",
      },
      {
        href: "/id/docs/troubleshooting",
        title: "Troubleshooting",
        description: "Masalah umum dan cara mengatasinya.",
      },
    ],
  },
]

/** English navigation (the default language), under /docs. */
export const DOCS_NAV_EN: DocGroup[] = [
  {
    title: "Start here",
    items: [
      {
        href: "/docs",
        title: "Overview",
        description: "What aoox is and how these docs are organized.",
      },
      {
        href: "/docs/installation",
        title: "Installation",
        description: "Running aoox on your own server with Docker Compose.",
      },
      {
        href: "/docs/panel-domain",
        title: "Domain for the panel",
        description: "Serve the dashboard and API on your own domain with HTTPS.",
      },
      {
        href: "/docs/users-roles",
        title: "Users & roles",
        description: "First owner account, invitations, per-role limits, 2FA, API tokens, audit log.",
      },
    ],
  },
  {
    title: "Applications",
    items: [
      {
        href: "/docs/project",
        title: "Project",
        description: "The container for apps, databases, and environments.",
      },
      {
        href: "/docs/applications",
        title: "Creating an application",
        description: "From a Git repo or a ready-made image, plus deploy modes.",
      },
      {
        href: "/docs/build",
        title: "How builds work",
        description: "Dockerfile, Nixpacks, or a static site, plus build args.",
      },
      {
        href: "/docs/deploy",
        title: "Deploy & rollback",
        description: "The deploy flow, realtime logs, health checks, blue/green, rollback.",
      },
      {
        href: "/docs/environment",
        title: "Environment variables",
        description: "Project vs. application env, and database references.",
      },
      {
        href: "/docs/mount",
        title: "Mounts",
        description: "Volumes, bind mounts, and config files for apps and databases.",
      },
      {
        href: "/docs/jobs",
        title: "Scheduled jobs",
        description: "Cron commands for applications, databases, and compose stacks.",
      },
      {
        href: "/docs/webhook",
        title: "Webhook auto-deploy",
        description: "Automatic deploy on push from GitHub/GitLab.",
      },
      {
        href: "/docs/preview",
        title: "Pull request previews",
        description: "A temporary container per PR with its own subdomain.",
      },
    ],
  },
  {
    title: "Stacks & databases",
    items: [
      {
        href: "/docs/compose",
        title: "Compose stacks",
        description: "Deploy a multi-service docker-compose stack from a repo.",
      },
      {
        href: "/docs/template",
        title: "One-click templates",
        description: "WordPress, Ghost, n8n, and more in a few clicks.",
      },
      {
        href: "/docs/database",
        title: "Managed databases",
        description: "Run PostgreSQL, MySQL, MariaDB, or Redis as a managed database per project.",
      },
      {
        href: "/docs/data-browser",
        title: "Data browser",
        description: "Browse tables and run queries from the dashboard.",
      },
      {
        href: "/docs/database-admin",
        title: "Database admin UI",
        description: "Adminer, phpMyAdmin, pgAdmin, and more, installed in one click.",
      },
      {
        href: "/docs/backup",
        title: "Backup & restore",
        description: "Back up databases and volumes, schedules, retention, S3 destinations.",
      },
    ],
  },
  {
    title: "CLI",
    items: [
      {
        href: "/docs/cli",
        title: "Getting started with the CLI",
        description: "Install aoox, store a panel token, and use it in CI.",
      },
    ],
  },
  {
    title: "Infrastructure",
    items: [
      {
        href: "/docs/registry",
        title: "Registry",
        description: "A local registry for built images, and external registries.",
      },
      {
        href: "/docs/domain",
        title: "Proxy & domain",
        description: "Traefik, application domains, automatic HTTPS, DNS checks.",
      },
      {
        href: "/docs/ssl-certificates",
        title: "Custom SSL certificates",
        description: "Your own certificate (corporate CA, wildcard) instead of Let's Encrypt.",
      },
      {
        href: "/docs/cloudflare-dns",
        title: "Cloudflare DNS",
        description: "Automatic DNS records for application domains and wildcard certificates via DNS-01.",
      },
      {
        href: "/docs/proxy-configuration",
        title: "Proxy configuration",
        description: "Your own Traefik middlewares (basic auth, headers, rate limit) attached per domain.",
      },
      {
        href: "/docs/remote-servers",
        title: "Remote servers",
        description: "Deploy to another server over SSH.",
      },
      {
        href: "/docs/swarm",
        title: "Docker Swarm",
        description: "Multi-node: applications as a service with replicas.",
      },
      {
        href: "/docs/terminal",
        title: "Web terminal",
        description: "A shell into the host or a remote server, from the browser.",
      },
      {
        href: "/docs/monitoring",
        title: "Monitoring",
        description: "Host and container metrics, resource limits.",
      },
      {
        href: "/docs/notifications",
        title: "Notifications",
        description: "Send deploy and health alerts to Telegram, Slack, Discord, a webhook, or email.",
      },
      {
        href: "/docs/troubleshooting",
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

export function getDocNeighbors(href: string, lang: Lang = "en") {
  const flat = lang === "en" ? DOCS_FLAT_EN : DOCS_FLAT
  const index = flat.findIndex((item) => item.href === href)
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index >= 0 && index < flat.length - 1 ? flat[index + 1] : null,
  }
}
