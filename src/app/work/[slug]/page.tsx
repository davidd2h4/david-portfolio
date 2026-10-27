import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case/CaseStudy";
import { getProject, projects, shot } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const image = shot(project, project.hero);
  const title = `${project.name} — ${project.category.en}`;
  return {
    title,
    description: project.summary.en,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description: project.summary.en,
      url: `/work/${project.slug}`,
      images: [{ url: image.src, width: image.width, height: image.height, alt: project.name }],
    },
    twitter: { card: "summary_large_image", title, description: project.summary.en, images: [image.src] },
  };
}

export default async function WorkPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return <CaseStudy slug={project.slug} />;
}
