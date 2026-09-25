import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Static export for GitHub Pages — this site has no API routes, middleware,
  // or dynamic route segments, so it can be served as plain files.
  output: "export",
  turbopack: {
    // Pin the root so a stray lockfile in a parent directory can't change it.
    root: import.meta.dirname,
  },
}

export default nextConfig
