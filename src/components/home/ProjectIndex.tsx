"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { Reveal } from "@/components/motion/Reveal";
import { projects, shot } from "@/data/projects";
import { useLocale } from "@/i18n/locale";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Compact list of all projects; on desktop a preview follows the pointer. */
export function ProjectIndex() {
  const { t, pick } = useLocale();
  const wrap = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = wrap.current;
    const pv = preview.current;
    if (!el || !pv || !window.matchMedia("(pointer: fine)").matches) return;
    const reduce = prefersReducedMotion();
    const x = gsap.quickTo(pv, "x", { duration: reduce ? 0 : 0.7, ease: "power3" });
    const y = gsap.quickTo(pv, "y", { duration: reduce ? 0 : 0.7, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <section aria-labelledby="index-title" className="bg-ivory py-24 sm:py-32">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6 border-b border-ink pb-6">
          <h2 id="index-title" className="display-md">
            {t.work.indexTitle}
          </h2>
          <p className="eyebrow hidden text-ink/50 md:block">{t.work.hoverHint}</p>
        </div>
        <div ref={wrap} className="relative" onMouseLeave={() => setHovered(null)}>
          <div
            ref={preview}
            aria-hidden
            className={`pointer-events-none absolute left-0 top-0 z-10 hidden w-[24rem] -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-500 ease-[var(--ease-out-expo)] md:block ${
              hovered === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-2xl">
              {projects.map((p, i) => {
                const s = shot(p, p.hero);
                return (
                  <Image
                    key={p.slug}
                    src={s.src}
                    alt=""
                    fill
                    sizes="384px"
                    className={`object-cover object-top transition-[opacity,scale] duration-700 ease-[var(--ease-out-expo)] ${hovered === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}
                  />
                );
              })}
            </div>
          </div>
          <Reveal as="ol" stagger={0.06} y={24}>
            {projects.map((p, i) => (
              <li key={p.slug} className="border-b border-ink/15">
                <TransitionLink
                  href={`/work/${p.slug}`}
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  data-cursor={t.caseStudy.project}
                  className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-6 sm:grid-cols-[4rem_1fr_1fr_auto] sm:py-8"
                >
                  <span className="eyebrow text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[clamp(1.6rem,4vw,3.4rem)] font-medium leading-none tracking-[-0.04em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-3">
                    {p.name}
                  </span>
                  <span className="hidden text-sm text-ink/55 sm:block">{pick(p.category)}</span>
                  <span className="grid size-11 place-items-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-ivory">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </TransitionLink>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
