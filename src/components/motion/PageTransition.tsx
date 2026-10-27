"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { getProject, projects } from "@/data/projects";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

let cover: ((href: string) => void) | null = null;

/** Navigate with the curtain transition; falls back to a plain push. */
export function navigateWithTransition(href: string, push: (href: string) => void) {
  if (cover) cover(href);
  else push(href);
}

export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const covering = useRef(false);
  // When opening a case study the curtain names the project; otherwise the logo.
  const [label, setLabel] = useState<{ index: string; name: string } | null>(null);

  useEffect(() => {
    cover = (href: string) => {
      const target = new URL(href, window.location.href);
      if (prefersReducedMotion() || !panel.current || target.pathname === window.location.pathname) {
        router.push(href);
        return;
      }
      covering.current = true;
      const project = getProject(target.pathname.match(/^\/work\/([^/]+)/)?.[1] ?? "");
      flushSync(() =>
        setLabel(project ? { index: String(projects.indexOf(project) + 1).padStart(2, "0"), name: project.name } : null),
      );
      gsap
        .timeline({ onComplete: () => router.push(href) })
        .set(panel.current, { display: "flex", yPercent: 100, borderRadius: "50% 50% 0 0 / 12% 12% 0 0" })
        .to(panel.current, { yPercent: 0, borderRadius: "0% 0% 0 0 / 0% 0% 0 0", duration: 0.75, ease: "expo.inOut" })
        .fromTo(word.current, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, "-=0.35");
    };
    return () => {
      cover = null;
    };
  }, [router]);

  useEffect(() => {
    if (!covering.current || !panel.current) return;
    covering.current = false;
    gsap
      .timeline()
      .to(word.current, { yPercent: -100, duration: 0.45, ease: "expo.in" })
      .to(panel.current, { yPercent: -100, borderRadius: "0 0 50% 50% / 0 0 12% 12%", duration: 0.85, ease: "expo.inOut" }, "-=0.1")
      .set(panel.current, { display: "none" });
  }, [pathname]);

  return (
    <div
      ref={panel}
      aria-hidden
      className="fixed inset-0 z-[80] hidden items-center justify-center bg-ink text-ivory"
    >
      <span className="block overflow-hidden px-6 text-center">
        <span ref={word} className="block">
          {label ? (
            <>
              <span className="eyebrow block text-ivory/50">({label.index})</span>
              <span className="mt-3 block text-[clamp(2.2rem,7vw,6rem)] font-medium leading-none tracking-[-0.045em]">{label.name}</span>
            </>
          ) : (
            <span className="block text-[clamp(2rem,6vw,5rem)] font-medium tracking-[-0.04em]">
              DAVID<span className="text-signal-soft">.</span>
            </span>
          )}
        </span>
      </span>
    </div>
  );
}
