"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

/** Moves its content against the scroll. speed > 0 drifts up, < 0 drifts down. */
export function Parallax({ children, speed = 10, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: speed / 2 },
        { yPercent: -speed / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }, el);
    return () => ctx.revert();
  }, [speed]);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

/** Reveals content through a mask that opens upward, with a slow inner zoom. */
export function ClipReveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 1 });
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
      tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
      if (el.firstElementChild) tl.fromTo(el.firstElementChild, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.1);
    }, el);
    return () => ctx.revert();
  }, [delay]);
  return (
    <div ref={ref} data-reveal="" className={`overflow-hidden ${className}`}>
      <div className="origin-center">{children}</div>
    </div>
  );
}
