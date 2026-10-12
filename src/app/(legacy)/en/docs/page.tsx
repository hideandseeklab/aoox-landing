import { RedirectStub, redirectMetadata } from "@/components/redirect-stub"

// Old English docs index (`/en/docs`).
export const metadata = redirectMetadata("/docs")

export default function Page() {
  return <RedirectStub target="/docs" />
}
