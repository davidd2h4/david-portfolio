import { Tilt } from "@/components/motion/Tilt";
import { ShotImage } from "./ShotImage";
import type { Shot } from "@/data/projects";

/** Minimal browser chrome around a desktop screenshot. */
export function BrowserFrame({
  shot,
  alt,
  url,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  priority = false,
  tone = "light",
  className = "",
}: {
  shot: Shot;
  alt: string;
  url: string;
  sizes?: string;
  priority?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const host = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const chrome = tone === "dark" ? "bg-[#202020] border-white/10 text-ivory/50" : "bg-[#e4dfd5] border-ink/10 text-ink/45";
  return (
    <Tilt max={3} className="rounded-[clamp(0.5rem,1vw,0.9rem)]">
      <figure className={`overflow-hidden rounded-[clamp(0.5rem,1vw,0.9rem)] border shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] ${chrome} ${className}`}>
        <div className="flex h-7 items-center gap-1.5 px-3 sm:h-8">
          <span className="size-2 rounded-full bg-current opacity-60" />
          <span className="size-2 rounded-full bg-current opacity-40" />
          <span className="size-2 rounded-full bg-current opacity-25" />
          <span className="ml-3 hidden truncate font-mono text-[0.65rem] tracking-wide sm:block">{host}</span>
        </div>
        <div className="overflow-hidden">
          <ShotImage
            shot={shot}
            alt={alt}
            sizes={sizes}
            priority={priority}
            liveUrl={url}
            className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/tilt:scale-[1.025]"
          />
        </div>
      </figure>
    </Tilt>
  );
}

/** Phone outline around a mobile screenshot (cropped to the viewport). */
export function PhoneFrame({ shot, alt, className = "", sizes = "(min-width: 1024px) 18vw, 45vw" }: { shot: Shot; alt: string; className?: string; sizes?: string }) {
  return (
    <Tilt max={5} className="rounded-[2.1rem]">
      <figure className={`relative rounded-[2.1rem] bg-[#0f0f0f] p-[0.45rem] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.55)] ring-1 ring-white/10 ${className}`}>
        <div className="relative overflow-hidden rounded-[1.7rem]">
          <ShotImage
            shot={shot}
            alt={alt}
            sizes={sizes}
            className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover/tilt:scale-[1.03]"
          />
        </div>
      </figure>
    </Tilt>
  );
}
