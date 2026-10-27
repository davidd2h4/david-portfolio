"use client";

import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { useLocale } from "@/i18n/locale";

const TOOLS = ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Motion", "three.js", "Zustand", "Zod", "Vite", "Vitest", "Playwright"];

export function About() {
  const { t } = useLocale();
  return (
    <section id="about" tabIndex={-1} aria-labelledby="about-title" className="relative overflow-hidden bg-paper py-24 outline-none sm:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <p className="eyebrow text-ink/55">{t.about.eyebrow}</p>
          </Reveal>
          <div className="lg:col-span-9">
            <RevealLines key={t.about.title} id="about-title" lines={[t.about.title]} className="display-md max-w-5xl text-ink" />
            <div className="mt-12 grid gap-8 text-lg leading-relaxed text-graphite md:grid-cols-2">
              <Reveal>
                <p>{t.about.p1}</p>
              </Reveal>
              <Reveal delay={0.1}>
                <p>{t.about.p2}</p>
              </Reveal>
            </div>
          </div>
        </div>

        <Reveal as="ul" stagger={0.07} className="mt-20 grid border-t border-ink/15 sm:grid-cols-2 lg:mt-28 lg:grid-cols-3">
          {t.about.pillars.map((p, i) => (
            <li key={p.t} className="group relative border-b border-ink/15 py-8 sm:pr-8 lg:[&:nth-child(3n+2)]:border-x lg:[&:nth-child(3n+2)]:px-8 lg:[&:nth-child(3n)]:pl-8">
              <span className="eyebrow text-signal">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em]">{p.t}</h3>
              <p className="mt-3 max-w-sm leading-relaxed text-ink/60">{p.d}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-20">
          <p className="eyebrow text-ink/55">{t.about.toolsTitle}</p>
        </div>
      </div>
      <div className="mt-6 overflow-hidden border-y border-ink/15 py-6" aria-label={t.about.toolsTitle}>
        <ul className="marquee-track flex w-max gap-12 whitespace-nowrap text-[clamp(1.8rem,4vw,3.5rem)] font-medium tracking-[-0.04em] motion-reduce:flex-wrap motion-reduce:w-auto motion-reduce:px-[var(--gutter)]">
          {[...TOOLS, ...TOOLS].map((tool, i) => (
            <li key={i} aria-hidden={i >= TOOLS.length} className={`flex items-center gap-12 ${i >= TOOLS.length ? "motion-reduce:hidden" : ""}`}>
              {tool}
              <span className="font-serif text-signal italic">✳</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
