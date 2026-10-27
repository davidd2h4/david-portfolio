import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { TransitionLink } from "@/components/motion/TransitionLink";

type Variant = "solid" | "outline" | "ghost" | "signal";
type Tone = "light" | "dark";

const base =
  "group/btn relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-full px-6 text-[0.95rem] font-medium tracking-[-0.01em] transition-[color,background-color,border-color,scale] duration-500 ease-[var(--ease-out-expo)] select-none active:scale-[0.96]";

function styles(variant: Variant, tone: Tone) {
  if (variant === "signal") return "bg-signal text-ivory hover:bg-ink";
  if (variant === "solid") return tone === "dark" ? "bg-ivory text-ink hover:bg-signal hover:text-ivory" : "bg-ink text-ivory hover:bg-signal";
  if (variant === "outline")
    return tone === "dark"
      ? "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink"
      : "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory";
  return tone === "dark" ? "px-0 text-ivory" : "px-0 text-ink";
}

/** Text that rolls up to a copy of itself on hover. */
function Roll({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-y-0">
        {children}
      </span>
    </span>
  );
}

type Common = { children: ReactNode; variant?: Variant; tone?: Tone; className?: string; cursor?: string };

export function ExternalButton({ href, children, variant = "solid", tone = "light", className = "", label, cursor }: Common & { href: string; label?: string }) {
  return (
    <Magnetic>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-cursor={cursor} className={`${base} ${styles(variant, tone)} ${className}`}>
        <Roll>{children}</Roll>
        <ArrowUpRight aria-hidden className="size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </a>
    </Magnetic>
  );
}

export function LinkButton({ href, children, variant = "solid", tone = "light", className = "", cursor, label }: Common & { href: string; label?: string }) {
  return (
    <Magnetic>
      <TransitionLink href={href} aria-label={label} data-cursor={cursor} className={`${base} ${styles(variant, tone)} ${className}`}>
        <Roll>{children}</Roll>
        <ArrowRight aria-hidden className="size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-1" />
      </TransitionLink>
    </Magnetic>
  );
}

export function MailButton({ href, children, variant = "solid", tone = "light", className = "" }: Common & { href: string }) {
  return (
    <Magnetic>
      <a href={href} className={`${base} ${styles(variant, tone)} ${className}`}>
        <Roll>{children}</Roll>
        <ArrowUpRight aria-hidden className="size-4 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
      </a>
    </Magnetic>
  );
}
