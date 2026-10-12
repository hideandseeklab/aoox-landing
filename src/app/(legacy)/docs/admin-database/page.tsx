import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/admin-database`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/admin-database")

export default function Page() {
  return <RedirectStub target="/id/docs/admin-database" />
}
