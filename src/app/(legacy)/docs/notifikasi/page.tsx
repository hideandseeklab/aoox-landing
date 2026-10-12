import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/notifikasi`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/notifikasi")

export default function Page() {
  return <RedirectStub target="/id/docs/notifikasi" />
}
