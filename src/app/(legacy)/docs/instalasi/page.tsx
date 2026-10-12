import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/instalasi`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/instalasi")

export default function Page() {
  return <RedirectStub target="/id/docs/instalasi" />
}
