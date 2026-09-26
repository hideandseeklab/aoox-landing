import type { Metadata } from "next"

import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: {
    template: "%s — aoox Docs",
    default: "Docs — aoox",
  },
}

/** English mirror of `src/app/docs/layout.tsx` — see its comment for why docs live outside `landing-page.tsx`'s lang prop threading. */
export default function EnDocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12">
        <aside className="border-b border-border py-6 lg:sticky lg:top-14 lg:max-h-[calc(100svh-3.5rem)] lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-10 lg:pr-6">
          <details className="lg:hidden">
            <summary className="cursor-pointer list-none text-xs font-medium">
              Table of contents ▾
            </summary>
            <div className="pt-4">
              <DocsSidebar lang="en" />
            </div>
          </details>
          <div className="hidden lg:block">
            <DocsSidebar lang="en" />
          </div>
        </aside>
        <main className="min-w-0 py-10 lg:py-10">{children}</main>
      </div>
      <SiteFooter />
    </>
  )
}
