"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RevealLines } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { projects, shot } from "@/data/projects";
import { useLocale } from "@/i18n/locale";
import { gsap, introOffset, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

const REEL = projects.map((p) => ({ project: p, shot: shot(p, p.hero) }));

export function Hero() {
  const { t, pick } = useLocale();
  const root = useRef<HTMLElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const lines = t.hero.lines;
  const longest = Math.max(...lines.map((l) => l.length));

  // Intro: supporting copy and reel arrive after the headline.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-hero-fade]");
    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1 });
      return;
    }
    const wait = introOffset();
    const ctx = gsap.context(() => {
      gsap.fromTo(items, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, stagger: 0.1, delay: 0.55 + wait });
      gsap.fromTo("[data-hero-reel]", { clipPath: "inset(18% 12% 18% 12% round 1rem)" }, { clipPath: "inset(0% 0% 0% 0% round 1rem)", duration: 1.8, ease: "expo.inOut", delay: 0.3 + wait });
      // Headline drifts and fades a little as the page scrolls away.
      gsap.to("[data-hero-title]", { yPercent: -12, opacity: 0.35, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    }, el);
    return () => ctx.revert();
  }, []);

  // Cursor-driven light and depth (desktop only).
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const lx = gsap.quickTo(light.current, "x", { duration: 1.2, ease: "power3" });
    const ly = gsap.quickTo(light.current, "y", { duration: 1.2, ease: "power3" });
    const rx = gsap.quickTo(reel.current, "rotationY", { duration: 1, ease: "power3" });
    const ry = gsap.quickTo(reel.current, "rotationX", { duration: 1, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      lx(e.clientX - r.left);
      ly(e.clientY - r.top);
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rx(nx * 7);
      ry(-ny * 5);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  // Reel: cycle through the seven projects.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % REEL.length), 3200);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const frames = reel.current?.querySelectorAll<HTMLElement>("[data-frame]");
    if (!frames) return;
    frames.forEach((f, i) => {
      if (i === active) {
        gsap.set(f, { zIndex: 2 });
        if (prefersReducedMotion()) gsap.set(f, { clipPath: "inset(0% 0% 0% 0%)" });
        else {
          gsap.fromTo(f, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" });
          gsap.fromTo(f.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "expo.out" });
        }
      } else gsap.set(f, { zIndex: i === (active - 1 + REEL.length) % REEL.length ? 1 : 0 });
    });
  }, [active]);

  const current = REEL[active].project;

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+1.5rem)] sm:pb-24 lg:pt-[calc(var(--header-h)+2rem)]">
      {/* Cinematic light that follows the pointer. */}
      <div
        ref={light}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,250,240,0.95)_0%,rgba(243,240,234,0)_65%)]"
        style={{ transform: "translate(70vw, 30vh)" }}
      />
      <div className="container-x">
        <div data-hero-fade className="eyebrow flex items-center justify-between border-b border-ink/15 pb-4 text-ink/60">
          <span className="flex items-center gap-2.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-50" />
              <span className="relative inline-flex size-2 rounded-full bg-signal" />
            </span>
            {t.hero.kicker}
          </span>
          <span className="hidden sm:inline">{t.hero.live}</span>
        </div>

        <h1 id="hero-title" className="sr-only">
          {lines.join(" ")}
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10">
          <div data-hero-title aria-hidden className="lg:col-span-8" style={{ ["--chars" as string]: longest }}>
            <RevealLines
              key={lines.join("|")}
              as="p"
              immediate
              delay={0.1}
              lines={lines}
              className="hero-title mt-8 font-medium leading-[0.86] tracking-[-0.055em] text-ink sm:mt-10"
              lineClassName={(i) =>
                i === 1 ? "lg:pl-[0.6em]" : i === 3 ? "pr-[0.06em] font-serif italic font-normal tracking-[-0.03em] text-signal lg:pl-[1.4em]" : undefined
              }
            />
          </div>

          <div className="lg:order-3 lg:col-span-6">
            <p data-hero-fade className="max-w-md text-lg leading-relaxed text-graphite sm:text-xl">
              {t.hero.text}
            </p>
            <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/#work">{t.hero.explore}</LinkButton>
              <LinkButton href="/#contact" variant="outline">
                {t.hero.start}
              </LinkButton>
            </div>
          </div>

          <div data-hero-fade className="self-end [perspective:1400px] lg:order-2 lg:col-span-4 lg:row-span-2 lg:pb-2">
            <div
              ref={reel}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              className="relative [transform-style:preserve-3d]"
            >
              <div data-hero-reel className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink shadow-[0_50px_100px_-40px_rgba(23,23,23,0.55)]">
                {REEL.map(({ project, shot: s }, i) => (
                  <div key={project.slug} data-frame className="absolute inset-0 overflow-hidden" style={{ clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", zIndex: i === 0 ? 2 : 0 }}>
                    <Image
                      src={s.src}
                      alt={`${project.name} — ${pick(project.category)}`}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 1024px) 32vw, 92vw"
                      className="object-cover object-top"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <p className="min-w-0" aria-live="polite">
                  <span className="eyebrow block text-ink/50">
                    {t.hero.reel} · {String(active + 1).padStart(2, "0")}/{String(REEL.length).padStart(2, "0")}
                  </span>
                  <span className="mt-1.5 block text-lg font-medium leading-tight tracking-[-0.02em]">{current.name}</span>
                  <span className="block truncate text-sm text-ink/50">{pick(current.category)}</span>
                </p>
                <div className="flex shrink-0 gap-0.5 pt-0.5" role="group" aria-label={t.work.indexTitle}>
                  {REEL.map(({ project }, i) => (
                    <button
                      key={project.slug}
                      type="button"
                      aria-pressed={i === active}
                      aria-label={project.name}
                      onClick={() => setActive(i)}
                      className="group grid h-8 w-4 place-items-center"
                    >
                      <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-4 bg-ink" : "w-1.5 bg-ink/25 group-hover:bg-ink/60"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
