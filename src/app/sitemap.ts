import type { MetadataRoute } from "next";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: SITE.url, priority: 1 },
    ...ENGINEERING_PROJECTS.map((project) => ({
      url: `${SITE.url}/work/${project.slug}`,
      priority: 0.8,
    })),
  ];

  return pages.map(({ url, priority }) => ({
    url,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
