import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { site } from "@/config/site"
import { ProjectDetail } from "@/components/project-detail"
import { getNextProject, getProject } from "@/lib/projects"

export function generateStaticParams() {
  return site.projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return <ProjectDetail project={project} next={getNextProject(project.slug)} />
}
