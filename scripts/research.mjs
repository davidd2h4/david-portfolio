// Visits each live project and records its visible structure (headings, nav,
// buttons, landmarks) so case-study copy is based on what actually exists.
// Usage: node scripts/research.mjs <outDir>
import { chromium } from "playwright-core";
import { writeFileSync, mkdirSync } from "node:fs";
import { CHROMIUM_PATH, SITES } from "./sites.mjs";

const out = process.argv[2] ?? "research";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROMIUM_PATH });

for (const site of SITES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US" });
  const page = await ctx.newPage();
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(2500);
    const info = await page.evaluate(() => {
      const txt = (el) => (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
      const q = (s) => [...document.querySelectorAll(s)];
      return {
        title: document.title,
        lang: document.documentElement.lang,
        description: document.querySelector('meta[name="description"]')?.content ?? "",
        headings: q("h1,h2,h3").map((h) => `${h.tagName}: ${txt(h)}`).filter((s) => s.length > 4).slice(0, 80),
        links: [...new Set(q("a[href]").map((a) => `${txt(a)} -> ${a.getAttribute("href")}`))].slice(0, 80),
        buttons: [...new Set(q("button").map(txt).filter(Boolean))].slice(0, 60),
        inputs: q("input,select,textarea").map((i) => `${i.tagName}[${i.type || ""}] ${i.getAttribute("aria-label") || i.placeholder || i.name || ""}`).slice(0, 40),
        bodyText: txt(document.body).slice(0, 6000),
      };
    });
    writeFileSync(`${out}/${site.slug}.json`, JSON.stringify(info, null, 2));
    console.log(`✓ ${site.slug}: ${info.title}`);
  } catch (e) {
    console.log(`✗ ${site.slug}: ${e.message}`);
  }
  await ctx.close();
}
await browser.close();
