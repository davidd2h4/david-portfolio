import { site } from "@/config/site"
import { AmbientField } from "@/components/ambient-field"
import { MagneticLink } from "@/components/magnetic-link"
import { Mark } from "@/components/mark"

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <AmbientField />
      <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-5 pt-24 pb-8 md:px-10 md:pt-28 md:pb-10 xl:px-16">
        <p className="hero-rise label">{site.hero.label}</p>

        <div className="my-auto py-10 md:py-12">
          <h1 className="max-w-full font-serif leading-none tracking-[-0.055em] text-[min(15.5vw,12.5rem)]">
            <span className="mask-line">
              <span
                className="hero-rise block whitespace-nowrap leading-none"
                style={{ animationDelay: "70ms" }}
              >
                <Mark text={site.hero.title} />
              </span>
            </span>
            <span className="mask-line mt-2 md:mt-3">
              <span
                className="hero-rise block text-[clamp(1.65rem,4vw,3.3rem)] leading-tight tracking-[-0.03em] text-silver italic"
                style={{ animationDelay: "160ms" }}
              >
                {site.hero.subtitle}
              </span>
            </span>
          </h1>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p
              className="hero-rise text-base leading-relaxed text-muted md:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              {site.hero.text}
            </p>
            <div
              className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "320ms" }}
            >
              <MagneticLink
                href={site.hero.primaryCta.href}
                className="w-full sm:w-auto"
              >
                {site.hero.primaryCta.label}
              </MagneticLink>
              <MagneticLink
                href={site.hero.secondaryCta.href}
                variant="line"
                className="w-full sm:w-auto"
              >
                {site.hero.secondaryCta.label}
              </MagneticLink>
            </div>
          </div>

          <a
            href="#work"
            className="group inline-flex items-center gap-4 self-start text-[0.68rem] tracking-[0.22em] text-muted uppercase transition-colors hover:text-paper md:self-end"
          >
            <span>Scroll</span>
            <span className="relative block h-12 w-px overflow-hidden bg-white/15" aria-hidden>
              <span className="scroll-line absolute inset-x-0 top-0 h-full bg-silver" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
