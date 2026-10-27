"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Depth } from "@/components/motion/Depth";
import { ClipReveal, Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { ExternalButton, LinkButton } from "@/components/ui/Button";
import { BrowserFrame, PhoneFrame } from "@/components/ui/Frames";
import { ScrollPreview } from "@/components/ui/ScrollPreview";
import { getProject, shot, type Project } from "@/data/projects";
import { useLocale } from "@/i18n/locale";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

type Tone = "light" | "dark";

const num = (p: Project) => String(["aeris-flights", "living-interior", "nexora-crm", "nori-sushi", "noir-restaurant", "nova-detailing", "coffee-studio"].indexOf(p.slug) + 1).padStart(2, "0");

/** Number, name, category, verified summary and both actions. */
function Intro({ project, tone, size = "lg", className = "" }: { project: Project; tone: Tone; size?: "lg" | "md"; className?: string }) {
  const { t, pick } = useLocale();
  const muted = tone === "dark" ? "text-ivory/55" : "text-ink/55";
  return (
    <div className={className}>
      <Reveal>
        <p className={`eyebrow flex items-center gap-3 ${muted}`}>
          <span className={tone === "dark" ? "text-ivory" : "text-ink"}>({num(project)})</span>
          <span aria-hidden className="h-px w-8 bg-current opacity-40" />
          <span>{pick(project.category)}</span>
        </p>
      </Reveal>
      <RevealLines
        as="h3"
        id={`${project.slug}-title`}
        lines={[project.name]}
        className={`mt-5 ${size === "lg" ? "display-lg" : "display-md"} ${tone === "dark" ? "text-ivory" : "text-ink"}`}
      />
      <Reveal delay={0.1}>
        <p className={`mt-6 max-w-xl text-base leading-relaxed sm:text-lg ${tone === "dark" ? "text-ivory/70" : "text-graphite"}`}>{pick(project.summary)}</p>
      </Reveal>
      <Reveal stagger={0.1} delay={0.3} y={24} className="mt-8 flex flex-wrap gap-3">
        <ExternalButton href={project.url} tone={tone} label={`${t.work.live}: ${project.name} (${t.a11y.external})`}>
          {t.work.live}
        </ExternalButton>
        <LinkButton href={`/work/${project.slug}`} variant="outline" tone={tone} label={`${t.work.case}: ${project.name}`}>
          {t.work.case}
        </LinkButton>
      </Reveal>
    </div>
  );
}

/** 01 — AERIS: dark, full-bleed screenshot that expands from an inset frame as you scroll. */
function Cinema({ project }: { project: Project }) {
  const { pick } = useLocale();
  const stage = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-expand]",
        { clipPath: "inset(6% 14% 6% 14% round 1.25rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: { trigger: el, start: "top 85%", end: "center center", scrub: true } },
      );
      gsap.fromTo("[data-expand] img", { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);
  const hero = shot(project, project.hero);
  return (
    <article className="on-dark bg-ink pb-24 pt-24 text-ivory sm:pb-32 sm:pt-32" aria-labelledby={`${project.slug}-title`}>
      <div className="container-x grid items-end gap-12 lg:grid-cols-12">
        <Intro project={project} tone="dark" className="lg:col-span-7" />
        <Reveal stagger={0.08} as="ul" className="border-t border-ivory/15 lg:col-span-4 lg:col-start-9">
          {project.features.slice(0, 4).map((f, i) => (
            <li key={i} className="flex gap-4 border-b border-ivory/15 py-4 text-sm leading-relaxed text-ivory/65">
              <span className="eyebrow pt-0.5 text-ivory/35">{String(i + 1).padStart(2, "0")}</span>
              {pick(f)}
            </li>
          ))}
        </Reveal>
      </div>
      <div ref={stage} className="mt-16 sm:mt-20">
        <div data-expand className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/9]" data-cursor="Live">
          <a href={project.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden>
            <Image src={hero.src} alt="" fill sizes="100vw" className="object-cover object-top" />
          </a>
        </div>
      </div>
      <div className="container-x mt-16 grid items-end gap-10 sm:mt-24 md:grid-cols-12">
        <Reveal className="md:col-span-5">
          <p className="eyebrow text-ivory/45">{pick(project.category)}</p>
          <p className="mt-4 max-w-md font-serif text-2xl italic leading-snug text-ivory/85 sm:text-3xl">{pick(project.direction)}</p>
        </Reveal>
        <div className="flex justify-center gap-4 sm:gap-6 md:col-span-6 md:col-start-7 md:justify-end">
          {project.mobile.map((m, i) => (
            <Parallax key={m.key} speed={i === 0 ? 8 : 22} className="w-[44%] max-w-[15rem]">
              <Depth depth={18}>
                <PhoneFrame shot={shot(project, m.key)} alt={`${project.name} — ${pick(m.caption)}`} />
              </Depth>
            </Parallax>
          ))}
        </div>
      </div>
    </article>
  );
}

/** 02 — LIVING: editorial split. Sticky text column, stacked visuals with depth. */
function Split({ project, reverse = false, tone = "light" }: { project: Project; reverse?: boolean; tone?: Tone }) {
  const { pick } = useLocale();
  const [a, b] = project.gallery;
  return (
    <article className={tone === "dark" ? "on-dark bg-ink text-ivory" : "bg-ivory"} aria-labelledby={`${project.slug}-title`}>
      <div className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-10">
        <div className={`lg:col-span-5 ${reverse ? "lg:order-2 lg:col-start-8" : ""}`}>
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <Intro project={project} tone={tone} />
            <Reveal stagger={0.08} as="ul" className={`mt-10 border-t ${tone === "dark" ? "border-ivory/15" : "border-ink/15"}`}>
              {project.features.slice(0, 3).map((f, i) => (
                <li key={i} className={`flex gap-4 border-b py-4 text-sm leading-relaxed ${tone === "dark" ? "border-ivory/15 text-ivory/70" : "border-ink/15 text-graphite"}`}>
                  <span className="eyebrow pt-0.5 opacity-50">{String(i + 1).padStart(2, "0")}</span>
                  {pick(f)}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
        <div className={`relative lg:col-span-7 ${reverse ? "lg:order-1" : "lg:col-start-6"}`}>
          <ClipReveal className="rounded-xl">
            <BrowserFrame shot={shot(project, project.hero)} alt={`${project.name} — ${pick(project.category)}`} url={project.url} tone={tone} />
          </ClipReveal>
          <div className="mt-8 grid grid-cols-12 items-start gap-4 sm:mt-12">
            <Parallax speed={10} className="col-span-12 sm:col-span-8">
              <ClipReveal className="rounded-xl">
                <BrowserFrame shot={shot(project, a.key)} alt={`${project.name} — ${pick(a.caption)}`} url={project.url} tone={tone} sizes="(min-width: 1024px) 38vw, 90vw" />
              </ClipReveal>
              <p className={`mt-3 text-sm ${tone === "dark" ? "text-ivory/50" : "text-ink/50"}`}>{pick(a.caption)}</p>
            </Parallax>
            <Parallax speed={28} className="col-span-6 col-start-4 -mt-4 sm:col-span-4 sm:mt-16">
              <Depth depth={26}>
                <PhoneFrame shot={shot(project, project.mobile[1].key)} alt={`${project.name} — ${pick(project.mobile[1].caption)}`} />
              </Depth>
            </Parallax>
          </div>
          {b && (
            <Parallax speed={6} className="mt-10 sm:ml-[20%]">
              <ClipReveal className="rounded-xl">
                <BrowserFrame shot={shot(project, b.key)} alt={`${project.name} — ${pick(b.caption)}`} url={project.url} tone={tone} sizes="(min-width: 1024px) 45vw, 90vw" />
              </ClipReveal>
              <p className={`mt-3 text-sm ${tone === "dark" ? "text-ivory/50" : "text-ink/50"}`}>{pick(b.caption)}</p>
            </Parallax>
          )}
        </div>
      </div>
    </article>
  );
}

/** 03 — NEXORA: interactive preview. Tabs switch between real product screens. */
function Tabs({ project }: { project: Project }) {
  const { pick } = useLocale();
  const screens = [{ key: project.hero, caption: { en: "Dashboard", uk: "Панель" } }, ...project.gallery];
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);

  function show(i: number) {
    if (i === active) return;
    setActive(i);
    const el = stage.current?.querySelectorAll<HTMLElement>("[data-screen]")[i];
    if (el && !prefersReducedMotion()) gsap.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" });
  }

  return (
    <article className="on-dark bg-[#1c1c1c] text-ivory" aria-labelledby={`${project.slug}-title`}>
      <div className="container-x py-24 sm:py-32">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <Intro project={project} tone="dark" className="lg:col-span-7" />
          <Reveal className="lg:col-span-4 lg:col-start-9">
            <div role="tablist" aria-label={project.name} className="flex flex-wrap gap-2 lg:justify-end">
              {screens.map((s, i) => (
                <button
                  key={s.key}
                  role="tab"
                  type="button"
                  id={`nx-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="nx-panel"
                  onClick={() => show(i)}
                  className={`min-h-11 rounded-full border px-5 text-sm transition-colors duration-300 ${
                    i === active ? "border-ivory bg-ivory text-ink" : "border-ivory/20 text-ivory/70 hover:border-ivory/60 hover:text-ivory"
                  }`}
                >
                  {pick(s.caption).split(" — ")[0]}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
        <ClipReveal className="mt-14 rounded-xl">
          <div id="nx-panel" role="tabpanel" aria-labelledby={`nx-tab-${active}`} ref={stage} className="relative">
            {screens.map((s, i) => (
              <div key={s.key} data-screen className={i === 0 ? "relative" : "absolute inset-0"} style={{ zIndex: i === active ? 2 : 1, visibility: i === active || i === 0 ? "visible" : "hidden" }}>
                <BrowserFrame shot={shot(project, s.key)} alt={`${project.name} — ${pick(s.caption)}`} url={project.url} tone="dark" sizes="(min-width: 1280px) 1200px, 94vw" />
              </div>
            ))}
          </div>
        </ClipReveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {project.features.slice(0, 3).map((f, i) => (
            <Reveal key={i} delay={i * 0.08} className="border-t border-ivory/15 pt-5 text-sm leading-relaxed text-ivory/65">
              {pick(f)}
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}

/** 04 — NORI: oversized wordmark with phones drifting at different speeds. */
function Phones({ project }: { project: Project }) {
  const { pick } = useLocale();
  const menu = project.gallery[0];
  return (
    <article className="relative overflow-hidden bg-paper" aria-labelledby={`${project.slug}-title`}>
      <div className="container-x py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <Intro project={project} tone="light" className="lg:col-span-5" />
          <div className="relative lg:col-span-7">
            <div className="flex items-start justify-center gap-4 sm:gap-8">
              <Parallax speed={-10} className="w-[46%] max-w-[17rem] pt-10">
                <Depth depth={10}>
                  <PhoneFrame shot={shot(project, project.mobile[0].key)} alt={`${project.name} — ${pick(project.mobile[0].caption)}`} />
                </Depth>
              </Parallax>
              <Parallax speed={24} className="w-[46%] max-w-[17rem]">
                <Depth depth={18}>
                  <PhoneFrame shot={shot(project, project.mobile[1].key)} alt={`${project.name} — ${pick(project.mobile[1].caption)}`} />
                </Depth>
              </Parallax>
            </div>
          </div>
        </div>
        <ClipReveal className="mt-16 rounded-xl sm:mt-24 lg:ml-[16%]">
          <BrowserFrame shot={shot(project, menu.key)} alt={`${project.name} — ${pick(menu.caption)}`} url={project.url} sizes="(min-width: 1024px) 80vw, 94vw" />
        </ClipReveal>
        <Reveal>
          <p className="mt-3 text-sm text-ink/50 lg:ml-[16%]">{pick(menu.caption)}</p>
        </Reveal>
      </div>
    </article>
  );
}

/** 05 — NOIR: full page in a window; hover to glide through the whole site. */
function Scroller({ project, tone = "dark", bg = "bg-night" }: { project: Project; tone?: Tone; bg?: string }) {
  const { t, pick } = useLocale();
  return (
    <article className={`${tone === "dark" ? "on-dark text-ivory" : ""} ${bg}`} aria-labelledby={`${project.slug}-title`}>
      <div className="container-x grid items-center gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ClipReveal className="rounded-xl">
            <div className={`overflow-hidden rounded-xl border ${tone === "dark" ? "border-ivory/10" : "border-ink/10"}`}>
              <ScrollPreview shot={shot(project, project.long)} alt={`${project.name} — ${t.caseStudy.fullPage}`} label="Scroll" />
            </div>
          </ClipReveal>
          <p className={`eyebrow mt-4 ${tone === "dark" ? "text-ivory/45" : "text-ink/45"}`}>{t.work.scrollPreview}</p>
        </div>
        <div className="lg:col-span-5">
          <Intro project={project} tone={tone} size="md" />
          <div className="mt-12 flex gap-4">
            {project.mobile.map((m, i) => (
              <Parallax key={m.key} speed={i ? 18 : 6} className="w-1/2 max-w-[11rem]">
                <Depth depth={26}>
                  <PhoneFrame shot={shot(project, m.key)} alt={`${project.name} — ${pick(m.caption)}`} sizes="(min-width: 1024px) 12vw, 40vw" />
                </Depth>
              </Parallax>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/** 06 — NOVA: wide screenshot with an overlapping detail and offset text. */
function Overlap({ project }: { project: Project }) {
  const { pick } = useLocale();
  const detail = project.gallery[1];
  return (
    <article className="bg-ivory" aria-labelledby={`${project.slug}-title`}>
      <div className="container-x py-24 sm:py-32">
        <div className="relative">
          <ClipReveal className="rounded-xl lg:w-[78%]">
            <BrowserFrame shot={shot(project, project.hero)} alt={`${project.name} — ${pick(project.category)}`} url={project.url} sizes="(min-width: 1024px) 75vw, 94vw" />
          </ClipReveal>
          <Parallax speed={20} className="relative mt-6 w-[86%] sm:ml-auto sm:w-[52%] lg:absolute lg:-bottom-24 lg:right-0 lg:mt-0 lg:w-[38%]">
            <BrowserFrame shot={shot(project, detail.key)} alt={`${project.name} — ${pick(detail.caption)}`} url={project.url} sizes="(min-width: 1024px) 36vw, 80vw" />
            <p className="mt-3 text-sm text-ink/50">{pick(detail.caption)}</p>
          </Parallax>
        </div>
        <div className="mt-16 grid gap-10 lg:mt-40 lg:grid-cols-12">
          <Intro project={project} tone="light" className="lg:col-span-6" />
          <Reveal stagger={0.08} as="ul" className="self-end border-t border-ink/15 lg:col-span-5 lg:col-start-8">
            {project.features.map((f, i) => (
              <li key={i} className="flex gap-4 border-b border-ink/15 py-4 text-sm leading-relaxed text-graphite">
                <span className="eyebrow pt-0.5 text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                {pick(f)}
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </article>
  );
}

/** 07 — COFFEE: warm closing frame; long-page window plus phone. */
function Closing({ project }: { project: Project }) {
  return <Scroller project={project} tone="dark" bg="bg-[#241a14]" />;
}

export function Showcase() {
  const { t } = useLocale();
  const p = (slug: string) => getProject(slug)!;
  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title" className="outline-none">
      <div className="container-x pb-16 pt-24 sm:pb-24 sm:pt-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-ink/55">{t.work.eyebrow}</p>
          </Reveal>
          <div className="lg:col-span-9">
            <RevealLines
              key={t.work.title}
              id="work-title"
              lines={[t.work.title, <span key="a" className="font-serif font-normal italic tracking-[-0.03em] text-ink/55">{t.work.titleAccent}</span>]}
              className="display-md text-ink"
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-graphite">{t.work.intro}</p>
            </Reveal>
          </div>
        </div>
      </div>
      <Cinema project={p("aeris-flights")} />
      <Split project={p("living-interior")} />
      <Tabs project={p("nexora-crm")} />
      <Phones project={p("nori-sushi")} />
      <Scroller project={p("noir-restaurant")} />
      <Overlap project={p("nova-detailing")} />
      <Closing project={p("coffee-studio")} />
    </section>
  );
}
