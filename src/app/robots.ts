import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Served at /robots.txt. Allow all crawlers (incl. AI bots) + point to the sitemap.
export default function robots(): MetadataRoute.Robots {
  // Note: no `host` directive — it's non-standard (Yandex-only) and expects a
  // bare hostname, not a URL; Google/Bing ignore it. Canonical host is asserted
  // via the canonical <link> + sitemap instead.
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
