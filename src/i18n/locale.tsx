"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { L, Locale } from "@/data/projects";
import { dictionaries, type Dictionary } from "./dictionary";

const KEY = "david-locale";
const listeners = new Set<() => void>();
let current: Locale | null = null;

function stored(): Locale {
  try {
    return localStorage.getItem(KEY) === "uk" ? "uk" : "en";
  } catch {
    return "en";
  }
}

function read(): Locale {
  return (current ??= stored());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    current = stored();
    fn();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

type Ctx = { locale: Locale; t: Dictionary; setLocale: (l: Locale) => void; pick: (v: L) => string };
const LocaleContext = createContext<Ctx | null>(null);

/**
 * English is rendered on the server; a saved Ukrainian preference is applied
 * right after hydration and kept in localStorage (synced across tabs).
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, read, () => "en" as Locale);

  const setLocale = useCallback((l: Locale) => {
    current = l;
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
    listeners.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "uk" ? "uk" : "en";
  }, [locale]);

  const value = useMemo<Ctx>(
    () => ({ locale, t: dictionaries[locale], setLocale, pick: (v: L) => v[locale] }),
    [locale, setLocale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
