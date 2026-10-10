import { site, type Project } from "@/config/site"

export function getProject(slug: string): Project | undefined {
  return site.projects.find((project) => project.slug === slug)
}

export function getNextProject(slug: string): Project {
  const index = site.projects.findIndex((project) => project.slug === slug)
  const next = site.projects[(index + 1) % site.projects.length]
  return next
}
