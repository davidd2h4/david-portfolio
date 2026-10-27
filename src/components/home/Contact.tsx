"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { MailButton } from "@/components/ui/Button";
import { ContactForm } from "./ContactForm";
import { CONTACT_EMAIL, mailtoHref } from "@/config/site";
import { useLocale } from "@/i18n/locale";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function Contact() {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !glow.current || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;
    const x = gsap.quickTo(glow.current, "x", { duration: 1.4, ease: "power3" });
    const y = gsap.quickTo(glow.current, "y", { duration: 1.4, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x(e.clientX - r.left);
      y(e.clientY - r.top);
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable: the mailto button still works */
    }
  }

  return (
    <section ref={root} id="contact" tabIndex={-1} aria-labelledby="contact-title" className="on-dark relative isolate overflow-hidden bg-night py-28 text-ivory outline-none sm:py-40">
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 size-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(47,61,230,0.35)_0%,rgba(17,17,17,0)_62%)]"
        style={{ transform: "translate(50vw, 40%)" }}
      />
      <div className="container-x">
        <Reveal>
          <p className="eyebrow text-ivory/50">{t.contact.eyebrow}</p>
        </Reveal>
        <RevealLines
          key={t.contact.line1}
          as="h2"
          id="contact-title"
          lines={[t.contact.line1, t.contact.line2, <em key="r" className="font-serif font-normal tracking-[-0.03em] text-signal-soft">{t.contact.line3}</em>]}
          lineClassName={(i) => (i === 0 ? "text-ivory/45" : undefined)}
          className="display-lg mt-8 max-w-[14ch]"
        />
        <div className="mt-14 grid gap-14 border-t border-ivory/15 pt-12 md:grid-cols-12 md:gap-10">
          <Reveal className="flex flex-col gap-10 md:col-span-4">
            <p className="max-w-md text-lg leading-relaxed text-ivory/70">{t.contact.text}</p>
            <div className="flex flex-col items-start gap-4">
              <p className="eyebrow text-ivory/45">{t.contact.orEmail}</p>
              <MailButton href={mailtoHref(t.contact.subject)} variant="outline" tone="dark">
                {t.contact.cta}
              </MailButton>
              {CONTACT_EMAIL && (
                <div className="flex items-center gap-3">
                  <a href={mailtoHref(t.contact.subject)} className="link-draw break-all text-ivory/85">
                    {CONTACT_EMAIL}
                  </a>
                  <button type="button" onClick={copy} aria-label={copied ? t.contact.copied : t.contact.copy} className="grid size-10 shrink-0 place-items-center rounded-full border border-ivory/20 transition-colors hover:bg-ivory hover:text-ink active:scale-90">
                    {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  </button>
                  <span role="status" className="sr-only">
                    {copied ? t.contact.copied : ""}
                  </span>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-7 md:col-start-6">
            <ContactForm mailto={mailtoHref(t.contact.subject)} email={CONTACT_EMAIL} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
