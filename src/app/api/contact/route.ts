import { NextResponse } from "next/server";
import { PROJECT_TYPES, validateContact, type ContactPayload } from "@/lib/contact";

/**
 * Contact form endpoint. Sends the message to CONTACT_EMAIL through Resend.
 *
 * Environment (server only, never exposed to the browser):
 *   RESEND_API_KEY  — Resend API key (required)
 *   CONTACT_EMAIL   — inbox that receives messages (required)
 *   RESEND_FROM     — verified sender, e.g. "DAVID Portfolio <hello@yourdomain.com>".
 *                     Defaults to Resend's test sender, which only delivers to the
 *                     email address of the Resend account owner.
 *
 * The visitor's address is used only as Reply-To, never as the sender.
 * Nothing is stored.
 */

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500;
const hits = new Map<string, number[]>();

/** Best-effort per-IP limit. On serverless it applies per instance. */
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(p: ContactPayload) {
  const type = PROJECT_TYPES.find((t) => t.id === p.type)?.en ?? "—";
  const rows: [string, string][] = [
    ["Name", p.name],
    ["Email", p.email],
    ["Project type", type],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${p.message}`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#171717">
<h2 style="font-size:18px;margin:0 0 16px">New message from the DAVID portfolio</h2>
<table style="border-collapse:collapse;margin-bottom:16px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b6862">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
<div style="white-space:pre-wrap;border-top:1px solid #d8d2c6;padding-top:16px">${escapeHtml(p.message)}</div>
</div>`;
  return { text, html };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  // Spam trap: a hidden field that people never see or fill. Bots get a
  // generic answer and nothing is sent.
  if (raw.website) return NextResponse.json({ ok: true });
  // A submit faster than a person can type is refused honestly, so a real
  // visitor (e.g. with autofill) is asked to retry instead of told it was sent.
  const startedAt = Number(raw.startedAt);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, error: "too_fast" }, { status: 429 });
  }

  const result = validateContact(raw);
  if (!result.ok) return NextResponse.json({ ok: false, error: "invalid", fields: result.errors }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_EMAIL is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const { text, html } = render(result.data);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "DAVID Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: result.data.email,
        subject: `Portfolio inquiry — ${result.data.name}`.slice(0, 150),
        text,
        html,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error("Contact form: Resend responded", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
  } catch (e) {
    console.error("Contact form: request to Resend failed", e);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
