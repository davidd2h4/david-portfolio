"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { useLocale } from "@/i18n/locale";

/** Accordion list: one service open at a time; the first is open by default. */
export function Services() {
  const { t } = useLocale();
  const [open, setOpen] = useState(0);
  return (
    <section id="services" tabIndex={-1} aria-labelledby="services-title" className="on-dark bg-ink py-24 text-ivory outline-none sm:py-36">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <Reveal>
              <p className="eyebrow text-ivory/50">{t.services.eyebrow}</p>
            </Reveal>
            <RevealLines key={t.services.title} id="services-title" lines={[t.services.title]} className="display-md mt-6" />
          </div>
        </div>
        <Reveal as="ul" stagger={0.06} className="border-t border-ivory/15 lg:col-span-8">
          {t.services.items.map((s, i) => {
            const isOpen = open === i;
            const id = `service-${i}`;
            return (
              <li key={s.t} className="border-b border-ivory/15">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center gap-5 py-7 text-left sm:gap-8 sm:py-9"
                  >
                    <span className={`eyebrow w-8 shrink-0 transition-colors ${isOpen ? "text-signal-soft" : "text-ivory/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-[clamp(1.4rem,3vw,2.6rem)] font-medium leading-tight tracking-[-0.035em] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-2">
                      {s.t}
                    </span>
                    <span
                      className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)] ${
                        isOpen ? "rotate-45 border-ivory bg-ivory text-ink" : "border-ivory/25 group-hover:border-ivory"
                      }`}
                    >
                      <Plus className="size-4" aria-hidden />
                    </span>
                  </button>
                </h3>
                <div id={id} role="region" aria-label={s.t} className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden" inert={!isOpen}>
                    <div className="flex flex-col gap-6 pb-9 pl-13 sm:pl-16 md:flex-row md:items-end md:justify-between">
                      <p className="max-w-xl text-lg leading-relaxed text-ivory/70">{s.d}</p>
                      <ul className="flex flex-wrap gap-2">
                        {s.tags.map((tag) => (
                          <li key={tag} className="eyebrow rounded-full border border-ivory/20 px-3 py-2 text-ivory/70">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
