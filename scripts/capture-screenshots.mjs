// Captures authentic screenshots of the seven live projects and converts them
// to optimised WebP files in public/work/<slug>/. Also writes
// src/data/shots.json with the pixel size of every image for next/image.
//
// Usage: npm run shots            (all projects)
//        npm run shots -- noir-restaurant   (one project)
import { chromium } from "playwright-core";
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { CHROMIUM_PATH, SITES } from "./sites.mjs";

const ROOT = new URL("..", import.meta.url).pathname;
const MANIFEST = `${ROOT}src/data/shots.json`;

const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 };
const MOBILE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true };

// path: route on the live site. at: CSS selector scrolled to the top of the
// viewport before capture. long: capture a tall strip of the page.
const PLAN = {
  "aeris-flights": [
    { name: "home", path: "/" },
    { name: "home-long", path: "/", long: 3400 },
    { name: "results", path: "/search?type=roundtrip&from=WAW&to=LIS&depart=2026-11-17&adults=1&children=0&infants=0&cabin=economy&return=2026-11-24" },
    { name: "explore", path: "/explore" },
    { name: "m-home", path: "/", mobile: true },
    { name: "m-results", path: "/search?type=roundtrip&from=WAW&to=LIS&depart=2026-11-17&adults=1&children=0&infants=0&cabin=economy&return=2026-11-24", mobile: true },
  ],
  "living-interior": [
    { name: "home", path: "/" },
    { name: "home-long", path: "/", long: 3400 },
    { name: "collections", path: "/collections" },
    // WebGL pages go last: after one, later captures in the session can glitch.
    { name: "studio", path: "/studio?room=bedroom&layout=suite&style=scandinavian", wait: 9000 },
    { name: "m-home", path: "/", mobile: true },
    { name: "m-studio", path: "/studio?room=bedroom&layout=suite&style=scandinavian", mobile: true, wait: 9000 },
  ],
  "nexora-crm": [
    { name: "dashboard", path: "/" },
    { name: "pipeline", path: "/pipeline" },
    { name: "analytics", path: "/analytics" },
    { name: "dashboard-long", path: "/", long: 2600 },
    { name: "m-dashboard", path: "/", mobile: true },
    { name: "m-pipeline", path: "/pipeline", mobile: true },
  ],
  "nori-sushi": [
    { name: "home", path: "/" },
    { name: "home-long", path: "/", long: 3400 },
    { name: "menu", path: "/menu" },
    { name: "product", path: "/menu/set-nori" },
    { name: "m-home", path: "/", mobile: true },
    { name: "m-menu", path: "/menu", mobile: true },
  ],
  "noir-restaurant": [
    { name: "home", path: "/" },
    { name: "home-long", path: "/", long: 3400 },
    { name: "menu", path: "/menu" },
    { name: "reservations", path: "/reservations" },
    { name: "m-home", path: "/", mobile: true },
    { name: "m-reservations", path: "/reservations", mobile: true },
  ],
  "nova-detailing": [
    { name: "home", path: "/" },
    { name: "home-long", path: "/", long: 3400 },
    { name: "packages", path: "/", at: "#packages" },
    { name: "gallery", path: "/", at: "#gallery" },
    { name: "m-home", path: "/", mobile: true },
    { name: "m-booking", path: "/", at: "#booking", mobile: true },
  ],
  "coffee-studio": [
    { name: "home", path: "/" },
    { name: "home-long", path: "/", long: 3400 },
    { name: "menu", path: "/", at: "#menu" },
    { name: "gallery", path: "/", at: "#gallery" },
    { name: "m-home", path: "/", mobile: true },
    { name: "m-menu", path: "/", at: "#menu", mobile: true },
  ],
};

/** Switch the site to English where it offers a language toggle. */
async function toEnglish(page) {
  const en = page.getByRole("button", { name: /^EN$/ });
  if (await en.count()) {
    await en.first().click().catch(() => {});
    await page.waitForTimeout(1200);
    return;
  }
  // NEXORA: globe dropdown labelled "Мова" with an "English" item.
  const menu = page.getByRole("button", { name: /^(Мова|Language)$/ });
  if (await menu.count()) {
    await menu.first().click().catch(() => {});
    await page.waitForTimeout(400);
    await page.getByText("English", { exact: true }).first().click().catch(() => {});
    await page.waitForTimeout(1200);
  }
}

// Sites that keep the language in a cookie get it before the first request.
const LOCALE_COOKIES = { "aeris-flights": "aeris-locale", "living-interior": "living-locale" };
// Sites that keep the language in localStorage get it before any script runs.
const LOCALE_STORAGE = {
  "nori-sushi": ["nori-locale", JSON.stringify({ state: { locale: "en" }, version: 1 })],
  "coffee-studio": ["coffee-studio-lang", "en"],
};
// NEXORA's public demo does not persist the language, so navigate client-side.
const SPA = new Set(["nexora-crm"]);

/** Scroll through the page so reveal-on-scroll content is rendered. */
async function settle(page, to) {
  await page.evaluate(async (limit) => {
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < Math.min(limit, document.body.scrollHeight); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  }, to);
  await page.waitForTimeout(800);
}

/**
 * Full-page capture stitched from viewport slices taken while scrolling, so
 * content the site reveals on scroll is visible in every part of the image.
 * Fixed and sticky elements (headers) only appear in the first slice.
 */
async function stitched(page, maxHeight, dsf) {
  const vp = page.viewportSize();
  const docHeight = () => page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
  const total = Math.min(maxHeight, await docHeight());
  // Wheel input works with smooth-scroll libraries that undo programmatic jumps.
  await page.mouse.move(8, vp.height / 2);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  const slices = [];
  let last = -1;
  for (let i = 0; i < 20; i++) {
    const top = await page.evaluate(() => Math.round(window.scrollY));
    if (top === last || top >= total) break;
    last = top;
    if (i > 0) {
      await page.evaluate(() =>
        document.querySelectorAll("body *").forEach((el) => {
          const pos = getComputedStyle(el).position;
          if (pos === "fixed" || pos === "sticky") el.style.setProperty("visibility", "hidden", "important");
        }),
      );
    }
    slices.push({ input: await page.screenshot({ animations: "disabled", timeout: 90000 }), top: Math.round(top * dsf), left: 0 });
    if (top + vp.height >= total) break;
    // Wheel at the page edge first (centre elements such as maps can swallow it),
    // then PageDown, then a direct scroll as the last resort.
    for (const step of [
      () => page.mouse.wheel(0, vp.height * 0.9),
      () => page.keyboard.press("PageDown"),
      () => page.evaluate((h) => window.scrollBy(0, h), vp.height * 0.9),
    ]) {
      await step();
      await page.waitForTimeout(1600);
      if ((await page.evaluate(() => Math.round(window.scrollY))) > top) break;
    }
  }
  await page.evaluate(() => document.querySelectorAll("body *").forEach((el) => el.style.removeProperty("visibility")));
  const width = Math.round(vp.width * dsf);
  const height = Math.round(Math.min(total, last + vp.height) * dsf);
  const canvasH = Math.max(height, ...slices.map((sl) => sl.top + Math.round(vp.height * dsf)));
  const full = await sharp({ create: { width, height: canvasH, channels: 3, background: "#000" } }).composite(slices).png().toBuffer();
  return sharp(full).extract({ left: 0, top: 0, width, height }).png().toBuffer();
}

const only = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : undefined;
const longOnly = process.argv.includes("--long");
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};
const browser = await chromium.launch({ executablePath: CHROMIUM_PATH, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

for (const site of SITES) {
  if (only && site.slug !== only) continue;
  const dir = `${ROOT}public/work/${site.slug}`;
  mkdirSync(dir, { recursive: true });
  manifest[site.slug] ??= {};

  for (const mobile of [false, true]) {
    const ctx = await browser.newContext({ ...(mobile ? MOBILE : DESKTOP), locale: "en-US", reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    const origin = new URL(site.url).origin;
    if (LOCALE_COOKIES[site.slug]) await ctx.addCookies([{ name: LOCALE_COOKIES[site.slug], value: "en", url: origin }]);
    if (LOCALE_STORAGE[site.slug]) {
      await ctx.addInitScript(([k, v]) => {
        try {
          if (!localStorage.getItem(k)) localStorage.setItem(k, v);
        } catch {}
      }, LOCALE_STORAGE[site.slug]);
    }
    await page.goto(origin + "/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await toEnglish(page);

    for (const shot of PLAN[site.slug].filter((s) => !!s.mobile === mobile && (!longOnly || s.long))) {
      try {
        if (SPA.has(site.slug)) {
          await page.evaluate((p) => {
            history.pushState({}, "", p);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }, shot.path);
        } else {
          await page.goto(origin + shot.path, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
        }
        await page.waitForTimeout(shot.wait ?? 2000);
        await settle(page, shot.long ?? 2400);
        if (shot.click) {
          await page.getByText(shot.click, { exact: true }).first().click().catch(() => {});
          await page.waitForTimeout(shot.after ?? 3000);
        }
        if (shot.at) {
          await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
          }, shot.at);
          await page.waitForTimeout(900);
        }
        const png = shot.long
          ? await stitched(page, shot.long, (mobile ? MOBILE : DESKTOP).deviceScaleFactor)
          : await page.screenshot({ animations: "disabled", timeout: 90000 });
        const width = mobile ? 780 : shot.long ? 1440 : 2160;
        const out = `${dir}/${shot.name}.webp`;
        const info = await sharp(png).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out);
        manifest[site.slug][shot.name] = { src: `/work/${site.slug}/${shot.name}.webp`, width: info.width, height: info.height };
        console.log(`✓ ${site.slug}/${shot.name} ${info.width}×${info.height}`);
      } catch (e) {
        console.log(`✗ ${site.slug}/${shot.name}: ${e.message}`);
      }
    }
    await ctx.close();
  }
}

await browser.close();
mkdirSync(`${ROOT}src/data`, { recursive: true });
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
