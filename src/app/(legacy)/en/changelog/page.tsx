import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old English changelog (`/en/changelog`).
export const metadata = redirectMetadata("/changelog")

export default function Page() {
  return <RedirectStub target="/changelog" />
}
