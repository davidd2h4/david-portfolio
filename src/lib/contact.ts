/** Contact form fields and validation, shared by the form and the API route. */

export const PROJECT_TYPES = [
  { id: "website", en: "Website", uk: "Вебсайт" },
  { id: "ecommerce", en: "E-commerce", uk: "E-commerce" },
  { id: "portfolio", en: "Portfolio", uk: "Портфоліо" },
  { id: "webapp", en: "Web Application", uk: "Вебзастосунок" },
  { id: "other", en: "Other", uk: "Інше" },
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number]["id"];

export type ContactPayload = { name: string; email: string; type: ProjectType | ""; message: string };
export type ContactField = keyof ContactPayload;
export type ContactError = "required" | "email" | "tooLong" | "tooShort";

export const LIMITS = { name: 100, email: 200, message: 5000 } as const;
export const MIN_MESSAGE = 10;

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

/** Strips control characters (keeps line breaks in the message). */
const clean = (v: unknown, multiline = false) =>
  String(v ?? "")
    .replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "")
    .trim();

export function validateContact(raw: Record<string, unknown>):
  | { ok: true; data: ContactPayload }
  | { ok: false; errors: Partial<Record<ContactField, ContactError>> } {
  const data: ContactPayload = {
    name: clean(raw.name),
    email: clean(raw.email),
    type: PROJECT_TYPES.some((t) => t.id === raw.type) ? (raw.type as ProjectType) : "",
    message: clean(raw.message, true),
  };
  const errors: Partial<Record<ContactField, ContactError>> = {};
  if (!data.name) errors.name = "required";
  else if (data.name.length > LIMITS.name) errors.name = "tooLong";
  if (!data.email) errors.email = "required";
  else if (data.email.length > LIMITS.email || !EMAIL.test(data.email)) errors.email = "email";
  if (!data.message) errors.message = "required";
  else if (data.message.length < MIN_MESSAGE) errors.message = "tooShort";
  else if (data.message.length > LIMITS.message) errors.message = "tooLong";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
