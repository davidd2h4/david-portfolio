"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Desktop-only cursor: a small dot plus a ring that grows into a label over
 * elements marked with data-cursor="Label". Hidden on touch and reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const update = () => setEnabled(fine.matches && !prefersReducedMotion());
    update();
    fine.addEventListener("change", update);
    return () => fine.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor], a, button, [role='slider']");
      const text = target?.dataset.cursor ?? "";
      setLabel(text);
      ring.current?.setAttribute("data-state", text ? "label" : target ? "link" : "idle");
    };
    const leave = () => {
      shown = false;
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference">
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-ivory opacity-0" />
      <div
        ref={ring}
        data-state="idle"
        className="group absolute left-0 top-0 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ivory/70 opacity-0 transition-[width,height,background-color,border-color] duration-500 ease-[var(--ease-out-expo)] data-[state=label]:size-24 data-[state=label]:border-transparent data-[state=label]:bg-ivory data-[state=link]:size-14"
      >
        <span className="eyebrow text-ink opacity-0 transition-opacity duration-300 group-data-[state=label]:opacity-100">{label}</span>
      </div>
    </div>
  );
}
