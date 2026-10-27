// Fails if any project screenshot is missing, unreadable, mis-sized against
// src/data/shots.json, or blank (a near-uniform image such as an all-black
// frame from a failed capture). Usage: npm run check:media
import sharp from "sharp";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("..", import.meta.url).pathname;
const MIN_DETAIL = 12;
const manifest = JSON.parse(readFileSync(`${ROOT}src/data/shots.json`, "utf8"));
const projects = readFileSync(`${ROOT}src/data/projects.ts`, "utf8");

let failures = 0;
for (const [site, shots] of Object.entries(manifest)) {
  for (const [name, s] of Object.entries(shots)) {
    const file = `${ROOT}public${s.src}`;
    let problem = "";
    if (!existsSync(file)) problem = "file missing";
    else {
      try {
        const meta = await sharp(file).metadata();
        const { channels } = await sharp(file).stats();
        const d = channels.slice(0, 3).reduce((a, c) => a + c.stdev, 0) / 3;
        if (meta.width !== s.width || meta.height !== s.height) problem = `size ${meta.width}×${meta.height} ≠ manifest ${s.width}×${s.height}`;
        else if (d < MIN_DETAIL) problem = `blank image (detail ${d.toFixed(1)})`;
      } catch (e) {
        problem = `unreadable: ${e.message}`;
      }
    }
    console.log(`${problem ? "✗" : "✓"} ${site}/${name}${problem ? " — " + problem : ""}`);
    if (problem) failures++;
  }
}
// Every screenshot key referenced by projects.ts must exist in the manifest.
for (const m of projects.matchAll(/shotsKey: "([\w-]+)"[\s\S]*?hero: "([\w-]+)",\s*long: "([\w-]+)",\s*gallery: \[([\s\S]*?)\],\s*mobile: \[([\s\S]*?)\]/g)) {
  const [, site, hero, long, gallery, mobile] = m;
  const keys = [hero, long, ...[...gallery.matchAll(/key: "([\w-]+)"/g), ...mobile.matchAll(/key: "([\w-]+)"/g)].map((k) => k[1])];
  for (const k of keys) {
    if (!manifest[site]?.[k]) {
      console.log(`✗ ${site}/${k} — referenced in projects.ts but not in shots.json`);
      failures++;
    }
  }
}
console.log(failures ? `\n${failures} media problem(s)` : "\nAll media OK");
process.exit(failures ? 1 : 0);
