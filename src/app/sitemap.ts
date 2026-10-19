import type { MetadataRoute } from "next";
import { ENGINEERING_PROJECTS } from "@/lib/engineering-projects";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { url: SITE.url, priority: 1 },
    { url: `${SITE.url}/product/career-plan`, priority: 0.8 },
    { url: `${SITE.url}/ai-projects`, priority: 0.9 },
    { url: `${SITE.url}/experiences`, priority: 0.8 },
    { url: `${SITE.url}/side-projects`, priority: 0.7 },
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
