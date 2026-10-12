import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/server-remote`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/server-remote")

export default function Page() {
  return <RedirectStub target="/id/docs/server-remote" />
}
