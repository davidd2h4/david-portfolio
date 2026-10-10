import type { MetadataRoute } from "next"
import { site } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: site.hero.text,
    start_url: "/",
    display: "standalone",
    background_color: "#08090B",
    theme_color: "#08090B",
  }
}
