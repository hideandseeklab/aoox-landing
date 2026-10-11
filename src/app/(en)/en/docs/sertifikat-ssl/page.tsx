import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old English URL (Indonesian slug) kept as a static redirect, see RedirectStub.
export const metadata = redirectMetadata("sertifikat-ssl")

export default function Page() {
  return <RedirectStub from="sertifikat-ssl" />
}
