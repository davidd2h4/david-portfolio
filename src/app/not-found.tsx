"use client";

import { LinkButton } from "@/components/ui/Button";
import { useLocale } from "@/i18n/locale";

export default function NotFound() {
  const { t } = useLocale();
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-[var(--header-h)]">
      <p className="eyebrow text-ink/50">404</p>
      <h1 className="display-lg mt-6 max-w-4xl">{t.notFound.title}</h1>
      <p className="mt-6 max-w-md text-lg text-graphite">{t.notFound.text}</p>
      <div className="mt-10">
        <LinkButton href="/">{t.notFound.back}</LinkButton>
      </div>
    </section>
  );
}
