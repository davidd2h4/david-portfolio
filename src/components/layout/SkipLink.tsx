"use client";

import { useLocale } from "@/i18n/locale";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a
      href="#main"
      className="fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm text-ivory transition-transform focus:translate-y-0"
    >
      {t.a11y.skip}
    </a>
  );
}
