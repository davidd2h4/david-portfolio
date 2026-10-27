"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Shot } from "@/data/projects";

/**
 * A fixed-ratio window onto a tall full-page screenshot. Hovering (or
 * focusing) glides the page through the window, like scrolling the real site.
 */
export function ScrollPreview({ shot, alt, label, ratio = "16 / 10", className = "" }: { shot: Shot; alt: string; label: string; ratio?: string; className?: string }) {
  const img = useRef<HTMLDivElement>(null);
  const start = () => {
    const el = img.current;
    if (!el?.parentElement) return;
    const travel = el.offsetHeight - el.parentElement.offsetHeight;
    el.style.transitionDuration = `${Math.max(3, travel / 260)}s`;
    el.style.transform = `translateY(-${Math.max(0, travel)}px)`;
  };
  const stop = () => {
    if (!img.current) return;
    img.current.style.transitionDuration = "1.4s";
    img.current.style.transform = "translateY(0)";
  };
  return (
    <div
      tabIndex={0}
      role="img"
      aria-label={alt}
      data-cursor={label}
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div ref={img} className="will-change-transform transition-transform ease-[cubic-bezier(0.45,0,0.2,1)] motion-reduce:transition-none">
        <Image src={shot.src} width={shot.width} height={shot.height} alt="" sizes="(min-width: 1024px) 50vw, 100vw" className="block h-auto w-full" />
      </div>
    </div>
  );
}
