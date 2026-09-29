import { ImageResponse } from "next/og"

// Apple touch icon (iOS home-screen bookmark) — file convention, generated
// once at build time, same mechanism as `opengraph-image.tsx`. The regular
// favicon stays `src/app/icon.svg`; Apple's convention wants an opaque PNG.
export const size = { width: 180, height: 180 }
export const contentType = "image/png"
// Required for `output: "export"` — same reason as sitemap.ts/robots.ts.
export const dynamic = "force-static"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
        }}
      >
        <span style={{ color: "#a3e635", fontSize: 92, fontWeight: 700, fontFamily: "sans-serif" }}>
          $
        </span>
      </div>
    ),
    { ...size }
  )
}
