"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import type { Shot } from "@/data/projects";
import { useLocale } from "@/i18n/locale";

/**
 * Project screenshot with honest loading and error states: a placeholder sits
 * behind the image while it loads, and a failed file shows a visible message
 * (with the live-site link) instead of an empty block.
 */
export function ShotImage({ shot, alt, sizes, priority = false, className = "", liveUrl }: { shot: Shot; alt: string; sizes: string; priority?: boolean; className?: string; liveUrl?: string }) {
  const { t } = useLocale();
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

  if (state === "error") {
    return (
      <div role="img" aria-label={alt} className="flex flex-col items-center justify-center gap-3 bg-[#2a2a2a] p-6 text-center text-ivory/70" style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
        <ImageOff aria-hidden className="size-6" />
        <p className="text-sm">{t.media.unavailable}</p>
        {liveUrl && (
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="link-draw text-sm text-ivory">
            {t.work.live}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${state === "loading" ? "animate-pulse bg-[#d9d4ca]/40" : ""}`} style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
      <Image
        src={shot.src}
        width={shot.width}
        height={shot.height}
        alt={alt}
        sizes={sizes}
        priority={priority}
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
        className={`block h-auto w-full ${className}`}
      />
    </div>
  );
}
