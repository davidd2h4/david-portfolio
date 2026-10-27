# DAVID — Independent Creative Developer

Portfolio website presenting seven published projects, each with its own case study.
English by default, Ukrainian one click away.

## Stack

Next.js 16 (App Router, static generation) · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis (smooth scroll) · lucide-react · next/image

## Run locally

Requires Node.js 20.9+.

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
```

| Command | What it does |
| --- | --- |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Production build; prerenders `/` and all seven `/work/*` pages |
| `npm run e2e` | Browser checks against a running server (`E2E_BASE=http://localhost:3000`): status codes, console errors, broken images, links, language switch, keyboard skip link, mobile menu, reduced motion, and horizontal overflow / clipped text at 9 widths in both languages |
| `npm run shots` | Re-captures the project screenshots from the live sites into `public/work/` and updates `src/data/shots.json` (`npm run shots -- noir-restaurant` for one project) |

`e2e` and `shots` use Playwright with a local Chromium. Set `CHROMIUM_PATH` if yours is not in the default Playwright cache (`scripts/sites.mjs`).

## Contact form (Resend)

The form posts to `/api/contact`, which sends the message to `CONTACT_EMAIL` through
[Resend](https://resend.com). The visitor's address is set as **Reply-To** (never as the
sender), input is validated and escaped on the server, there is a honeypot field, a
minimum fill time and a per-IP rate limit, and nothing is stored. The visitor only sees
"sent" when Resend has accepted the email; otherwise they get an error, a retry button
and the mailto link.

| Variable | Where | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | server, secret | API key from resend.com → API Keys |
| `CONTACT_EMAIL` | server | `davidwork2184@gmail.com` |
| `RESEND_FROM` | server, optional | verified sender, e.g. `DAVID Portfolio <hello@yourdomain.com>` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | public, optional | address shown for mailto (defaults to `davidwork2184@gmail.com`) |
| `NEXT_PUBLIC_SITE_URL` | public, optional | custom domain for metadata |

### Setting up Resend

1. Sign up at [resend.com](https://resend.com) **with `davidwork2184@gmail.com`**.
2. Resend → **API Keys** → *Create API Key* (permission: *Sending access*). Copy it once.
3. Locally: create `.env.local` with `RESEND_API_KEY=...` and `CONTACT_EMAIL=davidwork2184@gmail.com`.
   On Vercel: Project → Settings → Environment Variables → add the same two, then redeploy.
4. That's enough to start: without `RESEND_FROM`, mail is sent from `onboarding@resend.dev`,
   which Resend delivers **only to the account owner's address** — i.e. to your Gmail.
5. Optional, for a branded sender: Resend → **Domains** → *Add Domain*, add the DNS records it
   shows at your domain registrar, wait for *Verified*, then set
   `RESEND_FROM=DAVID Portfolio <hello@yourdomain.com>` and redeploy.

Never commit `.env.local` — it is already in `.gitignore`.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new). Framework, build command and output are detected automatically.
3. Add `RESEND_API_KEY` and `CONTACT_EMAIL` (see above), optionally `RESEND_FROM` and `NEXT_PUBLIC_SITE_URL`.
4. Deploy.

## Editing content

- **Projects** (names, links, categories, descriptions, features, captions — EN + UA): `src/data/projects.ts`
- **Interface text** (EN + UA): `src/i18n/dictionary.ts`
- **Colours, type, spacing tokens**: `src/app/globals.css`
- **Screenshots**: `public/work/<project>/`, sizes in `src/data/shots.json`

## Structure

```
src/app            routes: / , /work/[slug], sitemap, robots, OG image, 404
src/components
  home/            hero, selected-work showcase, project index, about, services, contact
  case/            case study page
  layout/          header + mobile menu, language switch, footer, skip link
  motion/          smooth scroll, reveals, parallax/mask reveals, page curtain, cursor
  ui/              buttons, browser/phone frames, scroll-on-hover preview
src/data           projects + screenshot manifest
src/i18n           dictionaries + locale provider (choice saved in localStorage)
scripts            screenshot capture, research crawler, e2e checks
```

## Notes on content

- Every screenshot is a real capture of the published site (Chromium, English UI where the site offers it).
- Project descriptions only state functionality verified on the live site or in the project's source.
- The Living Interior link in the brief (`living-interior-4d.verc/`) was a typo; the site uses `https://living-interior-4d.vercel.app/`.
- The Nova Detailing URL is spelled `nova-deteiling.vercel.app` — that is the real published address.
- Motion respects `prefers-reduced-motion`; the custom cursor only appears with a fine pointer.
