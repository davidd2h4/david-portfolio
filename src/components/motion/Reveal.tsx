"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, introOffset, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Animate direct children one after another instead of the wrapper. */
  stagger?: number;
  id?: string;
};

/** Fades and lifts content into place when it scrolls into view. */
export function Reveal({ as: Tag = "div", children, className, delay = 0, y = 40, stagger, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = stagger ? Array.from(el.children) : [el];
    if (prefersReducedMotion()) {
      gsap.set([el, ...targets], { opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      if (stagger) gsap.set(el, { opacity: 1 });
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: 1.2, delay, stagger, scrollTrigger: { trigger: el, start: "top 88%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y, stagger]);

  return (
    <Tag ref={ref} className={className} data-reveal="" id={id}>
      {children}
    </Tag>
  );
}

/** Headline whose lines slide up out of a mask. Pass each line as a child string or node. */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  delay = 0,
  immediate = false,
  id,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: (i: number) => string | undefined;
  delay?: number;
  /** Play on mount instead of on scroll (used above the fold). */
  immediate?: boolean;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const key = lines.map((l) => (typeof l === "string" ? l : "")).join("|");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { opacity: 1 });
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(".line-mask > span"),
        { yPercent: 110, rotate: 2.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.4,
          stagger: 0.09,
          delay: delay + (immediate ? introOffset() : 0),
          ...(immediate ? {} : { scrollTrigger: { trigger: el, start: "top 90%", once: true } }),
        },
      );
    }, el);
    return () => ctx.revert();
  }, [key, delay, immediate]);

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="">
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span className={lineClassName?.(i)}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
