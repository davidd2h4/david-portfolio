import type { MetadataRoute } from "next"
import { site } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-09")

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...site.projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
