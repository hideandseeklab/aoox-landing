import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old English URL (Indonesian slug) kept as a static redirect, see RedirectStub.
export const metadata = redirectMetadata("admin-database")

export default function Page() {
  return <RedirectStub from="admin-database" />
}
