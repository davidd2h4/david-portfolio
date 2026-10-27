/**
 * Central site configuration. Contact details live here and nowhere else.
 *
 * CONTACT_EMAIL is the public address shown next to the contact form and used
 * by the mailto links. NEXT_PUBLIC_CONTACT_EMAIL overrides it. (The inbox that
 * receives form messages is the server-only CONTACT_EMAIL env variable.)
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "davidwork2184@gmail.com";

export const SITE_NAME = "DAVID";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export function mailtoHref(subject: string) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
