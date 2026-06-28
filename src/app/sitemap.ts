import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

// Single-route site → one entry. Served at /sitemap.xml; referenced by robots.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
