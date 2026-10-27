"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Shifts its content with the pointer, by `depth` pixels at the window edge.
 * Layers with different depths read as a scene with real depth (desktop only).
 */
export function Depth({ children, depth = 14, className = "" }: { children: ReactNode; depth?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" });
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const move = (e: PointerEvent) => {
      if (!visible) return;
      x((e.clientX / window.innerWidth - 0.5) * depth * 2);
      y((e.clientY / window.innerHeight - 0.5) * depth * 2);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [depth]);
  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
