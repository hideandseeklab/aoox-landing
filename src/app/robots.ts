import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

// Required for `output: "export"` — same reason as sitemap.ts.
export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Installer scripts, not pages — nothing worth indexing, and keeping
      // them out of crawl results avoids a shell script showing up next to
      // real docs pages in search.
      disallow: ["/install.sh", "/install-cli.sh"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
