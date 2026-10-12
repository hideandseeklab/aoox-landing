import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old English home page (`/en`); the English site now lives at the root.
export const metadata = redirectMetadata("/")

export default function Page() {
  return <RedirectStub target="/" />
}
