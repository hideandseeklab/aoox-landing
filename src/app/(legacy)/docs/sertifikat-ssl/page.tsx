import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old Indonesian URL (`/docs/sertifikat-ssl`); Indonesian now lives under /id.
export const metadata = redirectMetadata("/id/docs/sertifikat-ssl")

export default function Page() {
  return <RedirectStub target="/id/docs/sertifikat-ssl" />
}
