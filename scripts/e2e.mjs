// Browser checks for the portfolio. Start the app first (`npm run build && npm start`
// or `npm run dev`), then: E2E_BASE=http://localhost:3000 npm run e2e
// Optional: E2E_SHOTS=<dir> saves review screenshots.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";
import { CHROMIUM_PATH } from "./sites.mjs";

const BASE = process.env.E2E_BASE ?? "http://localhost:3000";
const SHOTS = process.env.E2E_SHOTS ?? "";
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const SLUGS = ["aeris-flights", "living-interior", "nexora-crm", "nori-sushi", "noir-restaurant", "nova-detailing", "coffee-studio"];
const LIVE = {
  "aeris-flights": "https://aeris-flights.vercel.app/",
  "living-interior": "https://living-interior-4d.vercel.app/",
  "nexora-crm": "https://nexora-crm-two-phi.vercel.app/",
  "nori-sushi": "https://nori-sushi-delivery.vercel.app/",
  "noir-restaurant": "https://noir-restaurant.vercel.app/",
  "nova-detailing": "https://nova-deteiling.vercel.app/",
  "coffee-studio": "https://coffee-studio-delta.vercel.app/",
};
const ROUTES = ["/", ...SLUGS.map((s) => `/work/${s}`)];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1280, 1440, 1920];

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) failures++;
};

const browser = await chromium.launch({ executablePath: CHROMIUM_PATH });

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.7) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
}

// ---------- Routes: status, console errors, images, headings ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(90000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  for (const route of ROUTES) {
    errors.length = 0;
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    ok(res?.status() === 200, `${route} responds 200`);
    await scrollThrough(page);
    const h1 = await page.locator("h1").count();
    ok(h1 === 1, `${route} has exactly one h1 (${h1})`);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src));
    ok(broken.length === 0, `${route} has no broken images ${broken.join(", ")}`);
    ok(errors.length === 0, `${route} has no console errors ${errors.join(" | ")}`);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/desktop${route === "/" ? "-home" : route.replaceAll("/", "-")}.png`, fullPage: true });
  }

  // ---------- Links ----------
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => ({ href: a.getAttribute("href"), target: a.target, rel: a.rel })));
  for (const slug of SLUGS) {
    ok(links.some((l) => l.href === `/work/${slug}`), `home links to /work/${slug}`);
    const ext = links.filter((l) => l.href === LIVE[slug]);
    ok(ext.length > 0 && ext.every((l) => l.target === "_blank" && l.rel.includes("noopener")), `home links to live ${LIVE[slug]} in a new tab`);
  }
  const anchors = [...new Set(links.map((l) => l.href).filter((h) => h.startsWith("/#")))];
  for (const a of anchors) ok((await page.locator(a.slice(1)).count()) === 1, `anchor ${a} exists`);
  ok(links.some((l) => l.href.startsWith("mailto:")), "contact has a mailto link");

  for (const slug of SLUGS) {
    await page.goto(`${BASE}/work/${slug}`, { waitUntil: "networkidle" });
    const live = await page.locator(`a[href="${LIVE[slug]}"]`).count();
    ok(live >= 1, `/work/${slug} has the live website button`);
    const next = SLUGS[(SLUGS.indexOf(slug) + 1) % SLUGS.length];
    ok((await page.locator(`a[href="/work/${next}"]`).count()) >= 1, `/work/${slug} links to next project ${next}`);
  }
  const missing = await page.goto(`${BASE}/work/does-not-exist`);
  ok(missing?.status() === 404, "unknown case study returns 404");

  // ---------- Language switch ----------
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Українська" }).first().click();
  await page.waitForTimeout(400);
  ok((await page.locator("html").getAttribute("lang")) === "uk", "switching to UA sets html lang");
  ok(await page.getByText("Переглянути роботи").first().isVisible(), "hero button is translated");
  await page.goto(`${BASE}/work/nexora-crm`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  ok(await page.getByText("Перевірений функціонал").first().isVisible(), "language persists to case study");
  const englishLeft = await page.evaluate(() => {
    const words = ["View Live Website", "Explore Case Study", "Verified functionality", "Next project", "All work"];
    const text = document.body.innerText;
    return words.filter((w) => text.includes(w));
  });
  ok(englishLeft.length === 0, `no English UI strings in UA mode ${englishLeft.join(", ")}`);
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/uk-case.png` });
  await page.getByRole("button", { name: "English" }).first().click();
  await page.waitForTimeout(300);
  ok((await page.locator("html").getAttribute("lang")) === "en", "switching back to EN");

  // ---------- Keyboard ----------
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
  ok(first === "Skip to content", `first Tab focuses the skip link (${first})`);
  await ctx.close();
}

// ---------- Contact form ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  page.setDefaultTimeout(30000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const SUCCESS = "Thank you! Your message has been sent successfully. I'll get back to you soon.";
  const form = page.locator("#contact form");
  const open = async () => {
    await page.goto(`${BASE}/?t=${Date.now()}`, { waitUntil: "networkidle" });
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  };
  const fill = async () => {
    await page.getByLabel(/^Name/).fill("Test Visitor");
    await page.getByLabel(/^Email/).fill("visitor@example.com");
    await page.getByRole("button", { name: /Project type/ }).click();
    await page.getByRole("option", { name: "E-commerce" }).click();
    await page.getByLabel(/^Message/).fill("Hello, I would like a new store design.");
    await page.waitForTimeout(2600); // past the server's minimum fill time
  };

  await open();
  ok((await page.locator('a[href^="mailto:davidwork2184@gmail.com"]').count()) > 0, "mailto link to davidwork2184@gmail.com is kept");
  await form.getByRole("button", { name: "Send Message" }).click();
  ok((await form.locator('[aria-invalid="true"]').count()) === 3, "empty submit marks name, email and message invalid");
  await page.getByLabel(/^Email/).fill("not-an-email");
  await form.getByRole("button", { name: "Send Message" }).click();
  ok(await page.getByText("Please enter a valid email address.").isVisible(), "invalid email is explained");

  // Dropdown: keyboard selection.
  const select = page.getByRole("button", { name: /Project type/ });
  await select.focus();
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(300);
  ok(await page.getByRole("listbox").isVisible(), "project type dropdown opens with the keyboard");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  ok((await select.innerText()).includes("E-commerce"), "keyboard selection picks the next option");

  // Without RESEND_API_KEY the server refuses honestly: no success message.
  await open();
  await fill();
  await form.getByRole("button", { name: "Send Message" }).click();
  await page.waitForTimeout(1500);
  const unconfigured = await form.getByRole("alert").innerText().catch(() => "");
  ok(!(await page.getByText(SUCCESS).isVisible()), "no success message without a confirmed send");
  ok(unconfigured.length > 0 && (await page.getByRole("button", { name: "Try again" }).isVisible()), `failure shows an error and a retry button (${unconfigured.slice(0, 60)})`);

  // Server failure → error + retry; then a confirmed send → success.
  let reply = { status: 502, body: { ok: false, error: "send_failed" } };
  await page.route("**/api/contact", (r) => r.fulfill({ status: reply.status, contentType: "application/json", body: JSON.stringify(reply.body) }));
  await open();
  await fill();
  await form.getByRole("button", { name: "Send Message" }).click();
  await page.waitForTimeout(600);
  ok(await page.getByText("The message couldn’t be sent right now.", { exact: false }).isVisible(), "send failure is explained");
  reply = { status: 200, body: { ok: true } };
  await form.getByRole("button", { name: "Try again" }).click();
  await page.waitForTimeout(800);
  ok(await page.getByText(SUCCESS).isVisible(), "confirmed send shows the success message");
  await page.unroute("**/api/contact");

  // Ukrainian copy for the form.
  await page.evaluate(() => localStorage.setItem("david-locale", "uk"));
  await open();
  ok(await page.locator("#contact").getByRole("button", { name: "Надіслати повідомлення" }).isVisible(), "form is translated to Ukrainian");
  await page.evaluate(() => localStorage.removeItem("david-locale"));
  ok(errors.length === 0, `no page errors in the form flow ${errors.join(" | ")}`);

  // API directly.
  const post = (data) => page.request.post(BASE + "/api/contact", { data, headers: { "x-forwarded-for": `203.0.113.${Math.floor(Math.random() * 250)}` } });
  const old = Date.now() - 10000;
  ok((await post({ name: "", email: "x", message: "", startedAt: old })).status() === 400, "API rejects invalid input with 400");
  ok((await post({ name: "A", email: "a@b.co", message: "Hello there friend", startedAt: Date.now() })).status() === 429, "API refuses instant submissions");
  const bot = await post({ name: "A", email: "a@b.co", message: "Hello there friend", startedAt: old, website: "spam" });
  ok(bot.status() === 200, "API quietly drops honeypot submissions");
  ok((await page.request.get(BASE + "/api/contact")).status() === 405, "API only accepts POST");
  await ctx.close();
}

// ---------- Responsive: no horizontal overflow, no clipped text (both languages) ----------
for (const [width, lang] of WIDTHS.flatMap((w) => [[w, "en"], [w, "uk"]])) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768 });
  if (lang === "uk") await ctx.addInitScript(() => localStorage.setItem("david-locale", "uk"));
  const page = await ctx.newPage();
  page.setDefaultTimeout(90000);
  for (const route of ["/", "/work/aeris-flights", "/work/living-interior"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await scrollThrough(page);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(overflow <= 0, `${route} @${width}px ${lang} no horizontal overflow (${overflow}px)`);
    // Text or controls pushed past the viewport edge (even inside overflow:hidden).
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll("main p, main h1, main h2, main h3, main a, main button, main li")]
        .filter((el) => !el.closest("[aria-hidden='true'], .marquee-track, [data-frame]") && el.getClientRects().length)
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
        })
        .map((el) => el.textContent.trim().slice(0, 40)),
    );
    ok(clipped.length === 0, `${route} @${width}px ${lang} no clipped text ${clipped.slice(0, 3).join(" | ")}`);
    if (SHOTS && (width === 390 || width === 768) && route === "/") await page.screenshot({ path: `${SHOTS}/w${width}-${lang}-home.png`, fullPage: true });
  }
  if (width === 390 && lang === "en") {
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.waitForTimeout(900);
    ok(await page.locator("#mobile-menu").isVisible(), "mobile menu opens");
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/w390-menu.png` });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    ok(!(await page.locator("#mobile-menu").isVisible()), "mobile menu closes with Escape");

    // Real taps: every menu item closes the menu and brings its section into view.
    await page.waitForTimeout(1500);
    const burger = page.locator('[aria-controls="mobile-menu"]');
    for (const [label, id] of [["Work", "work"], ["About", "about"], ["Services", "services"], ["Contact", "contact"], ["Start a Project", "contact"]]) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await burger.tap();
      await page.waitForTimeout(900);
      await page.locator("#mobile-menu").getByRole("link", { name: new RegExp(`${label}$`) }).first().tap();
      await page.waitForTimeout(2200);
      const top = await page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
      const menuOpen = await page.locator("#mobile-menu").isVisible();
      ok(!menuOpen && Math.abs(top) < 80, `tap "${label}" in the mobile menu scrolls to #${id} (top ${top}px) and closes the menu`);
    }
    // After scrolling down the menu button stays reachable and opens on the first tap.
    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(800);
    await burger.tap({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(800);
    ok(await page.locator("#mobile-menu").isVisible(), "menu button works after scrolling down");
    await burger.tap();
    await page.waitForTimeout(800);
    ok(!(await page.locator("#mobile-menu").isVisible()), "menu closes with the X button on the first tap");
  }
  await ctx.close();
}

// ---------- Reduced motion: content visible without animation ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal],[data-hero-fade]")].filter((e) => getComputedStyle(e).opacity === "0").length);
  ok(hidden === 0, `reduced motion: no hidden reveal elements (${hidden})`);
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
