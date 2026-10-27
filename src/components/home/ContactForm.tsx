"use client";

import { ArrowUpRight, Check, ChevronDown, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LIMITS, PROJECT_TYPES, validateContact, type ContactError, type ContactField, type ProjectType } from "@/lib/contact";
import { useLocale } from "@/i18n/locale";

type Status = "idle" | "sending" | "sent" | "failed";
type Failure = "network" | "send_failed" | "not_configured" | "rate_limited" | "too_fast" | "invalid";

/** Text input or textarea with a label that floats up on focus or when filled. */
function Field({
  id,
  label,
  hint,
  error,
  multiline = false,
  ...input
}: {
  id: string;
  label: string;
  hint: string;
  error?: string;
  multiline?: boolean;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  const { value, onChange, placeholder, ...rest } = input;
  const common = {
    id,
    value,
    placeholder: placeholder ?? " ",
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    className:
      "peer block w-full resize-none border-0 border-b bg-transparent px-0 pb-3 pt-7 text-lg text-ivory outline-none transition-colors duration-500 placeholder:text-transparent focus:placeholder:text-ivory/30 " +
      (error ? "border-[#f0a08f]" : "border-ivory/20 focus:border-ivory"),
    ...rest,
  };
  return (
    <div className="relative">
      {multiline ? <textarea rows={4} {...common} /> : <input {...common} />}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-0 top-7 origin-left text-lg text-ivory/55 transition-all duration-500 ease-[var(--ease-out-expo)] peer-focus:top-0 peer-focus:scale-[0.72] peer-focus:text-signal-soft peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.72]"
      >
        {label} <span className="text-ivory/35">· {hint}</span>
      </label>
      {/* Line that draws across on focus. */}
      <span aria-hidden className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-signal-soft transition-transform duration-700 ease-[var(--ease-out-expo)] peer-focus:scale-x-100" />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#f0a08f] [animation:field-in_0.4s_var(--ease-out-expo)]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Accessible single-select dropdown (button + listbox) with an animated panel. */
function TypeSelect({ value, onChange }: { value: ProjectType | ""; onChange: (v: ProjectType) => void }) {
  const { t, locale } = useLocale();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = PROJECT_TYPES.find((p) => p.id === value);

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const close = (e: PointerEvent) => {
      if (!list.current?.parentElement?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  function openList() {
    setActive(Math.max(0, PROJECT_TYPES.findIndex((p) => p.id === value)));
    setOpen(true);
  }
  function choose(i: number) {
    onChange(PROJECT_TYPES[i].id);
    setOpen(false);
    button.current?.focus();
  }
  function onListKey(e: KeyboardEvent) {
    if (e.key === "ArrowDown") setActive((a) => Math.min(PROJECT_TYPES.length - 1, a + 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(PROJECT_TYPES.length - 1);
    else if (e.key === "Enter" || e.key === " ") choose(active);
    else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
      if (e.key === "Escape") button.current?.focus();
      return;
    } else return;
    e.preventDefault();
  }

  return (
    <div className="relative">
      <span id={`${id}-label`} className="block origin-left scale-[0.72] text-lg text-ivory/55">
        {t.contact.form.type} <span className="text-ivory/35">· {t.contact.form.optional}</span>
      </span>
      <button
        ref={button}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-value`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openList();
          }
        }}
        className="group flex w-full items-center justify-between border-b border-ivory/20 pb-3 pt-1 text-left text-lg transition-colors duration-500 hover:border-ivory/60 focus-visible:border-ivory"
      >
        <span id={`${id}-value`} className={selected ? "text-ivory" : "text-ivory/35"}>
          {selected ? selected[locale] : t.contact.form.typePlaceholder}
        </span>
        <ChevronDown aria-hidden className={`size-4 text-ivory/60 transition-transform duration-500 ease-[var(--ease-out-expo)] ${open ? "rotate-180" : ""}`} />
      </button>
      <ul
        ref={list}
        role="listbox"
        tabIndex={-1}
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onKeyDown={onListKey}
        className={`absolute inset-x-0 top-full z-20 mt-2 origin-top overflow-hidden rounded-xl border border-ivory/15 bg-[#1b1b1b] py-2 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] outline-none duration-400 ease-[var(--ease-out-expo)] ${
          // Visible at once when opening (so it can take focus); hidden only after the fade on close.
          open ? "visible translate-y-0 scale-100 opacity-100 transition-[opacity,transform]" : "invisible -translate-y-2 scale-[0.97] opacity-0 transition-[opacity,transform,visibility]"
        }`}
      >
        {PROJECT_TYPES.map((p, i) => (
          <li
            key={p.id}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={p.id === value}
            onPointerEnter={() => setActive(i)}
            onClick={() => choose(i)}
            style={{ transitionDelay: open ? `${i * 35}ms` : "0ms" }}
            className={`flex cursor-pointer items-center justify-between px-5 py-3 text-base transition-[background-color,opacity,transform] duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            } ${i === active ? "bg-ivory/[0.07] text-ivory" : "text-ivory/75"}`}
          >
            {p[locale]}
            {p.id === value && <Check aria-hidden className="size-4 text-signal-soft" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContactForm({ mailto, email }: { mailto: string; email: string }) {
  const { t } = useLocale();
  const f = t.contact.form;
  const [values, setValues] = useState({ name: "", email: "", type: "" as ProjectType | "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<ContactField, ContactError>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<Failure | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const set = (k: keyof typeof values) => (v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k as ContactField]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const check = validateContact(values);
    if (!check.ok) {
      setErrors(check.errors);
      const first = (["name", "email", "message"] as const).find((k) => check.errors[k]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    setFailure(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...check.data, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: Failure; fields?: typeof errors };
      // Success is shown only when the server confirms the message was sent.
      if (res.ok && data.ok) {
        setStatus("sent");
      } else {
        if (data.fields) setErrors(data.fields);
        setFailure(data.error && data.error in f.failed ? data.error : "send_failed");
        setStatus("failed");
      }
    } catch {
      setFailure("network");
      setStatus("failed");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  function reset() {
    setValues({ name: "", email: "", type: "", message: "" });
    setErrors({});
    setStatus("idle");
    setFailure(null);
    startedAt.current = Date.now();
  }

  if (status === "sent") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex flex-col items-start gap-6 outline-none [animation:field-in_0.7s_var(--ease-out-expo)]">
        <span className="grid size-16 place-items-center rounded-full bg-signal text-ivory [animation:pop-in_0.7s_var(--ease-out-expo)]">
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7.5" className="[stroke-dasharray:24] [stroke-dashoffset:24] [animation:draw-check_0.6s_0.25s_var(--ease-out-expo)_forwards]" />
          </svg>
        </span>
        <p className="max-w-lg text-2xl leading-snug tracking-[-0.02em] text-ivory sm:text-3xl">{f.success}</p>
        <button type="button" onClick={reset} className="link-draw text-ivory/70 hover:text-ivory">
          {f.another}
        </button>
      </div>
    );
  }

  const err = (k: ContactField) => (errors[k] ? f.errors[errors[k]!] : undefined);
  const sending = status === "sending";

  return (
    <form noValidate onSubmit={submit} aria-busy={sending} className="flex flex-col gap-9">
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
        </label>
      </div>

      <div className="grid gap-9 sm:grid-cols-2">
        <Field id="contact-name" label={f.name} hint={f.required} autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={set("name")} error={err("name")} />
        <Field id="contact-email" label={f.email} hint={f.required} type="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={set("email")} error={err("email")} />
      </div>
      <TypeSelect value={values.type} onChange={set("type")} />
      <Field id="contact-message" label={f.message} hint={f.required} multiline maxLength={LIMITS.message} placeholder={f.messagePlaceholder} value={values.message} onChange={set("message")} error={err("message")} />

      {status === "failed" && failure && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="flex flex-col gap-3 rounded-xl border border-[#f0a08f]/40 bg-[#f0a08f]/[0.07] p-5 text-[#f6c3b7] outline-none [animation:field-in_0.5s_var(--ease-out-expo)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed">{f.failed[failure]}</p>
          {failure !== "invalid" && (
            <a href={mailto} className="link-draw shrink-0 text-sm text-ivory">
              {email || t.contact.cta}
            </a>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={sending}
          className="group/btn relative inline-flex min-h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-ivory px-8 text-lg font-medium tracking-[-0.01em] text-ink transition-[background-color,color,transform] duration-500 ease-[var(--ease-out-expo)] hover:bg-signal hover:text-ivory active:scale-[0.97] disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            <>
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {f.sending}
            </>
          ) : (
            <>
              {status === "failed" ? <RotateCcw aria-hidden className="size-4" /> : null}
              {status === "failed" ? f.retry : f.send}
              {status !== "failed" && <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />}
            </>
          )}
        </button>
        <span className="sr-only" role="status">
          {sending ? f.sending : ""}
        </span>
      </div>
    </form>
  );
}
