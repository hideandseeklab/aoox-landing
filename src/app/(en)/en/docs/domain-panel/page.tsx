import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old English URL (Indonesian slug) kept as a static redirect, see RedirectStub.
export const metadata = redirectMetadata("domain-panel")

export default function Page() {
  return <RedirectStub from="domain-panel" />
}
