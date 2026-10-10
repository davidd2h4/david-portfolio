import { site } from "@/config/site"
import { Reveal } from "@/components/reveal"
import { Shell } from "@/components/shell"

export function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="scroll-mt-24 border-t border-white/10 py-24 md:py-32 lg:py-40"
    >
      <Shell>
        <p className="label">
          {site.process.index} — {site.process.label}
        </p>
        <h2
          id="process-title"
          className="mt-4 max-w-xl font-serif text-[clamp(2rem,4vw,3.25rem)] leading-snug tracking-[-0.03em]"
        >
          {site.process.title}
        </h2>

        <ol className="relative mt-16 grid gap-x-10 gap-y-14 border-l border-white/15 pl-8 md:grid-cols-2 md:border-0 md:pl-0 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          <div
            aria-hidden
            className="process-line absolute top-3 right-0 left-0 hidden h-px bg-white/15 lg:block"
          />
          {site.process.steps.map((step, index) => (
            <li key={step.number} className="relative">
              <Reveal delay={index * 0.08}>
                <span className="relative z-10 grid size-8 place-items-center bg-ink font-serif text-sm text-mist">
                  {step.number}
                </span>
                <h3 className="mt-6 font-serif text-3xl tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted md:text-base">
                  {step.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Shell>
    </section>
  )
}
