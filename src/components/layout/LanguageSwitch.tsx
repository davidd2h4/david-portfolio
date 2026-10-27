"use client";

import { useLocale } from "@/i18n/locale";
import type { Locale } from "@/data/projects";

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "en", label: "EN", name: "English" },
  { value: "uk", label: "UA", name: "Українська" },
];

export function LanguageSwitch({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { locale, setLocale, t } = useLocale();
  return (
    <div role="group" aria-label={t.a11y.language} className={`flex items-center rounded-full p-0.5 ${tone === "dark" ? "bg-ivory/10" : "bg-ink/[0.06]"}`}>
      {OPTIONS.map((o) => {
        const active = o.value === locale;
        return (
          <button
            key={o.value}
            type="button"
            lang={o.value === "uk" ? "uk" : "en"}
            aria-pressed={active}
            aria-label={o.name}
            onClick={() => setLocale(o.value)}
            className={`eyebrow min-h-9 min-w-10 rounded-full px-2.5 transition-colors duration-300 ${
              active ? (tone === "dark" ? "bg-ivory text-ink" : "bg-ink text-ivory") : tone === "dark" ? "text-ivory/60 hover:text-ivory" : "text-ink/55 hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
