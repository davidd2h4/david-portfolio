"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { lockScroll } from "@/components/motion/SmoothScroll";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useLocale } from "@/i18n/locale";
import { LanguageSwitch } from "./LanguageSwitch";

export function Header() {
  const { t } = useLocale();
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  // A menu link scrolls in the same tap, so the scroll lock must be released
  // right away, not in the effect after the re-render (Lenis ignores
  // scrollTo while stopped).
  const closeForNavigation = () => {
    lockScroll(false);
    setOpen(false);
  };
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  const links = [
    { href: "/#work", label: t.nav.work },
    { href: "/#about", label: t.nav.about },
    { href: "/#services", label: t.nav.services },
    { href: "/#contact", label: t.nav.contact },
  ];

  // Hide on scroll down, show on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > last + 2 ? true : y < last - 2 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    const el = menu.current;
    if (!el) return;
    if (open) {
      el.hidden = false;
      if (!prefersReducedMotion()) {
        gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" });
        gsap.fromTo(el.querySelectorAll("[data-menu-item]"), { yPercent: 110 }, { yPercent: 0, stagger: 0.06, delay: 0.25, duration: 1 });
      }
      el.querySelector<HTMLElement>("a")?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpenOn(null);
          toggle.current?.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    el.hidden = true;
  }, [open]);

  useEffect(() => () => lockScroll(false), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "translate-y-0 md:-translate-y-full" : "translate-y-0"
        } ${scrolled && !open ? "bg-ivory/80 shadow-[0_1px_0_rgba(23,23,23,0.08)] backdrop-blur-xl" : ""}`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <TransitionLink href="/" aria-label={t.a11y.home} className={`relative z-10 text-[1.35rem] font-semibold tracking-[-0.05em] ${open ? "text-ivory" : "text-ink"}`}>
            DAVID<span className="text-signal">.</span>
          </TransitionLink>

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <TransitionLink key={l.href} href={l.href} className="link-draw text-[0.95rem] text-ink/80 transition-colors hover:text-ink">
                {l.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitch tone={open ? "dark" : "light"} />
            </div>
            <TransitionLink
              href="/#contact"
              className="hidden min-h-10 items-center rounded-full bg-ink px-5 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-signal lg:inline-flex"
            >
              {t.nav.start}
            </TransitionLink>
            <button
              ref={toggle}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.menuClose : t.a11y.menuOpen}
              onClick={() => setOpen(!open)}
              className={`relative z-10 grid size-11 place-items-center rounded-full md:hidden ${open ? "bg-ivory text-ink" : "bg-ink text-ivory"}`}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" ref={menu} hidden className="on-dark fixed inset-0 z-40 bg-ink text-ivory md:hidden">
        <div className="container-x flex h-full flex-col justify-between pb-8 pt-[calc(var(--header-h)+2.5rem)]">
          <nav aria-label="Mobile">
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <span data-menu-item className="block">
                    <TransitionLink href={l.href} onClick={closeForNavigation} className="flex items-baseline gap-4 py-1 text-[clamp(2.6rem,13vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">
                      <span className="eyebrow text-ivory/40">0{i + 1}</span>
                      {l.label}
                    </TransitionLink>
                  </span>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-6">
            <TransitionLink href="/#contact" onClick={closeForNavigation} className="inline-flex min-h-12 items-center rounded-full bg-signal px-6 font-medium">
              {t.nav.start}
            </TransitionLink>
            <div className="flex items-center justify-between border-t border-ivory/15 pt-6">
              <span className="eyebrow text-ivory/50">{t.a11y.language}</span>
              <LanguageSwitch tone="dark" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
