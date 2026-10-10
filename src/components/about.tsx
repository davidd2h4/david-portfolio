import { site } from "@/config/site"
import { Headline } from "@/components/headline"
import { Shell } from "@/components/shell"

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="scroll-mt-24 overflow-hidden border-t border-white/10 py-24 md:py-32 lg:py-40"
    >
      <Shell>
        <p className="label">
          {site.about.index} — {site.about.label}
        </p>
        <div className="relative mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <p
            aria-hidden
            className="pointer-events-none absolute -top-8 right-0 font-serif text-[clamp(7rem,20vw,16rem)] leading-none text-paper/[0.045] select-none"
          >
            D
          </p>
          <Headline
            id="about-title"
            text={site.about.headline}
            className="relative font-serif text-[clamp(2.8rem,6.4vw,5.4rem)] leading-[0.96] tracking-[-0.035em] lg:col-span-10"
          />
          <p className="relative max-w-xl text-lg leading-relaxed text-muted lg:col-span-7 lg:col-start-6">
            {site.about.text}
          </p>
        </div>
      </Shell>
    </section>
  )
}
