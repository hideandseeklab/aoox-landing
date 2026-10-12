import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/pengguna-peran`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/pengguna-peran")

export default function Page() {
  return <RedirectStub target="/id/docs/pengguna-peran" />
}
