import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section, SectionHeading } from "@/components/section"
import type { Lang } from "@/lib/lang"
import { cn } from "@/lib/utils"

const ROLES = ["owner", "admin", "member"] as const
type Role = (typeof ROLES)[number]

const ROLE_META_ID: Record<Role, { tagline: string }> = {
  owner: { tagline: "Pemilik instance" },
  admin: { tagline: "Kelola infrastruktur" },
  member: { tagline: "Kerja di project" },
}

const ROLE_META_EN: Record<Role, { tagline: string }> = {
  owner: { tagline: "Instance owner" },
  admin: { tagline: "Manages infrastructure" },
  member: { tagline: "Works in projects" },
}

const CAPABILITIES_ID: { label: string; roles: Role[] }[] = [
  { label: "Project yang dibuat atau ditugaskan", roles: ["owner", "admin", "member"] },
  { label: "Melihat semua project", roles: ["owner", "admin"] },
  { label: "Deploy, rollback, backup, jobs", roles: ["owner", "admin", "member"] },
  { label: "2FA, ganti password, API token", roles: ["owner", "admin", "member"] },
  { label: "Undang anggota instance", roles: ["owner", "admin"] },
  { label: "Registry, server remote, Swarm, notifikasi", roles: ["owner", "admin"] },
  { label: "Web terminal & bind mount", roles: ["owner", "admin"] },
  { label: "Audit log", roles: ["owner", "admin"] },
  { label: "Ubah peran, hapus & reset password pengguna", roles: ["owner"] },
  { label: "Provision registry & proxy, backup instance", roles: ["owner"] },
]

const CAPABILITIES_EN: { label: string; roles: Role[] }[] = [
  { label: "Projects they create or are added to", roles: ["owner", "admin", "member"] },
  { label: "See every project", roles: ["owner", "admin"] },
  { label: "Deploy, rollback, backup, jobs", roles: ["owner", "admin", "member"] },
  { label: "2FA, change password, API tokens", roles: ["owner", "admin", "member"] },
  { label: "Invite instance members", roles: ["owner", "admin"] },
  { label: "Registry, remote servers, Swarm, notifications", roles: ["owner", "admin"] },
  { label: "Web terminal & bind mounts", roles: ["owner", "admin"] },
  { label: "Audit log", roles: ["owner", "admin"] },
  { label: "Change roles, delete & reset users' passwords", roles: ["owner"] },
  { label: "Provision registry & proxy, instance backup", roles: ["owner"] },
]

const PROJECT_ROLES_ID = [
  {
    role: "admin",
    description: "Kelola anggota project dan hapus project, selain semua yang bisa developer.",
  },
  {
    role: "developer",
    description: "Buat & deploy aplikasi, database, stack, domain, backup.",
  },
  {
    role: "viewer",
    description: "Baca saja — lihat status, log, dan metrik tanpa bisa mengubah.",
  },
]

const PROJECT_ROLES_EN = [
  {
    role: "admin",
    description: "Manages project members and can delete the project, plus everything a developer can do.",
  },
  {
    role: "developer",
    description: "Creates & deploys apps, databases, stacks, domains, backups.",
  },
  {
    role: "viewer",
    description: "Read-only — sees status, logs, and metrics without being able to change anything.",
  },
]

const INVITE_FLOW_ID = [
  { k: "Undang", v: "email + peran" },
  { k: "Salin tautan", v: "tampil sekali, 7 hari" },
  { k: "Bergabung", v: "nama + password" },
]

const INVITE_FLOW_EN = [
  { k: "Invite", v: "email + role" },
  { k: "Copy link", v: "shown once, 7 days" },
  { k: "Join", v: "name + password" },
]

const COPY_ID = {
  label: "tim",
  title: "Satu instance, banyak project.",
  description:
    "Peran instance mengatur siapa boleh menyentuh infrastruktur; keanggotaan per project mengatur siapa melihat dan mengubah apa.",
  instanceRoles: "Peran instance",
  canDo: "Boleh apa",
  projectRoles: "Peran per project",
  projectNote:
    "Anggota hanya melihat project yang ia buat atau yang ia ditambahkan ke dalamnya; owner dan admin instance melihat semuanya.",
  inviteTitle: "Mengundang anggota",
  inviteNote: "Tanpa server email — tautan undangan dibuat sekali, kamu kirim sendiri lewat chat.",
  more: "Selengkapnya tentang pengguna & peran",
  allowed: "boleh",
  notAllowed: "tidak",
  roleMeta: ROLE_META_ID,
  capabilities: CAPABILITIES_ID,
  projectRoleList: PROJECT_ROLES_ID,
  inviteFlow: INVITE_FLOW_ID,
}

type Copy = typeof COPY_ID

const COPY: Record<Lang, Copy> = {
  id: COPY_ID,
  en: {
    label: "team",
    title: "One instance, many projects.",
    description:
      "Instance roles control who can touch infrastructure; per-project membership controls who sees and changes what.",
    instanceRoles: "Instance roles",
    canDo: "Can do",
    projectRoles: "Per-project roles",
    projectNote:
      "A member only sees projects they created or were added to; the instance owner and admins see everything.",
    inviteTitle: "Inviting members",
    inviteNote: "No email server — an invite link is generated once, you send it yourself via chat.",
    more: "More on users & roles (docs in Indonesian)",
    allowed: "allowed",
    notAllowed: "not allowed",
    roleMeta: ROLE_META_EN,
    capabilities: CAPABILITIES_EN,
    projectRoleList: PROJECT_ROLES_EN,
    inviteFlow: INVITE_FLOW_EN,
  },
}

function TeamSection({ lang = "id" }: { lang?: Lang }) {
  const t = COPY[lang]
  return (
    <Section id="tim">
      <SectionHeading label={t.label} title={t.title} description={t.description} />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        {/* matriks hak akses instance */}
        <div className="flex min-w-0 flex-col gap-3">
          <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
            {t.instanceRoles}
          </span>
          <div className="min-w-0 overflow-x-auto border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="min-w-[11rem] px-4 py-3 text-left font-normal text-muted-foreground">
                    {t.canDo}
                  </th>
                  {ROLES.map((role) => (
                    <th key={role} className="w-20 px-2 py-3 text-center align-top sm:w-24 sm:px-3">
                      <span className="block text-sm font-semibold">{role}</span>
                      <span className="hidden text-[0.6rem] font-normal text-muted-foreground sm:block">
                        {t.roleMeta[role].tagline}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.capabilities.map((cap) => (
                  <tr key={cap.label} className="border-b border-border last:border-b-0">
                    <td className="min-w-[11rem] px-4 py-2.5 text-muted-foreground">{cap.label}</td>
                    {ROLES.map((role) => {
                      const ok = cap.roles.includes(role)
                      return (
                        <td
                          key={role}
                          className={cn(
                            "px-2 py-2.5 text-center sm:px-3",
                            ok
                              ? "text-primary-foreground dark:text-primary"
                              : "text-muted-foreground/40"
                          )}
                          aria-label={ok ? t.allowed : t.notAllowed}
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
        </div>

        {/* peran per project + undangan */}
        <div className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {t.projectRoles}
            </span>
            <ol className="flex flex-col border border-border bg-card text-xs">
              {t.projectRoleList.map((item) => (
                <li
                  key={item.role}
                  className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <span className="font-medium text-foreground">{item.role}</span>
                  <span className="text-muted-foreground">{item.description}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs leading-relaxed text-muted-foreground">{t.projectNote}</p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[0.65rem] tracking-wider text-muted-foreground uppercase">
              {t.inviteTitle}
            </span>
            <ol className="flex flex-col border border-border bg-card text-xs">
              {t.inviteFlow.map((step, i) => (
                <li
                  key={step.k}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border px-4 py-3 last:border-b-0"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center border border-border text-[0.6rem] text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="text-foreground">{step.k}</span>
                  <span className="ml-auto text-muted-foreground">{step.v}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs leading-relaxed text-muted-foreground">{t.inviteNote}</p>
          </div>

          <Link
            href="/docs/pengguna-peran"
            className="inline-flex items-center gap-1 text-xs text-foreground underline underline-offset-4 hover:no-underline"
          >
            {t.more}
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </Section>
  )
}

export { TeamSection }
