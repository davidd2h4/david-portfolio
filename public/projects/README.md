# Project images

Atmosphere studies already live next to this file. They describe a visual world. They are not screenshots of a website.

```
public/projects/
  noir/
    hero.jpg
    detail.jpg
    screenshots/
  aurel-estates/
    hero.jpg
    detail.jpg
    screenshots/
  nova-detailing/
    hero.jpg
    detail.jpg
    screenshots/
```

## Replace an atmosphere image

1. Export a photograph as `.jpg` or `.webp`.
2. Overwrite `hero.jpg` or `detail.jpg` in that project's folder, or point `src` in `src/config/site.ts` at the new file.
3. Update the `alt` text so it describes the new picture.

## Add a real interface screenshot

1. Save the capture in `public/projects/<slug>/screenshots/`, for example `public/projects/noir/screenshots/menu.jpg`.
2. In `src/config/site.ts`, add it to that project's `gallery` array:

```ts
{
  src: "/projects/noir/screenshots/menu.jpg",
  alt: "Noir menu page, with courses listed in a single column.",
  caption: "Menu",
  kind: "interface",
}
```

`kind: "interface"` labels the image as a screenshot. `kind: "atmosphere"` is for photography and art direction. Do not mark an unrelated photo as `interface`.

## Connect a live site or repository

Public demo URLs live in `liveDemos` at the top of `src/config/site.ts`:

```ts
export const liveDemos = {
  noir: "https://noir-restaurant.vercel.app/",
  "aurel-estates": "https://aurel-estates-chi.vercel.app/",
  "nova-detailing": "https://nova-deteiling.vercel.app/",
}
```

Leave a value as `null` until that site is deployed. The portfolio shows “Demo coming soon” and does not link to localhost.

A public repository is set on the project itself:

```ts
repositoryUrl: "https://github.com/your-username/noir",
```

Leave `repositoryUrl` as `null` to hide that button. Do not invent a URL.
