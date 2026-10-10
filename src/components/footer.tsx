import { site } from "@/config/site"
import { Mark } from "@/components/mark"
import { Shell } from "@/components/shell"

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <Shell className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-xl">
            <Mark text={site.mark} />
          </p>
          <p className="mt-1 text-sm text-muted">{site.label}</p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          <a href="#top" className="transition-colors hover:text-paper">
            Back to top
          </a>
          <p>© {site.year}</p>
        </div>
      </Shell>
    </footer>
  )
}
