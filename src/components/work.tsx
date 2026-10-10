import { site } from "@/config/site"
import { cn } from "@/lib/cn"
import { ProjectActions } from "@/components/project-actions"
import { ProjectMedia } from "@/components/project-media"
import { Reveal } from "@/components/reveal"
import { Shell } from "@/components/shell"

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-24 border-t border-white/10 py-24 md:py-32 lg:py-40"
    >
      <Shell>
        <div className="mb-14 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label">
              {site.work.index} — {site.work.label}
            </p>
            <h2
              id="work-title"
              className="mt-4 font-serif text-[clamp(2.7rem,6vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-balance"
            >
              {site.work.title}
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-muted md:pb-2">
            {site.work.intro}
          </p>
        </div>

        <div>
          {site.projects.map((project, index) => {
            const reverse = index % 2 === 1

            return (
              <article
                key={project.slug}
                className="grid items-center gap-8 border-t border-white/10 py-12 lg:grid-cols-12 lg:gap-12 lg:py-20"
              >
                <div className={cn("order-1 lg:col-span-7", reverse ? "lg:order-1" : "lg:order-2")}>
                  <ProjectMedia
                    src={project.hero.src}
                    alt={project.hero.alt}
                    accent={project.accent}
                    priority={index === 0}
                    objectPosition={project.hero.objectPosition}
                  />
                </div>

                <Reveal
                  className={cn("order-2 lg:col-span-5", reverse ? "lg:order-2" : "lg:order-1")}
                  delay={0.05}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-serif text-lg" style={{ color: project.accent }}>
                      {project.number}
                    </p>
                    <p className="text-right text-[0.68rem] tracking-[0.16em] text-muted uppercase">
                      {project.category}
                    </p>
                  </div>
                  <h3 className="mt-5 font-serif text-[clamp(2.4rem,4.6vw,4.1rem)] leading-[0.92] tracking-[-0.03em]">
                    {project.title}
                  </h3>
                  <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                    {project.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border border-white/12 px-2.5 py-1 text-[0.65rem] tracking-[0.14em] text-silver uppercase"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                  <ProjectActions
                    liveUrl={project.liveUrl}
                    repositoryUrl={project.repositoryUrl}
                    liveLabel="View website"
                  />
                </Reveal>
              </article>
            )
          })}
        </div>
      </Shell>
    </section>
  )
}
