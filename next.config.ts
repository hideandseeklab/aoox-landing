import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Static export for GitHub Pages — this site has no API routes, middleware,
  // or dynamic route segments, so it can be served as plain files.
  output: "export",
  experimental: {
    // Lets app/global-not-found.tsx render the 404 for unmatched URLs; the
    // app has several root layouts, so no single layout can wrap not-found.tsx.
    globalNotFound: true,
  },
  turbopack: {
    // Pin the root so a stray lockfile in a parent directory can't change it.
    root: import.meta.dirname,
  },
}

export default nextConfig
