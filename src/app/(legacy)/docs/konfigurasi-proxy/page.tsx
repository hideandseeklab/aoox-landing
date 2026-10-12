import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/konfigurasi-proxy`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/konfigurasi-proxy")

export default function Page() {
  return <RedirectStub target="/id/docs/konfigurasi-proxy" />
}
