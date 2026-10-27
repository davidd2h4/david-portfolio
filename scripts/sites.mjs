import { homedir } from "node:os";

export const CHROMIUM_PATH =
  process.env.CHROMIUM_PATH ??
  `${homedir()}/Library/Caches/ms-playwright/chromium-1140/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;

export const SITES = [
  { slug: "aeris-flights", url: "https://aeris-flights.vercel.app/" },
  { slug: "living-interior", url: "https://living-interior-4d.vercel.app/" },
  { slug: "nexora-crm", url: "https://nexora-crm-two-phi.vercel.app/" },
  { slug: "nori-sushi", url: "https://nori-sushi-delivery.vercel.app/" },
  { slug: "noir-restaurant", url: "https://noir-restaurant.vercel.app/" },
  { slug: "nova-detailing", url: "https://nova-deteiling.vercel.app/" },
  { slug: "coffee-studio", url: "https://coffee-studio-delta.vercel.app/" },
];
