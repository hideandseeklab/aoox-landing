import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/aplikasi`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/aplikasi")

export default function Page() {
  return <RedirectStub target="/id/docs/aplikasi" />
}
