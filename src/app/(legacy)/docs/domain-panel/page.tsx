import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/domain-panel`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/domain-panel")

export default function Page() {
  return <RedirectStub target="/id/docs/domain-panel" />
}
