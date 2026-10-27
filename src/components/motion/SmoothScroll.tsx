"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;

/** Scrolls to an element or to the top, smoothly when Lenis is active. */
export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) {
    // force: still scroll if a lock (e.g. the mobile menu) is being released.
    lenis.scrollTo(target, { offset: 0, duration: 1.4, force: true });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    el?.scrollIntoView();
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

export function SmoothScroll() {
  const pathname = usePathname();

  // The intro only delays the first page; later navigations animate at once.
  useEffect(() => {
    const id = window.setTimeout(() => document.documentElement.classList.remove("intro-play"), 1800);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Late fonts and images change the page height after Lenis first measures it.
    const remeasure = () => {
      lenis?.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", remeasure);
    document.fonts?.ready.then(remeasure);
    return () => {
      window.removeEventListener("load", remeasure);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // New page: start at the top (or at the hash), then re-measure triggers.
  // The hash jump waits for the router's own scroll handling and for
  // ScrollTrigger to re-measure, otherwise the target position is stale.
  useEffect(() => {
    lenis?.resize();
    if (!window.location.hash) lenis?.scrollTo(0, { immediate: true });
    const id = window.setTimeout(() => {
      // Lenis caches the scroll limit; the previous page's limit would clamp the jump.
      lenis?.resize();
      ScrollTrigger.refresh();
      const target = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else target.scrollIntoView();
    }, 160);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
