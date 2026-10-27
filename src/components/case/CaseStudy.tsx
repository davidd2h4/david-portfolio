"use client";

import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { ClipReveal, Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { ExternalButton } from "@/components/ui/Button";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { ScrollPreview } from "@/components/ui/ScrollPreview";
import { getProject, nextProject, projects, shot } from "@/data/projects";
import { useLocale } from "@/i18n/locale";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3 text-ink/50">
      <span className="text-ink">{n}</span>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

export function CaseStudy({ slug }: { slug: string }) {
  const { t, pick } = useLocale();
  const project = getProject(slug)!;
  const next = nextProject(slug);
  const index = projects.indexOf(project) + 1;
  const hero = shot(project, project.hero);
  const heroRef = useRef<HTMLDivElement>(null);
  const liveLabel = `${t.caseStudy.live}: ${project.name} (${t.a11y.external})`;

  useIsoLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-case-fade]");
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(items, { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.08, delay: 0.4, duration: 1.2 });
      gsap.fromTo("[data-case-hero]", { clipPath: "inset(10% 8% 0% 8% round 1.5rem)" }, { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: { trigger: "[data-case-hero]", start: "top 90%", end: "top 15%", scrub: true } });
      gsap.fromTo("[data-case-hero] img", { scale: 1.15, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: "[data-case-hero]", start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, [slug]);

  return (
    <article>
      {/* Hero */}
      <div ref={heroRef} className="pt-[calc(var(--header-h)+2rem)] sm:pt-[calc(var(--header-h)+3.5rem)]">
        <div className="container-x">
          <div data-case-fade className="flex items-center justify-between gap-4 border-b border-ink/15 pb-4">
            <TransitionLink href="/#work" className="group inline-flex min-h-11 items-center gap-2 text-sm text-ink/70 hover:text-ink">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" aria-hidden />
              {t.caseStudy.back}
            </TransitionLink>
            <span className="eyebrow text-ink/50">
              {t.caseStudy.project} {String(index).padStart(2, "0")}/{String(projects.length).padStart(2, "0")}
            </span>
          </div>
          <RevealLines key={project.slug} as="h1" immediate delay={0.15} lines={[project.name]} className="display-xl mt-10 break-words sm:mt-14" />
          <div className="mt-10 grid gap-8 pb-14 md:grid-cols-12 sm:pb-20">
            <p data-case-fade className="max-w-xl text-lg leading-relaxed text-graphite md:col-span-6 sm:text-xl">
              {pick(project.summary)}
            </p>
            <dl data-case-fade className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm md:col-span-5 md:col-start-8">
              <div className="col-span-2">
                <dt className="eyebrow text-ink/45">{t.caseStudy.category}</dt>
                <dd className="mt-1.5">{pick(project.category)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/45">{t.caseStudy.languages}</dt>
                <dd className="mt-1.5">{pick(project.languages)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-ink/45">{t.caseStudy.stack}</dt>
                <dd className="mt-1.5">{project.stack.slice(0, 4).join(", ")}</dd>
              </div>
              <div className="col-span-2 pt-2">
                <ExternalButton href={project.url} label={liveLabel}>
                  {t.caseStudy.live}
                </ExternalButton>
              </div>
            </dl>
          </div>
        </div>
        <div data-case-hero className="relative aspect-[4/3] overflow-hidden bg-ink sm:aspect-[16/9]">
          <Image src={hero.src} alt={`${project.name} — ${pick(project.category)}`} fill priority sizes="100vw" className="object-cover object-top" />
        </div>
      </div>

      {/* Overview + direction */}
      <section aria-labelledby="overview" className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel n="01">
            <span id="overview">{t.caseStudy.overview}</span>
          </SectionLabel>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <p className="text-[clamp(1.4rem,2.6vw,2.3rem)] font-medium leading-[1.2] tracking-[-0.025em]">{pick(project.overview)}</p>
          </Reveal>
          <div className="mt-16 grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-2">
            <Reveal>
              <h2 className="eyebrow text-ink/50">{t.caseStudy.direction}</h2>
              <p className="mt-4 font-serif text-2xl italic leading-snug text-graphite">{pick(project.direction)}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="eyebrow text-ink/50">{t.caseStudy.stack}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <li key={s} className="rounded-full border border-ink/15 px-3.5 py-1.5 text-sm">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Functionality */}
      <section aria-labelledby="features" className="on-dark bg-ink py-24 text-ivory sm:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-3 text-ivory/50">
              <span className="text-ivory">02</span>
              <span aria-hidden className="h-px w-8 bg-current" />
              <span id="features">{t.caseStudy.features}</span>
            </p>
          </div>
          <Reveal as="ol" stagger={0.07} className="border-t border-ivory/15 lg:col-span-8">
            {project.features.map((f, i) => (
              <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-ivory/15 py-6 text-lg leading-relaxed text-ivory/80 sm:text-xl">
                <span className="eyebrow pt-2 text-signal-soft">{String(i + 1).padStart(2, "0")}</span>
                {pick(f)}
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Interface details */}
      <section aria-labelledby="interface" className="py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel n="03">
            <span id="interface">{t.caseStudy.interface}</span>
          </SectionLabel>
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
            {project.gallery.map((g, i) => (
              <figure key={g.key} className={i === 0 ? "lg:col-span-8" : "lg:col-span-6 lg:col-start-6 lg:-mt-0"}>
                <Parallax speed={i ? 8 : 0}>
                  <ClipReveal className="rounded-xl">
                    <BrowserFrame shot={shot(project, g.key)} alt={`${project.name} — ${pick(g.caption)}`} url={project.url} sizes="(min-width: 1024px) 66vw, 94vw" />
                  </ClipReveal>
                  <figcaption className="mt-3 flex gap-3 text-sm text-ink/55">
                    <span className="eyebrow pt-0.5 text-ink/35">{String(i + 1).padStart(2, "0")}</span>
                    {pick(g.caption)}
                  </figcaption>
                </Parallax>
              </figure>
            ))}
          </div>

          <div className="mt-24 grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ClipReveal className="rounded-xl">
                <div className="overflow-hidden rounded-xl border border-ink/10">
                  <ScrollPreview shot={shot(project, project.long)} alt={`${project.name} — ${t.caseStudy.fullPage}`} label="Scroll" />
                </div>
              </ClipReveal>
              <p className="eyebrow mt-4 text-ink/45">{t.caseStudy.fullPage}</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="eyebrow text-ink/50">{t.caseStudy.interactions}</h2>
              <Reveal as="ul" stagger={0.07} className="mt-6 space-y-5">
                {project.interactions.map((x, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed text-graphite">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-signal" />
                    {pick(x)}
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Responsive */}
      <section aria-labelledby="responsive" className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionLabel n="04">
            <span id="responsive">{t.caseStudy.responsive}</span>
          </SectionLabel>
          <div className="mt-14 grid grid-cols-2 items-start gap-4 sm:gap-10 md:grid-cols-12">
            {project.mobile.map((m, i) => (
              <figure key={m.key} className={i === 0 ? "md:col-span-3 md:col-start-3" : "mt-16 md:col-span-3 md:col-start-8"}>
                <Parallax speed={i ? 16 : 4}>
                  <PhoneFrame shot={shot(project, m.key)} alt={`${project.name} — ${pick(m.caption)}`} sizes="(min-width: 768px) 22vw, 45vw" />
                  <figcaption className="mt-4 text-center text-sm text-ink/55">{pick(m.caption)}</figcaption>
                </Parallax>
              </figure>
            ))}
          </div>
          <Reveal className="mx-auto mt-24 max-w-2xl rounded-2xl border border-ink/15 p-6 sm:p-8">
            <h2 className="eyebrow text-ink/50">{t.caseStudy.note}</h2>
            <p className="mt-3 leading-relaxed text-graphite">{pick(project.note)}</p>
            <div className="mt-6">
              <ExternalButton href={project.url} label={liveLabel}>
                {t.caseStudy.live}
              </ExternalButton>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Next project */}
      <TransitionLink href={`/work/${next.slug}`} data-cursor={t.caseStudy.next} className="on-dark group relative block overflow-hidden bg-ink text-ivory">
        <div className="absolute inset-0 opacity-30 transition-[opacity,scale] duration-1000 ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-50">
          <Image src={shot(next, next.hero).src} alt="" fill sizes="100vw" className="object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        </div>
        <div className="container-x relative py-28 sm:py-40">
          <p className="eyebrow text-ivory/60">{t.caseStudy.next}</p>
          <p className="display-lg mt-6 flex flex-wrap items-end gap-x-6">
            {next.name}
            <ArrowUpRight className="mb-[0.1em] size-[0.6em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-2 group-hover:translate-x-2" aria-hidden />
          </p>
          <p className="mt-6 text-ivory/60">{pick(next.category)}</p>
        </div>
      </TransitionLink>
    </article>
  );
}
