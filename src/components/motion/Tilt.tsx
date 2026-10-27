"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Gentle 3D tilt toward the pointer, plus a soft light sheen (desktop only).
 * Children can use `group-hover/tilt:` utilities, e.g. for an image zoom.
 */
export function Tilt({ children, max = 4, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const sheen = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    gsap.set(el, { transformPerspective: 1200 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      ry(nx * max * 2);
      rx(-ny * max * 2);
      if (sheen.current) {
        sheen.current.style.opacity = "1";
        sheen.current.style.background = `radial-gradient(600px circle at ${(nx + 0.5) * 100}% ${(ny + 0.5) * 100}%, rgba(255,255,255,0.12), transparent 45%)`;
      }
    };
    const leave = () => {
      rx(0);
      ry(0);
      if (sheen.current) sheen.current.style.opacity = "0";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`group/tilt relative will-change-transform ${className}`}>
      {children}
      <span ref={sheen} aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-500" />
    </div>
  );
}
