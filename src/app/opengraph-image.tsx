import { ImageResponse } from "next/og"

// Static export renders this once at build time (no dynamic segments here),
// producing a plain PNG file — same mechanism as `sitemap.ts`/`robots.ts`.
// Temporary placeholder: swap this file's JSX (or replace the generated
// output with a designed asset under a matching `opengraph-image.png`) once
// a real graphic is ready — everything else (metadata wiring, absolute URL
// via metadataBase) stays the same either way.
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
// Required for `output: "export"` — same reason as sitemap.ts/robots.ts.
export const dynamic = "force-static"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 15%, rgba(163,230,53,0.16), transparent 45%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 16,
          }}
        >
          <span style={{ color: "#a3e635", fontSize: 96, fontWeight: 700 }}>$</span>
          <span style={{ color: "#f5f5f5", fontSize: 96, fontWeight: 700, letterSpacing: -4 }}>
            aoox
          </span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 34,
            color: "#a1a1aa",
          }}
        >
          Self-hosted PaaS — deploy from Git to your own server
        </div>
      </div>
    ),
    { ...size }
  )
}
