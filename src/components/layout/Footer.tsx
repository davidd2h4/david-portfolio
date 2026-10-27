"use client";

import { ArrowUp } from "lucide-react";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { projects } from "@/data/projects";
import { useLocale } from "@/i18n/locale";

export function Footer() {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-night text-ivory">
      <div className="container-x grid gap-12 border-t border-ivory/10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-2xl font-semibold tracking-[-0.05em]">
            DAVID<span className="text-signal-soft">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/55">{t.hero.kicker}</p>
        </div>
        <nav aria-label={t.nav.work} className="md:col-span-4">
          <p className="eyebrow mb-4 text-ivory/40">{t.nav.work}</p>
          <ul className="grid grid-cols-1 gap-2 text-sm xs:grid-cols-2">
            {projects.map((p) => (
              <li key={p.slug}>
                <TransitionLink href={`/work/${p.slug}`} className="link-draw text-ivory/75 hover:text-ivory">
                  {p.name}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Footer" className="md:col-span-2">
          <p className="eyebrow mb-4 text-ivory/40">DAVID</p>
          <ul className="space-y-2 text-sm">
            {[
              ["/#about", t.nav.about],
              ["/#services", t.nav.services],
              ["/#contact", t.nav.contact],
            ].map(([href, label]) => (
              <li key={href}>
                <TransitionLink href={href} className="link-draw text-ivory/75 hover:text-ivory">
                  {label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-start md:col-span-2 md:justify-end">
          <button type="button" onClick={() => scrollToTarget(0)} className="group inline-flex min-h-11 items-center gap-3 text-sm text-ivory/75 hover:text-ivory">
            {t.footer.top}
            <span className="grid size-10 place-items-center rounded-full border border-ivory/20 transition-colors group-hover:bg-ivory group-hover:text-ink">
              <ArrowUp className="size-4" aria-hidden />
            </span>
          </button>
        </div>
      </div>
      <div className="container-x flex flex-col gap-2 border-t border-ivory/10 py-6 text-xs text-ivory/40 sm:flex-row sm:justify-between">
        <p>
          © {year} DAVID. {t.footer.rights}
        </p>
        <p>{t.footer.built}</p>
      </div>
    </footer>
  );
}
