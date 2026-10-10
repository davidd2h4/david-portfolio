# DAVID — Web Developer & Digital Designer

Personal portfolio for an independent freelance web developer. Built with Next.js, TypeScript, and Tailwind CSS.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

`npm start` serves the production build at the same local address.

## Edit the site

Almost all copy, contacts, and projects live in one file:

`src/config/site.ts`

| What | Where in `site.ts` |
| --- | --- |
| Name and headlines | `name`, `mark`, `role`, `hero` |
| About | `about` |
| Services and process | `services`, `process` |
| Email, Telegram, GitHub, Instagram | `contact` |
| Project copy and images | `projects` |
| Live website URLs | `liveDemos` |

Leave a contact URL as `""` to hide that link. Leave a value in `liveDemos` as `null` until that website is deployed; the card then shows “Demo coming soon”. Do not paste localhost. Leave `repositoryUrl` as `null` to hide the source button.

A newline inside `about.headline` or `contact.headline` creates a line break.

Set the public site URL before you deploy:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

See `.env.example`. This value is used for metadata, Open Graph, `sitemap.xml`, and `robots.txt`.

## Contact form

- If `contact.formEndpoint` is `null`, the form opens a draft in the visitor's email app. The site says so, and it does not claim the message was delivered.
- To deliver in the page, set `formEndpoint` to a URL that accepts `POST` JSON: `{ name, email, project, message }` and returns a success status. A Formspree endpoint works.

## Project images and live URLs

See `public/projects/README.md`.

Atmosphere photographs are visual direction, not screenshots of the demonstration sites. Add real interface captures under `public/projects/<slug>/screenshots/` and register them in `gallery` with `kind: "interface"`.

## Deploy

This project is a Next.js app. Vercel, Netlify, or another host that runs Next.js is the straightforward path. GitHub stores the code; the host builds it.

1. Create a GitHub repository and push this project.
2. Import the repository in your host.
3. Set `NEXT_PUBLIC_SITE_URL` to the real domain.
4. Replace the contact placeholders in `src/config/site.ts` before sharing the site.
5. Confirm `/`, `/work/noir`, `/work/aurel-estates`, `/work/nova-detailing`, `/sitemap.xml`, and `/robots.txt`.

No secrets are required to build. Do not commit a filled-in `.env` if you later add private keys. `.env.example` is safe to commit.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Motion for React
- Lucide icons
