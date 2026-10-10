import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/config/site"
import { Gallery } from "@/components/gallery"
import { ProjectActions } from "@/components/project-actions"
import { Shell } from "@/components/shell"

export function ProjectDetail({
  project,
  next,
}: {
  project: Project
  next: Project
}) {
  return (
    <article>
      <section className="relative min-h-[100svh]">
        <Image
          src={project.hero.src}
          alt={project.hero.alt}
          fill
          priority
          sizes="100vw"
          quality={84}
          className="object-cover"
          style={{ objectPosition: project.hero.objectPosition ?? "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <Shell className="relative z-10 flex min-h-[100svh] flex-col justify-end pt-28 pb-12 md:pb-16">
          <p className="text-[0.68rem] tracking-[0.2em] text-silver uppercase">
            <span style={{ color: project.accent }}>{project.number}</span>
            <span className="mx-3 text-white/30">/</span>
            Demonstration concept
          </p>
          <h1 className="mt-4 max-w-5xl font-serif text-[clamp(3.4rem,9vw,8rem)] leading-[0.88] tracking-[-0.045em] text-balance">
            {project.title}
          </h1>
          <p className="mt-6 max-w-xl text-base text-silver md:text-lg">{project.category}</p>
        </Shell>
      </section>

      <section aria-labelledby="overview-title" className="py-20 md:py-28">
        <Shell>
          <div className="grid gap-8 md:grid-cols-12 md:gap-10">
            <h2 id="overview-title" className="label md:col-span-3">
              Overview
            </h2>
            <div className="md:col-span-8">
              <p className="font-serif text-[clamp(1.7rem,3vw,2.5rem)] leading-snug tracking-[-0.03em]">
                {project.summary}
              </p>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">
                {project.overview}
              </p>
            </div>
          </div>
        </Shell>
      </section>

      <section aria-labelledby="features-title" className="pb-20 md:pb-28">
        <Shell>
          <h2 id="features-title" className="label">
            Features
          </h2>
          <ol className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {project.features.map((feature, index) => (
              <li key={feature.title} className="grid gap-3 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                <p className="font-serif text-mist md:col-span-2">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl tracking-tight md:col-span-4 md:text-3xl">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-muted md:col-span-6">
                  {feature.description}
                </p>
              </li>
            ))}
          </ol>
        </Shell>
      </section>

      <section aria-labelledby="approach-title" className="border-t border-white/10 py-20 md:py-28">
        <Shell>
          <div className="grid gap-8 md:grid-cols-12">
            <h2 id="approach-title" className="label md:col-span-3">
              Approach
            </h2>
            <p className="font-serif text-[clamp(1.5rem,2.6vw,2.15rem)] leading-relaxed tracking-[-0.02em] text-paper md:col-span-8">
              {project.designApproach}
            </p>
          </div>
        </Shell>
      </section>

      <section aria-labelledby="gallery-title" className="border-t border-white/10 py-20 md:py-28">
        <Shell>
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 id="gallery-title" className="label">
              Gallery
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Visual direction for the concept.
            </p>
          </div>
          <Gallery images={project.gallery} />
          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-4" aria-label="Palette">
            {project.palette.map((color) => (
              <li
                key={color}
                className="h-16 border border-white/10"
                style={{ backgroundColor: color }}
              >
                <span className="sr-only">{color}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.68rem] tracking-[0.18em] text-muted uppercase">Palette</p>
        </Shell>
      </section>

      <section aria-labelledby="stack-title" className="border-t border-white/10 py-20 md:py-28">
        <Shell>
          <h2 id="stack-title" className="label">
            Stack
          </h2>
          <ul className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {project.technologies.map((tech) => (
              <li key={tech} className="font-serif text-3xl tracking-tight md:text-4xl">
                {tech}
              </li>
            ))}
          </ul>
          <ProjectActions
            slug={project.slug}
            liveUrl={project.liveUrl}
            repositoryUrl={project.repositoryUrl}
            includeCaseStudy={false}
          />
        </Shell>
      </section>

      <Link
        href={`/work/${next.slug}`}
        className="group relative block min-h-[52vh] overflow-hidden border-t border-white/10"
      >
        <Image
          src={next.hero.src}
          alt=""
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ objectPosition: next.hero.objectPosition ?? "center" }}
        />
        <div className="absolute inset-0 bg-ink/60 transition-colors duration-500 group-hover:bg-ink/50" />
        <Shell className="relative z-10 flex min-h-[52vh] flex-col justify-end py-12 md:py-16">
          <p className="text-[0.68rem] tracking-[0.2em] text-silver uppercase">Next project</p>
          <p className="mt-3 font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[0.9] tracking-[-0.04em]">
            {next.title}
          </p>
          <p className="mt-4 text-sm tracking-[0.16em] text-silver uppercase">{next.category}</p>
        </Shell>
      </Link>
    </article>
  )
}
